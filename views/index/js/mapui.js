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

    function initWithToolbox(){
        $('.climate-tool-button').click();
    }


    function initSlider() {
        // range slider
        var slider = document.getElementById('range-input');
        noUiSlider.create(slider, {
            start: [2000, 2013],
            connect: true,
            step: 1,
            range: {
                'min': 1901,
                'max': 2100
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
            data.rows.forEach(function(d){
                el.bec_names.push(d.map_label);
            })
            $('.bec-unit-variables select').children().remove().end();
            populate('.bec-unit-variables select', el.bec_names);

             // console.log($('.bec-focal-selector :selected').text());
            el.focal_name =  $('.bec-focal-selector :selected').text();
            el.comparison_name =  $('.bec-comparison-selector :selected').text();
            console.log(el.focal_name);
            // make sure that the material select is called to update the dropdown
            $("select").material_select();
        });
        
    }

    
    function setClimateSelected(){
        el.climate_selected = $('.climate-variables-map :selected').text();
        $("select").material_select();
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



    function updateTimeScaleSelected(){
        $('.timescale-selector select').change(function(){
            el.timescale_selected = $(".timescale-selector select").val();

                if (el.timescale_selected == "all"){
                    $('.climate-variables select').children().remove().end();
                    populate('.climate-variables select', el.column_names);
                } else if (el.timescale_selected == "monthly"){
                    $('.climate-variables select').children().remove().end();
                    populate('.climate-variables select', el.monthly_columns);
                } else if (el.timescale_selected == "seasonal"){
                    $('.climate-variables select').children().remove().end();
                    populate('.climate-variables select', el.seasonal_columns);
                } else if (el.timescale_selected == "annual"){
                    $('.climate-variables select').children().remove().end();
                    populate('.climate-variables select', el.annual_columns);
                }

            $('select').material_select();
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
        colorMapByClimate();
        updateClimateMap();
        updateTimeScaleSelected();
        initWithToolbox();
        // initMaterialDesignSelection(); // need to call this after getAllClimateVariables to update the form

        // initSideNav(); // this is done in the main layout
    };

    return {
        init: init
    }
})();
