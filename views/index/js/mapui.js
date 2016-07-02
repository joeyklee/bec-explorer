var app = app || {};

app.mapui = (function() {

    var el = null;

    // change the map display based on the selecte button
    function changeMapDisplay(){
        $('.map-display-buttons').click(function() {
            // disable the selected button color
            $('.map-display-buttons a').addClass('disabled');
            // get the name of the selected feature
            var sel = $(this).text().toUpperCase().trim();
            // turn on the selected button color
            $('a', this).toggleClass('disabled');
            console.log("the map option selected: ", sel);
            // change the map based on the button selected
            if (sel == "CLIMATE") {
                el.data_layer.setCartoCSS(el.bec_cartocss[el.selected_unit]);
            } else if (sel == "BEC UNIT") {
                el.data_layer.setCartoCSS(el.bec_cartocss.unit);
            } else if (sel == "BEC ZONE") {
                el.data_layer.setCartoCSS(el.bec_cartocss.zone);
            };
        });
    };


    // NOT CURRENTLY USED IN APP
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

    // set the climate variable to the first feature
    function setClimateSelected(){
        el.climate_selected = $('.climate-variables-map :selected:first').val();
        console.log("setClimateSelected - mapui is:", el.climate_selected);
        $("select").material_select();
    }

    function colorMapByClimate(){
        $('.climate-variables-button, .update-climate-map').click(function(){
            setClimateSelected();
            var query = 'SELECT ' + el.climate_selected + ', cartodb_id FROM ' + el.dataset_selected;

            // NEEED TO FIND A GOOD WAY TO CALCULATE BREAKS
            // THEN STYLE THE VALUES BASED ON THE BREAKS WITH CONDITIONALS!!!
            $.getJSON('https://'+el.username+'.cartodb.com/api/v2/sql/?q='+query, function(data) {
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

    // this is a temporary fix!!! on page load make sure the variables shown are same as what is loaded async
    // with the cliamte variables
    function setInitalClimateVariable() {
        $('.climate-variables :selected').val('rh_wt');
        $("select").material_select();   
    }
    
    

    var init = function() {
        el = app.main.el;
        changeMapDisplay();
        colorMapByClimate();
        updateClimateMap();
        setInitalClimateVariable();
        // initSlider();
    };

    return {
        init: init
    }
})();
