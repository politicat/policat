import Q from 'q';
import Keyword from './keywordModel.js';
import KeywordRelations from './keywordRelationsModel.js';
import helper from './keywordHelper.js';

// Promisify a few mongoose methods with the `q` promise library
var findKeyword = Q.nbind(Keyword.findOne, Keyword);

var api = {
  search: function (req, res, next) {
    let keyword = req.body.data;

    let relationsResult = [];
    let relationsTemp;
    let rootNode;
    findKeyword({keyword: keyword})
      .then(function (keyword) {
        if (keyword) {
          rootNode = keyword.keyword;
          helper.findRelations(keyword)
          .then(function(results) {
            res.send(results);
            console.log('results: ', results);
          });
        }})
      .fail(function (error) {
        next(error);
      });
  }
};

export default api;
