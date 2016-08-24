unreachable = "SHOULDN'T BE REACHABLE";


$(document.body).on('change','#filter-field-selector',function(){
  // $("#filter-field-selector").on('change',function(){
  console.log("FIELD CHANGE");
  if ($('#filter-field-selector').val() == "") {
    // TO DO: HIDE ALL SUCCEEDING SELECTORS
    hideCondition();
    hideValue();
    $('#filter-type-selector option[value=""]').prop('selected', true);
  }
  else{
    if($("#filter-type-selector").is(":visible")){
      // not initial select
      hideCondition();
      hideValue();
      $('#filter-type-selector option[value=""]').prop('selected', true);
    }
    else{
      // initial select
      console.log("INITIAL FIELD SELECT");
      $("#filter-type-selector").show();
    }
  }
});

$(document.body).on('change','#filter-type-selector',function(){
// $("#filter-type-selector").change(function(){
  if ($('#filter-type-selector').val() == "") {
    // TO DO: HIDE ALL SUCCEEDING SELECTORS
    hideCondition();
    hideValue();
  }
  else{
    if ($("#filter-condition1-selector").is(":visible") || $("#filter-condition2-selector").is(":visible") || $("#filter-condition3-selector").is(":visible") || $("#filter-condition4-selector").is(":visible")) {
        // not initial select
        hideValue();
        showCondition();
    }
    else{
      // initial select
      showCondition();
    }
  } // end else
});

// 3: TERM + RANGE
$(document.body).on('change','#filter-condition3-selector',function(){
// $("#filter-condition3-selector").change(function(){
  if ($('#filter-condition3-selector').val() == "") {
    hideValue();
  }
  else{
    if ($("#filter-value-input").is(":visible") || $("#filter-range-input").is(":visible")) {
      // not initial select
      showValue3();
    }
    else{
      // initial select
      showValue3();
    }
  }
});

// 4: TERM + REGEX + PARTIAL
$(document.body).on('change','#filter-condition4-selector',function(){
// $("#filter-condition4-selector").change(function(){
  if ($('#filter-condition4-selector').val() == "") {
    // TO DO: HIDE ALL SUCCEEDING SELECTORS
    hideValue();
  }
  else{
      $('#filter-value-input').prop('value', "");
      $("#filter-value-input").show();
      $("#add-new-filter-btn").show();
  }
});

function test(){
  resetForm();
}

function hideValue(){
  $("#filter-value-input").hide();
  $('#filter-value-input').prop('value', "");
  $("#filter-range-input").hide();
  $("#filter-range-input-lower").prop('value', "");
  $("#filter-range-input-upper").prop('value', "");
  $("#add-new-filter-btn").hide();
}

function showValue3(){
  hideValue();
  selected_field = $('#filter-condition3-selector').val();
  switch (selected_field) {
    case "equal":
      $("#filter-value-input").show();
      break;
    case "range":
      $("#filter-range-input").show();
      break;
    default:
      alert(unreachable); console.trace();
  }// end switch
  $("#add-new-filter-btn").show();
}

function hideCondition(){
  $("#filter-condition1-selector").hide();
  $("#filter-value-input").hide();
  $('#filter-value-input').prop('value', "");
  $("#filter-condition2-selector").hide();
  $("#filter-timerange-input").hide();
  $("#filter-timerange-input-lower").prop('value', "");
  $("#filter-timerange-input-upper").prop('value', "");
  $("#filter-condition3-selector").hide();
  $("#filter-condition4-selector").hide();
  $('#filter-condition3-selector option[value=""]').prop('selected', true);
  $('#filter-condition4-selector option[value=""]').prop('selected', true);
  $("#add-new-filter-btn").hide();
}

function showCondition(){
  selected_field = $('#filter-field-selector').val();
  switch (selected_field) {
    case "":
      alert(unreachable); console.trace();
      break;

    case "remote_addr":
    case "request_method":
      // 1: TERM only
        hideCondition();
        $("#filter-condition1-selector").show();
        $("#filter-value-input").show();
        $("#add-new-filter-btn").show();
        break;

    case "time_iso8601":
      // 2: TIME RANGE ONLY
      hideCondition();
      $("#filter-condition2-selector").show();
      $("#filter-timerange-input").show();
      $("#add-new-filter-btn").show();
      break;

    case "request_time":
    case "status":
    case "bytes_received":
    case "body_bytes_sent":
    case "bytes_sent":
      // 3: TERM + RANGE
      hideCondition();
      $("#filter-condition3-selector").show();
      break;

    case "request_uri":
    case "http_host":
    case "http_referer":
    case "http_agent":
      // 4: TERM + REGEX + PARTIAL
      hideCondition();
      $("#filter-condition4-selector").show();
      break;

    default:
      alert(unreachable); console.trace();
  } // end switch
}

