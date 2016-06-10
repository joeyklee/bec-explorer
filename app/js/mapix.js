var app = app || {};

app.mapix = (function() {
    // create empty el to take on attributes of the main el
    var el = null



    function sayHello() {
        console.log("hi there");
    }

    function toggleSidebar() {
        // add this function to jquery
        (function($) {
            $.fn.clickToggle = function(func1, func2) {
                var funcs = [func1, func2];
                this.data('toggleclicked', 0);
                this.click(function() {
                    var data = $(this).data();
                    var tc = data.toggleclicked;
                    $.proxy(funcs[tc], this)();
                    data.toggleclicked = (tc + 1) % 2;
                });
                return this;
            };
        }(jQuery));

        $('#sidebar-toggle-button').clickToggle(function() {
                $("#sidebar").animate({
                    "margin-left": "-400px"
                }, 100);
            },
            function() {
                $("#sidebar").animate({
                    "margin-left": "0px"
                }, 100);
            });
    }

    function toggleExploreBar(){
        $("#explore-bar-toggle").click(function() {
            console.log("hello");
            if (el.explore_toggle == true) {
                $('#explore-bar').css("display", "block");
                $("#explore-bar-toggle").animate({
                    "margin-bottom": "155px"
                }, 100);
                el.explore_toggle = false;
                
            } else{
                $('#explore-bar').css("display", "none");
                $("#explore-bar-toggle").animate({
                    "margin-bottom": "0px"
                }, 100);
                el.explore_toggle = true;

            }
        })
    }

    function showLargeImage(){
        $(".photo-browse").click(function(){
            var imgsrc = $(this).attr("src");

            $('#photo-browse-large').attr("src", imgsrc);
            $('#photoModal-trigger').click();

        })
    }


    function selectBecUnit() {
        $(function() {
            $(".map-dropdown li a").click(function() {
                console.log($(".btn:first-child"));
                $("#bec-unit-button-selector:first-child").text($(this).text());
                $("#bec-unit-button-selector:first-child").val($(this).text());

                var selectedId = $(this).attr('id');
                // console.log(selectedId);
                if( selectedId == "bec-unit-button" ){
                    el.data_layer.setCartoCSS(el.bec_cartocss.unit);
                } else if(selectedId == "bec-zone-button" ){
                    el.data_layer.setCartoCSS(el.bec_cartocss.zone);
                }else if(selectedId == "bec-subzone-button" ){
                    console.log("subzone button clicked")
                }else if(selectedId == "bec-phase-button" ){
                    console.log("subzone button clicked")
                };
            });

        });
    }

    function toggleChartOptions() {
        $("#chart-options").click(function() {
            console.log("hello");
            if (el.chart_options == true) {
                $('.chart-options-menu').css("display", "block");
                el.chart_options = false;
            } else{
                $('.chart-options-menu').css("display", "none");
                el.chart_options = true;
            }
        })
    }

    function toggleMapOptions() {
        $("#map-options").click(function() {
            console.log("hello");
            if (el.map_options == true) {
                $('.map-options-menu').css("display", "block");
                el.map_options = false;
            } else{
                $('.map-options-menu').css("display", "none");
                el.map_options = true;
            }
        })
    }

    function closeOptions(){
        $("#map-options").click();
        $("#chart-options").click();
    }



    // init all the functions
    function init() {
        el = app.map.el;
        sayHello();
        selectBecUnit();
        toggleSidebar();
        toggleChartOptions();
        toggleMapOptions();
        toggleExploreBar();
        showLargeImage();
        closeOptions();
        // addImages();

    }

    return {
        init: init
    }
})();
