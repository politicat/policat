import Q from 'q';
import Keyword from './keywordModel.js';
import KeywordRelations from './keywordRelationsModel.js';

var findKeyword = Q.nbind(Keyword.findOne, Keyword);
var findKeywordRelations = Q.nbind(KeywordRelations.find, KeywordRelations);

var api = {
  // * input : keyword object ({keyword: '...', _id: '...'})
  // * output : relation array [['keyword', 3(count)] , ... ]
  findRelations: function(keyword) {
    let relationsResult = [];
    let relationsTemp;

    return findKeywordRelations({keyword1_id: keyword['_id']})
    .then(function (relations) {
      relationsTemp = relations;
      let ids = relations.map(function(val) {
        return findKeyword(val.keyword2_id);
      });
      return Q.all(ids);
    })
    .then(function (results) {
      relationsTemp.forEach(function(val, i) {
        relationsResult.push([results[i].keyword, relationsTemp[i].total_count]);
      });
      return findKeywordRelations({keyword2_id: keyword['_id']});
    })
    .then(function (relations) {
      relationsTemp = relations;
      let ids = relations.map(function(val) {
        return findKeyword(val.keyword1_id);
      });
      return Q.all(ids);
    })
    .then(function (results) {
      relationsTemp.forEach(function(val, i) {
        relationsResult.push([results[i].keyword, relationsTemp[i].total_count]);
      });
      return relationsResult;
    });
  }
};

export default api;
