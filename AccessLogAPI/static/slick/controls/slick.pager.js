(function ($) {
  function SlickGridPager(dataView, grid, $container) {
    var $status;

    function init() {
      dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
        updatePager(pagingInfo);
      });

      constructPagerUI();
      updatePager(dataView.getPagingInfo());
    }

    // function getNavState() {
    //   var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
    //   var pagingInfo = dataView.getPagingInfo();
    //   var lastPage = pagingInfo.totalPages - 1;
    //
    //   return {
    //     canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
    //     canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
    //     canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
    //     canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
    //     pagingInfo: pagingInfo
    //   }
    // }

    function getNavState() {
      return {
        canGotoFirst: get("page_number") != 1 && get("page_size") != 0,
        canGotoLast: get("page_number") != get("total_page") && get("page_size") != 0,
        canGotoPrev: get("page_number") != 1 && get("page_size") != 0,
        canGotoNext: get("page_number") != get("total_page") && get("page_size") != 0
      }
    }

    function setPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: true
      });
      dataView.setPagingOptions({pageSize: n});
    }

    function resetPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: true
      });

      cur_page_size = get("page_size");
      cur_page_number = get("page_number");
      page_number_to_set = Math.floor(cur_page_size*(cur_page_number - 1)/n) + 1;

      var args = {
        'limit': n,
        'offset': (page_number_to_set - 1) * n,
        'sortBy': get("sortby"),
        'order': get("order"),
        'mustData' : JSON.stringify(filter_to_array(filters.must)),
        'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
        'shouldData' : JSON.stringify(filter_to_array(filters.should))
      };
      LoadTableData('/elasticsearch/filterOptions', args);

      dataView.setPagingOptions({pageSize: n});
      set("page_size", n);
      set("page_number", page_number_to_set);
      set("total_page", Math.ceil(get("total_size")/n));
      updatePager();
    }

    function gotoFirst() {
      if (getNavState().canGotoFirst) {
        // dataView.setPagingOptions({pageNum: 0});
        var args = {
          'limit': get("page_size"),
          'offset': 0,
          'sortBy': get("sortby"),
          'order': get("order"),
          'mustData' : JSON.stringify(filter_to_array(filters.must)),
          'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
          'shouldData' : JSON.stringify(filter_to_array(filters.should))
        };
        LoadTableData('/elasticsearch/filterOptions', args);
        set("page_number", 1);
        updatePager();
      }
    }

    function gotoLast() {
      var state = getNavState();
      if (state.canGotoLast) {
        // dataView.setPagingOptions({pageNum: state.pagingInfo.totalPages - 1});
        var args = {
          'limit': get("page_size"),
          'offset': get("page_size") * (get("total_page") - 1),
          'sortBy': get("sortby"),
          'order': get("order"),
          'mustData' : JSON.stringify(filter_to_array(filters.must)),
          'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
          'shouldData' : JSON.stringify(filter_to_array(filters.should))
        };
        LoadTableData('/elasticsearch/filterOptions', args);
        set("page_number", parseInt(get("total_page")));
        updatePager();
      }
    }

    function gotoPrev() {
      var state = getNavState();
      if (state.canGotoPrev) {
        // dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum - 1});
        var args = {
          'limit': get("page_size"),
          'offset': get("page_size") * (get("page_number") - 2),
          'sortBy': get("sortby"),
          'order': get("order"),
          'mustData' : JSON.stringify(filter_to_array(filters.must)),
          'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
          'shouldData' : JSON.stringify(filter_to_array(filters.should))
        };
        LoadTableData('/elasticsearch/filterOptions', args);
        set("page_number", parseInt(get("page_number"))-1);
        updatePager();
      }
    }

    function gotoNext() {
      // alert("before: " + get("page_number"));
      var state = getNavState();
      if (state.canGotoNext) {
        // dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum + 1});
        var args = {
          'limit': get("page_size"),
          'offset': get("page_size") * get("page_number"),
          'sortBy': get("sortby"),
          'order': get("order"),
          'mustData' : JSON.stringify(filter_to_array(filters.must)),
          'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
          'shouldData' : JSON.stringify(filter_to_array(filters.should))
        };
        LoadTableData('/elasticsearch/filterOptions', args);
        set("page_number", parseInt(get("page_number"))+1);
        updatePager();
        // alert("after: " + get("page_number"));
      }
    }

    function gotoPage(n) {
      // alert("caller of GO TO PAGE is " + arguments.callee.caller.toString());
      // alert(n);
      canGotoN = get("page_size") != 0 && n <= get("total_page") && n > 0;

      if (canGotoN) {
        var args = {
          'limit': get("page_size"),
          'offset': get("page_size") * (n - 1),
          'sortBy': get("sortby"),
          'order': get("order"),
          'mustData' : JSON.stringify(filter_to_array(filters.must)),
          'mustNotData' : JSON.stringify(filter_to_array(filters.mustNot)),
          'shouldData' : JSON.stringify(filter_to_array(filters.should))
        };
        LoadTableData('/elasticsearch/filterOptions', args);
        set("page_number", n);
        updatePager();
      }
    }

    function constructPagerUI() {
      $container.empty();

      var $nav = $("<span class='slick-pager-nav' />").appendTo($container);
      var $settings = $("<span class='slick-pager-settings' />").appendTo($container);
      $status = $("<span class='slick-pager-status' />").appendTo($container);

      var pagingInfo = dataView.getPagingInfo();

      $settings
          .append("<span class='slick-pager-settings-expanded' style='display:initial;'>Show: <a data=10>10</a><a data=20>20</a><a data=50>50</a><a data='100'>100</a><a data='500'>500</a><a data='1000'>1000</a>  Custom Size: <input type='text' id='page_size_input' maxlength=4 size=4><span id='page_size_refresh' class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ui-icon-refresh' style='width=16px; height=16px; align=center'/></span></span>");
          // <a data='-1'>Auto</a>

      $settings.find("a[data]").click(function (e) {
        var pagesize = $(e.target).attr("data");
        if (pagesize != undefined) {
          if (pagesize == -1) {
            var vp = grid.getViewport();
            resetPageSize(vp.bottom - vp.top - 1);
          } else {
            resetPageSize(parseInt(pagesize));
          }
        }
      });

      $( "#page_size_refresh" ).click(function(){
        resetPageSize(get("page_size_input"));
      })

      // $( "#records_per_page" )
      //   .keyup(function() {
      //     var value = $( this ).val();
      //     cur_page_size = get("page_size");
      //     alert(value);
      //     if (value != page_size ){
      //       $("#page_number_refresh").removeClass("ui-state-disabled").addClass("ui-state-highlight");
      //     }
      //     else{
      //       $("#page_number_refresh").removeClass("ui-state-highlight").addClass("ui-state-disabled");
      //     }
      //   })
      //   .keyup();

      var icon_prefix = "<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ";
      var icon_suffix = "' /></span>";

      $("<span id='page_number_button' class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ui-icon-wrench' style='width=18px; height=18px; align=center'/></span>")
          .click(function () {
            $(".slick-pager-settings-expanded").toggle()
            $("#page_number_button").toggleClass("ui-state-active");
            $("#page_number_button").toggleClass("ui-state-default");
          })
          .appendTo($settings);

      $(icon_prefix + "ui-icon-seek-first" + icon_suffix)
          .click(gotoFirst)
          .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-prev" + icon_suffix)
          .click(gotoPrev)
          .appendTo($nav);

      $("<span><input type='text' id='page_number_input' maxlength=6 size=6 style='margin: 2px; text-align: center;' value=1></span>")
        .appendTo($nav);

      $( "#page_number_input" )
          .keyup(function() {
            var value = $( this ).val();
            if (value != undefined){
              gotoPage(parseInt(value));
            }
          });

      $(icon_prefix + "ui-icon-seek-next" + icon_suffix)
          .click(gotoNext)
          .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-end" + icon_suffix)
          .click(gotoLast)
          .appendTo($nav);

      $container.find(".ui-icon-container")
          .hover(function () {
            $(this).toggleClass("ui-state-hover");
          });

      $container.children().wrapAll("<div class='slick-pager' />");
    }


    function updatePager() {
      var state = getNavState();

      $container.find(".slick-pager-nav span").removeClass("ui-state-disabled");
      if (!state.canGotoFirst) {
        $container.find(".ui-icon-seek-first").addClass("ui-state-disabled");
      }
      if (!state.canGotoLast) {
        $container.find(".ui-icon-seek-end").addClass("ui-state-disabled");
      }
      if (!state.canGotoNext) {
        $container.find(".ui-icon-seek-next").addClass("ui-state-disabled");
      }
      if (!state.canGotoPrev) {
        $container.find(".ui-icon-seek-prev").addClass("ui-state-disabled");
      }

      $status.text("Showing page " + get("page_number") + " of " + get("total_page"));
      set("page_number_input", get("page_number"));
      // if (pagingInfo.pageSize == 0) {
      //   var totalRowsCount = dataView.getItems().length;
      //   var visibleRowsCount = pagingInfo.totalRows;
      //   if (visibleRowsCount < totalRowsCount) {
      //     $status.text("Showing " + visibleRowsCount + " of " + totalRowsCount + " rows");
      //   } else {
      //     $status.text("Showing all " + totalRowsCount + " rows");
      //   }
      //   $status.text("Showing all " + pagingInfo.totalRows + " rows");
      // }
      // else {
      //   $status.text("Showing page " + (pagingInfo.pageNum + 1) + " of " + pagingInfo.totalPages);
      // }
    }

    init();
  }

  // Slick.Controls.Pager
  $.extend(true, window, { Slick:{ Controls:{ Pager:SlickGridPager }}});
})(jQuery);
