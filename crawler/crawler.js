/* request-sync deprecated, but using because of 'encoding: null' setting */
var request = require('request-sync'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    urlencode = require('urlencode'),
    mongoose = require('mongoose'),
    Promise = require('bluebird');;

var helpers = require('./helpers'),
    articleModel = require('./model/article').articleModel;


var reqOption = {
  method: "GET"
  , headers: {"User-Agent": "Mozilla/5.0"} // 아래 encoding을 넣지 않으면 node에서 자동으로 utf8로 디코드해서 iconv-lite로 아무리 디코드해봐야 소용없음
  , encoding: null //followRedirect :false
};

function crawling(section, page, date) {
  // page를 -1씩 하면서 crawling 수행
  // page === 1000 이면, 해당 section, date의 마지막 페이지 number을 출력
  var searchOption = {
    // keyword: "반기문",
    page: page,
    // detail: 1, // 0: 내용요약도 출력, 1: 제목만 출력
    section: section,
    date: date // 다음과 같은 형식으로 "20160416"
  };


  // 주소를 분해하여 array로 저장. join("&")를 이용하여 결합.
  // 네이버 뉴스 속보란
  var urlSet = ["http://news.naver.com/main/list.nhn?sid1=" + searchOption.section, "listType=title", "mid=sec", "mode=LSD", "date=" + searchOption.date, "page=" + searchOption.page];
  var url = urlSet.join("&");

  //console.log(url);

  // var reqOption = {
  //   method: "GET"
  //   // , uri: url
  //   , headers: {"User-Agent": "Mozilla/5.0"} // 아래 encoding을 넣지 않으면 node에서 자동으로 utf8로 디코드해서 iconv-lite로 아무리 디코드해봐야 소용없음
  //   , encoding: null //followRedirect :false
  // };

  // 존재하지 않는 day을 입력한 경우 --> 해당 월의 마지막 day의 첫페이지 출력
  // 존재하지 않는 페이지를 입력한 경우 --> 해당 day의 마지막 페이지 출력
  //console.log("now working");

  // statuscode가 400 이상인 경우 5회 반복
  var response = request(url, reqOption),
      retrycnt = 0;
  while (retrycnt < 5 && response.statusCode >= 400) {
    retrycnt++;
    response = request(reqOption, url);
    if (retrycnt === 4 && response.statusCode >= 400) return console.log("error in get html");
  };
  // -----------------------------------

  var decodedBody = iconv.decode(response.body, 'euc-kr');
  var $ = cheerio.load(decodedBody);

  // page === 1000 이면 lastpage를 반환.
  if (page === 1000) {
    var lastpage = $(".paging strong").text();
    return lastpage;
  }
  // ----------------------------------

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

    var article = new articleModel({
      title: $title,
      url: $url,
      section: searchOption.section,
      time: helpers.convertTime($time),
      date: date,
      page: page,
      index: index,
      uniqId: Number(helpers.convertTime($time).toString() + (1000 - page).toString() + (99 - index).toString())
    });
    return Promise.resolve(article.save(
      // function(err) {
      // if (err) {
      //   console.log(err);
      // }
      //   console.log('title: ', $title);
      //   console.log('url: ', $url);
      //   console.log('sec: ', searchOption.section);
      //   console.log('date: ', helpers.convertTime($time));
      //   console.log('page: ', searchOption.page);
      //   console.log("\n");
      //   console.log('before recursion');
      //   saveArticle(index - 1);
      // }
    ).then(function() {
      console.log('title: ', $title);
      console.log('url: ', $url);
      console.log('sec: ', searchOption.section);
      console.log('date: ', helpers.convertTime($time));
      console.log('page: ', searchOption.page);
      console.log('uniqId: ', helpers.convertTime($time).toString() + (1000 - page).toString() + (99 - index).toString());
      console.log("\n");
      console.log('before recursion');
      saveArticle(index - 1);
    }))
  };

  return saveArticle(articleDom.length - 1);

}

module.exports = crawling;
