var helpers = {};
helpers.convertData = function convertData(dataArray) {
  var result = [];
  dataArray.forEach(function(item) {
    result.push({"key": item[0], "value": item[1]});
  });
  return result;
};

export default helpers;
