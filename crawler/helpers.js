// 입력받은 기간 내의 모든 날짜를 갖는 array를 출력
function arrayOfDates(dateFrom, dateTo, diff) {
  // argument형식은 (yyyymmdd, yyyymmdd, xxxxxxx), diff는 일자의 차이를 the number of days로 변환한 것.
  if (Number(dateTo - dateFrom) < 0) return null;

  var result = [];
  dateFrom = dateFrom.toString();
  dateTo = dateTo.toString();

  var yearF = dateFrom.slice(0, 4),
      yearT = dateTo.slice(0, 4),
      monthF = dateFrom.slice(4, 6),
      monthT = dateTo.slice(4, 6),
      dayF = dateFrom.slice(6, 8),
      dayT = dateTo.slice(6,8);

    console.log(yearF, yearT, monthF, monthT, dayF, dayT);
  for (var y = Number(yearF), m = Number(monthF), d = Number(dayF); y <= yearT , m <= 12, d <= 31; ) {

    var dateStr = module.exports.convertNumDateToFullString(y, m, d);

    if (Number(dateTo) - Number(dateStr) < 0) break;
    result.unshift(dateStr);
    d += 1;
    if (d > 31) {
      m += 1;
      d = 1;
    }
    if (m > 12) {
      y += 1;
      m = 1;
    }
  }
  return result;
}

// naver 뉴스 기사의 시간 표기를 Date 객체로 변환
function convertTime(str) {

  //2016-04-13 23:56

  // console.log("date");
  var $year = str.slice(0, str.indexOf("-"));
  str = str.slice(str.indexOf("-") + 1);
  // console.log(str);
  // month는 0이 JAN.
  var $month = Number(str.slice(0, str.indexOf("-")));
  str = str.slice(str.indexOf("-") + 1);
  // console.log("m: ", $month);
  var $day = str.slice(0, str.indexOf(" "));
  str = str.slice(str.indexOf(" ") + 1);

  var $hour = str.slice(0, str.indexOf(":"));
  str = str.slice(str.indexOf(":") + 1);
  var $minute = str;
  // console.log($year, ":", $month, ":", $day, "h:", $hour, " m: ", $minute);
  return new Date($year, $month - 1, $day, $hour, $minute);

}

// 연, 월, 일의 num을 8자리의 string으로 출력
function convertNumDateToFullString(y, m, d) {
  // 연, 월, 일의 num을 8자리의 string으로 출력
  var convertedY = y.toString(),
      convertedD = d.toString(),
      convertedM = m.toString();
  // console.log('ml: ', convertedM.length, ' dl: ', convertedD.length);
  while (convertedY.length < 4 || convertedM.length < 2 || convertedD.length < 2) {
    // console.log('in loop', typeof convertedY);
    if (convertedY.length < 4) {
      convertedY = "0" + convertedY;
    }
    if (convertedM.length < 2) {
      convertedM = "0" + convertedM;
    }
    if (convertedD.length < 2) {
      convertedD = "0" + convertedD;
    }
  }
  return convertedY + convertedM + convertedD;
}

// 현재 연, 월, 일을 담은 8자리 string을 반환
function getTodayDateStr() {
  var today = new Date();
  var todayY = today.getFullYear(),
      todayM = today.getMonth() + 1,
      todayD = today.getDate();
      console.log(typeof module.exports.convertNumDateToFullString);
  var todayStr = module.exports.convertNumDateToFullString(todayY, todayM, todayD);
  return todayStr;
}


module.exports.arrayOfDates = arrayOfDates;
module.exports.convertTime = convertTime;
module.exports.convertNumDateToFullString = convertNumDateToFullString;
module.exports.getTodayDateStr = getTodayDateStr;
