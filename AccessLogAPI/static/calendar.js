function filter_to_array(x){
  return $.map(x, function(el) { return el; });
}

  jQuery(document).ready(function() {
    jQuery('.cal-tabs .cal-tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');

        // Show/Hide Tabs
        jQuery('.cal-tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
    });
});

function month_previous(n){
  cal.previous(n);
  cal3.previous(n);
  cal5.previous(n);
}
function day_previous(n){
  cal2.previous(n);
  cal4.previous(n);
  cal6.previous(n);
}
function month_next(n){
  cal.next(n);
  cal3.next(n);
  cal5.next(n);
}
function day_next(n){
  cal2.next(n);
  cal4.next(n);
  cal6.next(n);
}
function toggle_day_sync(){
  Daysync = !Daysync;
  if ($("#day_sync_button").attr("icon") == "notification:sync") {
    $("#day_sync_button").attr("icon", "notification:sync-disabled");
    $("#day_sync_button2").attr("icon", "notification:sync-disabled");
    $("#day_sync_button3").attr("icon", "notification:sync-disabled");
  }
  else{
    $("#day_sync_button").attr("icon", "notification:sync");
    $("#day_sync_button2").attr("icon", "notification:sync");
    $("#day_sync_button3").attr("icon", "notification:sync");
  }
}

function packNum(n){
  if (n > 1000000000000) {
    return ((n/1000000000000).toFixed(2)).toString() + "T";
  }
  else if (n > 1000000000) {
    return ((n/1000000000).toFixed(2)).toString() + "B";
  }
  else if (n > 1000000) {
    return ((n/1000000).toFixed(2)).toString() + "M";
  }
  else if (n > 1000) {
    return ((n/1000).toFixed(2)).toString() + "K";
  }
  else{
    return n.toString();
  }
}

function packBytes(n){
  if (n > 1000000000000000) {
    return ((n/1000000000000000).toFixed(2)).toString() + "P";
  }
  if (n > 1000000000000) {
    return ((n/1000000000000).toFixed(2)).toString() + "T";
  }
  else if (n > 1000000000) {
    return ((n/1000000000).toFixed(2)).toString() + "G";
  }
  else if (n > 1000000) {
    return ((n/1000000).toFixed(2)).toString() + "M";
  }
  else if (n > 1000) {
    return ((n/1000).toFixed(2)).toString() + "K";
  }
  else{
    return n.toFixed(2).toString();
  }
}

