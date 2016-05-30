import Q from 'q';
import Keyword from './model/keyword.js';
import KeywordRelations from './model/keywordRelations.js';
import TodayKeyword from './model/todayKeyword.js';
import helper from './keywordHelper.js';

// Promisify a few mongoose methods with the `q` promise library
var findKeyword = Q.nbind(Keyword.findOne, Keyword);
var findTodayKeyword = Q.nbind(TodayKeyword.find, TodayKeyword);

var api = {
  search: function (req, res, next) {
    let root = req.body.data;

    var relationsResult = [];
    findKeyword({keyword: root})
      .then(function (rootKeyword) {
        if (rootKeyword) {
          helper.findRelations(rootKeyword)
          .then(function(results) {
            results = results.sort(function(a, b) {
              return b[b.length-1] - a[a.length-1];
            });

            var rootRelations = results.slice(0, 10);
            rootRelations = rootRelations.map(function(val) {
              let rootChildKeyword = val[0];
              let rootChildCnt = val[1];

              return findKeyword({keyword: rootChildKeyword})
                .then(function (childKeywordObj) {
                  return helper.findRelations(childKeywordObj)
                    .then(function(results) {
                      results = results.sort(function(a, b) {
                        return b[b.length-1] - a[a.length-1];
                      });

                      results = results.slice(0, 5);
                      results.forEach(function(val) {
                        relationsResult.push([rootChildKeyword, val[0], rootChildCnt + val[1]]);
                      });
                    });
                });
            });

            Q.all(rootRelations)
            .then(function () {
              console.log('results: ', relationsResult);
              res.send(relationsResult);
            });
          });
        }})
      .fail(function (error) {
        next(error);
      });
  },

  home: function(req, res, next) {
    findTodayKeyword({})
    .then(function(results) {
      results = results.map(function(val) {
        return [val.keyword, val.count];
      });

      console.log('results: ', results);
      res.send(results);
    });
  }
};

export default api;