function resetForm(){
  hideCondition();
  hideValue();
  $('#filter-field-selector').hide();
  $('#filter-type-selector').hide();
  $('#filter-field-selector option[value=""]').prop('selected', true);
  $('#filter-type-selector option[value=""]').prop('selected', true);
  $('#cancel-new-filter-btn').hide();
  $('#new-filter-btn').show();
}

function newFilter(){
  $("#new-filter-btn").hide();
  $("#filter-field-selector").show();
  $("#cancel-new-filter-btn").show();
}

function CancelNewFilter(){
  hideValue();
  hideCondition();
  $("#cancel-new-filter-btn").hide();
  $("#filter-field-selector").hide();
  $("#filter-type-selector").hide();
  $("#new-filter-btn").show();
  resetForm();
}

function AddNewFilter(){
  // DISPLAY
  var timestamp = Date.now();
  var field_name = $("#filter-field-selector option:selected").text();
  var field_id = $("#filter-field-selector").val();
  var type_name = $("#filter-type-selector option:selected").text();
  var type_id = $("#filter-type-selector").val();

  var condition_name, condition_id;
  if ($("#filter-condition1-selector").is(":visible")){
    condition_name = $("#filter-condition1-selector option:selected").text();
    condition_id = $("#filter-condition1-selector").val();
  }
  else if ($("#filter-condition2-selector").is(":visible")){
    condition_name = $("#filter-condition2-selector option:selected").text();
    condition_id = $("#filter-condition2-selector").val();
  }
  else if ($("#filter-condition3-selector").is(":visible")){
    condition_name = $("#filter-condition3-selector option:selected").text();
    condition_id = $("#filter-condition3-selector").val();
  }
  else if ($("#filter-condition4-selector").is(":visible")){
    condition_name = $("#filter-condition4-selector option:selected").text();
    condition_id = $("#filter-condition4-selector").val();
  }
  else{
    alert(unreachable); console.trace();
  }

  var value;
  var lower, upper;
  if ($("#filter-value-input").is(":visible")){
    value = $("#filter-value-input").val();
  }
  else if ($("#filter-timerange-input").is(":visible")){
    lower = $("#filter-timerange-input-lower").val();
    upper = $("#filter-timerange-input-upper").val();
  }
  else if ($("#filter-range-input").is(":visible")){
    lower = $("#filter-range-input-lower").val()
    upper = $("#filter-range-input-upper").val();
  }
  else{
    alert(unreachable); console.trace();
  }

  if (value != undefined) {
    // term
    if (value == "") {
      return;
    }
    $("#filter-tags").append("<li class='filter-tag' id='tag-" + timestamp + "' field='" + field_id + "' type='" + type_id + "' condition='" + condition_id + "' value='" + value + "' onclick='editTag(" + timestamp + ");' >" + field_name + " " + type_name + " " + condition_name + " " + value + "<span class='delete-filter-tag' onclick='deleteTag(" + timestamp + ", true);'>×</span></li>");
  }
  else{
    // range
    if(upper == undefined || upper == "" || lower == undefined || lower == ""){
      return;
    }
    $("#filter-tags").append("<li class='filter-tag' id='tag-" + timestamp + "' field='" + field_id + "' type='" + type_id + "' condition='" + condition_id + "' lower='" + lower + "' upper='" + upper + "' onclick='editTag(" + timestamp + ");' >" + field_name + " " + type_name + " " + condition_name + " " + lower + " & " + upper + "<span class='delete-filter-tag' onclick='deleteTag(" + timestamp + ", true);'>×</span></li>");
  }

  resetForm();
  $("#del-all-filter-btn").show();
  // END DISPLAY

  // store the new filter condition
  console.log(field_id);
  if (value != undefined) {
      // term
      switch (type_id) {
        case "must":
          if (condition_id == "equal"){
            filters.must[timestamp] = {"term": {}};
            filters.must[timestamp]["term"][field_id] = value;
          }
          else if (condition_id == "regex"){
            filters.must[timestamp] = {"regexp": {}};
            filters.must[timestamp]["regexp"][field_id] = value;
          }
          else if (condition_id == "partial"){
            var stringSplit = value.split(',');
            for(var xReg = 0; xReg < stringSplit.length; xReg++){
              stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
              stringSplit[xReg] = "*" + stringSplit[xReg] + "*";
              filters.must[timestamp] = {"query": {"wildcard": {} }};
              filters.must[timestamp]["query"]["wildcard"][field_id] = stringSplit[xReg];
              // mustData.splice(0, 0, { "query": { "wildcard" : { "http_host" : stringSplit[xReg] }}});
            }
          }
          else{
            alert(unreachable);
          }
          break;
        case "mustNot":

          if (condition_id == "equal"){
            filters.mustNot[timestamp] = {"term": {}};
            filters.mustNot[timestamp]["term"][field_id] = value;
          }
          else if (condition_id == "regex"){
            filters.mustNot[timestamp] = {"regexp": {}};
            filters.mustNot[timestamp]["regexp"][field_id] = value;
          }
          else if (condition_id == "partial"){
            var stringSplit = value.split(',');
            for(var xReg = 0; xReg < stringSplit.length; xReg++){
              stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
              stringSplit[xReg] = "*" + stringSplit[xReg] + "*";
              filters.mustNot[timestamp] = {"query": {"wildcard": {} }};
              filters.mustNot[timestamp]["query"]["wildcard"][field_id] = stringSplit[xReg];
              // mustData.splice(0, 0, { "query": { "wildcard" : { "http_host" : stringSplit[xReg] }}});
            }
          }
          else{
            alert(unreachable);
          }

          break;
        case "should":

          if (condition_id == "equal"){
            filters.should[timestamp] = {"term": {}};
            filters.should[timestamp]["term"][field_id] = value;
          }
          else if (condition_id == "regex"){
            filters.should[timestamp] = {"regexp": {}};
            filters.should[timestamp]["regexp"][field_id] = value;
          }
          else if (condition_id == "partial"){
            var stringSplit = value.split(',');
            for(var xReg = 0; xReg < stringSplit.length; xReg++){
              stringSplit[xReg] = stringSplit[xReg].replace(/^\s*/, "").replace(/\s*$/, "");
              stringSplit[xReg] = "*" + stringSplit[xReg] + "*";
              filters.should[timestamp] = {"query": {"wildcard": {} }};
              filters.should[timestamp]["query"]["wildcard"][field_id] = stringSplit[xReg];
              // mustData.splice(0, 0, { "query": { "wildcard" : { "http_host" : stringSplit[xReg] }}});
            }
          }
          else{
            alert(unreachable);
          }

          break;
        default:
          alert(unreachable);
      } // end switch
  } // end term
  else{
    // Range
    switch (type_id) {
      case "must":
        filters.must[timestamp] = {"range": {}};
        filters.must[timestamp]["range"][field_id] = {};
        filters.must[timestamp]["range"][field_id]["gte"] = lower;
        filters.must[timestamp]["range"][field_id]["lte"] = upper;
        break;
      case "mustNot":
        filters.mustNot[timestamp] = {"range": {}};
        filters.mustNot[timestamp]["range"][field_id] = {};
        filters.mustNot[timestamp]["range"][field_id]["gte"] = lower;
        filters.mustNot[timestamp]["range"][field_id]["lte"] = upper;
        break;
      case "should":
        filters.should[timestamp] = {"range": {}};
        filters.should[timestamp]["range"][field_id] = {};
        filters.should[timestamp]["range"][field_id]["gte"] = lower;
        filters.should[timestamp]["range"][field_id]["lte"] = upper;
        break;
      default:
        alert(unreachable);
    } // end switch
  } // end range


  // refresh Calendar
  // console.log(JSON.stringify($.map(filters.must, function(el) { return el; })));
  loadCal();

  $.post('/calendar_stat',
  {
    "must": JSON.stringify(filter_to_array(filters.must)),
    "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
    "should": JSON.stringify(filter_to_array(filters.should))
  },
  function(data){
    showStats(data["result"], new Date(), true);
  });

}

