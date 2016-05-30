var mongoose = require('mongoose')
    ,Promise = require('bluebird');

var crawler = require('./crawler')
    ,helpers = require('./helpers')
    ,articleModel = require('./model/article').articleModel
    ,lastDateModel = require('./model/article').lastDateModel;

var settings = {
  sectionList: [100, 101, 102]
};
mongoose.connect("mongodb://localhost/politicat");


getArticles()


function getArticles() {
// argument 입력 형식은 (yyyymmdd, yyyymmdd, xxx), type은 number.

  // if (dateTo - dateFrom < 0) return console.log("error: date error");

  // var dateArray = ["20160423","20160422"]//,"20160421"];

  var saveByPage = function(section, date, page) {
    // init 때는 page 생략해야함.
    if (page === undefined) {
      return Promise.resolve(Promise.resolve(
        crawler(section, crawler(section, 1000, date), date)
      ).then(function() {
        saveByPage(section, date, crawler(section, 1000, date) - 1);
      }));
    } else if (page === 1) {
      return crawler(section, page, date);
    } else if (page > 1) {
      return Promise.resolve(crawler(section, page, date)).then(function() {
        saveByPage(section, date, page - 1);
      });
    } else {
      return;
    }

  };

  var saveBySection = function(date, sectionArray, sessIdx) {
    // init 할 때, sessIdx 생략해야함.
    if (sessIdx === undefined) {
      return Promise.resolve(Promise.resolve(saveByPage(sectionArray[0], date)).then(function() {
        saveBySection(date, sectionArray, 1);
      }))
    } else if (sessIdx === sectionArray.length - 1) {
      return Promise.resolve(saveByPage(sectionArray[sessIdx], date)).then(function() {
        lastDateModel.findByIdAndUpdate({_id: 'entityId'}, {$set: {date: date}}, {"upsert": true, "new": true}, function(error, count)   {
            if(error) throw error;
        });
      })
    } else if (sessIdx < sectionArray.length - 1){
      return Promise.resolve(saveByPage(sectionArray[sessIdx], date)).then(function() {
        saveBySection(date, sectionArray, sessIdx + 1);
      })
    } else {
      return;
    }
  };

  var saveByDate = function(dateF) {
    // dateF는 추출해오고 싶은 일자를 입력. string, "YYYYMMDD"형식
    // 현재 lastdates 테이블에 존재하는 가장 최근 일자보다 dateF가 이전일 경우, 최근 일자 자료를 모두 삭제하고 해당 일자 자료를 저장
    // lastdates 테이블의 최근 일자보다 dateF 가 이후일 경우, (최근 일자 + 1)일의 자료를 저장
    // var saveBySection = function(date, sectionArray, sessIdx)
    var routine = function(dateArray, dateIdx) {

        // // init 할 때, dateIdx 생략해야함.
        // if (dateIdx === undefined) {
        //   return Promise.resolve(saveBySection(dateArray[0], settings.sectionList)).then(function() {
        //     routine(dateArray, 1);
        //   })
        // } else if (dateIdx === dateArray.length - 1) {
        //   return saveBySection(dateArray[dateIdx], settings.sectionList);
        // } else if (dateIdx < dateArray.length - 1) {
        //   return Promise.resolve(saveBySection(dateArray[dateIdx], settings.sectionList)).then(function() {
        //     routine(dateArray, dateIdx + 1);
        //   })
        // } else {
        //   return;
        // }
        // init 할 때, dateIdx 생략해야함.
        var init = Promise.resolve()
        dateArray.forEach(function(item) {
          init = init.then(function() {
            saveBySection(item, settings.sectionList);
          })
        })


    };
    lastDateModel.findOne({_id: 'entityId'}, function(err, date) {
      if (err) throw err;

      if (date === null) {
        var dateFrom = new Date();
        // 첫 init때는 아래를 우선
        // 원하는 최대 기간 정하기(dateF가 아래보다 이후일 경우 dateF를 기준으로 계산, 아래보다 이전일 경우 아래를 우선)
        dateFrom.setDate(dateFrom.getDate() - 30);
        var dateFromStr = helpers.convertNumDateToFullString(dateFrom.getFullYear(), dateFrom.getMonth() + 1, dateFrom.getDate());

        lastDateModel.findByIdAndUpdate({_id: 'entityId'}, {$set: {date: dateFromStr}}, {"upsert": true, "new": true}, function(error, count)   {
            if(error) throw error;
            saveByDate(dateFromStr);
        });
      } else {
        var today = new Date();
        var todayStr = helpers.convertNumDateToFullString(today.getFullYear(), today.getMonth() + 1, today.getDate());
        if (Number(date.date) - Number(dateF) < 0) {
          console.log('date.date < dateF');
          // routine(helpers.arrayOfDates(dateF, todayStr));

          // articleModel.find({date: date.date}).remove(function(err, obj) {
          //   if (err) throw err;
          //   console.log('remove duplicates');
          //   console.log('length is ', obj.result.n);
          //   counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: -1 * obj.result.n} }, function(error, count)   {
          //       if(error)
          //           return next(error);
          //       routine(helpers.arrayOfDates(date.date, todayStr));
          //   });
          //   // routine(helpers.arrayOfDates(date.date, todayStr));
          // })
          routine(helpers.arrayOfDates(helpers.addNDays(date.date, 1), helpers.addNDays(date.date, 1)));

        } else if (Number(date.date) - Number(dateF) >= 0) {
          //console.log('date.date >= dateF', date.date, dateF);

          articleModel.find({date: date.date}).remove(function(err, obj) {
            if (err) throw err;
/*            console.log('remove duplicates');*/
            /*console.log('length is ', obj.result.n);*/
          })
        }

      }
    })
  }

  // var lastpage = crawler(100, 1000, "20160527");
  // crawler(100, lastpage, "20160527");

  // saveByPage(100, "20160527")
  // saveBySection("20160527", settings.sectionList);


  saveByDate(helpers.getTodayDateStr());
  console.log("end");
}