function showStats(res, date, initialLoad){
  console.log(res);
  if (initialLoad) {
    title = "<h3>Summary</h3>";
  }
  else {
    if (date.getHours() != 0) {
      title = "<h3>" + moment(date).format("LLL") + "</h3>";
    }
    else {
      title = "<h3>" + moment(date).format("LL") + "</h3>";
    }
  }

  num_request_total = res["num_request"]["size"];
  $("#cal-stats_num_request").html(

    title +

    "<br /> A Total of <b>" + packNum(num_request_total) + "</b> Requests" +
    "<br /> Average Request Time: <b>" + res["num_request"]["request_time"]["avg"].toFixed(3) + "</b> s" +
    "<br />Top" +
    "<br /><b>IP</b>: <b>" + res["num_request"]["remote_addr"]["list"][0]["name"] + "</b> " + packNum(res["num_request"]["remote_addr"]["list"][0]["count"]) + " Requests (" + (res["num_request"]["remote_addr"]["list"][0]["count"]/num_request_total*100).toFixed(2) + "%)" +
    "<br /><b>URL</b>: <b>" + res["num_request"]["request_uri"]["list"][0]["name"] + "</b> " + packNum(res["num_request"]["request_uri"]["list"][0]["count"]) + " Requests (" + (res["num_request"]["request_uri"]["list"][0]["count"]/num_request_total*100).toFixed(2) + "%)" +
    "<br /><b>Host</b>: <b>" + res["num_request"]["http_host"]["list"][0]["name"] + "</b> " + packNum(res["num_request"]["http_host"]["list"][0]["count"]) + " Requests (" + (res["num_request"]["http_host"]["list"][0]["count"]/num_request_total*100).toFixed(2) + "%)" +
    "<br /><b>Referer</b>: <b>" + res["num_request"]["http_referer"]["list"][0]["name"] + "</b> " + packNum(res["num_request"]["http_referer"]["list"][0]["count"]) + " Requests (" + (res["num_request"]["http_referer"]["list"][0]["count"]/num_request_total*100).toFixed(2) + "%)" +
    "<br /><b>Agent</b>: <b>" + res["num_request"]["http_agent"]["list"][0]["name"] + "</b> " + packNum(res["num_request"]["http_agent"]["list"][0]["count"]) + " Requests (" + (res["num_request"]["http_agent"]["list"][0]["count"]/num_request_total*100).toFixed(2) + "%)"
  );

  bytes_received_total = res["bytes_received"]["size"];
  $("#cal-stats_bytes_received").html(

    title +

    "<br /> A Total of <b>" + packBytes(bytes_received_total) + "</b> Bytes Received" +
    "<br /> Average: <b>" + packBytes((bytes_received_total/num_request_total)) + "</b> Bytes/Request" +
    "<br />Top" +
    "<br /><b>IP</b>: <b>" + res["bytes_received"]["remote_addr"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_received"]["remote_addr"]["list"][0]["count"]) + " Bytes (" + (res["bytes_received"]["remote_addr"]["list"][0]["count"]/bytes_received_total*100).toFixed(2) + "%)" +
    "<br /><b>URL</b>: <b>" + res["bytes_received"]["request_uri"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_received"]["request_uri"]["list"][0]["count"]) + " Bytes (" + (res["bytes_received"]["request_uri"]["list"][0]["count"]/bytes_received_total*100).toFixed(2) + "%)" +
    "<br /><b>Host</b>: <b>" + res["bytes_received"]["http_host"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_received"]["http_host"]["list"][0]["count"]) + " Bytes (" + (res["bytes_received"]["http_host"]["list"][0]["count"]/bytes_received_total*100).toFixed(2) + "%)" +
    "<br /><b>Referer</b>: <b>" + res["bytes_received"]["http_referer"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_received"]["http_referer"]["list"][0]["count"]) + " Bytes (" + (res["bytes_received"]["http_referer"]["list"][0]["count"]/bytes_received_total*100).toFixed(2) + "%)" +
    "<br /><b>Agent</b>: <b>" + res["bytes_received"]["http_agent"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_received"]["http_agent"]["list"][0]["count"]) + " Bytes (" + (res["bytes_received"]["http_agent"]["list"][0]["count"]/bytes_received_total*100).toFixed(2) + "%)"
  );

  bytes_sent_total = res["bytes_sent"]["size"];
  $("#cal-stats_bytes_sent").html(

    title +

    "<br /> A Total of <b>" + packBytes(bytes_sent_total) + "</b> Bytes Sent" +
    "<br /> Average: <b>" + packBytes((bytes_sent_total/num_request_total)) + "</b> Bytes/Request" +
    "<br />Top" +
    "<br /><b>IP</b>: <b>" + res["bytes_sent"]["remote_addr"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_sent"]["remote_addr"]["list"][0]["count"]) + " Bytes (" + (res["bytes_sent"]["remote_addr"]["list"][0]["count"]/bytes_sent_total*100).toFixed(2) + "%)" +
    "<br /><b>URL</b>: <b>" + res["bytes_sent"]["request_uri"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_sent"]["request_uri"]["list"][0]["count"]) + " Bytes (" + (res["bytes_sent"]["request_uri"]["list"][0]["count"]/bytes_sent_total*100).toFixed(2) + "%)" +
    "<br /><b>Host</b>: <b>" + res["bytes_sent"]["http_host"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_sent"]["http_host"]["list"][0]["count"]) + " Bytes (" + (res["bytes_sent"]["http_host"]["list"][0]["count"]/bytes_sent_total*100).toFixed(2) + "%)" +
    "<br /><b>Referer</b>: <b>" + res["bytes_sent"]["http_referer"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_sent"]["http_referer"]["list"][0]["count"]) + " Bytes (" + (res["bytes_sent"]["http_referer"]["list"][0]["count"]/bytes_sent_total*100).toFixed(2) + "%)" +
    "<br /><b>Agent</b>: <b>" + res["bytes_sent"]["http_agent"]["list"][0]["name"] + "</b> " + packBytes(res["bytes_sent"]["http_agent"]["list"][0]["count"]) + " Bytes (" + (res["bytes_sent"]["http_agent"]["list"][0]["count"]/bytes_sent_total*100).toFixed(2) + "%)"
  );
}

function RefreshDayCal(){

  cal2.destroy(function(){
    cal2 = new CalHeatMap();
    cal2.init({
      itemSelector: "#cal-heatmap2",
      domain: "day",
      subDomain: "hour",
      cellSize: 20,
      cellRadius: 10,
      range: 10,
      colLimit: 24,
      verticalOrientation: true,
      animationDuration: 500,
      label: {
        position: "left",
        width: 46
      },
      itemNamespace: "domainDynamicDimension",
      tooltip: true,
      start: start_day,
      data: day_data["num_request"],
      highlight: ["now",],
      considerMissingDataAsZero: true,
      legend: day_colors["num_request"],
      displayLegend: true,
      legendCellSize: 10,
      legendMargin: [10,0,10,10],
      itemName: ["Request", "Requests"],
      subDomainTextFormat: function(date ,value) {
          if (value/1000000000000 > 1) {
            return (value/1000000000000).toFixed(0) + "T";
          }
          if (value/1000000000 > 1) {
            return (value/1000000000).toFixed(0) + "B";
          }
          if (value/1000000 > 1) {
            return (value/1000000).toFixed(0) + "M";
          }
          if (value/1000 > 1) {
            return (value/1000).toFixed(0) + "K";
          }
        return value;
      },

      onClick: function(date, val){
        if (val !== null) {
          var nextHour = new Date(date);
          nextHour.setHours(nextHour.getHours() + 1);
          timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(nextHour).format("YYYY-MM-DDTHH:mm:ssZ")}}};
          $.post('/calendar_stat',
          {
            "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },
          function(data){
            showStats(data["result"], date, false);
          });
        } // end val!= null
        else{// val == 0
          $("#cal-stats_num_request").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_received").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_sent").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
        }

      }, // end onClick function

      legendColors: {
        min: "#B6E6FF",
        max: "MidnightBlue",
        empty: "#ededed"
      }
    }); // end init() cal2
  }); // end destroy() cal2

  cal4.destroy(function(){
    cal4 = new CalHeatMap();
    cal4.init({
      itemSelector: "#cal-heatmap4",
      domain: "day",
      subDomain: "hour",
      cellSize: 20,
      cellRadius: 10,
      range: 10,
      colLimit: 24,
      verticalOrientation: true,
      animationDuration: 500,
      label: {
        position: "left",
        width: 46
      },
      itemNamespace: "domainDynamicDimension",
      tooltip: true,
      start: start_day,
      data: day_data["bytes_received"],
      highlight: ["now",],
      considerMissingDataAsZero: true,
      legend: day_colors["bytes_received"],
      displayLegend: true,
      legendCellSize: 10,
      legendMargin: [10,0,10,10],
      itemName: ["Byte", "Bytes"],
      subDomainTextFormat: function(date ,value) {
          if (value/1000000000000000 > 1) {
            return (value/1000000000000000).toFixed(0) + "P";
          }
          if (value/1000000000000 > 1) {
            return (value/1000000000000).toFixed(0) + "T";
          }
          if (value/1000000000 > 1) {
            return (value/1000000000).toFixed(0) + "G";
          }
          if (value/1000000 > 1) {
            return (value/1000000).toFixed(0) + "M";
          }
          if (value/1000 > 1) {
            return (value/1000).toFixed(0) + "K";
          }
        return value;
      },

      onClick: function(date, val){
        if (val !== null) {
          var nextHour = new Date(date);
          nextHour.setHours(nextHour.getHours() + 1);
          timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(nextHour).format("YYYY-MM-DDTHH:mm:ssZ")}}};
          $.post('/calendar_stat',
          {
            "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },
          function(data){
            showStats(data["result"], date, false);
          });
        } // end val!= null
        else{// val == 0
          $("#cal-stats_num_request").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_received").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_sent").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
        }
      }, // end onClick function

      legendColors: {
        min: "#B6E6FF",
        max: "MidnightBlue",
        empty: "#ededed"
      }
    });// end init() cal4
  }); // end destroy() cal4

  cal6.destroy(function(){
    cal6 = new CalHeatMap();
    cal6.init({
      itemSelector: "#cal-heatmap6",
      domain: "day",
      subDomain: "hour",
      cellSize: 20,
      cellRadius: 10,
      range: 10,
      colLimit: 24,
      verticalOrientation: true,
      animationDuration: 500,
      label: {
        position: "left",
        width: 46
      },
      itemNamespace: "domainDynamicDimension",
      tooltip: true,
      start: start_day,
      data: day_data["bytes_sent"],
      highlight: ["now",],
      considerMissingDataAsZero: true,
      legend: day_colors["bytes_sent"],
      displayLegend: true,
      legendCellSize: 10,
      legendMargin: [10,0,10,10],
      itemName: ["Byte", "Bytes"],
      subDomainTextFormat: function(date ,value) {
          if (value/1000000000000000 > 1) {
            return (value/1000000000000000).toFixed(0) + "P";
          }
          if (value/1000000000000 > 1) {
            return (value/1000000000000).toFixed(0) + "T";
          }
          if (value/1000000000 > 1) {
            return (value/1000000000).toFixed(0) + "G";
          }
          if (value/1000000 > 1) {
            return (value/1000000).toFixed(0) + "M";
          }
          if (value/1000 > 1) {
            return (value/1000).toFixed(0) + "K";
          }
        return value;
      },

      onClick: function(date, val){
        if (val !== null) {
          var nextHour = new Date(date);
          nextHour.setHours(nextHour.getHours() + 1);
          timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(nextHour).format("YYYY-MM-DDTHH:mm:ssZ")}}};
          $.post('/calendar_stat',
          {
            "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },
          function(data){
            showStats(data["result"], date, false);
          });
        } // end val!= null
        else{// val == 0
          $("#cal-stats_num_request").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_received").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_sent").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
        }
      }, // end onClick function

      legendColors: {
        min: "#B6E6FF",
        max: "MidnightBlue",
        empty: "#ededed"
      }
    }); // end init() cal6
  }); // end destroy() cal6
}