function editTag(tag_id){
  var tag = $("#tag-" + tag_id);
  if (!tag.length) {
    // for deleting
    return;
  }
  console.log("EDIT");
  var field = tag.attr("field");
  var type = tag.attr("type");
  var condition = tag.attr("condition");
  // var value = tag.attr("value");
  // var lower = tag.attr("lower");
  // var upper = tag.attr("upper");
  resetForm();
  $('#new-filter-btn').hide();
  $('#cancel-new-filter-btn').show();
  $('#add-new-filter-btn').show();

  $('#filter-field-selector').show();
  $('#filter-field-selector option[value="' + field + '"]').prop('selected', true);
  $('#filter-type-selector').show();
  $('#filter-type-selector option[value="' + type + '"]').prop('selected', true);
  switch (field) {
    case "":
      alert(unreachable); console.trace();
      break;

    case "remote_addr":
    case "request_method":
      // 1: TERM only
      $("#filter-condition1-selector").show();
      $("#filter-value-input").show();
      $("#filter-value-input").val(tag.attr("value"));
      break;

    case "time_iso8601":
      // 2: TIME RANGE ONLY
      $("#filter-condition2-selector").show();
      $("#filter-timerange-input").show();
      $("#filter-timerange-input-lower").val(tag.attr("lower"));
      $("#filter-timerange-input-upper").val(tag.attr("upper"));
      break;

    case "request_time":
    case "status":
    case "bytes_received":
    case "body_bytes_sent":
    case "bytes_sent":
      // 3: TERM + RANGE
      $("#filter-condition3-selector").show();
      $('#filter-condition3-selector option[value="' + condition + '"]').prop('selected', true);
      if (condition == "equal") {
        $("#filter-value-input").show();
        $("#filter-value-input").val(tag.attr("value"));
      }
      else if (condition == "range"){
        $("#filter-range-input").show();
        $("#filter-range-input-lower").val(tag.attr("lower"));
        $("#filter-range-input-upper").val(tag.attr("upper"));
      }
      else{
        alert(unreachable); console.trace();
      }
      break;

    case "request_uri":
    case "http_host":
    case "http_referer":
    case "http_agent":
      // 4: TERM + REGEX + PARTIAL
      $("#filter-condition4-selector").show();
      $('#filter-condition4-selector option[value="' + condition + '"]').prop('selected', true);
      $("#filter-value-input").show();
      $("#filter-value-input").val(tag.attr("value"));
      break;

    default:
      alert(unreachable); console.trace();
  } // end switch
}

