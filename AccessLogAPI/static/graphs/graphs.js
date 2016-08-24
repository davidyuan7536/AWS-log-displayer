
jQuery(document).ready(function(){

  var sort_by = function(field, reverse, primer){

    var key = primer ?
    function(x) {return primer(x[field])} :
    function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////
  //Graph Container 1///////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  var options = {
    rangeSelector : {
      buttons : [{
        type : 'day',
        count : 1,
        text : '1D'
      }, {
        type : 'week',
        count : 1,
        text : '1W'
      }, {
        type : 'month',
        count : 1,
        text : '1M'
      }, {
        type : 'all',
        count : 1,
        text : 'All'
      }],
      selected : 3,
      inputEnabled : false
    },

    chart: {
      renderTo: 'mainGraphContainer1',
      defaultSeriesType: 'line',
      panning: 'true'
    },

    title: {
      text: 'Average Bytes Sent By Day'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
      day: '%b %e',
      week: '%b %e',
      month: '%b %e',
      year: '%y'
    },
    title: {
      text: 'Date'
    }
  },
  yAxis: {
    min: 0
  },
  tooltip: {

  },

  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        ]
      },
      marker: {
        radius: 2
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    }
  },




  series: [],

};


var dps = [];
mustData = [];
mustNotData = [];
shouldData = [];

var data2 = {
  'bucketData': "bytes_sent",
  'bucketDataAnalyze': "avg",
  'granularity': "day",
  'limit': '0',
  'offset': '0',
  'mustData' : JSON.stringify(mustData),
  'mustNotData' : JSON.stringify(mustNotData),
  'shouldData' : JSON.stringify(shouldData)
};

$.post( "/elasticsearch/dateHistogram", data2, function( data3 ){

  var myDate
  $.each(data3.grouping.buckets, function(index,value ){

    // alert(data3.grouping.buckets[index].key_as_string);
    myDate = new Date(data3.grouping.buckets[index].key_as_string);

    var myEpoch = myDate.getTime()/1000.0;
    // alert(data3.grouping.buckets[index].dataAnalyzeReturned.value);
    dps.push({x: myEpoch, y: data3.grouping.buckets[index].dataAnalyzeReturned.value});


  });
  dps.sort(sort_by('x', false, parseInt));

  dataHolder = [];
  $.each(dps, function(index, value){
    dataHolder.push([ dps[index]["x"]*1000, dps[index]["y"] ]);
  });


  options.series = [{name : 'testing', data: dataHolder}];

  var chart = new Highcharts.StockChart(options);
  chart.pointer.cmd = chart.pointer.onContainerMouseDown;
  chart.pointer.onContainerMouseDown = function (a){
    this.zoomX=this.zoomHor=this.hasZoom=a.shiftKey;
    this.cmd(a);
  };
});




/////////////////////////////////////////////////////////////////////////////////////////////////
//FILTER MODAL///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////



$('#addFilterOptionsMust').click(function(){
  var x = $(".mustUniqueCounterHiddenFlag");
  if($('#mustUniqueCounter').val() >= 26 && x.length == 0){
    alert("Maximum Filter Options Reached!")
  }
  else if(x.length != 0){
    var temp = $(x[0]).val();
    var temp2 = $('#currentLastDisplayedFilterMust').val();
    // var temp2 = parseInt($('#mustUniqueCounter').val(), 10) - 1;
    $('dataFilter-optionsMust[unique-id = "' + temp +'"]').insertAfter($('dataFilter-optionsMust[unique-id = "' + temp2 +'"]'));
    $('dataFilter-optionsMust[unique-id = "' + temp +'"]').show();
    var temp3 = "#must-filter-by-onchange-wrap" + temp;
    $(temp3).show()
    $('#currentLastDisplayedFilterMust').val(temp);
    $(x[0]).remove();
  }
  else{
    $('dataFilter-optionsMust[unique-id = "' + $('#mustUniqueCounter').val() +'"]').show("slow");
    var adder = $('#mustUniqueCounter').val();
    adder = parseInt(adder, 10) + 1;
    $('#mustUniqueCounter').val(adder);
    $('#currentLastDisplayedFilterMust').val(parseInt(adder, 10) - 1);
  }
});