function RefreshMonthCal(){
  cal.destroy(function(){
    cal = new CalHeatMap();
    cal.init({
      itemSelector: "#cal-heatmap",
      domain: "month",
      subDomain: "x_day",
      cellSize: 30,
      range: 4,
      domainGutter: 10,
      label: {
        position: "top"
      },
      animationDuration: 500,
      // domainDynamicDimension: false,
      itemNamespace: "domainDynamicDimension",
      tooltip: true,
      // minDate: MinDate,
      // maxDate: MaxDate,
      start: start,
      data: month_data["num_request"],
      highlight: ["now",],
      considerMissingDataAsZero: true,
      legend: month_colors["num_request"],
      displayLegend: true,
      legendCellSize: 10,
      legendMargin: [10,0,10,10],
      itemName: ["Request", "Requests"],
      // previousSelector: ".cal-heatmap-PreviousDomain-selector",
      // nextSelector: ".cal-heatmap-NextDomain-selector",
      weekStartOnMonday: false,
      // afterLoad: function() {
      //     start = Date.now();
      //     init();
      // },
      subDomainTextFormat: "%d",
      // subDomainTitleFormat: {filled: ("{count} {name} {connector} {date}"},

      // onClick: function(date, nb) {
      //   window.location.href = "http://" + window.location.host + "/calendar2?time=" + moment(date).format();
      // }

      onClick: function(date, val){
        // console.log(moment(date).format("YYYY-MM-DDTHH:mm:ssZ"));
        // console.log(filter_to_array(filters.must));

        if (val !== null) {
          $.get('/calendar_point',
          {
            granularity: 'day',
            method: 'sum',
            "must": JSON.stringify(filter_to_array(filters.must)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          // {
          //   granularity: "day",
          //   bucketData: "{{obj}}",
          //   bucketDataAnalyze: "sum",
          //   time: moment(date).format().substring(0,19)
            //
          },
          function(data) {
            if (Daysync) {
              start_day = new Date(date);
              start_day.setDate(start_day.getDate() - 3);
              RefreshDayCal();
            }
          });

          var tomorrow = new Date(date);
          tomorrow.setDate(tomorrow.getDate() + 1);
          timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(tomorrow).format("YYYY-MM-DDTHH:mm:ssZ")}}};
          $.post('/calendar_stat',
          {
            "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },
          function(data){
            showStats(data["result"], date, false);
          });
        } // end val!= null
        else{// val == 0
          $("#cal-stats_num_request").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_received").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_sent").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
        }
      }, // end onClick function

      legendColors: {
        min: "#B6E6FF",
        max: "MidnightBlue",
        empty: "#ededed"
      }
    });
    // end function init cal
  });

  cal3.destroy(function(){
    cal3 = new CalHeatMap();
    cal3.init({
      itemSelector: "#cal-heatmap3",
      domain: "month",
      subDomain: "x_day",
      cellSize: 30,
      range: 4,
      domainGutter: 10,
      label: {
        position: "top"
      },
      animationDuration: 500,
      // domainDynamicDimension: false,
      itemNamespace: "domainDynamicDimension",
      tooltip: true,
      start: start,
      data: month_data["bytes_received"],
      highlight: ["now",],
      considerMissingDataAsZero: true,
      legend: month_colors["bytes_received"],
      displayLegend: true,
      legendCellSize: 10,
      legendMargin: [10,0,10,10],
      itemName: ["Byte", "Bytes"],
      weekStartOnMonday: false,
      subDomainTextFormat: "%d",

      onClick: function(date, val){
        if (val !== null) {
          $.post('/calendar_point',
          {
            granularity: 'day',
            method: 'sum',
            "must": JSON.stringify(filter_to_array(filters.must)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },

          function(data) {
            if (Daysync) {
              start_day = new Date(date);
              start_day.setDate(start_day.getDate() - 3);
              RefreshDayCal();
            }
          });
          var tomorrow = new Date(date);
          tomorrow.setDate(tomorrow.getDate() + 1);
          timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(tomorrow).format("YYYY-MM-DDTHH:mm:ssZ")}}};
          $.post('/calendar_stat',
          {
            "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },
          function(data){
            showStats(data["result"], date, false);
          });
        } // end val!= null
        else{// val == 0
          $("#cal-stats_num_request").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_received").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_sent").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
        }
      }, // end onClick function
      legendColors: {
        min: "#B6E6FF",
        max: "MidnightBlue",
        empty: "#ededed"
      }
    });
    // end init() cal3
  });

  cal5.destroy(function(){
    cal5 = new CalHeatMap();
    cal5.init({
      itemSelector: "#cal-heatmap5",
      domain: "month",
      subDomain: "x_day",
      cellSize: 30,
      range: 4,
      domainGutter: 10,
      label: {
        position: "top"
      },
      animationDuration: 500,
      // domainDynamicDimension: false,
      itemNamespace: "domainDynamicDimension",
      tooltip: true,
      start: start,
      data: month_data["bytes_sent"],
      highlight: ["now",],
      considerMissingDataAsZero: true,
      legend: month_colors["bytes_sent"],
      displayLegend: true,
      legendCellSize: 10,
      legendMargin: [10,0,10,10],
      itemName: ["Byte", "Bytes"],
      weekStartOnMonday: false,
      subDomainTextFormat: "%d",

      onClick: function(date, val){
        if (val !== null) {
          if (Daysync) {
            start_day = new Date(date);
            start_day.setDate(start_day.getDate() - 3);
            RefreshDayCal();
          }
          $.post('/calendar_point',
          {
            granularity: 'day',
            method: 'sum',
            "must": JSON.stringify(filter_to_array(filters.must)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },
          function(data) {
            if (Daysync) {
              start_day = new Date(date);
              start_day.setDate(start_day.getDate() - 3);
              RefreshDayCal();
            }
          });
          var tomorrow = new Date(date);
          tomorrow.setDate(tomorrow.getDate() + 1);
          timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(tomorrow).format("YYYY-MM-DDTHH:mm:ssZ")}}};
          $.post('/calendar_stat',
          {
            "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
            "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
            "should": JSON.stringify(filter_to_array(filters.should))
          },
          function(data){
            showStats(data["result"], date, false);
          });
        } // end val!= null
        else{// val == 0
          $("#cal-stats_num_request").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_received").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
          $("#cal-stats_bytes_sent").html(
            "<h3>" + moment(date).format("LL") + "</h3>" +
            "<br /><h1>No DATA</h1>"
          );
        }
      }, // end onClick function
      legendColors: {
        min: "#B6E6FF",
        max: "MidnightBlue",
        empty: "#ededed"
      }
    });
    // end init() cal5
  });
}

