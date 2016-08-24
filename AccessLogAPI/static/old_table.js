$( document ).ready(function() {


  $('#tableOptionsModal').on('hidden.bs.modal', function () {

    filterNumberOfColumnsReturnToRememberedState();

  });

  $('#tableOptionsModal').on('shown.bs.modal', function (e) {

    filterNumberOfColumnsRememeberState();
});

  function filterNumberOfColumnsReturnToRememberedState(){

    if($('#memory1').attr("value") == 1){
      $('#id_checkbox').prop("checked", "true");

    }
    else{
      $('#id_checkbox').removeAttr('checked');
    }

    if($('#memory2').attr("value") == 1){
      $('#ip_address_checkbox').prop("checked", "true");

    }
    else{
      $('#ip_address_checkbox').removeAttr('checked');
    }

    if($('#memory3').attr("value") == 1){
      $('#time_checkbox').prop("checked", "true");
    }
    else{
      $('#time_checkbox').removeAttr('checked');
    }

    if($('#memory4').attr("value") == 1){
      $('#time_elapsed_checkbox').prop("checked", "true");
    }
    else{
      $('#time_elapsed_checkbox').removeAttr('checked');
    }

    if($('#memory5').attr("value") == 1){
      $('#request_uri_checkbox').prop("checked", "true");
    }
    else{
      $('#request_uri_checkbox').removeAttr('checked');
    }

    if($('#memory6').attr("value") == 1){
      $('#request_method_checkbox').prop("checked", "true");
    }
    else{
      $('#request_method_checkbox').removeAttr('checked');
    }

    if($('#memory7').attr("value") == 1){
      $('#status_code_checkbox').prop("checked", "true");
    }
    else{
      $('#status_code_checkbox').removeAttr('checked');
    }

    if($('#memory8').attr("value") == 1){
      $('#request_length_checkbox').prop("checked", "true");
    }
    else{
      $('#request_length_checkbox').removeAttr('checked');
    }

    if($('#memory9').attr("value") == 1){
      $('#body_bytes_sent_checkbox').prop("checked", "true");
    }
    else{
      $('#body_bytes_sent_checkbox').removeAttr('checked');
    }

    if($('#memory10').attr("value") == 1){
      $('#bytes_sent_checkbox').prop("checked", "true");
    }
    else{
      $('#bytes_sent_checkbox').removeAttr('checked');
    }

    if($('#memory11').attr("value") == 1){
      $('#host_checkbox').prop("checked", "true");
    }
    else{
      $('#host_checkbox').removeAttr('checked');
    }

    if($('#memory12').attr("value") == 1){
      $('#referer_checkbox').prop("checked", "true");
    }
    else{
      $('#referer_checkbox').removeAttr('checked');
    }

    if($('#memory13').attr("value") == 1){
      $('#user_agent_checkbox').prop("checked", "true");
    }
    else{
      $('#user_agent_checkbox').removeAttr('checked');
    }

    $("#tableHeaderDisplayedTemp").selectedIndex = -1;


    var temp = $('#memory14').val();
    if(temp == ""){
      temp = "defaultSelected";
    }
    temp = "options-" + temp;

    setNewSelector = document.getElementById(temp);
    setNewSelector.setAttribute('selected', 'selected');


    elem = document.getElementById("tableDataDisplayedTemp");
    if(!$('#memory15').val()){
      elem.value = "";
    }
    else{
      elem.value =  $('#memory15').val();
    }

  };

  function filterNumberOfColumnsRememeberState(){

    if($('#id_checkbox').is(':checked')){
      $('#memory1').attr("value", "1");
    }
    else{
      $('#memory1').attr("value", "0");
    }

    if($('#ip_address_checkbox').is(':checked')){
      $('#memory2').attr("value", "1");
    }
    else{
      $('#memory2').attr("value", "0");
    }


    if($('#time_checkbox').is(':checked')){
      $('#memory3').attr("value", "1");
    }
    else{
      $('#memory3').attr("value", "0");
    }

    if($('#time_elapsed_checkbox').is(':checked')){
      $('#memory4').attr("value", "1");
    }
    else{
      $('#memory4').attr("value", "0");
    }

    if($('#request_uri_checkbox').is(':checked')){
      $('#memory5').attr("value", "1");
    }
    else{
      $('#memory5').attr("value", "0");
    }

    if($('#request_method_checkbox').is(':checked')){
      $('#memory6').attr("value", "1");
    }
    else{
      $('#memory6').attr("value", "0");
    }


    if($('#status_code_checkbox').is(':checked')){
      $('#memory7').attr("value", "1");
    }
    else{
      $('#memory7').attr("value", "0");
    }

    if($('#request_length_checkbox').is(':checked')){
      $('#memory8').attr("value", "1");
    }
    else{
      $('#memory8').attr("value", "0");
    }

    if($('#body_bytes_sent_checkbox').is(':checked')){
      $('#memory9').attr("value", "1");
    }
    else{
      $('#memory9').attr("value", "0");
    }


    if($('#bytes_sent_checkbox').is(':checked')){
      $('#memory10').attr("value", "1");
    }
    else{
      $('#memory10').attr("value", "0");
    }


    if($('#host_checkbox').is(':checked')){
      $('#memory11').attr("value", "1");
    }
    else{
      $('#memory11').attr("value", "0");
    }


    if($('#referer_checkbox').is(':checked')){
      $('#memory12').attr("value", "1");
    }
    else{
      $('#memory12').attr("value", "0");
    }


    if($('#user_agent_checkbox').is(':checked')){
      $('#memory13').attr("value", "1");
    }
    else{
      $('#memory13').attr("value", "0");
    }

    $('#memory14').attr("value", $("#tableHeaderDisplayedTemp").val());

    $('#memory15').attr("value", $("#tableDataDisplayedTemp").val());

  };

  function filterNumberOfColumnsUncheckAll(){

    if($('#id_checkbox').is(':checked')){
      $('#id_checkbox').removeAttr('checked');
    }

    if($('#ip_address_checkbox').is(':checked')){
      $('#ip_address_checkbox').removeAttr('checked');
    }

    if($('#time_checkbox').is(':checked')){
      $('#time_checkbox').removeAttr('checked');
    }

    if($('#time_elapsed_checkbox').is(':checked')){
      $('#time_elapsed_checkbox').removeAttr('checked');
    }

    if($('#request_uri_checkbox').is(':checked')){
      $('#request_uri_checkbox').removeAttr('checked');
    }

    if($('#request_method_checkbox').is(':checked')){
      $('#request_method_checkbox').removeAttr('checked');
    }


    if($('#status_code_checkbox').is(':checked')){
      $('#status_code_checkbox').removeAttr('checked');
    }

    if($('#request_length_checkbox').is(':checked')){
      $('#request_length_checkbox').removeAttr('checked');
    }

    if($('#body_bytes_sent_checkbox').is(':checked')){
      $('#body_bytes_sent_checkbox').removeAttr('checked');
    }


    if($('#bytes_sent_checkbox').is(':checked')){
      $('#bytes_sent_checkbox').removeAttr('checked');
    }


    if($('#host_checkbox').is(':checked')){
      $('#host_checkbox').removeAttr('checked');
    }


    if($('#referer_checkbox').is(':checked')){
      $('#referer_checkbox').removeAttr('checked');
    }


    if($('#user_agent_checkbox').is(':checked')){
      $('#user_agent_checkbox').removeAttr('checked');
    }
  };

  function filterNumberOfColumns(){
    if($('#id_checkbox').is(':checked')){
      $('td:nth-child(1),th:nth-child(1),col:nth-child(1)').hide();
    }
    else {
      $('td:nth-child(1),th:nth-child(1),col:nth-child(1)').show();
    }

    if($('#ip_address_checkbox').is(':checked')){
      $('td:nth-child(2),th:nth-child(2),col:nth-child(2)').hide();
    }
    else{
      $('td:nth-child(2),th:nth-child(2),col:nth-child(2)').show();
    }

    if($('#time_checkbox').is(':checked')){
      $('td:nth-child(3),th:nth-child(3),col:nth-child(3)').hide();
    }
    else{
      $('td:nth-child(3),th:nth-child(3),col:nth-child(3)').show();
    }

    if($('#time_elapsed_checkbox').is(':checked')){
      $('td:nth-child(4),th:nth-child(4),col:nth-child(4)').hide();
    }
    else{
      $('td:nth-child(4),th:nth-child(4),col:nth-child(4)').show();
    }

    if($('#request_uri_checkbox').is(':checked')){
      $('td:nth-child(5),th:nth-child(5),col:nth-child(5)').hide();
    }
    else{
      $('td:nth-child(5),th:nth-child(5),col:nth-child(5)').show();
    }

    if($('#request_method_checkbox').is(':checked')){
      $('td:nth-child(6),th:nth-child(6),col:nth-child(6)').hide();
    }
    else{
      $('td:nth-child(6),th:nth-child(6),col:nth-child(6)').show();
    }

    if($('#status_code_checkbox').is(':checked')){
      $('td:nth-child(7),th:nth-child(7),col:nth-child(7)').hide();
    }
    else{
      $('td:nth-child(7),th:nth-child(7),col:nth-child(7)').show();
    }

    if($('#request_length_checkbox').is(':checked')){
      $('td:nth-child(8),th:nth-child(8),col:nth-child(8)').hide();
    }
    else{
      $('td:nth-child(8),th:nth-child(8),col:nth-child(8)').show();
    }

    if($('#body_bytes_sent_checkbox').is(':checked')){
      $('td:nth-child(9),th:nth-child(9),col:nth-child(9)').hide();
    }
    else{
      $('td:nth-child(9),th:nth-child(9),col:nth-child(9)').show();
    }

    if($('#bytes_sent_checkbox').is(':checked')){
      $('td:nth-child(10),th:nth-child(10),col:nth-child(10)').hide();
    }
    else{
      $('td:nth-child(10),th:nth-child(10),col:nth-child(10)').show();
    }

    if($('#host_checkbox').is(':checked')){
      $('td:nth-child(11),th:nth-child(11),col:nth-child(11)').hide();
    }
    else{
        $('td:nth-child(11),th:nth-child(11),col:nth-child(11)').show();
    }

    if($('#referer_checkbox').is(':checked')){
      $('td:nth-child(12),th:nth-child(12),col:nth-child(12)').hide();
    }
    else{
      $('td:nth-child(12),th:nth-child(12),col:nth-child(12)').show();
    }

    if($('#user_agent_checkbox').is(':checked')){
      $('td:nth-child(13),th:nth-child(13),col:nth-child(13)').hide();
    }
    else{
      $('td:nth-child(13),th:nth-child(13),col:nth-child(13)').show();
    }

  };
  function filterNumberOfColumnsSortColor(){
    $('th').removeClass("headerOrdered");
    $('col').removeClass("coloredColumn");

    if($('#id_checkbox').is(':checked')){
    }
    else {
      colColor = document.getElementById("header-id");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_id");
      headColor.setAttribute('class', 'coloredColumn');

      return("id");
    }

    if($('#ip_address_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-remote_addr");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_remote_addr");
      headColor.setAttribute('class', 'coloredColumn');

      return("remote_addr");
    }

    if($('#time_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-time_iso8601");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_time_iso8601");
      headColor.setAttribute('class', 'coloredColumn');

      return("time_iso8601");
    }

    if($('#time_elapsed_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-request_time");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_request_time");
      headColor.setAttribute('class', 'coloredColumn');

      return("request_time");
    }

    if($('#request_uri_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-request_uri");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_request_uri");
      headColor.setAttribute('class', 'coloredColumn');

      return("request_uri");
    }

    if($('#request_method_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-request_method");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_request_method");
      headColor.setAttribute('class', 'coloredColumn');

      return("request_method");
    }

    if($('#status_code_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-status");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_status");
      headColor.setAttribute('class', 'coloredColumn');

      return("status");
    }

    if($('#request_length_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-request_length");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_request_length");
      headColor.setAttribute('class', 'coloredColumn');

      return("request_length");
    }

    if($('#body_bytes_sent_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-body_bytes_sent");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_body_bytes_sent");
      headColor.setAttribute('class', 'coloredColumn');

      return("body_bytes_sent");
    }

    if($('#bytes_sent_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-bytes_sent");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_bytes_sent");
      headColor.setAttribute('class', 'coloredColumn');

      return("bytes_sent");
    }

    if($('#host_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-http_host");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_http_host");
      headColor.setAttribute('class', 'coloredColumn');

      return("http_host");
    }

    if($('#referer_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-http_referer");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_http_referer");
      headColor.setAttribute('class', 'coloredColumn');

      return("http_referer");
    }

    if($('#user_agent_checkbox').is(':checked')){

    }
    else{
      colColor = document.getElementById("header-http_user_agent");
      colColor.setAttribute('class', 'headerOrdered');

      headColor = document.getElementById("col_http_user_agent");
      headColor.setAttribute('class', 'coloredColumn');

      return("http_user_agent");
    }

  };

  function filterNumberOfColumnsSort(){


    if($('#id_checkbox').is(':checked')){
    }
    else {
      return("id");
    }

    if($('#ip_address_checkbox').is(':checked')){

    }
    else{
      return("remote_addr");
    }

    if($('#time_checkbox').is(':checked')){

    }
    else{
      return("time_iso8601");
    }

    if($('#time_elapsed_checkbox').is(':checked')){

    }
    else{
      return("request_time");
    }

    if($('#request_uri_checkbox').is(':checked')){

    }
    else{
      return("request_uri");
    }

    if($('#request_method_checkbox').is(':checked')){

    }
    else{
      return("request_method");
    }

    if($('#status_code_checkbox').is(':checked')){

    }
    else{
      return("status");
    }

    if($('#request_length_checkbox').is(':checked')){

    }
    else{
      return("request_length");
    }

    if($('#body_bytes_sent_checkbox').is(':checked')){

    }
    else{
      return("body_bytes_sent");
    }

    if($('#bytes_sent_checkbox').is(':checked')){

    }
    else{
      return("bytes_sent");
    }

    if($('#host_checkbox').is(':checked')){

    }
    else{
      return("http_host");
    }

    if($('#referer_checkbox').is(':checked')){

    }
    else{
      return("http_referer");
    }

    if($('#user_agent_checkbox').is(':checked')){

    }
    else{
      return("http_user_agent");
    }

  };

  $('input').each(function() {

    $(this).on('focus', function() {
      $(this).parent('.css').addClass('active');
    });

    $(this).on('blur', function() {
      if ($(this).val().length == 0) {
        $(this).parent('.css').removeClass('active');
      }
    });

    if ($(this).val() != '') $(this).parent('.css').addClass('active');

  });


  $('#firstButton').attr("disabled"," true");

  $('#prevButton').attr("disabled"," true");
  var data = {
    'limit': $('#limit').val(),
    'offset': '0',
    'action': 'load',
    'json': '1',
    'sortBy': "id",
    'order': "Asc"
  };
  $.getJSON('/api/all', data, function(data){

    elem = document.getElementById("orderad");
    elem.value = "Asc";



    var elem = document.getElementById("logSize");
    elem.value = data.size;

    elem = document.getElementById("totalPages");
    elem.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

    if(Math.ceil($("#logSize").val()/$("#recordsPerPage").val()) == 1){
      $('#nextButton').attr("disabled"," true");
      $('#lastButton').attr("disabled"," true");
    }

    $('#example').find("tr:gt(0)").remove();
    $.each(data.rows, function( index, value ) {
      var temp = data.rows[index].time_iso8601.toString();
      var regex2 = new RegExp(' ', 'g');
      temp = temp.replace(regex2, '-');
      $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

    });

    $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

  });



  $('#example').on('click','td', function(e){
    e = e || window.event;
    var td = e.target || e.srcElement;


    var th = $('table th').eq($(this).index()).attr('id');
    th = th.split('-');


    elem = document.getElementById("tableHeaderDisplayed");
    elem.value = th[1];

    elem2 = document.getElementById("tableDataDisplayed");
    elem2.value = td.innerHTML;

    var elem3 = document.getElementById("curPage");
    elem3.value = 1;



    elem = document.getElementById("orderad");
    elem.value = "Asc";

    // $('th').removeClass("headerOrdered");
    //
    // colColor = document.getElementById("header-id");
    // colColor.setAttribute('class', 'headerOrdered');
    //
    // $('col').removeClass("coloredColumn");
    //
    // headColor = document.getElementById("col_id");
    // headColor.setAttribute('class', 'coloredColumn');


    $('#prevButton').attr("disabled","true");
    $('#firstButton').attr("disabled","true");

    $("#tableHeaderDisplayedTemp").selectedIndex = -1;


    var temp = $('#tableHeaderDisplayed').val();
    temp = "options-" + temp;
    setNewSelector = document.getElementById(temp);
    setNewSelector.setAttribute('selected', 'selected');

    $('#tableDataDisplayedTemp').removeAttr("disabled");

    $('#tableDataDisplayedTempHidden').show();

    elem3 = document.getElementById("tableDataDisplayedTemp");
    elem3.value = td.innerHTML;

    var sortBy = filterNumberOfColumnsSort();

    var data = {
      'limit': $('#limit').val(),
      'offset': '0',
      'action': 'load',
      'json': '1',
      'sortBy': sortBy,
      'order': "Asc",
      'attr': th[1],
      'q': td.innerHTML
    };

    $.getJSON('/api/attribute', data, function(data){

      elem = document.getElementById("orderad");
      elem.value = "Asc";

      elem = document.getElementById("logSize");
      elem.value = data.size;

      elem3 = document.getElementById("totalPages");
      elem3.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

      if(Math.ceil($("#logSize").val()/$("#recordsPerPage").val()) == 1){
        $('#nextButton').attr("disabled"," true");
        $('#lastButton').attr("disabled"," true");
      }
      else{
        $('#nextButton').removeAttr("disabled");
        $('#lastButton').removeAttr("disabled");
      }

      $('#example').find("tr:gt(0)").remove();
      $.each(data.rows, function( index, value ) {
        var temp = data.rows[index].time_iso8601.toString();
        var regex2 = new RegExp(' ', 'g');
        temp = temp.replace(regex2, '-');
        $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

      });

      $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

      filterNumberOfColumns();
      filterNumberOfColumnsSortColor();
    });


  });



  $('th').click(function(e) {
    e = e || window.event;
    var th = e.target || e.srcElement;
    var headerName = th.innerHTML;
    if(headerName == "ID"){
      headerName = "id";
    }
    if(headerName == "IP Address"){
      headerName = "remote_addr";
    }
    if(headerName == "Time"){
      headerName = "time_iso8601";
    }
    if(headerName == "Time Elapsed"){
      headerName = "request_time";
    }
    if(headerName == "Request Method"){
      headerName = "request_method";
    }
    if(headerName == "Request URI"){
      headerName = "request_uri";
    }
    if(headerName == "Status Code"){
      headerName = "status";
    }
    if(headerName == "Request Length"){
      headerName = "request_length";
    }
    if(headerName == "Body Bytes Sent"){
      headerName = "body_bytes_sent";
    }
    if(headerName == "Bytes Sent"){
      headerName = "bytes_sent";
    }
    if(headerName == "Host"){
      headerName = "http_host";
    }
    if(headerName == "Referer"){
      headerName = "http_referer";
    }
    if(headerName == "User Agent"){
      headerName = "http_user_agent";
    }

    var headerName2 = "col_" + headerName;
    var className = $(th).attr('class');

    var elem;
    if (className == "headerOrdered"){
      elem = document.getElementById("orderad");
      if(elem.value == "Desc"){
        elem.value = "Asc";
      }
      else {
        elem.value = "Desc";
      }

    }

    else {
      elem = document.getElementById("orderad");
      elem.value = "Asc";

      // $('th').removeClass("headerOrdered");
      // th.setAttribute('class', 'headerOrdered');
      //
      // $('col').removeClass("coloredColumn");
      //
      // headColor = document.getElementById(headerName2);
      // headColor.setAttribute('class', 'coloredColumn');
    }

    var nextPage = '1';

    $('#prevButton').attr("disabled"," true");
    $('#firstButton').attr("disabled"," true");



    if($("#tableHeaderDisplayed").val() != ""){
      var data = {
        'limit': $('#limit').val(),
        'offset': '0',
        'action': 'sort',
        'json': '1',
        'sortBy': headerName,
        'order': elem.value,
        'attr': $("#tableHeaderDisplayed").val(),
        'q': $("#tableDataDisplayed").val()
      };
      $.getJSON('/api/attribute', data, function(data){
        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        elem3 = document.getElementById("totalPages");
        elem3.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

        if(Math.ceil($("#logSize").val()/$("#recordsPerPage").val()) == 1){
          $('#nextButton').attr("disabled"," true");
          $('#lastButton').attr("disabled"," true");
        }
        else{
          $('#nextButton').removeAttr("disabled");
          $('#lastButton').removeAttr("disabled");
        }

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');
        });
        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

        $('th').removeClass("headerOrdered");
        th.setAttribute('class', 'headerOrdered');

        $('col').removeClass("coloredColumn");

        headColor = document.getElementById(headerName2);
        headColor.setAttribute('class', 'coloredColumn');

      });
    }
    else{
      var data = {
        'limit': $('#limit').val(),
        'offset': '0',
        'action': 'sort',
        'json': '1',
        'sortBy': headerName,
        'order': elem.value
      };

      $.getJSON('/api/all', data, function(data){
        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        elem3 = document.getElementById("totalPages");
        elem3.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

        if(Math.ceil($("#logSize").val()/$("#recordsPerPage").val()) == 1){
          $('#nextButton').attr("disabled"," true");
          $('#lastButton').attr("disabled"," true");
        }
        else{
          $('#nextButton').removeAttr("disabled");
          $('#lastButton').removeAttr("disabled");
        }

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });
        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

          filterNumberOfColumns();

          $('th').removeClass("headerOrdered");
          th.setAttribute('class', 'headerOrdered');

          $('col').removeClass("coloredColumn");

          headColor = document.getElementById(headerName2);
          headColor.setAttribute('class', 'coloredColumn');

      });
    }
  });



  $( "#tableHeaderDisplayedTemp" ).change(function() {
    var elem = document.getElementById("tableHeaderDisplayed");
    elem.value =   $("#tableHeaderDisplayedTemp").val();
    if($("#tableHeaderDisplayedTemp").val() == ""){
      $('#tableDataDisplayedTemp').attr("disabled", "true");
      $('#tableDataDisplayedTempHidden').hide("slow");
      elem = document.getElementById("tableDataDisplayedTemp");
      elem.value =  "";

    }
    else{
      $('#tableDataDisplayedTemp').removeAttr("disabled");
      $('#tableDataDisplayedTempHidden').show("slow");

    }
  });


  $('#tableOptionsSubmit').click(function(){

    filterNumberOfColumnsRememeberState();

    var elem = document.getElementById("tableDataDisplayed");
    elem.value =   $( "#tableDataDisplayedTemp" ).val();

    if($("#tableHeaderDisplayedTemp").val() == ""){

      elem = document.getElementById("tableHeaderDisplayed");
      elem.value = "";

      elem2 = document.getElementById("tableDataDisplayed");
      elem2.value = "";

      $('#tableDataDisplayedTemp').attr("disabled", "true");
      $('#tableDataDisplayedTempHidden').hide("slow");
      elem = document.getElementById("tableDataDisplayedTemp");
      elem.value =  "";


      setNewSelector = document.getElementById("options-defaultSelected");
      setNewSelector.setAttribute('selected', 'selected');

      $('#hiddenSectionFilterByAttribute').attr("style"," display: none");
      $('#firstButton').attr("disabled"," true");
      $('#prevButton').attr("disabled"," true");




      elem = document.getElementById("orderad");
      elem.value = "Asc";

      // $('th').removeClass("headerOrdered");
      //
      // colColor = document.getElementById("header-id");
      // colColor.setAttribute('class', 'headerOrdered');
      //
      // $('col').removeClass("coloredColumn");
      //
      // headColor = document.getElementById("col_id");
      // headColor.setAttribute('class', 'coloredColumn');

      var sortBy = filterNumberOfColumnsSort();

      var data = {
        'limit': $('#limit').val(),
        'offset': '0',
        'action': 'load',
        'json': '1',
        'sortBy': sortBy,
        'order': "Asc"
      };
      $.getJSON('/api/all', data, function(data){

        elem = document.getElementById("curPage");
        elem.value = "1";



        var elem = document.getElementById("logSize");
        elem.value = data.size;

        elem = document.getElementById("totalPages");
        elem.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

        if(Math.ceil($("#logSize").val()/$("#recordsPerPage").val()) == 1){
          $('#nextButton').attr("disabled"," true");
          $('#lastButton').attr("disabled"," true");
        }
        else
        {
          $('#nextButton').removeAttr("disabled");
          $('#lastButton').removeAttr("disabled");
        }

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();
        filterNumberOfColumnsSortColor();

      });

      return;
    }


    elem = document.getElementById("orderad");
    elem.value = "Asc";

    // $('th').removeClass("headerOrdered");
    // colColor = document.getElementById("header-id");
    // colColor.setAttribute('class', 'headerOrdered');
    //
    // $('col').removeClass("coloredColumn");
    //
    // headColor = document.getElementById("col_id");
    // headColor.setAttribute('class', 'coloredColumn');

    var sortBy = filterNumberOfColumnsSort();

    var data = {
      'limit': $('#limit').val(),
      'offset': '0',
      'action': 'sort',
      'json': '1',
      'sortBy': sortBy,
      'order': "Asc",
      'attr': $("#tableHeaderDisplayed").val(),
      'q': $("#tableDataDisplayed").val()
    };
    $.getJSON('/api/attribute', data, function(data){
      var elem = document.getElementById("curPage");
      elem.value = 1;

      elem = document.getElementById("logSize");
      elem.value = data.size;

      elem3 = document.getElementById("totalPages");
      elem3.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

      if(Math.ceil($("#logSize").val()/$("#recordsPerPage").val()) == 1){
        $('#nextButton').attr("disabled"," true");
        $('#lastButton').attr("disabled"," true");
      }
      else{
        $('#nextButton').removeAttr("disabled");
        $('#lastButton').removeAttr("disabled");
      }

      $('#example').find("tr:gt(0)").remove();
      $.each(data.rows, function( index, value ) {
        var temp = data.rows[index].time_iso8601.toString();
        var regex2 = new RegExp(' ', 'g');
        temp = temp.replace(regex2, '-');
        $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

      });
      $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

      filterNumberOfColumns();
      filterNumberOfColumnsSortColor();
    });

  });



  $( "#recordsPerPage" ).change(function() {

    var curPage = $("#curPage").val();
    var limit = $("#limit").val();
    var offset = (limit * curPage) - limit;

    var elem =  document.getElementById("limit");
    elem.value = $("#recordsPerPage").val();
    var newLimit = $("#recordsPerPage").val();

    var newPage = offset/newLimit;

    newPage = Math.floor(newPage)+1;

    offset = (newLimit * newPage) - newLimit;


    var elem2 =  document.getElementById("curPage");
    elem2.value = newPage;

    var $table = $('#example');
    var th = $table.find("th." + "headerOrdered");
    var id = $('.headerOrdered').attr('id').split('-');

    elem3 = document.getElementById("totalPages");
    elem3.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

    if($("#curPage").val() != $("#totalPages").val()){
      $('#nextButton').removeAttr("disabled");
      $('#lastButton').removeAttr("disabled");
    }


    if($("#tableHeaderDisplayed").val() != ""){
      var data = {
        'limit': $('#limit').val(),
        'offset': offset,
        'action': 'dataPerPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val(),
        'attr': $("#tableHeaderDisplayed").val(),
        'q': $("#tableDataDisplayed").val()
      };
      $.getJSON('/api/attribute', data, function(data){

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

      });
    }

    else{
      var data = {
        'limit': $('#limit').val(),
        'offset': offset,
        'action': 'dataPerPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val()
      };
      $.getJSON('/api/all', data, function(data){

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

      });

    }
  });


  $('#curPage').on('input', function() {

    curPage = $("#curPage").val();
    limit = $("#limit").val();
    var offset = (limit * curPage) - limit;

    var $table = $('#example');
    var th = $table.find("th." + "headerOrdered");
    var id = $('.headerOrdered').attr('id').split('-');

    if((curPage < 1 || parseInt(curPage, 10) > parseInt($("#totalPages").val(),10)) && curPage != ""){


      alert("Please Enter a Page Number Between 1 and "+$("#totalPages").val()+"")
    }


    if(curPage == "1"){
      $('#prevButton').attr("disabled"," true");
      $('#firstButton').attr("disabled"," true");
    }
    else if(curPage == $("#totalPages").val()){
      $('#nextButton').attr("disabled"," true");
      $('#lastButton').attr("disabled"," true");
    }
    else{
      $('#prevButton').removeAttr("disabled");
      $('#firstButton').removeAttr("disabled");
      $('#nextButton').removeAttr("disabled");
      $('#lastButton').removeAttr("disabled");
    }

    if($("#tableHeaderDisplayed").val() != ""){
      var data = {
        'limit': $('#limit').val(),
        'offset': offset,
        'action': 'selfInputPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val(),
        'attr': $("#tableHeaderDisplayed").val(),
        'q': $("#tableDataDisplayed").val()
      };

      $.getJSON('/api/attribute', data, function(data){
        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });
        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });

    }
    else{
      var data = {
        'limit': $('#limit').val(),
        'offset': offset,
        'action': 'selfInputPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val()
      };

      $.getJSON('/api/all', data, function(data){
        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });
        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });
    }
  });


  $('#nextButton').click(function() {
    nextPage($('#curPage').val(), $('#limit').val(), $('#logSize').val());
  });

  $('#prevButton').click(function() {
    prevPage($('#curPage').val(), $('#limit').val());
  });

  $('#lastButton').click(function() {
    lastPage($('#curPage').val(), $('#limit').val(), $('#logSize').val());
  });

  $('#firstButton').click(function() {
    firstPage($('#curPage').val(), $('#limit').val(), $('#logSize').val());
  });

  $('#resetTableButton').click(function(){
    resetTable();
  });


  function resetTable(){

    elem = document.getElementById("tableHeaderDisplayed");
    elem.value = "";

    elem2 = document.getElementById("tableDataDisplayed");
    elem2.value = "";

    $('#tableDataDisplayedTemp').attr("disabled", "true");
    $('#tableDataDisplayedTempHidden').hide("slow");
    elem = document.getElementById("tableDataDisplayedTemp");
    elem.value =  "";


    setNewSelector = document.getElementById("options-defaultSelected");
    setNewSelector.setAttribute('selected', 'selected');

    $('#hiddenSectionFilterByAttribute').attr("style"," display: none");
    $('#firstButton').attr("disabled"," true");
    $('#prevButton').attr("disabled"," true");


    $('th').removeClass("headerOrdered");

    elem = document.getElementById("orderad");
    elem.value = "Asc";

    colColor = document.getElementById("header-id");
    colColor.setAttribute('class', 'headerOrdered');

    $('col').removeClass("coloredColumn");

    headColor = document.getElementById("col_id");
    headColor.setAttribute('class', 'coloredColumn');


    var data = {
      'limit': $('#limit').val(),
      'offset': '0',
      'action': 'load',
      'json': '1',
      'sortBy': "id",
      'order': "Asc"
    };
    $.getJSON('/api/all', data, function(data){

      elem = document.getElementById("curPage");
      elem.value = "1";



      var elem = document.getElementById("logSize");
      elem.value = data.size;

      elem = document.getElementById("totalPages");
      elem.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

      if(Math.ceil($("#logSize").val()/$("#recordsPerPage").val()) == 1){
        $('#nextButton').attr("disabled"," true");
        $('#lastButton').attr("disabled"," true");
      }
      else
      {
        $('#nextButton').removeAttr("disabled");
        $('#lastButton').removeAttr("disabled");
      }

      $('#example').find("tr:gt(0)").remove();
      $.each(data.rows, function( index, value ) {
        var temp = data.rows[index].time_iso8601.toString();
        var regex2 = new RegExp(' ', 'g');
        temp = temp.replace(regex2, '-');
        $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

      });

      $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

      filterNumberOfColumnsUncheckAll();
      filterNumberOfColumns();

    });
  }



  function nextPage(curPageP, limitP, logSizeP){
    var logSize = logSizeP;
    var curPage = curPageP;


    var nextPage = parseInt(curPage, 10) + 1;

    $('#prevButton').removeAttr("disabled");
    $('#firstButton').removeAttr("disabled");

    if(nextPage == $("#totalPages").val()){
      $('#nextButton').attr("disabled"," true");
      $('#lastButton').attr("disabled"," true");
    }


    var limit = limitP;
    var offset = (limit * curPage);
    if ((nextPage * limit) > parseInt(logSize, 10) + parseInt(limit, 10))
    {
      return;

    }

    var $table = $('#example');
    var th = $table.find("th." + "headerOrdered");
    var id = $('.headerOrdered').attr('id').split('-');

    if($("#tableHeaderDisplayed").val() != ""){
      var data = {
        'limit': limit,
        'offset': offset,
        'action': 'nextPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val(),
        'attr': $("#tableHeaderDisplayed").val(),
        'q': $("#tableDataDisplayed").val()
      };
      $.getJSON('/api/attribute', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });
        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });

    }

    else{
      var data = {
        'limit': limit,
        'offset': offset,
        'action': 'nextPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val()
      };
      $.getJSON('/api/all', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });
        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();
      });

    }
  }


  function prevPage(curPageP, limitP){



    var curPage = curPageP;
    var nextPage = parseInt(curPage, 10) - 1;
    var limit = limitP;
    var offset = (limit * curPage) - (parseInt(limit,10) * 2);

    var $table = $('#example');
    var th = $table.find("th." + "headerOrdered");
    var id = $('.headerOrdered').attr('id').split('-');

    $('#lastButton').removeAttr("disabled");
    $('#nextButton').removeAttr("disabled");

    if(nextPage == "1"){
      $('#prevButton').attr("disabled"," true");
      $('#firstButton').attr("disabled"," true");
    }


    if($("#tableHeaderDisplayed").val() != ""){
      var data = {
        'limit': limit,
        'offset': offset,
        'action': 'prevPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val(),
        'attr': $("#tableHeaderDisplayed").val(),
        'q': $("#tableDataDisplayed").val()
      };
      $.getJSON('/api/attribute', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });

    }
    else{

      var data = {
        'limit': limit,
        'offset': offset,
        'action': 'prevPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val()
      };
      $.getJSON('/api/all', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });

    }

  }


  function lastPage(curPageP, limitP, logSizeP){


    var logSize = logSizeP;
    var curPage = curPageP;
    var limit = limitP;
    var nextPage = Math.ceil(logSize/limit);
    var offset = (nextPage-1)*limit;

    var $table = $('#example');
    var th = $table.find("th." + "headerOrdered");
    var id = $('.headerOrdered').attr('id').split('-');

    $('#prevButton').removeAttr("disabled");
    $('#firstButton').removeAttr("disabled");


    $('#nextButton').attr("disabled"," true");
    $('#lastButton').attr("disabled"," true");

    if($("#tableHeaderDisplayed").val() != ""){
      var data = {
        'limit': limit,
        'offset': offset,
        'action': 'lastPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val(),
        'attr': $("#tableHeaderDisplayed").val(),
        'q': $("#tableDataDisplayed").val()
      };
      $.getJSON('/api/attribute', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });

    }
    else{
      var data = {
        'limit': limit,
        'offset': offset,
        'action': 'lastPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val()
      };
      $.getJSON('/api/all', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });

    }
  }


  function firstPage(curPageP, limitP, logSizeP){
    var logSize = logSizeP
    var curPage = curPageP;
    var nextPage = '1';
    var limit = limitP;
    var offset = (limit * curPage) - (parseInt(limit,10) * 2);
    var $table = $('#example');
    var th = $table.find("th." + "headerOrdered");
    var id = $('.headerOrdered').attr('id').split('-');

    $('#lastButton').removeAttr("disabled");
    $('#nextButton').removeAttr("disabled");


    $('#prevButton').attr("disabled"," true");
    $('#firstButton').attr("disabled"," true");

    if($("#tableHeaderDisplayed").val() != ""){

      var data = {
        'limit': limit,
        'offset': '0',
        'action': 'firstPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val(),
        'attr': $("#tableHeaderDisplayed").val(),
        'q': $("#tableDataDisplayed").val()
      };
      $.getJSON('/api/attribute', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });
    }
    else{


      var data = {
        'limit': limit,
        'offset': '0',
        'action': 'firstPage',
        'json': '1',
        'sortBy': id[1],
        'order': $('#orderad').val()
      };
      $.getJSON('/api/all', data, function(data){

        var elem = document.getElementById("curPage");
        elem.value = nextPage;

        $('#example').find("tr:gt(0)").remove();
        $.each(data.rows, function( index, value ) {
          var temp = data.rows[index].time_iso8601.toString();
          var regex2 = new RegExp(' ', 'g');
          temp = temp.replace(regex2, '-');
          $('#example > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].request_length+'>'+data.rows[index].request_length+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_user_agent+'>'+data.rows[index].http_user_agent+'</td></tr>');

        });

        $('#example > tbody:last-child').append('<tr><th>ID</th><th>IP Address</th><th>Time</th><th>Time Elapsed</th><th>Request URI</th><th>Request Method</th><th>Status Code</th><th>Request Length</th><th>Body Bytes Sent</th><th>Bytes Sent</th><th>Host</th><th>Referer</th><th>User Agent</th></tr>');

        filterNumberOfColumns();

      });

    }

  }

});
