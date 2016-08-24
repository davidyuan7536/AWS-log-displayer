/***
 * Contains basic SlickGrid formatters.
 *
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 *
 * @module Formatters
 * @namespace Slick
 */


(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "PercentComplete": PercentCompleteFormatter,
        "PercentCompleteBar": PercentCompleteBarFormatter,
        "YesNo": YesNoFormatter,
        "Checkmark": CheckmarkFormatter,
        "Time": TimeFormatter,
        "Status": StatusFormatter,
        "Byte": ByteFormatter,
        "RequestTime": RequestTimeFormatter
      }
    }
  });

  function TimeFormatter(row, cell, value, columnDef, dataContext) {
    // alert("Formatter running!")
    switch (display_time_format) {
      case time_format.RAW:
        return value;
        break;
      case time_format.UTC:
        return moment(value, "YYYY-MM-DD HH:mm:ssZZ").utc().format("MM-DD HH:mm:ss") + " UTC";
        break;
      case time_format.UTC_NOTIMEZONE:
        return moment(value, "YYYY-MM-DD HH:mm:ssZZ").utc().format("MM-DD HH:mm:ss");
        break;
      case time_format.LOCAL:
        return moment(value, "YYYY-MM-DD HH:mm:ssZZ").format("MM-DD HH:mm:ss ZZ");
        break;
      case time_format.LOCAL_NOTIMEZONE:
        return moment(value, "YYYY-MM-DD HH:mm:ssZZ").format("MM-DD HH:mm:ss");
        break;
      default:
        return value;
    }
  }

  function ByteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == 0){
      return "<span style='color:#A4A4A4;'>0</span>";
    } else if (value < 1000) {
      return value;
    } else if (value < 1000000) {
      return (value/1000).toFixed(2) + "K";
    } else if(value < 1000000000){
      return (value/1000000).toFixed(2) + "M";
    } else if(value < 1000000000000){
      return (value/1000000000).toFixed(2) + "G";
    } else { return (value/1000000000000).toFixed(2) + "T";}
  }

  function StatusFormatter(row, cell, value, columnDef, dataContext) {
    if (!display_status_color) {
      return value;
    }
    else {
      if (value > 199 && value < 300) {
        // 2xx Success
        return "<div style='color:#33CC33;' target='_blank'>" + value + "</div>";
      } else if (value > 399 && value < 600) {
        // 4xx Client Error
        // 5xx Server Error
        return "<div style='color:red;font-weight:bold;' target='_blank'>" + value + "</div>";
      } else if(value >= 600){
        // error with status code
        return "<span style='color:purple'>" + value + "</span>";
      } else {
        return "<div target='_blank'>" + value + "</div>";
      }
    }
  }

  function RequestTimeFormatter(row, cell, value, columnDef, dataContext) {
    if (value == 0){
      return "<span style='color:#A4A4A4;'>0</span>";
    }
    // else if(value < 1){
    //   return value*1000 + "ms";
    // }
    else{
      return value + "s";
    }
  }

  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }

  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "<img src='../images/tick.png'>" : "";
  }
})(jQuery);
