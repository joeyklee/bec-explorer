var app = app || {};

app.scatterplot = (function() {

    var el = null;

    function getSelectedClimate(climateSelector, timeaggSelector){
        var climateSelected = $(climateSelector).val();
        var timeagg = $(timeaggSelector).val();

        var climate_selected = null;

        if (timeagg == 'annual'){
             climate_selected = climateSelected;
        } else if ( ['wt','at','sm','sp'].indexOf(timeagg) > -1 == true) {
            climate_selected = climateSelected + '_' + timeagg; // for seasonal variables
        } else{
            climate_selected = climateSelected + timeagg; // for jan - dec
        }

        return climate_selected;
    }

    // var plotScatter = function() {
    //     console.log("initscatter");
        
    //     el.xSelector = getSelectedClimate('.scatter-x select option:selected', '.timescale-selector-scatterx select') //$(".scatter-x select option:selected").val();
    //     el.ySelector = getSelectedClimate('.scatter-y select option:selected', '.timescale-selector-scattery select') //$(".scatter-y select option:selected").val();
    //     console.log("the x and y selectors are: ", el.xSelector, el.ySelector);

    //     var query = "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";
    //     // var query = "SELECT DISTINCT * FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL";
    //     $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
    //         console.log("the number of objects is:", data.rows.length);
    //         el.xData = data.rows.map(function(obj) {
    //             return obj[el.xSelector];
    //         });
    //         el.yData = data.rows.map(function(obj) {
    //             return obj[el.ySelector];
    //         });
    //         el.scatter_labels = data.rows.map(function(obj) {
    //             return obj.map_label;
    //         });
    //         var trace = {
    //             x: el.xData,
    //             y: el.yData,
    //             text: el.scatter_labels,
    //             mode: 'markers',
    //             type: 'scatter',
    //             title: 'PLOTS PLOTS PLOTS',
    //              marker: { size: 12, color: 'rgba(97, 97, 97, 0.75)'}
    //         };

    //         var layout = {
    //             xaxis: { title: el.xSelector, type: el.xSelector_axis },
    //             yaxis: { title: el.ySelector, type: el.ySelector_axis },
    //             width: 400,
    //             margin: {
    //                 l: 60,
    //                 r: 40,
    //                 b: 60,
    //                 t: 10,
    //                 pad: 2
    //             },
    //             hovermode: 'closest'

    //         };

    //         var layout_responsive = {
    //             xaxis: { title: el.xSelector, type: el.xSelector_axis },
    //             yaxis: { title: el.ySelector, type: el.ySelector_axis },
    //             margin: {
    //                 l: 60,
    //                 r: 40,
    //                 b: 60,
    //                 t: 10,
    //                 pad: 2
    //             },
    //             hovermode: 'closest',
    //             showlegend: true,
    //             legend: { "orientation": "h" }
    //         };

    //         var traces = [trace];
    //         // Plotly.newPlot("scatter-chart", traces, layout, { staticPlot: false, displayModeBar: false });

    //         // var update = {
    //         //     width: 400, // or any new width
    //         //     // height: 500  // " "
    //         // };

    //         // Plotly.relayout('scatter-chart', update);
    //         var d3 = Plotly.d3;
            
    //         // var WIDTH_IN_PERCENT_OF_PARENT = 1,
    //         //     HEIGHT_IN_PERCENT_OF_PARENT = 10;
    //         d3.select("#scatter-child").remove();
    //         var gd3 = d3.select("#scatter-chart").append('div').attr('id', 'scatter-child')
    //             .style({
    //                 width: 550 + 'px',
    //                 'margin-left': 10 + 'px',
    //                 height: 400+ 'px'
    //                 // 'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
    //             });
    //         el.chart_div = document.getElementById('scatter-child'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/

    //         var scatter_chart = gd3.node();
    //         Plotly.plot(scatter_chart, traces, layout_responsive, { staticPlot: false, displayModeBar: false });
    //         // window.onresize = function() { Plotly.Plots.resize( Green_Line_E ); };
    //         window.addEventListener('resize', function() { Plotly.Plots.resize('scatter_chart'); });

    //         highlightUnit();
    //     });

    // }


    var plotScatter2 = function(){


        el.xSelector = getSelectedClimate('.scatter-x select option:selected', '.timescale-selector-scatterx select') //$(".scatter-x select option:selected").val();
        el.ySelector = getSelectedClimate('.scatter-y select option:selected', '.timescale-selector-scattery select') //$(".scatter-y select option:selected").val();

        // var focalUnit = $('.bec-focal-selector select').val();
        // var comparisonUnit = $('.bec-comparison-selector select').val();
        // console.log("the x and y selectors are: ", el.xSelector, el.ySelector);
        

        var queryClimateNormals = "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";
        var query_45 = "SELECT DISTINCT id2, year," + el.xSelector + ", + " + el.ySelector + " FROM " + 'bec10centroid_access1_0_rcp45_2011_2100msyt' + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year = " + 2070;
        var query_85 = "SELECT DISTINCT id2, year," + el.xSelector + ", + " + el.ySelector + " FROM " + 'bec10centroid_access1_0_rcp85_2011_2100msyt' + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year = " + 2070;
        


        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + queryClimateNormals, function(data) {
            $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query_45, function(data_45) {
                $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query_85, function(data_85) {

                    // console.log(data_45);
                    // console.log(data_85);
                    // get back the scatter labels 
                     

                    var xdat = [],
                        ydat = [],
                        focal_x = [],
                        focal_y = [],
                        focal_x_45 = [],
                        focal_y_45 = [],
                        focal_x_85 = [],
                        focal_y_85 = [],
                        comparison_x = [],
                        comparison_y = [],
                        comparison_x_45 = [],
                        comparison_y_45 = [],
                        comparison_x_85 = [],
                        comparison_y_85 = [];

                    // data models
                    var scatterClimateNormals, 
                        scatterFocal, 
                        scatterFocal_45,
                        scatterFocal_85,
                        scatterComparison_45,
                        scatterComparison_85; 
                        
                    scatterClimateNormals = {
                        x: xdat,
                        y: ydat,
                        text: el.scatter_labels,
                        mode: 'markers',
                        type: 'scatter',
                        title: 'PLOTS PLOTS PLOTS',
                         marker: { size: 6, color: 'rgba(97, 97, 97, 0.75)'}
                    };

                    scatterFocal = {
                        x: focal_x,
                        y: focal_y,
                        text: el.focal_name,
                        mode: 'markers',
                        type: 'scatter',
                        marker: { size: 12, color: '#d32f2f'},
                        name: el.focal_name + " RCP 4.5"
                    };

                    scatterFocal_45 = {
                        x: focal_x_45,
                        y: focal_y_45,
                        mode: 'lines',
                        text: el.focal_name + " RCP 4.5",
                        line: {
                            color: 'rgba(228, 129, 129, 0.5)',
                            width: 4,
                            opacity: 0.5
                        },
                        name: el.focal_name + " RCP 4.5"
                    };

                    scatterFocal_85 = {
                        x: focal_x_85,
                        y: focal_y_85,
                        text: el.focal_name + " RCP 8.5",
                        mode: 'lines',
                        line: {
                            color: 'rgb(126, 27, 27, 0.5)',
                            width: 4,
                            opacity: 0.5
                        },
                        name: el.focal_name + " RCP 8.5"
                    };


                    scatterComparison = {
                        x: comparison_x,
                        y: comparison_y,
                        text: el.comparison_name,
                        mode: 'markers',
                        type: 'scatter',
                        marker: { size: 12, color: '#303f9f'},
                        name: el.comparison_name + " RCP 4.5"
                    };

                    scatterComparison_45 = {
                        x: comparison_x_45,
                        y: comparison_y_45,
                        text: el.comparison_name + " RCP 4.5",
                        mode: 'lines',
                        line: {
                            color: 'rgb(98, 113, 208, 0.5)',
                            width: 4,
                            opacity: 0.5
                        },
                        name: el.comparison_name + " RCP 4.5"
                    };

                    scatterComparison_85 = {
                        x: comparison_x_85,
                        y: comparison_y_85,
                        text: el.comparison_name + " RCP 8.5",
                        mode: 'lines',
                        line: {
                            color: 'rgb(23, 31, 79, 0.5)',
                            width: 4,
                            opacity: 0.5
                        },
                        name: el.comparison_name + " RCP 8.5"
                    };


                    data.rows.forEach(function(obj){
                        xdat.push(obj[el.xSelector]);
                        ydat.push(obj[el.ySelector]);
                        el.scatter_labels.push(obj.map_label);

                        if(obj.map_label == el.focal_name){
                            console.log('focal true');
                            focal_x.push(obj[el.xSelector]);
                            focal_y.push(obj[el.ySelector]);

                            focal_x_45.push(obj[el.xSelector]);
                            focal_y_45.push(obj[el.ySelector]);
                            

                            focal_x_85.push(obj[el.xSelector]);
                            focal_y_85.push(obj[el.ySelector]);
                            

                        } else if (obj.map_label == el.comparison_name){
                            console.log(' comparison true');
                            comparison_x.push(obj[el.xSelector]);
                            comparison_y.push(obj[el.ySelector]);

                            comparison_x_45.push(obj[el.xSelector]);
                            comparison_y_45.push(obj[el.ySelector]);
                            

                            comparison_x_85.push(obj[el.xSelector]);
                            comparison_y_85.push(obj[el.ySelector]);
                            
                        }

                    });

                    data_45.rows.forEach(function(d){
                        if(d.id2 == el.focal_name){
                            focal_x_45.push(d[el.xSelector]);
                            focal_y_45.push(d[el.ySelector]);
                        } else{
                            comparison_x_45.push(d[el.xSelector]);
                            comparison_y_45.push(d[el.ySelector]);
                        }
                    });

                    data_85.rows.forEach(function(d){
                        if(d.id2 == el.focal_name){
                            focal_x_85.push(d[el.xSelector]);
                            focal_y_85.push(d[el.ySelector]);
                        } else{
                            comparison_x_85.push(d[el.xSelector]);
                            comparison_y_85.push(d[el.ySelector]);
                        }
                    });

                    var scatterData = [scatterClimateNormals, scatterFocal_45, scatterFocal_85, scatterComparison_45, scatterComparison_85, scatterFocal, scatterComparison];

                    var layout_responsive = {
                                    xaxis: { title: el.xSelector, type: el.xSelector_axis },
                                    yaxis: { title: el.ySelector, type: el.ySelector_axis },
                                    margin: {
                                        l: 60,
                                        r: 40,
                                        b: 60,
                                        t: 10,
                                        pad: 2
                                    },
                                    hovermode: 'closest',
                                    showlegend: true,
                                    legend: { "orientation": "v" }
                                };

                    
                    // Plotly.relayout('scatter-chart', update);
                    var d3 = Plotly.d3;
                    
                    // var WIDTH_IN_PERCENT_OF_PARENT = 1,
                    //     HEIGHT_IN_PERCENT_OF_PARENT = 10;
                    d3.select("#scatter-child").remove();
                    var gd3 = d3.select("#scatter-chart").append('div').attr('id', 'scatter-child')
                        .style({
                            width: 650 + 'px',
                            'margin-left': 10 + 'px',
                            height: 400+ 'px'
                            // 'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
                        });
                    el.chart_div = document.getElementById('scatter-child'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/

                    var scatter_chart = gd3.node();
                    Plotly.plot(scatter_chart, scatterData, layout_responsive, { staticPlot: false, displayModeBar: false });
                    // window.onresize = function() { Plotly.Plots.resize( Green_Line_E ); };
                    window.addEventListener('resize', function() { Plotly.Plots.resize('scatter_chart'); });

                    highlightUnit();

                });
            });
        });
        
    }



    function highlightUnit() {
        el.chart_div.on('plotly_hover', function(data) {
                // add geojson polygon for hovered poly


                el.hover_poly = L.geoJson(null, el.hover_style).addTo(el.map);
                
                
                if(Array.isArray(data.points[0].data.text) == true ){
                    var pointNumber = data.points[0].pointNumber;
                    var selected_label = el.scatter_labels[pointNumber];
                    // set the selected unit as the selected label
                    el.selected_unit = selected_label;
                } else{
                    el.selected_unit = data.points[0].data.text;
                }
                
                console.log(el.selected_unit);

                var sql = new cartodb.SQL({ user: 'becexplorer', format: 'geojson' });
                sql.execute("SELECT map_label, the_geom FROM " + el.dataset_selected + " WHERE map_label LIKE '{{unit}}'", { unit: el.selected_unit })
                    .done(function(geo_data) {
                        el.hover_poly.addData(geo_data);
                    })
                    .error(function(errors) {
                        // errors contains a list of errors
                        console.log("errors:" + errors);
                    })

            })
            .on('plotly_unhover', function() {
                el.map.removeLayer(el.hover_poly);
            });

        el.chart_div.on('plotly_click', function(data) {
            var sql = new cartodb.SQL({ user: 'becexplorer', format: 'geojson' });
            if(Array.isArray(data.points[0].data.text) == true ){
                var pointNumber = data.points[0].pointNumber;
                var selected_label = el.scatter_labels[pointNumber];
                // set the selected unit as the selected label
                el.selected_unit = selected_label;
            } else{
                el.selected_unit = data.points[0].data.text;
            }
            sql.execute("SELECT cartodb_id, the_geom FROM  " + el.dataset_selected + " WHERE map_label LIKE '{{unit}}'", { unit: el.selected_unit })
                .done(function(data) {
                    var geojsonLayer = L.geoJson(data);
                    el.map.fitBounds(geojsonLayer.getBounds());
                })
                .error(function(errors) {
                    // errors contains a list of errors
                    console.log("errors:" + errors);
                })
        });
    }

    
    function replot() {
        $(".scatter-x, .scatter-y, .timescale-selector-scatterx select, .timescale-selector-scattery select, .bec-comparison-selector-scatter, .bec-focal-selector-scatter, .bec-focal-selector-timeseries, .bec-comparison-selector-timeseries").change(function(e) {
            plotScatter2();
        });
    }

    // function replotOnPinAdded(){
    //     $('.add-focal-pin').click(function() {
    //         el.focal_pin.on('dragend', function(){
    //             plotScatter2();
    //         })
    //     });
    //     $('.add-comparison-pin').click(function() {
    //         el.comparison_pin.on('dragend', function(){
    //             plotScatter2();
    //         })
    //     });
    // }

    function initAxesSwitch() {
        // if x selector is log
        if (el.xSelector_axis == 'log') {
            $('.scatter-x-axis input').prop("checked", true);
        } else {
            $('.scatter-x-axis input').prop('checked', false);
        }

        // if y selector is log
        if (el.ySelector_axis == 'log') {
            $('.scatter-y-axis input').prop("checked", true);
        } else {
            $('.scatter-y-axis input').prop('checked', false);
        }
    }

    function toggleLogLinearAxes() {
        $('.scatter-x-axis input').change(function() {
            // console.log("x switch toggled");
            if (el.xSelector_axis == 'log') {
                el.xSelector_axis = "linear";
            } else {
                el.xSelector_axis = "log";
            }
        });

        $('.scatter-y-axis input').change(function() {
            // console.log("y switch toggled");
            // if y selector is log
            if (el.ySelector_axis == 'log') {
                el.ySelector_axis = "linear";
            } else {
                el.ySelector_axis = "log";
            }
        });
    }

    // function updateScatterFCDropdown(){
    //     $('.bec-unit-variables, .timescale-selector').change(function(){
    //         console.log($('.bec-focal-selector :selected'));
    //         el.focal_name = $('.bec-focal-selector :selected').text();
    //         el.comparison_name = $('.bec-comparison-selector :selected').text();
    //         plotTimeSeries2();
    //     })
    // }



    var init = function() {
        el = app.main.el;
        // plotScatter();
        replot();
        initAxesSwitch();
        toggleLogLinearAxes();
        // plotScatter2();
        plotScatter2();
        // replotOnPinAdded();

    }

    return {
        init: init,
        plotScatter: plotScatter2
    }
})();