$('#addFilterOptionsMustNot').click(function(){
  var x = $(".MustNotUniqueCounterHiddenFlag");
  if($('#MustNotUniqueCounter').val() >= 26 && x.length == 0){
    alert("Maximum Filter Options Reached!")
  }
  else if(x.length != 0){
    var temp = $(x[0]).val();
    var temp2 = $('#currentLastDisplayedFilterMustNot').val();
    // var temp2 = parseInt($('#MustNotUniqueCounter').val(), 10) - 1;
    $('dataFilter-optionsMustNot[unique-id = "' + temp +'"]').insertAfter($('dataFilter-optionsMustNot[unique-id = "' + temp2 +'"]'));
    $('dataFilter-optionsMustNot[unique-id = "' + temp +'"]').show();
    var temp3 = "#MustNot-filter-by-onchange-wrap" + temp;
    $(temp3).show()
    $('#currentLastDisplayedFilterMustNot').val(temp);
    $(x[0]).remove();
  }
  else{
    $('dataFilter-optionsMustNot[unique-id = "' + $('#MustNotUniqueCounter').val() +'"]').show("slow");
    var adder = $('#MustNotUniqueCounter').val();
    adder = parseInt(adder, 10) + 1;
    $('#MustNotUniqueCounter').val(adder);
    $('#currentLastDisplayedFilterMustNot').val(parseInt(adder, 10) - 1);
  }
});


$('#addFilterOptionsShould').click(function(){
  var x = $(".ShouldUniqueCounterHiddenFlag");
  if($('#ShouldUniqueCounter').val() >= 26 && x.length == 0){
    alert("Maximum Filter Options Reached!")
  }
  else if(x.length != 0){
    var temp = $(x[0]).val();
    var temp2 = $('#currentLastDisplayedFilterShould').val();
    // var temp2 = parseInt($('#ShouldUniqueCounter').val(), 10) - 1;
    $('dataFilter-optionsShould[unique-id = "' + temp +'"]').insertAfter($('dataFilter-optionsShould[unique-id = "' + temp2 +'"]'));
    $('dataFilter-optionsShould[unique-id = "' + temp +'"]').show();
    var temp3 = "#Should-filter-by-onchange-wrap" + temp;
    $(temp3).show()
    $('#currentLastDisplayedFilterShould').val(temp);
    $(x[0]).remove();
  }
  else{
    $('dataFilter-optionsShould[unique-id = "' + $('#ShouldUniqueCounter').val() +'"]').show("slow");
    var adder = $('#ShouldUniqueCounter').val();
    adder = parseInt(adder, 10) + 1;
    $('#ShouldUniqueCounter').val(adder);
    $('#currentLastDisplayedFilterShould').val(parseInt(adder, 10) - 1);
  }

});


