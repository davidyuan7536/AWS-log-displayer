jQuery(document).ready(function(){

  $('#graphSideMenu').click(function (){

    var sub = $("#graphSideMenuSub");
    if (sub.is(":visible")){
      sub.slideUp(200);
      $("#graphSideMenuArrow").removeAttr("class");
      $("#graphSideMenuArrow").attr("class", "menu-arrow-down");
    }
    else{
      sub.slideDown(200);
      $("#graphSideMenuArrow").removeAttr("class");
      $("#graphSideMenuArrow").attr("class", "menu-arrow-right");
    }
  });
});

  function get(variable_name){
    return $("#" + variable_name).val();
  }
  function set(variable_name, val){
    $("#" + variable_name).attr("value", val);
  }



  var dataView;
  var grid;
  var data = [];
  var columns = JSON.parse($("#columns").html());
  var default_columns = [ // {id: "id", name: "ID", field:"id", editor: Slick.Editors.Text, width: 10, sortable: false},
      {id: "remote_addr", name: "IP Address", field: "remote_addr", editor: Slick.Editors.Text, width: 25, sortable: true},
      {id: "time_iso8601", name: "Timestamp", field: "time_iso8601", editor: Slick.Editors.Text, formatter: Slick.Formatters.Time, width: 30, sortable: true,
        header:{
          menu:{
            items:[
              {title: "Display Raw Format", command: "Raw"},
              {title: "Display in UTC", command: "UTC"},
              {title: "Display in Local Time", command: "Local"},
              {title: "Show Time Zone", command: "Show Time Zone"},
              {title: "Hide Time Zone", command: "Hide Time Zone"}
           ]
         }
       }
     },
      {id: "request_time", name: "Request Time", field: "request_time", editor: Slick.Editors.Text, formatter: Slick.Formatters.RequestTime, width: 12, sortable: true},
      {id: "request_uri", name: "Request URI", field: "request_uri", editor: Slick.Editors.Text, width: 30, sortable: true},
      {id: "request_method", name: "Method", field: "request_method", editor: Slick.Editors.Text, width: 20, sortable: true},
      {id: "status", name: "Status", field: "status", editor: Slick.Editors.Text, formatter: Slick.Formatters.Status, width: 10, sortable: true,
        header:{
          menu:{
            items:[
              {title: "Disable Coloring", command: "Disable Color"}
           ]
         }
       }
     },
      {id: "bytes_received", name: "Bytes Rcvd", field: "bytes_received", editor: Slick.Editors.Text, formatter: Slick.Formatters.Byte, width: 12, sortable: true},
      {id: "body_bytes_sent", name: "Body Bytes Sent", field: "body_bytes_sent", editor: Slick.Editors.Text, formatter: Slick.Formatters.Byte, width: 12, sortable: true},
      {id: "bytes_sent", name: "Bytes Sent", field: "bytes_sent", editor: Slick.Editors.Text, formatter: Slick.Formatters.Byte, width: 12, sortable: true},
      {id: "http_host", name: "HTTP Host", field: "http_host", editor: Slick.Editors.Text, width: 40, sortable: true},
      {id: "http_referer", name: "HTTP Referer", field: "http_referer", editor: Slick.Editors.Text, width: 15, sortable: true},
      {id: "http_agent", name: "User Agent", field: "http_agent", editor: Slick.Editors.Text, width: 40, sortable: true}
      // {id: "sel", name: "#", field: "num", behavior: "select", cssClass: "cell-selection", width: 40, cannotTriggerInsert: true, resizable: false, selectable: false },
      // {id: "title", name: "Title", field: "title", width: 120, minWidth: 120, cssClass: "cell-title", editor: Slick.Editors.Text, validator: requiredFieldValidator, sortable: true},
      // {id: "duration", name: "Duration", field: "duration", editor: Slick.Editors.Text, sortable: true},
      // {id: "%", defaultSortAsc: false, name: "% Complete", field: "percentComplete", width: 80, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete, sortable: true},
      // {id: "start", name: "Start", field: "start", minWidth: 60, editor: Slick.Editors.Date, sortable: true},
      // {id: "finish", name: "Finish", field: "finish", minWidth: 60, editor: Slick.Editors.Date, sortable: true},
      // {id: "effort-driven", name: "Effort Driven", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "effortDriven", formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true, sortable: true}
    ];

  // for (var i = 0; i < columns.length; i++) {
  //   columns[i].header = {
  //     menu: {
  //       items: [
  //         {
  //           iconImage: "../images/sort-asc.gif",
  //           title: "Sort Ascending",
  //           command: "sort-asc"
  //         },
  //         {
  //           iconImage: "../images/sort-desc.gif",
  //           title: "Sort Descending",
  //           command: "sort-desc"
  //         },
  //         {
  //           title: "Hide Column",
  //           command: "hide",
  //           disabled: true,
  //           tooltip: "Can't hide this column"
  //         },
  //         {
  //           iconCssClass: "icon-help",
  //           title: "Help",
  //           command: "help"
  //         }
  //       ]
  //     }
  //   };
  // }

  var options = {
    editable: true,
    enableAddRow: false,
    enableCellNavigation: true,
    asyncEditorLoading: true,
    forceFitColumns: true,
    topPanelHeight: 25,
    autoEdit: false,
    syncColumnCellResize: true,
    enableColumnReorder: true,
    headerRowHeight: 100
  };

  var sortcol = "time_iso8601";
  var sortdir = 1;
  var percentCompleteThreshold = 0;
  var searchString = "";
  var headerMenuPlugin = new Slick.Plugins.HeaderMenu({});

  // function requiredFieldValidator(value) {
  //   if (value == null || value == undefined || !value.length) {
  //     return {valid: false, msg: "This is a required field"};
  //   }
  //   else {
  //     return {valid: true, msg: null};
  //   }
  // }

  // function myFilter(item, args) {
  //   if (item["percentComplete"] < args.percentCompleteThreshold) {
  //     return false;
  //   }
  //
  //   if (args.searchString != "" && item["remote_addr"].indexOf(args.searchString) == -1) {
  //     return false;
  //   }
  //
  //   return true;
  // }

  // function percentCompleteSort(a, b) {
  //   return a["percentComplete"] - b["percentComplete"];
  // }
  //
  // function comparer(a, b) {
  //   var x = a[sortcol], y = b[sortcol];
  //   return (x == y ? 0 : (x > y ? 1 : -1));
  // }

  function toggleFilterRow() {
    grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
    $("#toggle-filter-button").toggleClass("ui-state-default");
    $("#toggle-filter-button").toggleClass("ui-state-highlight");
  }

  function RefreshColumns(){
    grid.setColumns(grid.getColumns());
  }

  function test_schema(){
    console.log(store.get("schema"));
    console.log(store.getAll());
    // store.clear();
    console.log(grid.getColumns());
  }

  // NOT DONE
  function downloadTable(){
    bootbox.dialog({
                  message: "Select a Format",
                  buttons: {
                      csv: {
                          label: "CSV",
                          className: "btn-default",
                          callback: function () {
                              var downloadLink = document.createElement("a");
                              console.log(JSON.stringify(data));
                              downloadLink.href = "/download_table?fomrat=csv" // &data=" + JSON.stringify(filter_to_array(data));
                              downloadLink.target = "_blank";
                              downloadLink.download = "data.csv";
                              document.body.appendChild(downloadLink);
                              downloadLink.click();
                              document.body.removeChild(downloadLink);
                          }
                      },
                      tsv: {
                          label: "TSV",
                          className: "btn-default",
                          callback: function () {
                            var downloadLink = document.createElement("a");
                            downloadLink.href = "/download_table?fomrat=tsv";
                            downloadLink.target = "_blank";
                            downloadLink.download = "data.tsv";
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                          }
                      },
                      exit: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function(){}
                      }
                  }
              }
          );
  }

  function SaveColumns(){
    // alert("save columns!");
    // console.log(grid.getColumns());
    bootbox.dialog({
                  title: "Save the Column Ordering as a Schema.",
                  message: '<div class="row">  ' +
                      '<div class="col-md-12"> ' +
                      '<form class="form-horizontal"> ' +
                      '<div class="form-group"> ' +
                      '<label class="col-md-4 control-label" for="name">Schema Name</label> ' +
                      '<div class="col-md-4"> ' +
                      '<input id="name" name="name" type="text" placeholder="e.g. Most Used Browser" class="form-control input-md"> ' +
                      '<span class="help-block">referenced later when loading</span> </div> ' +
                      '</div> ' +
                      '</form> </div>  </div>',
                  buttons: {
                      success: {
                          label: "Save",
                          className: "btn-default",
                          callback: function () {
                              var name = $('#name').val();
                              if (name != ""){
                                sch = store.get("schema");
                                if (sch[name] != undefined) {
                                  // schema name already exist
                                  bootbox.dialog({
                                                size: "small",
                                                title: "Schema Already Exists!",
                                                message: 'Overwrite " <b>' + name + '</b> " ?',
                                                buttons: {
                                                    exit: {
                                                      label: "Cancel",
                                                      className: "btn-default",
                                                      callback: function(){}
                                                    },
                                                    overwrite: {
                                                      label: "Overwite",
                                                      className: "btn-danger",
                                                      callback: function(){
                                                        sch[name] = grid.getColumns();
                                                        store.set("schema", sch);
                                                      }
                                                    }
                                                }
                                            });
                                }
                                else{
                                  sch[name] = grid.getColumns();
                                  store.set("schema", sch);
                                }
                              }
                          }
                      },
                      exit: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function(){}
                      }
                  }
              }
          );
  }

  function LoadColumns(){
    // alert("load columns!");
    // dialog.dialog( "open" );
    sch = store.get("schema");
    options = "";
    for (name in sch) {
      options += '<div class="radio"> <label for="'+ name + '"> ' + '<input type="radio" name="schema" id="schema_' + name + '" value="' + name + '" > ' + name + '</label></div> ';
    }

    bootbox.dialog({
                  size: "small",
                  title: "Load/Delete Schema",
                  message: '<div class="row">  ' +
                      '<div class="col-md-12"> ' +
                      '<form class="form-horizontal"> ' +
                      '<div class="form-group"> ' +
                      // '<label class="col-md-4 control-label" for="awesomeness">Choose From a Schema</label> ' +
                      '<div class="col-md-6">' +
                      options +
                      '</div> </div>' +
                      '</form> </div>  </div>',
                  buttons: {
                      delete: {
                          label: "Delete",
                          className: "btn-danger",
                          callback: function () {
                              var answer = $("input[name='schema']:checked").val()
                              console.log(sch[answer]);
                              if (answer != undefined) {
                              delete sch[answer];
                              store.set("schema", sch);
                              bootbox.dialog({
                                            size: "small",
                                            // title: "Success",
                                            message: "Schema - " + answer + " Deleted!",
                                            buttons: {
                                                exit: {
                                                  label: "OK",
                                                  className: "btn-default",
                                                  callback: function(){}
                                                }
                                            }
                                        });
                              }
                          }
                      },
                      success: {
                          label: "Load",
                          className: "btn-default",
                          callback: function () {
                              var answer = $("input[name='schema']:checked").val()
                              console.log(sch[answer]);
                              if (answer != undefined) {

                                sch[answer].forEach(function(ch) {    // Re-create editor and formatter functions
                                  var result = $.grep(default_columns, function(e){ return e.id == ch.id; });
                                  if (result[0]) {
                                      ch.editor = result[0].editor;
                                      ch.formatter = result[0].formatter;
                                  }
                              });
                              grid.setColumns(sch[answer]);
                              }
                          }
                      },
                      exit: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function(){}
                      }
                  }
              }
          );
  }

  function LoadTableData(url, args){
    // alert("caller of LOAD TABLE DATA is " + arguments.callee.caller.toString());
    // alert("load with args:" + JSON.stringify(args))
    $.post(url, args, function(json_data){

      // elem = document.getElementById("orderad");
      // elem.value = "Asc";
      //
      // var elem = document.getElementById("logSize");
      // elem.value = data.size;
      //
      // elem = document.getElementById("totalPages");
      // elem.value = Math.ceil($("#logSize").val()/$("#recordsPerPage").val());

      set("total_size", json_data.size);
      set("total_page", Math.ceil(get("total_size")/get("page_size")));

      // if(page_number == 1){
      //   $('#nextButton').attr("disabled"," true");
      //   $('#lastButton').attr("disabled"," true");
      // }

      // $('#table-id').find("tr:gt(0)").remove();

      // $.each(data.rows, function( index, value ) {
      //   var temp = data.rows[index].time_iso8601.toString();
      //   var regex2 = new RegExp(' ', 'g');
      //   temp = temp.replace(regex2, '-');
      //   $('#table-id > tbody:last-child').append('<tr><td title = '+data.rows[index].id+'>'+data.rows[index].id+'</td><td title = '+data.rows[index].remote_addr+'>'+data.rows[index].remote_addr+'</td><td title = '+temp+'>'+data.rows[index].time_iso8601+'</td><td title = '+data.rows[index].request_time+'>'+data.rows[index].request_time+'</td><td title = '+data.rows[index].request_uri+'>'+data.rows[index].request_uri+'</td><td title = '+data.rows[index].request_method+'>'+data.rows[index].request_method+'</td><td title = '+data.rows[index].status+'>'+data.rows[index].status+'</td><td title = '+data.rows[index].bytes_received+'>'+data.rows[index].bytes_received+'</td><td title = '+data.rows[index].body_bytes_sent+'>'+data.rows[index].body_bytes_sent+'</td><td title = '+data.rows[index].bytes_sent+'>'+data.rows[index].bytes_sent+'</td><td title = '+data.rows[index].http_host+'>'+data.rows[index].http_host+'</td><td title = '+data.rows[index].http_referer+'>'+data.rows[index].http_referer+'</td><td title = '+data.rows[index].http_agent+'>'+data.rows[index].http_agent+'</td></tr>');
      // });

      // alert("json rows returned: " + json_data.rows.length);
      var i = 0;
      data = [];
      $.each(json_data.rows, function( index, value ) {

        var d = (data[i] = {});

        d["id"] = json_data.rows[index]._id;
        d["remote_addr"] = json_data.rows[index]._source.remote_addr;
        d["time_iso8601"] = json_data.rows[index]._source.time_iso8601;
        d["request_time"] = json_data.rows[index]._source.request_time;
        d["request_uri"] = json_data.rows[index]._source.request_uri;
        d["request_method"] = json_data.rows[index]._source.request_method;
        d["status"] = json_data.rows[index]._source.status;
        d["bytes_received"] = json_data.rows[index]._source.bytes_received;
        d["body_bytes_sent"] = json_data.rows[index]._source.body_bytes_sent;
        d["bytes_sent"] = json_data.rows[index]._source.bytes_sent;
        d["http_host"] = json_data.rows[index]._source.http_host;
        d["http_referer"] = json_data.rows[index]._source.http_referer;
        d["http_agent"] = json_data.rows[index]._source.http_agent;
        i++;
      });
      // alert("data size after load: " + data.length);
      dataView.beginUpdate();
      dataView.setItems(data);
      // dataView.setPagingOptions({pageSize: page_size});
      dataView.endUpdate();
      dataView.refresh();
      console.log(grid);
      grid.invalidate();
      grid.registerPlugin(headerMenuPlugin);
      grid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
      grid.render();
      });
  }

  function LoadDefaultTable(){
    set("sortby", "time_iso8601");
    set("page_size", 20);
    set("page_number", 1);
    set("order", "asc");

    // alert("LOADING DEFAULT");
    var args = {
      'limit': 20,
      'offset': 0,
      'sortBy': "time_iso8601",
      'order': "asc",
      'mustData' : JSON.stringify(filter_to_array(filters.must)), // JSON.stringify($.map(filters.must, function(el) { return el; })),
      'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
      'shouldData' : JSON.stringify(filter_to_array(filters.should))
    };

    LoadTableData('/elasticsearch/filterOptions', args);
    // updatePager();

    grid.setColumns(default_columns);
    grid.setOptions({syncColumnCellResize:true, forceFitColumns: true});
    // dataView = new Slick.Data.DataView({ inlineFilters: true });
    // grid = new Slick.Grid("#myGrid", dataView, default_columns, options);
    // grid.setSelectionModel(new Slick.RowSelectionModel());
    //
    // grid.autosizeColumns();
    // // grid.setOptions({syncColumnCellResize:true});
    //
    // var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
    // var columnpicker = new Slick.Controls.ColumnPicker(default_columns, grid, options);
  }

  function copy_url_text(){
    var copyTextarea = document.querySelector('#table_url');
    copyTextarea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
      bootbox.dialog({
                    size: "small",
                    title: "Fail",
                    message: "Ooops, Something Went Wrong!",
                    buttons: {
                        exit: {
                          label: "OK",
                          className: "btn-default",
                          callback: function(){}
                        }
                    }
                }
            );
    }
  }

  function copyTextToClipboard(text) {

    var textArea = document.createElement("textarea");

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';

    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      bootbox.dialog({
                    size: "large",
                    // title: "Success",
                    message: "<input id='table_url' onclick='this.select(); copy_url_text();' style='width:100%; margin-bottom:10px' value='" + text + "'></input><br />" +
                              "Copied To ClipBoard! (Click URL to Re-Copy)",
                    buttons: {
                        exit: {
                          label: "OK",
                          className: "btn-default",
                          callback: function(){}
                        }
                    }
                }
            );
      console.log('Copying text command was ' + msg);
    } catch (err) {
      bootbox.dialog({
                    size: "small",
                    title: "Fail",
                    message: "Ooops, Something Went Wrong!",
                    buttons: {
                        exit: {
                          label: "OK",
                          className: "btn-default",
                          callback: function(){}
                        }
                    }
                }
            );
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  }

  function generate_link(){
    copyTextToClipboard(window.location.protocol + "//" + window.location.host + "/table?" + $("#page_info").serialize() + "&display_time_format=" + display_time_format + "&display_status_color=" + display_status_color + "&columns=" + JSON.stringify(grid.getColumns()));
  }


  $(".grid-header .ui-icon")
          .addClass("ui-state-default ui-corner-all")
          .mouseover(function (e) {
            $(e.target).addClass("ui-state-hover")
          })
          .mouseout(function (e) {
            $(e.target).removeClass("ui-state-hover")
          });

  function filter_to_array(x){
    return $.map(x, function(el) { return el; });
  }

  $(function () {

    // alert(get("page_number"));
    // prepare the data
    console.log(JSON.stringify(filter_to_array(filters.must)));
    temp ={"key":{}}
    console.log()
    var args = {
      'limit': get("page_size"),
      'offset': (get("page_number") - 1) * get("page_size"),
      'sortBy': get("sortby"),
      'order': get("order"),
      'mustData' : JSON.stringify(filter_to_array(filters.must)),
      'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
      'shouldData' : JSON.stringify(filter_to_array(filters.should))
    };

    if (store.get("schema") == undefined ) {
      store.clear();
      store.set("schema", {});
    }

    columns.forEach(function(ch) {    // Re-create editor and formatter functions
      var result = $.grep(default_columns, function(e){ return e.id == ch.id; });
      if (result[0]) {
          ch.editor = result[0].editor;
          ch.formatter = result[0].formatter;
      }
    });

    dataView = new Slick.Data.DataView({ inlineFilters: true });
    if (columns.length != 0) {
      grid = new Slick.Grid("#myGrid", dataView, columns, options);
    }
    else {
      grid = new Slick.Grid("#myGrid", dataView, default_columns, options);
    }

    console.log("INITIAL TABLE DATA LOAD");
    LoadTableData('/elasticsearch/filterOptions', args);
    // grid.getHeaderRowColumn(get("sortby")).click();
    // if (order = "desc") {
    //   grid.getHeaderRowColumn(get("sortby")).click();
    // }
    grid.setSelectionModel(new Slick.RowSelectionModel());

    grid.autosizeColumns();
    // grid.setOptions({syncColumnCellResize:true});

    var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
    var columnpicker = new Slick.Controls.ColumnPicker(default_columns, grid, options);

    // HEADER MENU

    function DisableHeaderMenu(item, bool, size){
      for (var i = 0; i < size; i++) {
        item[i].disabled = bool[i];
      }
    };

    headerMenuPlugin.onBeforeMenuShow.subscribe(function(e, args) {
      var items = args.menu.items;
      // console.log(args);
      switch (args.column.id) {
        case "time_iso8601":
          switch (display_time_format) {
            case time_format.RAW:
              // menu.items[0].disabled = true;
              DisableHeaderMenu(items, [true, false, false, true, true], 5);
              break;
            case time_format.UTC:
              DisableHeaderMenu(items, [false, true, false, true, false], 5);
              break;
            case time_format.UTC_NOTIMEZONE:
              DisableHeaderMenu(items, [false, true, false, false, true], 5);
              break;
            case time_format.LOCAL:
              DisableHeaderMenu(items, [false, false, true, true, false], 5);
              break;
            case time_format.LOCAL_NOTIMEZONE:
              DisableHeaderMenu(items, [false, false, true, false, true,], 5);
              break;
            default:
              return;
          }// end time_iso8601
          break;

        case "status":
          items.pop();
          if (display_status_color) {
            items.push({
                title: "Disable Coloring", command: "Disable Color", iconImage: "../images/black_wheel.png"
            });
          }
          else{
            items.push({
                title: "Enable Coloring", command: "Enable Color", iconImage: "../images/color_wheel.png"
            });
          }
          break;

        default:
          return;
      } // end column switch

    });

    headerMenuPlugin.onCommand.subscribe(function(e, args) {
      // alert("Command: " + args.command);
      console.log(args);
      switch (args.column.id) {
        case "time_iso8601":
          switch (args.command) {
            case "Raw":
              display_time_format = time_format.RAW;
              break;
            case "UTC":
              if (display_time_format == time_format.LOCAL_NOTIMEZONE) {
                display_time_format = time_format.UTC_NOTIMEZONE;
              }
              else {
                display_time_format = time_format.UTC;
              }
              break;
            case "Local":
              if (display_time_format == time_format.UTC_NOTIMEZONE) {
                display_time_format = time_format.LOCAL_NOTIMEZONE;
              }
              else {
                display_time_format = time_format.LOCAL;
              }
              break;
            case "Hide Time Zone":
              if (display_time_format == time_format.UTC) {
                display_time_format = time_format.UTC_NOTIMEZONE;
              }
              else{
                display_time_format = time_format.LOCAL_NOTIMEZONE;
              }
              break;
            case "Show Time Zone":
              if (display_time_format == time_format.UTC_NOTIMEZONE) {
                display_time_format = time_format.UTC;
              }
              else{
                display_time_format = time_format.LOCAL;
              }
              break;
            default:
              return;
          } // end time_iso8601 switch
          break;

        case "status":
          switch (args.command) {
            case "Enable Color":
              display_status_color = true;
              break;
            case "Disable Color":
              display_status_color = false;
              break;
            default:
              return;
          } // end status switch
          break;

        default:
          return;

      } // end column switch
      RefreshColumns();
    });

    // END HEADER MENU

    // move the filter panel defined in a hidden div into grid top panel
    $("#inlineFilterPanel")
        .appendTo(grid.getTopPanel())
        .show();

    grid.onCellChange.subscribe(function (e, args) {
      dataView.updateItem(args.item.id, args.item);
    });

    // grid.onAddNewRow.subscribe(function (e, args) {
    //   var item = {"num": data.length, "id": "new_" + (Math.round(Math.random() * 10000)), "title": "New task", "duration": "1 day", "percentComplete": 0, "start": "01/01/2009", "finish": "01/01/2009", "effortDriven": false};
    //   $.extend(item, args.item);
    //   dataView.addItem(item);
    // });

    grid.onKeyDown.subscribe(function (e) {
      // select all rows on ctrl-a
      if (e.which != 65 || !e.ctrlKey) {
        return false;
      }

      var rows = [];
      for (var i = 0; i < dataView.getLength(); i++) {
        rows.push(i);
      }

      grid.setSelectedRows(rows);
      e.preventDefault();
    });

    grid.onSort.subscribe(function (e, args) {
      // sortdir = args.sortAsc ? 1 : -1;
      sortcol = args.sortCol.field;

      // alert("Sorting on " + sortcol + "with sortAsc = " + args.sortAsc + " !");
      set("sortby", sortcol);
      set("order", (args.sortAsc ? "asc" : "desc"))

      var args = {
        'limit': get("page_size"),
        'offset': get("page_size") * (get("page_number") - 1),
        'sortBy': sortcol,
        'order': (args.sortAsc ? "asc" : "desc"),
        'mustData' : JSON.stringify(filter_to_array(filters.must)),
        'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
        'shouldData' : JSON.stringify(filter_to_array(filters.should))
      };

      LoadTableData('/elasticsearch/filterOptions', args);

      // if ($.browser.msie && $.browser.version <= 8) {
      //   // using temporary Object.prototype.toString override
      //   // more limited and does lexicographic sort only by default, but can be much faster
      //
      //   var percentCompleteValueFn = function () {
      //     var val = this["percentComplete"];
      //     if (val < 10) {
      //       return "00" + val;
      //     } else if (val < 100) {
      //       return "0" + val;
      //     } else {
      //       return val;
      //     }
      //   };
      //
      //   // use numeric sort of % and lexicographic for everything else
      //   dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc);
      // } else {
      //   // using native sort with comparer
      //   // preferred method but can be very slow in IE with huge datasets
      //   dataView.sort(comparer, args.sortAsc);
      // }
    });

    // wire up model events to drive the grid
    // dataView.onRowCountChanged.subscribe(function (e, args) {
    //   grid.updateRowCount();
    //   grid.render();
    // });
    //
    // dataView.onRowsChanged.subscribe(function (e, args) {
    //   grid.invalidateRows(args.rows);
    //   grid.render();
    // });

    dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
      var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
      var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
      var options = grid.getOptions();

      if (options.enableAddRow != enableAddRow) {
        grid.setOptions({enableAddRow: enableAddRow});
      }
    });


    var h_runfilters = null;

    // wire up the slider to apply the filter to the model
    // $("#pcSlider").slider({
    //   "range": "min",
    //   "slide": function (event, ui) {
    //     Slick.GlobalEditorLock.cancelCurrentEdit();
    //
    //     if (percentCompleteThreshold != ui.value) {
    //       window.clearTimeout(h_runfilters);
    //       h_runfilters = window.setTimeout(updateFilter, 10);
    //       percentCompleteThreshold = ui.value;
    //     }
    //   }
    // });

    // wire up the search textbox to apply the filter to the model
    $("#txtSearch,#txtSearch2").keyup(function (e) {
      Slick.GlobalEditorLock.cancelCurrentEdit();

      // clear on Esc
      if (e.which == 27) {
        this.value = "";
      }

      searchString = this.value;
      updateFilter();
    });

    // function updateFilter() {
    //   dataView.setFilterArgs({
    //     percentCompleteThreshold: percentCompleteThreshold,
    //     searchString: searchString
    //   });
    //   dataView.refresh();
    // }

    $("#btnSelectRows").click(function () {
      if (!Slick.GlobalEditorLock.commitCurrentEdit()) {
        return;
      }

      var rows = [];
      for (var i = 0; i < 10 && i < dataView.getLength(); i++) {
        rows.push(i);
      }

      grid.setSelectedRows(rows);
    });


    // initialize the model after all the events have been hooked up
    // alert("data size before rendering: " + data.length);
    dataView.beginUpdate();
    dataView.setItems(data);
    // dataView.setFilterArgs({
    //   percentCompleteThreshold: percentCompleteThreshold,
    //   searchString: searchString
    // });
    // dataView.setFilter(myFilter);
    // dataView.setPagingOptions({pageSize: page_size});
    dataView.endUpdate();

    // if you don't want the items that are not visible (due to being filtered out
    // or being on a different page) to stay selected, pass 'false' to the second arg
    dataView.syncGridSelection(grid, true);

    // $("#gridContainer").resizable();

    // SET SCHEMA DIALOG


    // END SCHEMA DIALOG

  });
