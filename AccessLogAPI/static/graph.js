$( document ).ready(function() {

  lineGraph($('#scope').val(), $('#granularity').val());

  var elem = document.getElementById("upper");

  var currentdate = new Date();
  var datetime = currentdate.getFullYear() + "-" + ('0' + (currentdate.getMonth()+1)).slice(-2) + "-" + ('0' + currentdate.getDate()).slice(-2)  + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

  elem.value = datetime;


  var sort_by = function(field, reverse, primer){

    var key = primer ?
    function(x) {return primer(x[field])} :
    function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }

  $('#hideGraphInfo').click(function() {
    var containerElement = document.getElementById('specific-stats');
    containerElement.innerHTML = "";

  });

  $('#scope').change(function() {

    if($("#scope").val() == "Custom"){
      $(".customDateRange").first().show( "slow", function showNext() {
        $( this ).next( "div" ).show( "slow", showNext );
      });
    }
    else{
      $(".customDateRange").hide(600);
    }
  });

  $('#lineGraphGenerate2').click(function() {
    var containerElement = document.getElementById('loadingWrap');
    containerElement.setAttribute('class', 'blur');
    $('#loaderAnimation').fadeTo(1000, 1);
    lineGraph2($('#upper').val(), $('#lower').val(), $('#granularity').val());
  });

  $('#lineGraphGenerate').click(function() {
    var containerElement = document.getElementById('loadingWrap');
    containerElement.setAttribute('class', 'blur');
    $('#loaderAnimation').fadeTo(1000, 1);

    if($("#scope").val() == "Custom"){
      lineGraph2($('#upper').val(), $('#lower').val(), $('#granularity').val());
    }
    else{
      lineGraph($('#scope').val(), $('#granularity').val());
    }



  });

  function lineGraph2(upperP, lowerP, granularityP){
    var dps = [];
    var dps2 = [];
    var dps3 = [];
    var upper = upperP;
    var lower = lowerP
    var granularity = granularityP;

    var data2 = {
      'lower': lower,
      'upper': upper,
      'granularity': granularity
    };

    $.getJSON('/api/custom_time_points', data2, function(data3){

      $.each(data3.points, function( index, value ){
        var myDate = new Date(data3.points[index].time);
        var myEpoch = myDate.getTime()/1000.0;
        dps.push({x: myEpoch, y: data3.points[index].data_out});
        dps2.push({x: myEpoch, y: data3.points[index].data_in});
        dps3.push({x: myEpoch, y: data3.points[index].num_request});

      });

      dps.sort(sort_by('x', false, parseInt));
      dps2.sort(sort_by('x', false, parseInt));
      dps3.sort(sort_by('x', false, parseInt));

      $.each(dps, function(index, value){
        var temp = new Date(dps[index]["x"]*1000);
        dps[index]["x"] = new Date(temp.toLocaleString());
      });

      $.each(dps2, function(index, value){
        var temp = new Date(dps2[index]["x"]*1000);
        dps2[index]["x"] = new Date(temp.toLocaleString());
      });

      $.each(dps3, function(index, value){
        var temp = new Date(dps3[index]["x"]*1000);
        dps3[index]["x"] = new Date(temp.toLocaleString());
      });


      var chart = new CanvasJS.Chart("chartContainer",
      {

        animationEnabled: true,
        zoomEnabled: true,
        axisX:
        {
          valueFormatString: "DD-MMM HH:mm:ss",
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12,
          labelWrap: true,
          labelMaxWidth: 50,

        },
        toolTip:
        {
          shared:true
        },
        theme: "theme1",
        axisY:
        {
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12
        },
        legend:
        {
          verticalAlign: "center",
          horizontalAlign: "right"
        },
        data: [
          {
            click: function(e){


              var isoTime = new Date(e.dataPoint.x);
              ;
              var temp2 = String(isoTime.toISOString());
              var temp = temp2.split(".");
              var granularityModified = $("#granularity").val().toLowerCase();
              granularityModified = granularityModified.substring(0, granularityModified.length - 1);
              var data = {
                'date': temp[0],
                'granularity': granularityModified,
                'obj': "data_out"
              };

              $.each(dps3, function( key, value ) {
                var myDate1 = new Date(dps3[key]["x"]);
                var myEpoch1 = myDate1.getTime()/1000.0;
                var myDate2 = new Date(e.dataPoint.x);
                var myEpoch2 = myDate2.getTime()/1000.

                if(myEpoch1 == myEpoch2)
                {

                  var elem = document.getElementById("numRequests");
                  elem.value = dps3[key]["y"];
                }
              });

              var num_request = $('#numRequests').val()

              $.getJSON('/calendar_stats', data, function(data){

                $("#specific-stats").html(

                  "<br /> Total <b>" + num_request + "</b> Requests" +
                  "<br /> Average Request Size: <b>" + data.result["avg_length"] + "</b> Bytes" +
                  "<br /> Request Methods: <ol> <li><b>" + data.result["request_method"][1]["name"] + "</b>&nbsp" + ((data.result["request_method"][1]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][2]["name"] + "</b>&nbsp" + ((data.result["request_method"][2]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][3]["name"] + "</b>&nbsp" + ((data.result["request_method"][3]["count"] / num_request) * 100).toFixed(2) + "%</li></ol>" +
                  "<br /> TOP 3 URI:       <ol> <li><b>" + data.result["request_uri"][1]["name"] + "</b>&nbsp" + data.result["request_uri"][1]["count"] + " (" + ((data.result["request_uri"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][2]["name"] + "</b>&nbsp" + data.result["request_uri"][2]["count"] + " (" + ((data.result["request_uri"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][3]["name"] + "</b>&nbsp" + data.result["request_uri"][3]["count"] + " (" + ((data.result["request_uri"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Host:      <ol> <li><b>" + data.result["http_host"][1]["name"] + "</b>&nbsp" + data.result["http_host"][1]["count"] + " (" + ((data.result["http_host"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][2]["name"] + "</b>&nbsp" + data.result["http_host"][2]["count"] + " (" + ((data.result["http_host"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][3]["name"] + "</b>&nbsp" + data.result["http_host"][3]["count"] + " (" + ((data.result["http_host"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Client Address:<ol> <li><b>" + data.result["remote_addr"][1]["name"] + "</b>&nbsp" + data.result["remote_addr"][1]["count"] + " (" + ((data.result["remote_addr"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][2]["name"] + "</b>&nbsp" + data.result["remote_addr"][2]["count"] + " (" + ((data.result["remote_addr"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][3]["name"] + "</b>&nbsp" + data.result["remote_addr"][3]["count"] + " (" + ((data.result["remote_addr"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>"
                );

              });


            },
            type: "column",
            showInLegend: true,
            lineThickness: 2,
            name: "Data Sent",
            color: "#D15B05",
            dataPoints: dps
          },
          {
            click: function(e){


              var isoTime = new Date(e.dataPoint.x);
              ;
              var temp2 = String(isoTime.toISOString());
              var temp = temp2.split(".");
              var granularityModified = $("#granularity").val().toLowerCase();
              granularityModified = granularityModified.substring(0, granularityModified.length - 1);
              var data = {
                'date': temp[0],
                'granularity': granularityModified,
                'obj': "data_in"
              };

              $.each(dps3, function( key, value ) {
                var myDate1 = new Date(dps3[key]["x"]);
                var myEpoch1 = myDate1.getTime()/1000.0;
                var myDate2 = new Date(e.dataPoint.x);
                var myEpoch2 = myDate2.getTime()/1000.

                if(myEpoch1 == myEpoch2)
                {

                  var elem = document.getElementById("numRequests");
                  elem.value = dps3[key]["y"];
                }
              });

              var num_request = $('#numRequests').val()

              $.getJSON('/calendar_stats', data, function(data){

                $("#specific-stats").html(

                  "<br /> Total <b>" + num_request + "</b> Requests" +
                  "<br /> Average Request Size: <b>" + data.result["avg_length"] + "</b> Bytes" +
                  "<br /> Request Methods: <ol> <li><b>" + data.result["request_method"][1]["name"] + "</b>&nbsp" + ((data.result["request_method"][1]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][2]["name"] + "</b>&nbsp" + ((data.result["request_method"][2]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][3]["name"] + "</b>&nbsp" + ((data.result["request_method"][3]["count"] / num_request) * 100).toFixed(2) + "%</li></ol>" +
                  "<br /> TOP 3 URI:       <ol> <li><b>" + data.result["request_uri"][1]["name"] + "</b>&nbsp" + data.result["request_uri"][1]["count"] + " (" + ((data.result["request_uri"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][2]["name"] + "</b>&nbsp" + data.result["request_uri"][2]["count"] + " (" + ((data.result["request_uri"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][3]["name"] + "</b>&nbsp" + data.result["request_uri"][3]["count"] + " (" + ((data.result["request_uri"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Host:      <ol> <li><b>" + data.result["http_host"][1]["name"] + "</b>&nbsp" + data.result["http_host"][1]["count"] + " (" + ((data.result["http_host"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][2]["name"] + "</b>&nbsp" + data.result["http_host"][2]["count"] + " (" + ((data.result["http_host"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][3]["name"] + "</b>&nbsp" + data.result["http_host"][3]["count"] + " (" + ((data.result["http_host"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Client Address:<ol> <li><b>" + data.result["remote_addr"][1]["name"] + "</b>&nbsp" + data.result["remote_addr"][1]["count"] + " (" + ((data.result["remote_addr"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][2]["name"] + "</b>&nbsp" + data.result["remote_addr"][2]["count"] + " (" + ((data.result["remote_addr"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][3]["name"] + "</b>&nbsp" + data.result["remote_addr"][3]["count"] + " (" + ((data.result["remote_addr"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>"
                );

              });


            },
            type: "column",
            showInLegend: true,
            lineThickness: 2,
            name: "Data Received",
            color: "#557FA0",
            dataPoints: dps2
          }
        ],
        legend:
        {
          cursor:"pointer",
          itemclick:function(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            }
            else{
              e.dataSeries.visible = true;
            }
            chart.render();
          },
          fontSize: 15
        }
      });

      var chart2 = new CanvasJS.Chart("chartContainer2",
      {

        animationEnabled: true,
        zoomEnabled: true,
        axisX:
        {
          valueFormatString: "DD-MMM HH:mm:ss",
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12,
          labelWrap: true,
          labelMaxWidth: 50
        },
        toolTip:
        {
          shared:true
        },
        theme: "theme1",
        axisY:
        {
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12
        },
        legend:
        {
          verticalAlign: "center",
          horizontalAlign: "right"
        },
        data: [
          {
            click: function(e){


              var isoTime = new Date(e.dataPoint.x);
              ;
              var temp2 = String(isoTime.toISOString());
              var temp = temp2.split(".");
              var granularityModified = $("#granularity").val().toLowerCase();
              granularityModified = granularityModified.substring(0, granularityModified.length - 1);

              var data = {
                'date': temp[0],
                'granularity': granularityModified,
                'obj': "num_request"
              };

              $.each(dps3, function( key, value ) {
                var myDate1 = new Date(dps3[key]["x"]);
                var myEpoch1 = myDate1.getTime()/1000.0;
                var myDate2 = new Date(e.dataPoint.x);
                var myEpoch2 = myDate2.getTime()/1000.

                if(myEpoch1 == myEpoch2)
                {

                  var elem = document.getElementById("numRequests");
                  elem.value = dps3[key]["y"];
                }
              });

              var num_request = $('#numRequests').val()

              $.getJSON('/calendar_stats', data, function(data){

                $("#specific-stats").html(
                  "<br /> Total <b>" + num_request + "</b> Requests" +
                  "<br /> Average Request Size: <b>" + data.result["avg_length"] + "</b> Bytes" +
                  "<br /> Request Methods: <ol> <li><b>" + data.result["request_method"][1]["name"] + "</b>&nbsp" + ((data.result["request_method"][1]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][2]["name"] + "</b>&nbsp" + ((data.result["request_method"][2]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][3]["name"] + "</b>&nbsp" + ((data.result["request_method"][3]["count"] / num_request) * 100).toFixed(2) + "%</li></ol>" +
                  "<br /> TOP 3 URI:       <ol> <li><b>" + data.result["request_uri"][1]["name"] + "</b>&nbsp" + data.result["request_uri"][1]["count"] + " (" + ((data.result["request_uri"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][2]["name"] + "</b>&nbsp" + data.result["request_uri"][2]["count"] + " (" + ((data.result["request_uri"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][3]["name"] + "</b>&nbsp" + data.result["request_uri"][3]["count"] + " (" + ((data.result["request_uri"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Host:      <ol> <li><b>" + data.result["http_host"][1]["name"] + "</b>&nbsp" + data.result["http_host"][1]["count"] + " (" + ((data.result["http_host"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][2]["name"] + "</b>&nbsp" + data.result["http_host"][2]["count"] + " (" + ((data.result["http_host"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][3]["name"] + "</b>&nbsp" + data.result["http_host"][3]["count"] + " (" + ((data.result["http_host"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Client Address:<ol> <li><b>" + data.result["remote_addr"][1]["name"] + "</b>&nbsp" + data.result["remote_addr"][1]["count"] + " (" + ((data.result["remote_addr"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][2]["name"] + "</b>&nbsp" + data.result["remote_addr"][2]["count"] + " (" + ((data.result["remote_addr"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][3]["name"] + "</b>&nbsp" + data.result["remote_addr"][3]["count"] + " (" + ((data.result["remote_addr"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>"
                );

              });


            },
            type: "column",
            showInLegend: true,
            lineThickness: 2,
            name: "Number of Requests",
            color: "#333333",
            dataPoints: dps3
          }
        ],

        legend:
        {
          cursor:"pointer",
          itemclick:function(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            }
            else{
              e.dataSeries.visible = true;
            }
            chart2.render();
          },
          fontSize: 15
        }
      });

      if($('#granularity').val() == "Year"){
        chart.options.axisX.valueFormatString = "YYYY";
        chart2.options.axisX.valueFormatString = "YYYY";
      }
      if($('#granularity').val() == "Month"){
        chart.options.axisX.valueFormatString = "DD-MMM";
        chart2.options.axisX.valueFormatString = "DD-MMM";
      }

      chart.render();
      chart2.render();
      $("#loadingWrap").removeClass( "blur" );
      $('#loaderAnimation').hide();
    });
  };

  function lineGraph(scopeP, granularityP){
    var dps = [];
    var dps2 = [];
    var dps3 = [];
    var scope = scopeP;
    var granularity = granularityP;


    var data2 = {
      'scope': scope,
      'granularity': granularity
    };

    $.getJSON('/api/time_points', data2, function(data3){

      $.each(data3.points, function( index, value ){
        var myDate = new Date(data3.points[index].time);
        var myEpoch = myDate.getTime()/1000.0;
        dps.push({x: myEpoch, y: data3.points[index].data_out});
        dps2.push({x: myEpoch, y: data3.points[index].data_in});
        dps3.push({x: myEpoch, y: data3.points[index].num_request});

      });

      dps.sort(sort_by('x', false, parseInt));
      dps2.sort(sort_by('x', false, parseInt));
      dps3.sort(sort_by('x', false, parseInt));

      $.each(dps, function(index, value){
        var temp = new Date(dps[index]["x"]*1000);
        dps[index]["x"] = new Date(temp.toLocaleString());
      });

      $.each(dps2, function(index, value){
        var temp = new Date(dps2[index]["x"]*1000);
        dps2[index]["x"] = new Date(temp.toLocaleString());
      });

      $.each(dps3, function(index, value){
        var temp = new Date(dps3[index]["x"]*1000);
        dps3[index]["x"] = new Date(temp.toLocaleString());
      });


      var chart = new CanvasJS.Chart("chartContainer",
      {

        animationEnabled: true,
        zoomEnabled: true,
        axisX:
        {
          valueFormatString: "DD-MMM HH:mm:ss",
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12,
          labelWrap: true,
          labelMaxWidth: 50,

        },
        toolTip:
        {
          shared:true
        },
        theme: "theme1",
        axisY:
        {
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12
        },
        legend:
        {
          verticalAlign: "center",
          horizontalAlign: "right"
        },
        data: [
          {
            click: function(e){


              var isoTime = new Date(e.dataPoint.x);
              ;
              var temp2 = String(isoTime.toISOString());
              var temp = temp2.split(".");
              var granularityModified = $("#granularity").val().toLowerCase();
              granularityModified = granularityModified.substring(0, granularityModified.length - 1);
              var data = {
                'date': temp[0],
                'granularity': granularityModified,
                'obj': "data_out"
              };

              $.each(dps3, function( key, value ) {
                var myDate1 = new Date(dps3[key]["x"]);
                var myEpoch1 = myDate1.getTime()/1000.0;
                var myDate2 = new Date(e.dataPoint.x);
                var myEpoch2 = myDate2.getTime()/1000.

                if(myEpoch1 == myEpoch2)
                {

                  var elem = document.getElementById("numRequests");
                  elem.value = dps3[key]["y"];
                }
              });

              var num_request = $('#numRequests').val()

              $.getJSON('/calendar_stats', data, function(data){

                $("#specific-stats").html(

                  "<br /> Total <b>" + num_request + "</b> Requests" +
                  "<br /> Average Request Size: <b>" + data.result["avg_length"] + "</b> Bytes" +
                  "<br /> Request Methods: <ol> <li><b>" + data.result["request_method"][1]["name"] + "</b>&nbsp" + ((data.result["request_method"][1]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][2]["name"] + "</b>&nbsp" + ((data.result["request_method"][2]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][3]["name"] + "</b>&nbsp" + ((data.result["request_method"][3]["count"] / num_request) * 100).toFixed(2) + "%</li></ol>" +
                  "<br /> TOP 3 URI:       <ol> <li><b>" + data.result["request_uri"][1]["name"] + "</b>&nbsp" + data.result["request_uri"][1]["count"] + " (" + ((data.result["request_uri"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][2]["name"] + "</b>&nbsp" + data.result["request_uri"][2]["count"] + " (" + ((data.result["request_uri"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][3]["name"] + "</b>&nbsp" + data.result["request_uri"][3]["count"] + " (" + ((data.result["request_uri"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Host:      <ol> <li><b>" + data.result["http_host"][1]["name"] + "</b>&nbsp" + data.result["http_host"][1]["count"] + " (" + ((data.result["http_host"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][2]["name"] + "</b>&nbsp" + data.result["http_host"][2]["count"] + " (" + ((data.result["http_host"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][3]["name"] + "</b>&nbsp" + data.result["http_host"][3]["count"] + " (" + ((data.result["http_host"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Client Address:<ol> <li><b>" + data.result["remote_addr"][1]["name"] + "</b>&nbsp" + data.result["remote_addr"][1]["count"] + " (" + ((data.result["remote_addr"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][2]["name"] + "</b>&nbsp" + data.result["remote_addr"][2]["count"] + " (" + ((data.result["remote_addr"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][3]["name"] + "</b>&nbsp" + data.result["remote_addr"][3]["count"] + " (" + ((data.result["remote_addr"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>"
                );

              });


            },

            type: "column",
            showInLegend: true,
            lineThickness: 2,
            name: "Data Sent",
            color: "#D15B05",
            dataPoints: dps
          },
          {
            click: function(e){


              var isoTime = new Date(e.dataPoint.x);
              ;
              var temp2 = String(isoTime.toISOString());
              var temp = temp2.split(".");
              var granularityModified = $("#granularity").val().toLowerCase();
              granularityModified = granularityModified.substring(0, granularityModified.length - 1);
              var data = {
                'date': temp[0],
                'granularity': granularityModified,
                'obj': "data_in"
              };

              $.each(dps3, function( key, value ) {
                var myDate1 = new Date(dps3[key]["x"]);
                var myEpoch1 = myDate1.getTime()/1000.0;
                var myDate2 = new Date(e.dataPoint.x);
                var myEpoch2 = myDate2.getTime()/1000.

                if(myEpoch1 == myEpoch2)
                {

                  var elem = document.getElementById("numRequests");
                  elem.value = dps3[key]["y"];
                }
              });

              var num_request = $('#numRequests').val()

              $.getJSON('/calendar_stats', data, function(data){

                $("#specific-stats").html(

                  "<br /> Total <b>" + num_request + "</b> Requests" +
                  "<br /> Average Request Size: <b>" + data.result["avg_length"] + "</b> Bytes" +
                  "<br /> Request Methods: <ol> <li><b>" + data.result["request_method"][1]["name"] + "</b>&nbsp" + ((data.result["request_method"][1]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][2]["name"] + "</b>&nbsp" + ((data.result["request_method"][2]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][3]["name"] + "</b>&nbsp" + ((data.result["request_method"][3]["count"] / num_request) * 100).toFixed(2) + "%</li></ol>" +
                  "<br /> TOP 3 URI:       <ol> <li><b>" + data.result["request_uri"][1]["name"] + "</b>&nbsp" + data.result["request_uri"][1]["count"] + " (" + ((data.result["request_uri"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][2]["name"] + "</b>&nbsp" + data.result["request_uri"][2]["count"] + " (" + ((data.result["request_uri"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][3]["name"] + "</b>&nbsp" + data.result["request_uri"][3]["count"] + " (" + ((data.result["request_uri"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Host:      <ol> <li><b>" + data.result["http_host"][1]["name"] + "</b>&nbsp" + data.result["http_host"][1]["count"] + " (" + ((data.result["http_host"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][2]["name"] + "</b>&nbsp" + data.result["http_host"][2]["count"] + " (" + ((data.result["http_host"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][3]["name"] + "</b>&nbsp" + data.result["http_host"][3]["count"] + " (" + ((data.result["http_host"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Client Address:<ol> <li><b>" + data.result["remote_addr"][1]["name"] + "</b>&nbsp" + data.result["remote_addr"][1]["count"] + " (" + ((data.result["remote_addr"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][2]["name"] + "</b>&nbsp" + data.result["remote_addr"][2]["count"] + " (" + ((data.result["remote_addr"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][3]["name"] + "</b>&nbsp" + data.result["remote_addr"][3]["count"] + " (" + ((data.result["remote_addr"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>"
                );

              });


            },

            type: "column",
            showInLegend: true,
            lineThickness: 2,
            name: "Data Received",
            color: "#557FA0",
            dataPoints: dps2
          }
        ],
        legend:
        {
          cursor:"pointer",
          itemclick:function(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            }
            else{
              e.dataSeries.visible = true;
            }
            chart.render();
          },
          fontSize: 15
        }
      });

      var chart2 = new CanvasJS.Chart("chartContainer2",
      {

        animationEnabled: true,
        zoomEnabled: true,
        axisX:
        {
          valueFormatString: "DD-MMM HH:mm:ss",
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12,
          labelWrap: true,
          labelMaxWidth: 50
        },
        toolTip:
        {
          shared:true
        },
        theme: "theme1",
        axisY:
        {
          gridColor: "Silver",
          tickColor: "silver",
          labelFontSize: 12
        },
        legend:
        {
          verticalAlign: "center",
          horizontalAlign: "right"
        },
        data: [
          {
            click: function(e){


              var isoTime = new Date(e.dataPoint.x);
              ;
              var temp2 = String(isoTime.toISOString());
              var temp = temp2.split(".");
              var granularityModified = $("#granularity").val().toLowerCase();
              granularityModified = granularityModified.substring(0, granularityModified.length);
              var data = {
                'time': temp[0],
                'granularity': granularityModified,
                'obj': "num_request"
              };


              $.each(dps3, function( key, value ) {
                var myDate1 = new Date(dps3[key]["x"]);
                var myEpoch1 = myDate1.getTime()/1000.0;
                var myDate2 = new Date(e.dataPoint.x);
                var myEpoch2 = myDate2.getTime()/1000.

                if(myEpoch1 == myEpoch2)
                {

                  var elem = document.getElementById("numRequests");
                  elem.value = dps3[key]["y"];
                }
              });

              var num_request = $('#numRequests').val()

              $.getJSON('/calendar_stats', data, function(data){

                $("#specific-stats").html(

                  "<br /> Total <b>" + num_request + "</b> Requests" +
                  "<br /> Average Request Size: <b>" + data.result["avg_length"] + "</b> Bytes" +
                  "<br /> Request Methods: <ol> <li><b>" + data.result["request_method"][1]["name"] + "</b>&nbsp" + ((data.result["request_method"][1]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][2]["name"] + "</b>&nbsp" + ((data.result["request_method"][2]["count"] / num_request) * 100).toFixed(2) + "%</li>" +
                  "<li><b>" + data.result["request_method"][3]["name"] + "</b>&nbsp" + ((data.result["request_method"][3]["count"] / num_request) * 100).toFixed(2) + "%</li></ol>" +
                  "<br /> TOP 3 URI:       <ol> <li><b>" + data.result["request_uri"][1]["name"] + "</b>&nbsp" + data.result["request_uri"][1]["count"] + " (" + ((data.result["request_uri"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][2]["name"] + "</b>&nbsp" + data.result["request_uri"][2]["count"] + " (" + ((data.result["request_uri"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["request_uri"][3]["name"] + "</b>&nbsp" + data.result["request_uri"][3]["count"] + " (" + ((data.result["request_uri"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Host:      <ol> <li><b>" + data.result["http_host"][1]["name"] + "</b>&nbsp" + data.result["http_host"][1]["count"] + " (" + ((data.result["http_host"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][2]["name"] + "</b>&nbsp" + data.result["http_host"][2]["count"] + " (" + ((data.result["http_host"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["http_host"][3]["name"] + "</b>&nbsp" + data.result["http_host"][3]["count"] + " (" + ((data.result["http_host"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>" +
                  "<br /> TOP 3 Client Address:<ol> <li><b>" + data.result["remote_addr"][1]["name"] + "</b>&nbsp" + data.result["remote_addr"][1]["count"] + " (" + ((data.result["remote_addr"][1]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][2]["name"] + "</b>&nbsp" + data.result["remote_addr"][2]["count"] + " (" + ((data.result["remote_addr"][2]["count"] / num_request) * 100).toFixed(2) + "%) </li>" +
                  "<li><b>" + data.result["remote_addr"][3]["name"] + "</b>&nbsp" + data.result["remote_addr"][3]["count"] + " (" + ((data.result["remote_addr"][3]["count"] / num_request) * 100).toFixed(2) + "%) </li></ol>"
                );

              });


            },
            type: "column",
            showInLegend: true,
            lineThickness: 2,
            name: "Number of Requests",
            color: "#333333",
            dataPoints: dps3
          }
        ],

        legend:
        {
          cursor:"pointer",
          itemclick:function(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            }
            else{
              e.dataSeries.visible = true;
            }
            chart2.render();
          },
          fontSize: 15
        }
      });

      if($('#granularity').val() == "Year"){
        chart.options.axisX.valueFormatString = "YYYY";
        chart2.options.axisX.valueFormatString = "YYYY";
      }
      if($('#granularity').val() == "Month"){
        chart.options.axisX.valueFormatString = "DD-MMM";
        chart2.options.axisX.valueFormatString = "DD-MMM";
      }


      chart.render();
      chart2.render();
      $("#loadingWrap").removeClass( "blur" );
      $('#loaderAnimation').hide();
    });
  };
});
