var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    urlencode = require('urlencode'),
    mongoose = require('mongoose');

var helpers = require('./helpers'),
    articleModel = require('./model/article').articleModel;



// mongoose.connect("mongodb://localhost/politicat");



function crawling(section, page, date) {
  var searchOption = {
    // keyword: "반기문",
    page: page,
    // detail: 1, // 0: 내용요약도 출력, 1: 제목만 출력
    section: section,
    date: date // 다음과 같은 형식으로 "20160416"
  };


  // 주소를 분해하여 array로 저장. join("&")를 이용하여 결합.
    // 제목 + 내용
  // var urlSet2 = ["http://news.naver.com/main/search/search.nhn?query=" + urlencode(searchOption.keyword, 'euc-kr'), "st=news.all", "q_enc=EUC-KR", "r_enc=UTF-8", "r_format=xml", "rp=none", "sm=all.basic", "ic=all", "so=datetime.dsc", "rcsection=exist:" + searchOption.section, "detail=0", "pd=1", "start=1", "display=10", "page=" + searchOption.page]
    // 제목만
  // var urlSet3 = ["http://news.naver.com/main/search/search.nhn?query=" + urlencode(searchOption.keyword, 'euc-kr'), "st=news.all&q_enc=EUC-KR&r_enc=UTF-8&r_format=xml&rp=none&sm=title.basic&ic=all", "so=datetime.dsc", "rcsection=exist:100:101:102:", "detail=" + searchOption.detail, "pd=1", "start=1", "display=20", "page=" + searchOption.page];

  // 네이버 뉴스 속보란
  var urlSet = ["http://news.naver.com/main/list.nhn?sid1=" + searchOption.section, "listType=title", "mid=sec", "mode=LSD", "date=" + searchOption.date, "page=" + searchOption.page];
  var url = urlSet.join("&");

  // console.log(url);

  var reqOption = {
    method: "GET"
    , uri: url
    , headers: {"User-Agent": "Mozilla/5.0"} // 아래 encoding을 넣지 않으면 node에서 자동으로 utf8로 디코드해서 iconv-lite로 아무리 디코드해봐야 소용없음
    , encoding: null //followRedirect :false
  };

  // 존재하지 않는 day을 입력한 경우 --> 해당 월의 마지막 day의 첫페이지 출력
  // 존재하지 않는 페이지를 입력한 경우 --> 해당 day의 마지막 페이지 출력
  // console.log("now working");

  request(reqOption, function (err, res, body) {
      if (!err) {

          // console.log('section is: ', searchOption.section, "\n");
          // console.log("statuscode is :", res.statusCode, "\n");

          var bufferedBody = new Buffer(body);
          var decodedBody = iconv.decode(bufferedBody, 'euc-kr');
          var $ = cheerio.load(decodedBody);

          var articleDom = $(".list_body li");

          var saveArticle = function(index) {
            if (index < 0) return;

            var atc = articleDom[index];

            var $title = $(atc).find('a').text();
            var $url = $(atc).find('a').attr("href");
            var $time = $(atc).find('.date').text();

            // console.log('title: ', $title);
            // console.log('url: ', $url);
            // console.log('sec: ', searchOption.section);
            // console.log('date: ', helpers.convertTime($time));
            // console.log('page: ', searchOption.page);
            // console.log("\n");

            articleModel.findOne({title: $title, time: helpers.convertTime($time)}, function(err, article) {
              if (err) console.log("error in find article in db");

              if (article) {
                // db에 동일 article이 있으면 저장x, callback 중지.
                console.log($time, " db already has the same article");
                return;
              } else {
                // console.log($time, "db has not the same article");
                var article = new articleModel({
                  title: $title,
                  url: $url,
                  section: searchOption.section,
                  time: helpers.convertTime($time)
                });
                article.save(function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('title: ', $title);
                  console.log('url: ', $url);
                  console.log('sec: ', searchOption.section);
                  console.log('date: ', helpers.convertTime($time));
                  console.log('page: ', searchOption.page);
                  console.log("\n");
                  saveArticle(index - 1);
                });
              }
            });
          };

          saveArticle(articleDom.length - 1);
          // .each(function () {
          //
          //   var $title = $(this).find('a').text();
          //   var $url = $(this).find('a').attr("href");
          //   var $time = $(this).find('.date').text();
          //
          //   console.log('title: ', $title);
          //   console.log('url: ', $url);
          //   console.log('sec: ', searchOption.section);
          //   console.log('date: ', helpers.convertTime($time));
          //   console.log("\n");
          //
          //
          //
          //   articleModel.findOne({title: $title, time: $time}, function(err, article) {
          //     if (err) console.log("error in find article in db");
          //
          //     if (article) {
          //       console.log("db already has the same article");
          //
          //       return false;
          //     } else {
          //       console.log("db has not the same article");
          //       var article = new articleModel({
          //         title: $title,
          //         url: $url,
          //         section: searchOption.section,
          //         time: $time
          //       });
          //       article.save(function(err) {
          //         if (err) throw err;
          //       });
          //     }
          //   })
          //
          //
          //
          // });
      } else {
        console.log(err);
        crawling(section, page, date);
      }
  });

  // //중복 체크
  // if (dupCounter > 5) {
  //   return false;
  // } else {
  //   return true;
  // }

}


module.exports = crawling;
