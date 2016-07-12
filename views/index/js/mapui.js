var app = app || {};

app.mapui = (function() {

    var el = null;

    // change the map display based on the selecte button
    function changeMapDisplay(){
        $('.map-display-buttons').click(function() {
            // disable the selected button color
            // $('.map-display-buttons a').addClass('disabled');
            $('.map-display-buttons').addClass('disabled');
            // get the name of the selected feature
            var sel = $(this).text().toUpperCase().trim();
            // turn on the selected button color
            // $('a', this).toggleClass('disabled');
            $(this).toggleClass('disabled');
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

    function setClimateSelected2(){
        var timeagg = $('.timescale-selector select').val();
        var climateSelected = $('.climate-variables-map :selected:first').val();
        // el.climate_selected
        if (timeagg == 'annual'){
            if(climateSelected == "tave"){
                el.climate_selected = 'mat'
            } else{
                el.climate_selected = climateSelected;
            }
        } else if ( ['wt','at','sm','sp'].indexOf(timeagg) > -1 == true) {
            el.climate_selected = climateSelected + '_' + timeagg; // for seasonal variables
        } else{
            el.climate_selected = climateSelected + timeagg; // for jan - dec
        }

        console.log("***the climate selected is: ", el.climate_selected);
    }

    function colorMapByClimate(){
        $('.climate-variables-button, .update-climate-map').click(function(){
            setClimateSelected2();
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
                  .domain([ min, max])
                  .range(colorbrewer.GnBu[9]);
              
                var color = d3.scale.quantile()
                    .domain([ min, max])
                    .range(colorbrewer.GnBu[9]);

                // var dom = color.domain(),
                //     l = (dom[1] - dom[0])/color.range().length,
                //     breaks = d3.range(0, color.range().length).map(function(i) { return i * l; });
                //     breaks = breaks.reverse();
                

                d3.select("#legend-child").remove();
                var svg = d3.select("#climate-legend").append('div')
                    .attr('id', "legend-child").append('svg')
                    .attr('height', 200)
                    .attr('width', 200);

                svg.append("g")
                  .attr("class", "legendQuant")
                  .attr("transform", "translate(20,20)");

                var legend = d3.legend.color()
                  .labelFormat(d3.format(".2f"))
                  .useClass(false)
                  .ascending(true)
                  .orient('vertical')
                  .scale(color);

                svg.select(".legendQuant")
                  .call(legend);

                 var styleArray = [];
                 var breaks = color.quantiles();
                 breaks = breaks.reverse();
                 breaks.forEach(function(d, i){
                  
                    var output;
                    if(i == 0){
                        // output = '#' + el.dataset_selected + '['+ el.climate_selected + ' <= ' + d + ']'+'['+ el.climate_selected + ' > ' + d + ']'+'{polygon-fill:' + quantize(d) + '}';
                        output = '#' + el.dataset_selected + '['+ el.climate_selected + ' <= ' + max + ']'+'{polygon-fill:' + quantize(d) + '}';
                    } else{
                        output = '#' + el.dataset_selected + '['+ el.climate_selected + ' <= ' + d + ']{polygon-fill:' + quantize(d) + '}';
                    }
                    styleArray.push(output)
                 })
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
        $('.climate-variables-map, .timescale-selector-map').change(function(){
            $('.climate-variables-button').click();
        });
    }

    // this is a temporary fix!!! on page load make sure the variables shown are same as what is loaded async
    // with the cliamte variables
    function setInitalClimateVariable() {
        $('.climate-variables :selected').val('rh_wt');
        $("select").material_select();   
    }

    function screenSizePrompt(){
        if($(window).width() < 750) {
            // alert("Hi there! Sorry but the BC Climate Explorer is best experienced on a screen size larger than 750px. In the mean time, you're welcome to learn more <a href='http://www.bc-climate-explorer.org/about'>here</a>");
            $('#toosmall').click();
        }
    }

    function addMaterializeTooltipped(){
        $('.tooltipped').tooltip({delay: 50});
    }
    
    

    var init = function() {
        el = app.main.el;
        changeMapDisplay();
        colorMapByClimate();
        updateClimateMap();
        setInitalClimateVariable();
        screenSizePrompt();
        addMaterializeTooltipped();
        // initSlider();
    };

    return {
        init: init
    }
})();