function deleteTag(tag_id, reload){
  switch ($("#tag-" + tag_id).attr("type")) {
    case "must":
      delete filters.must[tag_id];
      break;
    case "mustNot":
      delete filters.mustNot[tag_id];
      break;
    case "should":
      delete filters.should[tag_id];
      break;
    default:
  }
  $("#tag-" + tag_id).remove();
  if ($("#filter-tags").children("li").length == 0) {
    $("#del-all-filter-btn").hide();
  }
  if (reload) {
    loadCal();
    $.post('/calendar_stat',
    {
      "must": JSON.stringify(filter_to_array(filters.must)),
      "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
      "should": JSON.stringify(filter_to_array(filters.should))
    },
    function(data){
      showStats(data["result"], new Date(), true);
    });
  }
}

function DeleteAllFilter(){
  $("#filter-tags").children("li").each(function( index ) {
    console.log( index + ": " + $( this ).attr("id").substring(4) );
    deleteTag($( this ).attr("id").substring(4), false);
  });
  $("#del-all-filter-btn").hide();

  // reload everything in one run
  loadCal();
  $.post('/calendar_stat',
  {
    "must": JSON.stringify(filter_to_array(filters.must)),
    "mustNot": JSON.stringify(filter_to_array(filters.mustNot)),
    "should": JSON.stringify(filter_to_array(filters.should))
  },
  function(data){
    showStats(data["result"], new Date(), true);
  });
}

// remote_addr
// time_iso8601
// request_time
// request_uri
// request_method
// status
// bytes_received
// body_bytes_sent
// bytes_sent
// http_host
// http_referer
// http_agent
