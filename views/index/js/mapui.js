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
                $('.climate-tools, .climate-tool-button').addClass("active");
            };
        });
    }

    function populate(selector, objlist) {
        objlist.forEach(function(d, i) {
            if (i == 0) {
                $(selector)
                    .append('<option value="' + d + '" selected>' + d + '</option>')
            } else {
                $(selector)
                    .append('<option value="' + d + '">' + d + '</option>')
            }
        })
    }

    function feedBecUnitSelector(){
        var query = "SELECT DISTINCT map_label FROM " + el.dataset_selected + " WHERE map_label IS NOT NULL";
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            // console.log(data.rows);
            data.rows.forEach(function(d){
                el.bec_names.push(d.map_label);
            })

            // console.log(el.bec_names);
            $('.bec-unit-variables select').children().remove().end();
            populate('.bec-unit-variables select', el.bec_names);
        });
        $("select").material_select();
    }

    

    function getAllClimateVariables() {
        // fetch the geometry
        var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
        sql.execute("SELECT * FROM " + el.dataset_selected + " WHERE cartodb_id = 1").done(function(data) {

            for (var k in data.features[0].properties) { el.column_names.push(k) };
            // console.log(el.column_names);

            $('.climate-variables select').children().remove().end();

            populate('.climate-variables select', el.column_names);

            // call material select AFTER updating all the options to get the material style
            // otherwise it wont work !! 
            $("select").material_select();

            setClimateSelected();
        });
    }

    function setClimateSelected(){
        el.climate_selected = $('.climate-variables-map :selected').text();
        console.log(el.climate_selected);
    }

    function colorMapByClimate(){
        $('.climate-variables-button, .update-climate-map').click(function(){
            setClimateSelected();
            var query = 'SELECT ' + el.climate_selected + ', cartodb_id FROM ' + el.dataset_selected;
            console.log(query);

            // NEEED TO FIND A GOOD WAY TO CALCULATE BREAKS
            // THEN STYLE THE VALUES BASED ON THE BREAKS WITH CONDITIONALS!!!
            $.getJSON('https://'+el.username+'.cartodb.com/api/v2/sql/?q='+query, function(data) {
                console.log(data.rows[0]);

                var max = d3.max(data.rows, function(d){ 
                    return d[el.climate_selected];
                })
                var min = d3.min(data.rows, function(d){ 
                    return d[el.climate_selected];
                })

                var quantize = d3.scale.quantize()
                  .domain([min, max])
                  .range([min, max]);
              
                var color = d3.scale.quantize()
                    .domain([min, max])
                    .range(colorbrewer.GnBu[9]);

                var dom = color.domain(),
                    l = (dom[1] - dom[0])/color.range().length,
                    breaks = d3.range(0, color.range().length).map(function(i) { return i * l; });
                    breaks = breaks.reverse();
                    // console.log(breaks);

                 var styleArray = [];

                 breaks.forEach(function(d, i){
                    var output;
                    output = '#' + el.dataset_selected + '['+ el.climate_selected + ' <= ' + d + ']{polygon-fill:' + color(d) + '}';
                    styleArray.push(output)
                 })
                 styleArray.unshift('#' + el.dataset_selected + '['+ el.climate_selected + ' < ' + max+ ']{polygon-fill:' + color(max) + '}');
    
                // set the color
                el.bec_cartocss[el.climate_selected] = null;
                el.bec_cartocss[el.climate_selected] = styleArray.join("\n");
                el.data_layer.setCartoCSS(el.bec_cartocss[el.climate_selected]);
            });
        });
    }

    // super hacky way to recolor map - take care of this later by 
    // refactoring the colorMapByClimate() function - but in the end it kind of works nicely
    // since it fires the "climate" button and updates the map at the same time.
    function updateClimateMap(){
        $('.climate-variables-map').change(function(){
            $('.climate-variables-button').click();
        });
    }



    var init = function() {
        el = app.main.el;
        initCollapsible();
        initDropDown();
        initExpander();
        initClimateToolsNavigation();
        initWithMapDescription();
        // initSlider();
        activateMapDisplayButtons();
        feedBecUnitSelector();
        getAllClimateVariables();
        colorMapByClimate();
        updateClimateMap();
        // initMaterialDesignSelection(); // need to call this after getAllClimateVariables to update the form

        // initSideNav(); // this is done in the main layout
    };

    return {
        init: init
    }
})();