function Display_num_request() {
    // window.history.back();
    // $("#month-cal").load("calendar?domain=month&obj=num_request");
    // $("#day-cal").load("calendar?domain=day&obj=num_request");
    if (obj != "num_request") {
      obj = "num_request";
      RefreshCal();
    }

}
function Display_bytes_received() {
    // window.history.back();
    // $("#month-cal").load("calendar?domain=month&obj=bytes_received");
    // $("#day-cal").load("calendar?domain=day&obj=bytes_received");
    if (obj != "bytes_received") {
      obj = "bytes_received";
      RefreshCal();
    }
}
function Display_bytes_sent() {
    // window.history.back();
    // $("#month-cal").load("calendar?domain=month&obj=bytes_sent");
    // $("#day-cal").load("calendar?domain=day&obj=bytes_sent");
    if (obj != "bytes_sent") {
      obj = "bytes_sent";
      RefreshCal();
    }
}

function loadCal(){
  $.post('/calendar_point',
  {
    granularity: 'day',
    method: 'sum',
    "must": JSON.stringify(filter_to_array(filters.must)),
    "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
    "should": JSON.stringify(filter_to_array(filters.should))
  }, function(json_data){
    if(cal){
      month_data = json_data.result;
      month_colors = json_data.colors;
      RefreshMonthCal();
    }
    // initial load
    else{
      console.log(json_data);
      month_data = json_data.result;
      month_colors = json_data.colors;

      console.log(month_data);
      // var month_datas = {"1434092400": 1483}

      var parser = function(data) {
        var stats = {};
        for (var d in data) {
          stats[data[d].date] = data[d].value;
        }
        return stats;
      };

      // function init(){
      if (cal === null) {
        cal = new CalHeatMap();
       }
      if (cal3 === null) {
         cal3 = new CalHeatMap();
        }
      if (cal5 === null) {
        cal5 = new CalHeatMap();
       }

      cal.init({
        itemSelector: "#cal-heatmap",
        domain: "month",
        subDomain: "x_day",
        cellSize: 30,
        range: 4,
        domainGutter: 10,
        label: {
          position: "top"
        },
        animationDuration: 500,
        // domainDynamicDimension: false,
        itemNamespace: "domainDynamicDimension",
        tooltip: true,
        // minDate: MinDate,
        // maxDate: MaxDate,
        start: start,
        data: month_data["num_request"],
        highlight: ["now",],
        considerMissingDataAsZero: true,
        legend: month_colors["num_request"],
        displayLegend: true,
        legendCellSize: 10,
        legendMargin: [10,0,10,10],
        itemName: ["Request", "Requests"],
        // previousSelector: ".cal-heatmap-PreviousDomain-selector",
        // nextSelector: ".cal-heatmap-NextDomain-selector",
        weekStartOnMonday: false,
        // afterLoad: function() {
        //     start = Date.now();
        //     init();
        // },
        subDomainTextFormat: "%d",
        // subDomainTitleFormat: {filled: ("{count} {name} {connector} {date}"},

        // onClick: function(date, nb) {
        //   window.location.href = "http://" + window.location.host + "/calendar2?time=" + moment(date).format();
        // }

        onClick: function(date, val){
          console.log(filter_to_array(filters.must));
          if (val !== null) {
            $.post('/calendar_point',
            {
              granularity: 'day',
              method: 'sum',
              "must": JSON.stringify(filter_to_array(filters.must)),
              "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
              "should": JSON.stringify(filter_to_array(filters.should))
            // {
            //   granularity: "day",
            //   bucketData: "{{obj}}",
            //   bucketDataAnalyze: "sum",
            //   time: moment(date).format().substring(0,19)
              //
            },

            function(data) {
              if (Daysync) {
                start_day = new Date(date);
                start_day.setDate(start_day.getDate() - 3);
                RefreshDayCal();
              }
            });
            var tomorrow = new Date(date);
            tomorrow.setDate(tomorrow.getDate() + 1);
            timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(tomorrow).format("YYYY-MM-DDTHH:mm:ssZ")}}};
            $.post('/calendar_stat',
            {
              "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
              "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
              "should": JSON.stringify(filter_to_array(filters.should))
            },
            function(data){
              showStats(data["result"], date, false);
            });
          } // end val!= null
          else{// val == 0
            $("#cal-stats_num_request").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
            $("#cal-stats_bytes_received").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
            $("#cal-stats_bytes_sent").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
          }

        }, // end onClick function

        legendColors: {
          min: "#B6E6FF",
          max: "MidnightBlue",
          empty: "#ededed"
        }
      });
      // end function init cal

      cal3.init({
        itemSelector: "#cal-heatmap3",
        domain: "month",
        subDomain: "x_day",
        cellSize: 30,
        range: 4,
        domainGutter: 10,
        label: {
          position: "top"
        },
        animationDuration: 500,
        // domainDynamicDimension: false,
        itemNamespace: "domainDynamicDimension",
        tooltip: true,
        start: start,
        data: month_data["bytes_received"],
        highlight: ["now",],
        considerMissingDataAsZero: true,
        legend: month_colors["bytes_received"],
        displayLegend: true,
        legendCellSize: 10,
        legendMargin: [10,0,10,10],
        itemName: ["Byte", "Bytes"],
        weekStartOnMonday: false,
        subDomainTextFormat: "%d",

        onClick: function(date, val){
          if (val !== null) {
            $.post('/calendar_point',
            {
              granularity: 'day',
              method: 'sum',
              "must": JSON.stringify(filter_to_array(filters.must)),
              "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
              "should": JSON.stringify(filter_to_array(filters.should))
            },

            function(data) {
              if (Daysync) {
                start_day = new Date(date);
                start_day.setDate(start_day.getDate() - 3);
                RefreshDayCal();
              }
            });
            var tomorrow = new Date(date);
            tomorrow.setDate(tomorrow.getDate() + 1);
            timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(tomorrow).format("YYYY-MM-DDTHH:mm:ssZ")}}};
            $.post('/calendar_stat',
            {
              "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
              "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
              "should": JSON.stringify(filter_to_array(filters.should))
            },
            function(data){
              showStats(data["result"], date, false);
            });
          } // end val!= null
          else{// val == 0
            $("#cal-stats_num_request").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
            $("#cal-stats_bytes_received").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
            $("#cal-stats_bytes_sent").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
          }
        }, // end onClick function
        legendColors: {
          min: "#B6E6FF",
          max: "MidnightBlue",
          empty: "#ededed"
        }
      });
      // end init() cal3

      cal5.init({
        itemSelector: "#cal-heatmap5",
        domain: "month",
        subDomain: "x_day",
        cellSize: 30,
        range: 4,
        domainGutter: 10,
        label: {
          position: "top"
        },
        animationDuration: 500,
        // domainDynamicDimension: false,
        itemNamespace: "domainDynamicDimension",
        tooltip: true,
        start: start,
        data: month_data["bytes_sent"],
        highlight: ["now",],
        considerMissingDataAsZero: true,
        legend: month_colors["bytes_sent"],
        displayLegend: true,
        legendCellSize: 10,
        legendMargin: [10,0,10,10],
        itemName: ["Byte", "Bytes"],
        weekStartOnMonday: false,
        subDomainTextFormat: "%d",

        onClick: function(date, val){
          if (val !== null) {
            $.post('/calendar_point',
            {
              granularity: 'day',
              method: 'sum',
              "must": JSON.stringify(filter_to_array(filters.must)),
              "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
              "should": JSON.stringify(filter_to_array(filters.should))
            // {
            //   granularity: "day",
            //   bucketData: "{{obj}}",
            //   bucketDataAnalyze: "sum",
            //   time: moment(date).format().substring(0,19)
              //
            },

            function(data) {
              if (Daysync) {
                start_day = new Date(date);
                start_day.setDate(start_day.getDate() - 3);
                RefreshDayCal();
              }
            });
            var tomorrow = new Date(date);
            tomorrow.setDate(tomorrow.getDate() + 1);
            timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(tomorrow).format("YYYY-MM-DDTHH:mm:ssZ")}}};
            $.post('/calendar_stat',
            {
              "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
              "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
              "should": JSON.stringify(filter_to_array(filters.should))
            },
            function(data){
              showStats(data["result"], date, false);
            });
          } // end val!= null
          else{// val == 0
            $("#cal-stats_num_request").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
            $("#cal-stats_bytes_received").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
            $("#cal-stats_bytes_sent").html(
              "<h3>" + moment(date).format("LL") + "</h3>" +
              "<br /><h1>No DATA</h1>"
            );
          }
        }, // end onClick function
        legendColors: {
          min: "#B6E6FF",
          max: "MidnightBlue",
          empty: "#ededed"
        }
      });
      // end init() cal5

      // function destroy(){
      //   cal = cal.destroy();
      // }
      // $("#cal-heatmap-destroy").on("click", function(e) {
      //   destroy();
      // });
      //
      // $("#cal-heatmap-afterLoad-init").on("click", function(e) {
      //   // $(this).remove();
      //   if (cal !== null) {
      //     destroy();
      //   }
      //   if (cal === null) {
      //     init();
      //   }
      // });
      //
      // $(".cal-heatmap-PreviousDomain-selector").on("click", function(e) {
      // 	e.preventDefault();
      // 	if (!cal.previous()) {
      // 		alert("No more domains to load");
      // 	}
      // });
      //
      // $(".cal-heatmap-NextDomain-selector").on("click", function(e) {
      // 	e.preventDefault();
      // 	if (!cal.next()) {
      // 		alert("No more domains to load");
      // 	}
      // });
      // $("#cal-heatmap-display-in").on("click", function() {
      // 	cal.update(in_data);
      // });
      //
      // $("#cal-heatmap-display-out").on("click", function() {
      // 	cal.update(out_data);
      // });
    } // end initial load
  }); // END initial AJAX data load for month calendars


  $.post('/calendar_point',
  {
    granularity: 'hour',
    method: 'sum',
    "must": JSON.stringify(filter_to_array(filters.must)),
    "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
    "should": JSON.stringify(filter_to_array(filters.should))
  }, function(json_data){
    if (cal2) {
      day_data = json_data.result;
      day_colors = json_data.colors;
      RefreshDayCal();
    }
    else
    // initial load
    {  console.log(json_data);
      day_data = json_data.result;
      day_colors = json_data.colors;

      console.log(day_data);
      // var datas = {"1434092400": 1483}

      var parser = function(data) {
        var stats = {};
        for (var d in data) {
          stats[data[d].date] = data[d].value;
        }
        return stats;
      };

      // function init(){
      if (cal2 === null) {
        cal2 = new CalHeatMap();
       }
      if (cal4 === null) {
       cal4 = new CalHeatMap();
      }
      if (cal6 === null) {
        cal6 = new CalHeatMap();
       }

      cal2.init({
        itemSelector: "#cal-heatmap2",
        domain: "day",
        subDomain: "hour",
        cellSize: 20,
        cellRadius: 10,
        range: 10,
        colLimit: 24,
        verticalOrientation: true,
        animationDuration: 500,
        label: {
          position: "left",
          width: 46
        },
        // domainDynamicDimension: false,
        itemNamespace: "domainDynamicDimension",
        tooltip: true,
        // minDate: MinDate2,
        // maxDate: MaxDate2,
        start: start_day,
        data: day_data["num_request"],
        highlight: ["now",],
        considerMissingDataAsZero: true,
        legend: day_colors["num_request"],
        displayLegend: true,
        legendCellSize: 10,
        legendMargin: [10,0,10,10],
        itemName: ["Request", "Requests"],
        // previousSelector: ".cal-heatmap2-PreviousDomain-selector",
        // nextSelector: ".cal-heatmap2-NextDomain-selector",
        // afterLoad: function() {
        //     start = Date.now();
        //     init();
        // },
        subDomainTextFormat: function(date ,value) {
            if (value/1000000000000 > 1) {
              return (value/1000000000000).toFixed(0) + "T";
            }
            if (value/1000000000 > 1) {
              return (value/1000000000).toFixed(0) + "B";
            }
            if (value/1000000 > 1) {
              return (value/1000000).toFixed(0) + "M";
            }
            if (value/1000 > 1) {
              return (value/1000).toFixed(0) + "K";
            }
          return value;
        },

        // onClick: function(date, nb) {
        //   window.location.href = "http://" + window.location.host + "/calendar2?time=" + moment(date).format();
        // }

        onClick: function(date, val){
          if (val !== null) {
            var nextHour = new Date(date);
            nextHour.setHours(nextHour.getHours() + 1);
            timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(nextHour).format("YYYY-MM-DDTHH:mm:ssZ")}}};
            $.post('/calendar_stat',
            {
              "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
              "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
              "should": JSON.stringify(filter_to_array(filters.should))
            },
            function(data){
              showStats(data["result"], date, false);
            });
            } // end val!= null
            else{// val == 0
              $("#cal-stats_num_request").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
              $("#cal-stats_bytes_received").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
              $("#cal-stats_bytes_sent").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
            }

          }, // end onClick function

          legendColors: {
            min: "#B6E6FF",
            max: "MidnightBlue",
            empty: "#ededed"
          }
        });
        // } // end init() cal2

        cal4.init({
          itemSelector: "#cal-heatmap4",
          domain: "day",
          subDomain: "hour",
          cellSize: 20,
          cellRadius: 10,
          range: 10,
          colLimit: 24,
          verticalOrientation: true,
          animationDuration: 500,
          label: {
            position: "left",
            width: 46
          },
          itemNamespace: "domainDynamicDimension",
          tooltip: true,
          start: start_day,
          data: day_data["bytes_received"],
          highlight: ["now",],
          considerMissingDataAsZero: true,
          legend: day_colors["bytes_received"],
          displayLegend: true,
          legendCellSize: 10,
          legendMargin: [10,0,10,10],
          itemName: ["Byte", "Bytes"],
          subDomainTextFormat: function(date ,value) {
              if (value/1000000000000000 > 1) {
                return (value/1000000000000000).toFixed(0) + "P";
              }
              if (value/1000000000000 > 1) {
                return (value/1000000000000).toFixed(0) + "T";
              }
              if (value/1000000000 > 1) {
                return (value/1000000000).toFixed(0) + "G";
              }
              if (value/1000000 > 1) {
                return (value/1000000).toFixed(0) + "M";
              }
              if (value/1000 > 1) {
                return (value/1000).toFixed(0) + "K";
              }
            return value;
          },

          onClick: function(date, val){
            if (val !== null) {
              var nextHour = new Date(date);
              nextHour.setHours(nextHour.getHours() + 1);
              timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(nextHour).format("YYYY-MM-DDTHH:mm:ssZ")}}};
              $.post('/calendar_stat',
              {
                "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
                "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
                "should": JSON.stringify(filter_to_array(filters.should))
              },
              function(data){
                showStats(data["result"], date, false);
              });
            } // end val!= null
            else{// val == 0
              $("#cal-stats_num_request").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
              $("#cal-stats_bytes_received").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
              $("#cal-stats_bytes_sent").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
            }
          }, // end onClick function

          legendColors: {
            min: "#B6E6FF",
            max: "MidnightBlue",
            empty: "#ededed"
          }
        });
        // end init() cal4

        cal6.init({
          itemSelector: "#cal-heatmap6",
          domain: "day",
          subDomain: "hour",
          cellSize: 20,
          cellRadius: 10,
          range: 10,
          colLimit: 24,
          verticalOrientation: true,
          animationDuration: 500,
          label: {
            position: "left",
            width: 46
          },
          itemNamespace: "domainDynamicDimension",
          tooltip: true,
          start: start_day,
          data: day_data["bytes_sent"],
          highlight: ["now",],
          considerMissingDataAsZero: true,
          legend: day_colors["bytes_sent"],
          displayLegend: true,
          legendCellSize: 10,
          legendMargin: [10,0,10,10],
          itemName: ["Byte", "Bytes"],
          subDomainTextFormat: function(date ,value) {
              if (value/1000000000000000 > 1) {
                return (value/1000000000000000).toFixed(0) + "P";
              }
              if (value/1000000000000 > 1) {
                return (value/1000000000000).toFixed(0) + "T";
              }
              if (value/1000000000 > 1) {
                return (value/1000000000).toFixed(0) + "G";
              }
              if (value/1000000 > 1) {
                return (value/1000000).toFixed(0) + "M";
              }
              if (value/1000 > 1) {
                return (value/1000).toFixed(0) + "K";
              }
            return value;
          },

          onClick: function(date, val){
            if (val !== null) {
              var nextHour = new Date(date);
              nextHour.setHours(nextHour.getHours() + 1);
              timescope[0] = {"range": {"time_iso8601": {"gte": moment(date).format("YYYY-MM-DDTHH:mm:ssZ"), "lte": moment(nextHour).format("YYYY-MM-DDTHH:mm:ssZ")}}};
              $.post('/calendar_stat',
              {
                "must": JSON.stringify(filter_to_array(filters.must).concat(timescope)),
                "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
                "should": JSON.stringify(filter_to_array(filters.should))
              },
              function(data){
                showStats(data["result"], date, false);
              });
            } // end val!= null
            else{// val == 0
              $("#cal-stats_num_request").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
              $("#cal-stats_bytes_received").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
              $("#cal-stats_bytes_sent").html(
                "<h3>" + moment(date).format("LL") + "</h3>" +
                "<br /><h1>No DATA</h1>"
              );
            }
          }, // end onClick function

          legendColors: {
            min: "#B6E6FF",
            max: "MidnightBlue",
            empty: "#ededed"
          }
        });
        // end init() cal6

        // function destroy(){
        //   cal = cal.destroy();
        // }
        // $("#cal-heatmap2-destroy").on("click", function(e) {
        //   destroy();
        // });
        //
        // $("#cal-heatmap2-afterLoad-init").on("click", function(e) {
        //   // $(this).remove();
        //   if (cal !== null) {
        //     destroy();
        //   }
        //   if (cal === null) {
        //     init();
        //   }
        // });
        //
        // $(".cal-heatmap2-PreviousDomain-selector").on("click", function(e) {
        // 	e.preventDefault();
        // 	if (!cal2.previous()) {
        // 		alert("No more domains to load");
        // 	}
        // });
        //
        // $("#cal-heatmap2-NextDomain-selector").on("click", function(e) {
        // 	e.preventDefault();
        // 	if (!cal2.next()) {
        // 		alert("No more domains to load");
        // 	}
        // });
        // $("#cal-heatmap2-display-in").on("click", function() {
        // 	cal.update(in_data);
        // });
        //
        // $("#cal-heatmap2-display-out").on("click", function() {
        // 	cal.update(out_data);
        // });
      }

  }); // END initial AJAX data load for DAY CALENDAR
}// end else

loadCal();
// display overstats
$.post('/calendar_stat',
{
  "must": JSON.stringify(filter_to_array(filters.must)),
  "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
  "should": JSON.stringify(filter_to_array(filters.should))
},
function(data){
  showStats(data["result"], new Date(), true);
});
