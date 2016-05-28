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
                // var dateArray = helpers.arrayOfDates(todayBeforeYearStr, todayStr);
                var dateArray = helpers.arrayOfDates("20151102", "20151121");

                return dateArray;
             }
};
console.log(settings.dateArray());
