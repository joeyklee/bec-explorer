var app = app || {};

app.mapui = (function() {

    var el = null;

    function initCollapsible() {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    function initSideNav() {
        $(".button-collapse").sideNav({
            menuWidth: 300, // Default is 240
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });
    }

    function initDropDown() {
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: true, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });
    };

    function initExpander() {
        $('.expander').click(function() {
            $('.sidebar').toggleClass('active');
            $('.expander').toggleClass('active');
        });
    };

    function initClimateToolsNavigation() {
        $('.climate-tool-button').click(function() {
            $('.climate-tools, .climate-tool-button').toggleClass("active");
        });
    }

    function initMaterialDesignSelection() {
        // init the materialize selection
        $('select').material_select();
    }

    function initWithMapDescription() {
        // init the materialize selection
        $('.map-description').click();
        // $('.scatter-panel').click();

    }


    function initSlider() {
        // range slider
        var slider = document.getElementById('range-input');
        noUiSlider.create(slider, {
            start: [20, 80],
            connect: true,
            step: 1,
            range: {
                'min': 0,
                'max': 100
            }
        });
    }

    function activateMapDisplayButtons() {
        $('.map-display-buttons').click(function() {
            console.log($(this).text());
            $('.map-display-buttons').addClass("disabled");
            $(this).toggleClass("disabled");
            if ($(this).text().toUpperCase() == "CLIMATE") {
                $('.climate-tools, .climate-tool-button').addClass("active");
            } else {
                $('.climate-tools, .climate-tool-button').removeClass("active");
            };
        });
    }

    function getAllClimateVariables() {
        // fetch the geometry
        var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
        sql.execute("SELECT * FROM bgcv10beta_200m_wgs84_merge WHERE cartodb_id = 1").done(function(data) {

            for (var k in data.features[0].properties) { el.column_names.push(k) };
            // console.log(el.column_names);

            $('.climate-variables select').children().remove().end();

            function populate(selector) {
                el.column_names.forEach(function(d, i) {
                    if (i == 0) {
                        $(selector)
                            .append('<option value="' + d + '" selected>' + d + '</option>')
                    } else {
                        $(selector)
                            .append('<option value="' + d + '">' + d + '</option>')
                    }
                })
            }

            populate('.climate-variables select');

            // call material select AFTER updating all the options to get the material style
            // otherwise it wont work !! 
            $("select").material_select();
        });

    }

    var init = function() {
        el = app.main.el;
        initCollapsible();
        initDropDown();
        initExpander();
        initClimateToolsNavigation();
        initWithMapDescription();
        initSlider();
        activateMapDisplayButtons();
        getAllClimateVariables();
        // initMaterialDesignSelection(); // need to call this after getAllClimateVariables to update the form

        // initSideNav(); // this is done in the main layout
    };

    return {
        init: init
    }
})();
