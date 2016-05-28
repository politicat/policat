var mongoose = require('mongoose')
    ,Promise = require('bluebird');

var crawler = require('./crawler')
    ,helpers = require('./helpers')
    // ,articleModel = require('./article_model').articleModel;

var settings = {
  sectionList: [100, 101, 102],
  dateArray: function() {
                var todayStr = helpers.getTodayDateStr();
                var todayBeforeYearStr = todayStr - 10000;
                var dateArray = helpers.arrayOfDates(todayBeforeYearStr, todayStr);
                // var dateArray = helpers.arrayOfDates("20151102", "20151107");

                return dateArray;
             }
};
console.log(settings.dateArray());
mongoose.connect("mongodb://localhost/politicat");



getArticles()


function getArticles(dateFrom, dateTo) {
// argument 입력 형식은 (yyyymmdd, yyyymmdd, xxx), type은 number.

  // if (dateTo - dateFrom < 0) return console.log("error: date error");

  var dateArray = settings.dateArray();
  // var dateArray = ["20160423","20160422"]//,"20160421"];

  var saveByPage = function(index, endPage, section, date) {
    // 처음에는 endPage와 index를 동일하게 init할 것.
    if (index === 1) return crawler(section, index, date);
    return new Promise(function(resolve, reject) {crawler(section, index, date); resolve()})
                .then(function() {saveByPage(index - 1, endPage, section, date);});
  };
  // var saveBySection = function(index, sectionArray, date) {
  //   if (index === sectionArray.length - 1) return saveByPage(50, 50, settings.sectionList[index], date).then(function(){});
  //   return new Promise(function(resolve, reject) {
  //     saveByPage(50, 50, settings.sectionList[index], date).then(function(){});
  //     resolve();
  //   }).then(function() {
  //     saveBySection(index + 1, sectionArray, date);
  //   })
  // };


  // for (var k = 0; k < dateArray.length ; k++) {
  //     // k는 일시
  //     // saveBySection(0, settings.sectionList, dateArray[k]);
  //     for (var i = 0; i < settings.sectionList.length; i++) {
  //       // i는 섹션
  //       // saveByPage(50, 50, settings.sectionList[i], dateArray[k]);
  //       for (var j = 1; j < 51; j++) {
  //         crawler(settings.sectionList[i], j, dateArray[k]);
  //       }
  //     }
  //
  // }
  var k = 0;
  var interval = setInterval(function() {
    for (var i = 0; i < settings.sectionList.length; i++) {
      // i는 섹션
      saveByPage(50, 50, settings.sectionList[i], dateArray[k]);
      // for (var j = 1; j < 51; j++) {
      //   crawler(settings.sectionList[i], j, dateArray[k]);
      // }
    }
    k++;
    if (k >= dateArray.length) {
      clearInterval(interval);
    }
  }, 10000);
}