$('#graphFilterOptionsSubmit').click(function(){
  alert("function call?!");

  mustData = [];
  mustNotData = [];
  shouldData = [];

  var x = $("dataFilter-optionsMust");

  for(var i = 0; i < parseInt($('#mustUniqueCounter').val(), 10) - 1; i++){
    var uid = $(x[i]).attr("unique-id");
    temp = "must-filter-by-onchange" + uid;
    var e = document.getElementById(temp);
    var mustFilterByValue = e.options[e.selectedIndex].value;

    temp = "must-filter-type-onchange" + uid;
    e = document.getElementById(temp);
    var mustFilterTypeValue = e.options[e.selectedIndex].value;

    temp = "#must-filter-term" + uid;
    var mustFilterTermValue = $(temp).val();

    temp = "#must-filter-range-lower" + uid;
    var mustFilterRangeLower = $(temp).val();

    temp = "#must-filter-range-upper" + uid;
    var mustFilterRangeUpper = $(temp).val();

    var mustPartialMatchCheckboxHandler = "#must-checkbox-value" + uid;

    if(mustFilterByValue != ""){
      if(mustFilterTypeValue != ""){
        if(mustFilterTypeValue == "Term"){
          if(mustFilterTermValue != ""){
            if(mustFilterByValue == "IP Address"){
              mustData.splice(0, 0, { "term" : { "remote_addr" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Time"){
              mustData.splice(0, 0, { "term" : { "time_iso8601" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Time Elapsed"){
              mustData.splice(0, 0, { "term" : { "request_time" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Request URI"){

              if($(mustPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = mustFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustData.splice(0, 0, { "regexp" : { "request_uri" : stringSplit[xReg] }});
                }
              }
              else{
                mustData.splice(0, 0, { "term" : { "request_uri" : mustFilterTermValue }});
              }
            }
            if(mustFilterByValue == "Request Method"){
              mustData.splice(0, 0, { "term" : { "request_method" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Status Code"){
              mustData.splice(0, 0, { "term" : { "status" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Request Length"){
              mustData.splice(0, 0, { "term" : { "bytes_received" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Body Bytes Sent"){
              mustData.splice(0, 0, { "term" : { "body_bytes_sent" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Bytes Sent"){
              mustData.splice(0, 0, { "term" : { "bytes_sent" : mustFilterTermValue }});
            }
            if(mustFilterByValue == "Host"){
              if($(mustPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = mustFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustData.splice(0, 0, { "regexp" : { "http_host" : stringSplit[xReg] }});
                }
              }
              else{
                mustData.splice(0, 0, { "term" : { "http_host" : mustFilterTermValue }});
              }
            }
            if(mustFilterByValue == "Referer"){
              if($(mustPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = mustFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustData.splice(0, 0, { "regexp" : { "http_referer" : stringSplit[xReg] }});
                }
              }
              else{
                mustData.splice(0, 0, { "term" : { "http_referer" : mustFilterTermValue }});
              }
            }
            if(mustFilterByValue == "User Agent"){
              if($(mustPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = mustFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustData.splice(0, 0, { "regexp" : { "http_user_agent" : stringSplit[xReg] }});
                }
              }
              else{
                mustData.splice(0, 0, { "term" : { "http_user_agent" : mustFilterTermValue }});
              }
            }
          }
        }

        if(mustFilterTypeValue == "Range"){
          if(mustFilterRangeLower != "" && mustFilterRangeLower != ""){
            if(mustFilterByValue == "IP Address"){
              mustData.splice(0, 0, {"range" : {"remote_addr" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Time"){
              mustData.splice(0, 0, {"range" : {"time_iso8601" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Time Elapsed"){
              mustData.splice(0, 0, {"range" : {"request_time" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Request URI"){
              mustData.splice(0, 0, {"range" : {"request_uri" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Request Method"){
              mustData.splice(0, 0, {"range" : {"request_method" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Status Code"){
              mustData.splice(0, 0, {"range" : {"status" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Request Length"){
              mustData.splice(0, 0, {"range" : {"request_length" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Body Bytes Sent"){
              mustData.splice(0, 0, {"range" : {"body_bytes_sent" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Bytes Sent"){
              mustData.splice(0, 0, {"range" : {"bytes_sent" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Host"){
              mustData.splice(0, 0, {"range" : {"http_host" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "Referer"){
              mustData.splice(0, 0, {"range" : {"http_referer" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
            if(mustFilterByValue == "User Agent"){
              mustData.splice(0, 0, {"range" : {"http_user_agent" : {"gte" : ""+mustFilterRangeLower+"", "lte" : ""+mustFilterRangeUpper+""}}});
            }
          }
        }
      }
    }
  }







  var x = $("dataFilter-optionsMustNot");
  for(var i = 0; i < parseInt($('#MustNotUniqueCounter').val(), 10) - 1; i++){
    var uid = $(x[i]).attr("unique-id");
    temp = "MustNot-filter-by-onchange" + uid;
    var e = document.getElementById(temp);
    var MustNotFilterByValue = e.options[e.selectedIndex].value;

    temp = "MustNot-filter-type-onchange" + uid;
    e = document.getElementById(temp);
    var MustNotFilterTypeValue = e.options[e.selectedIndex].value;

    temp = "#MustNot-filter-term" + uid;
    var MustNotFilterTermValue = $(temp).val();

    temp = "#MustNot-filter-range-lower" + uid;
    var MustNotFilterRangeLower = $(temp).val();

    temp = "#MustNot-filter-range-upper" + uid;
    var MustNotFilterRangeUpper = $(temp).val();


    var MustNotPartialMatchCheckboxHandler = "#MustNot-checkbox-value" + uid;

    if(MustNotFilterByValue != ""){
      if(MustNotFilterTypeValue != ""){
        if(MustNotFilterTypeValue == "Term"){
          if(MustNotFilterTermValue != ""){
            if(MustNotFilterByValue == "IP Address"){
              mustNotData.splice(0, 0, { "term" : { "remote_addr" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Time"){
              mustNotData.splice(0, 0, { "term" : { "time_iso8601" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Time Elapsed"){
              mustNotData.splice(0, 0, { "term" : { "request_time" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Request URI"){

              if($(MustNotPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = MustNotFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustNotData.splice(0, 0, { "regexp" : { "request_uri" : stringSplit[xReg] }});
                }
              }
              else{
                mustNotData.splice(0, 0, { "term" : { "request_uri" : MustNotFilterTermValue }});
              }
            }
            if(MustNotFilterByValue == "Request Method"){
              mustNotData.splice(0, 0, { "term" : { "request_method" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Status Code"){
              mustNotData.splice(0, 0, { "term" : { "status" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Request Length"){
              mustNotData.splice(0, 0, { "term" : { "bytes_received" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Body Bytes Sent"){
              mustNotData.splice(0, 0, { "term" : { "body_bytes_sent" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Bytes Sent"){
              mustNotData.splice(0, 0, { "term" : { "bytes_sent" : MustNotFilterTermValue }});
            }
            if(MustNotFilterByValue == "Host"){
              if($(MustNotPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = MustNotFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustNotData.splice(0, 0, { "regexp" : { "http_host" : stringSplit[xReg] }});
                }
              }
              else{
                mustNotData.splice(0, 0, { "term" : { "http_host" : MustNotFilterTermValue }});
              }
            }
            if(MustNotFilterByValue == "Referer"){
              if($(MustNotPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = MustNotFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustNotData.splice(0, 0, { "regexp" : { "http_referer" : stringSplit[xReg] }});
                }
              }
              else{
                mustNotData.splice(0, 0, { "term" : { "http_referer" : MustNotFilterTermValue }});
              }
            }
            if(MustNotFilterByValue == "User Agent"){
              if($(MustNotPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = MustNotFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  mustNotData.splice(0, 0, { "regexp" : { "http_user_agent" : stringSplit[xReg] }});
                }
              }
              else{
                mustNotData.splice(0, 0, { "term" : { "http_user_agent" : MustNotFilterTermValue }});
              }
            }
          }
        }


        if(MustNotFilterTypeValue == "Range"){
          if(MustNotFilterRangeLower != "" && MustNotFilterRangeLower != ""){
            if(MustNotFilterByValue == "IP Address"){
              mustNotData.splice(0, 0, {"range" : {"remote_addr" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Time"){
              mustNotData.splice(0, 0, {"range" : {"time_iso8601" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Time Elapsed"){
              mustNotData.splice(0, 0, {"range" : {"request_time" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Request URI"){
              mustNotData.splice(0, 0, {"range" : {"request_uri" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Request Method"){
              mustNotData.splice(0, 0, {"range" : {"request_method" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Status Code"){
              mustNotData.splice(0, 0, {"range" : {"status" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Request Length"){
              mustNotData.splice(0, 0, {"range" : {"request_length" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Body Bytes Sent"){
              mustNotData.splice(0, 0, {"range" : {"body_bytes_sent" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Bytes Sent"){
              mustNotData.splice(0, 0, {"range" : {"bytes_sent" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Host"){
              mustNotData.splice(0, 0, {"range" : {"http_host" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "Referer"){
              mustNotData.splice(0, 0, {"range" : {"http_referer" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
            if(MustNotFilterByValue == "User Agent"){
              mustNotData.splice(0, 0, {"range" : {"http_user_agent" : {"gte" : ""+MustNotFilterRangeLower+"", "lte" : ""+MustNotFilterRangeUpper+""}}});
            }
          }
        }
      }
    }
  }


  var x = $("dataFilter-optionsShould");
  for(var i = 0; i < parseInt($('#ShouldUniqueCounter').val(), 10) - 1; i++){
    var uid = $(x[i]).attr("unique-id");
    temp = "Should-filter-by-onchange" + uid;
    var e = document.getElementById(temp);
    var ShouldFilterByValue = e.options[e.selectedIndex].value;

    temp = "Should-filter-type-onchange" + uid;
    e = document.getElementById(temp);
    var ShouldFilterTypeValue = e.options[e.selectedIndex].value;

    temp = "#Should-filter-term" + uid;
    var ShouldFilterTermValue = $(temp).val();

    temp = "#Should-filter-range-lower" + uid;
    var ShouldFilterRangeLower = $(temp).val();

    temp = "#Should-filter-range-upper" + uid;
    var ShouldFilterRangeUpper = $(temp).val();


    var ShouldPartialMatchCheckboxHandler = "#Should-checkbox-value" + uid;

    if(ShouldFilterByValue != ""){
      if(ShouldFilterTypeValue != ""){
        if(ShouldFilterTypeValue == "Term"){
          if(ShouldFilterTermValue != ""){
            if(ShouldFilterByValue == "IP Address"){
              shouldData.splice(0, 0, { "term" : { "remote_addr" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Time"){
              shouldData.splice(0, 0, { "term" : { "time_iso8601" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Time Elapsed"){
              shouldData.splice(0, 0, { "term" : { "request_time" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Request URI"){

              if($(ShouldPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = ShouldFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  shouldData.splice(0, 0, { "regexp" : { "request_uri" : stringSplit[xReg] }});
                }
              }
              else{
                shouldData.splice(0, 0, { "term" : { "request_uri" : ShouldFilterTermValue }});
              }
            }
            if(ShouldFilterByValue == "Request Method"){
              shouldData.splice(0, 0, { "term" : { "request_method" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Status Code"){
              shouldData.splice(0, 0, { "term" : { "status" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Request Length"){
              shouldData.splice(0, 0, { "term" : { "bytes_received" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Body Bytes Sent"){
              shouldData.splice(0, 0, { "term" : { "body_bytes_sent" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Bytes Sent"){
              shouldData.splice(0, 0, { "term" : { "bytes_sent" : ShouldFilterTermValue }});
            }
            if(ShouldFilterByValue == "Host"){
              if($(ShouldPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = ShouldFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  shouldData.splice(0, 0, { "regexp" : { "http_host" : stringSplit[xReg] }});
                }
              }
              else{
                shouldData.splice(0, 0, { "term" : { "http_host" : ShouldFilterTermValue }});
              }
            }
            if(ShouldFilterByValue == "Referer"){
              if($(ShouldPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = ShouldFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  shouldData.splice(0, 0, { "regexp" : { "http_referer" : stringSplit[xReg] }});
                }
              }
              else{
                shouldData.splice(0, 0, { "term" : { "http_referer" : ShouldFilterTermValue }});
              }
            }
            if(ShouldFilterByValue == "User Agent"){
              if($(ShouldPartialMatchCheckboxHandler).val() == 1){
                var stringSplit = ShouldFilterTermValue.split(',');
                for(var xReg = 0; xReg < stringSplit.length; xReg++){
                  stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
                  stringSplit[xReg] = ".*" + stringSplit[xReg] + ".*";
                  shouldData.splice(0, 0, { "regexp" : { "http_user_agent" : stringSplit[xReg] }});
                }
              }
              else{
                shouldData.splice(0, 0, { "term" : { "http_user_agent" : ShouldFilterTermValue }});
              }
            }
          }
        }



        if(ShouldFilterTypeValue == "Range"){
          if(ShouldFilterRangeLower != "" && ShouldFilterRangeLower != ""){
            if(ShouldFilterByValue == "IP Address"){
              shouldData.splice(0, 0, {"range" : {"remote_addr" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Time"){
              shouldData.splice(0, 0, {"range" : {"time_iso8601" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Time Elapsed"){
              shouldData.splice(0, 0, {"range" : {"request_time" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Request URI"){
              shouldData.splice(0, 0, {"range" : {"request_uri" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Request Method"){
              shouldData.splice(0, 0, {"range" : {"request_method" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Status Code"){
              shouldData.splice(0, 0, {"range" : {"status" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Request Length"){
              shouldData.splice(0, 0, {"range" : {"request_length" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Body Bytes Sent"){
              shouldData.splice(0, 0, {"range" : {"body_bytes_sent" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Bytes Sent"){
              shouldData.splice(0, 0, {"range" : {"bytes_sent" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Host"){
              shouldData.splice(0, 0, {"range" : {"http_host" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "Referer"){
              shouldData.splice(0, 0, {"range" : {"http_referer" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
            if(ShouldFilterByValue == "User Agent"){
              shouldData.splice(0, 0, {"range" : {"http_user_agent" : {"gte" : ""+ShouldFilterRangeLower+"", "lte" : ""+ShouldFilterRangeUpper+""}}});
            }
          }
        }
      }
    }
  }

  console.log(JSON.stringify(mustData));
  console.log(JSON.stringify(mustNotData));
  console.log(JSON.stringify(shouldData));
  alert("HERE");


  var data = {
    'limit': '0',
    'offset': '0',
    'mustData' : JSON.stringify(mustData),
    'mustNotData' : JSON.stringify(mustNotData),
    'shouldData' : JSON.stringify(shouldData)
  };


  $.post( "/elasticsearch/filterOptions", data, function( data ) {

  });



});







});
