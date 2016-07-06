var app = app || {};

app.climatetimeseries = (function() {
    var el = null;


    function plotTimeSeries2() {
        console.log("init timeseries");
        el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/
        
        var tsvar = getSelectedClimate('.climate-variables-chart option:selected', '.timescale-selector-timeseries select')
        console.log(tsvar);

        var query = null;
        var query_45 = null;
        var query_85 = null;
        if (el.timeRange_to < 2014) {
            query = "SELECT DISTINCT id2, year," + tsvar + " FROM " + el.climateNormals_1901_2014 + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + el.timeRange_to;
            $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
                climateNormals(data);
            });
        } else {
            query = "SELECT DISTINCT id2, year," + tsvar + " FROM " + el.climateNormals_1901_2014 + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + 2014;
            //45
            query_45 = "SELECT DISTINCT id2, year," + tsvar + " FROM " + 'bec10centroid_access1_0_rcp45_2011_2100msyt' + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year > " + 2014 + " AND year <= " + el.timeRange_to;
            // 85
            query_85 = "SELECT DISTINCT id2, year," + tsvar + " FROM " + 'bec10centroid_access1_0_rcp85_2011_2100msyt' + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year > " + 2014 + " AND year <= " + el.timeRange_to;
            $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
                normalsPlusModeled(data);
            });
        }


        //  data
        var xdat1 = [],
            ydat1 = [],
            xdat1_45 = [],
            ydat1_45 = [],
            xdat1_85 = [],
            ydat1_85 = [],
            xdat2 = [],
            ydat2 = [],
            xdat2_45 = [],
            ydat2_45 = []
            xdat2_85 = [],
            ydat2_85 = [];

        // data models
        var ts1, 
            ts2, 
            ts1_45, 
            ts2_45,
            ts1_85, 
            ts2_85;

        ts1 = {
            x: null,
            y: null,
            text: el.focal_name,
            type: "scatter",
            line: {
                color: '#d32f2f',
                width: 3,
                opacity: 1
            },
            name: el.focal_name
        }

        ts2 = {
            x: null,
            y: null,
            text: el.comparison_name,
            type: "scatter",
            line: {
                color: '#303f9f',
                width: 3,
                opacity: 1
            },
            name: el.comparison_name
        }

        ts1_45 = {
            x: null,
            y: null,
            text: el.focal_name + " RCP 4.5",
            type: "scatter",
            line: {
                color: 'rgba(228, 129, 129, 0.5)',
                width: 2,
                opacity: 0.25
            },
            name: el.focal_name + " RCP 4.5"
        }

        ts2_45 = {
            x: null,
            y: null,
            text: el.comparison_name + " RCP 4.5",
            type: "scatter",
            line: {
                color: 'rgb(98, 113, 208, 0.5)',
                width: 2,
                opacity: 0.25
            },
            name: el.comparison_name + " RCP 4.5"
        }

        ts1_85 = {
            x: null,
            y: null,
            text: el.focal_name + " RCP 8.5",
            type: "scatter",
            line: {
                color: 'rgb(126, 27, 27, 0.5)',
                width: 2,
                opacity: 0.25
            },
            name: el.focal_name + " RCP 8.5"
        }

        ts2_85 = {
            x: null,
            y: null,
            text: el.comparison_name + " RCP 8.5",
            type: "scatter",
            line: {
                color: 'rgb(23, 31, 79, 0.5)',
                width: 2,
                opacity: 0.25
            },
            name: el.comparison_name + " RCP 8.5"
        }

        var layout = {
            xaxis: { title: "year" },
            yaxis: { title: tsvar, type: 'linear' },
            width: 500,
            height:300,
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

        var layout_responsive = {
             // autosize: true,
            xaxis: { title: "year" },
            yaxis: { title: tsvar, type: 'linear' },
            // width: 500,
            // height:300,
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

        var update = {
            width: 500,
            height:300
        };


        function climateNormals(data) {
            data.rows.sort(function(a, b) {
                return parseFloat(a.year) - parseFloat(b.year);
            });

            data.rows.forEach(function(d) {

                if (d.id2 == el.focal_name) {
                    ydat1.push(d[tsvar]);
                    xdat1.push(d.year);

                } else if (d.id2 == el.comparison_name) {
                    ydat2.push(d[tsvar]);
                    xdat2.push(d.year);
                }
            });

            ts1.x = xdat1;
            ts1.y = ydat1;

            ts2.x = xdat2;
            ts2.y = ydat2;

            var ts = [ts1, ts2];

            var d3 = Plotly.d3;
            
            // var WIDTH_IN_PERCENT_OF_PARENT = 1,
            //     HEIGHT_IN_PERCENT_OF_PARENT = 10;
            d3.select("#ts-child").remove();
            var gd3 = d3.select("#timeseries-chart").append('div').attr('id', 'ts-child')
                .style({
                    width: 650 + 'px',
                    'margin-left': 10 + 'px',
                    height: 400+ 'px'
                    // 'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
                });

            var ts_chart = gd3.node();
            Plotly.plot(ts_chart, ts, layout_responsive, { staticPlot: false, displayModeBar: false });
            // window.onresize = function() { Plotly.Plots.resize( Green_Line_E ); };
            window.addEventListener('resize', function() { Plotly.Plots.resize('ts_chart'); });

            // Plotly.newPlot("timeseries-chart", ts, layout, { staticPlot: false, displayModeBar: false });
            // Plotly.relayout('timeseries-chart', update);
            // $( window ).resize(function() {
            //     Plotly.relayout('timeseries-chart', update);
            // });
        }

        function normalsPlusModeled(data) {
            $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query_45, function(data_45) {
                $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query_85, function(data_85) {
                    data.rows.sort(function(a, b) {
                        return parseFloat(a.year) - parseFloat(b.year);
                    });

                    data_45.rows.sort(function(a, b) {
                        return parseFloat(a.year) - parseFloat(b.year);
                    });

                    data_85.rows.sort(function(a, b) {
                        return parseFloat(a.year) - parseFloat(b.year);
                    });

                    console.log(data_45.rows)


                    data.rows.forEach(function(d) {

                        if (d.id2 == el.focal_name) {
                            ydat1.push(d[tsvar]);
                            xdat1.push(d.year);

                        } else if (d.id2 == el.comparison_name) {
                            ydat2.push(d[tsvar]);
                            xdat2.push(d.year);
                        }
                    });

                    data_45.rows.forEach(function(d) {

                        if (d.id2 == el.focal_name) {
                            ydat1_45.push(d[tsvar]);
                            xdat1_45.push(d.year);

                        } else if (d.id2 == el.comparison_name) {
                            ydat2_45.push(d[tsvar]);
                            xdat2_45.push(d.year);
                        }
                    });

                    data_85.rows.forEach(function(d) {

                        if (d.id2 == el.focal_name) {
                            ydat1_85.push(d[tsvar]);
                            xdat1_85.push(d.year);

                        } else if (d.id2 == el.comparison_name) {
                            ydat2_85.push(d[tsvar]);
                            xdat2_85.push(d.year);
                        }
                    });

                    ts1.x = xdat1;
                    ts1.y = ydat1;
                    ts1_45.x = xdat1_45;
                    ts1_45.y = ydat1_45;
                    ts1_85.x = xdat1_85;
                    ts1_85.y = ydat1_85;

                    ts2.x = xdat2;
                    ts2.y = ydat2;
                    ts2_45.x = xdat2_45;
                    ts2_45.y = ydat2_45;
                    ts2_85.y = ydat2_85;
                    ts2_85.x = xdat2_85;


                    var ts = [ts1, ts1_45, ts1_85, ts2, ts2_45, ts2_85];

                    var d3 = Plotly.d3;
                    d3.select("#ts-child").remove();
                    var gd3 = d3.select("#timeseries-chart").append('div')
                    .attr('id', 'ts-child')
                        .style({
                            width: 650 + 'px',
                            'margin-left': 10 + 'px',
                            height: 400+ 'px'
                            // 'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
                        });

                    var ts_chart = gd3.node();
                    Plotly.plot(ts_chart, ts, layout_responsive, { staticPlot: false, displayModeBar: false });
                    // window.onresize = function() { Plotly.Plots.resize( Green_Line_E ); };
                    window.addEventListener('resize', function() { Plotly.Plots.resize('ts_chart'); });


                });
            });
        }
    }

    // function getSelectedClimate(selector){
    //     var climateSelected = $(selector).val();
    //     var timeagg = $('.timescale-selector-timeseries select').val();

    //     if (timeagg == 'annual'){
    //          el.climate_selected = climateSelected;
    //     } else if ( ['wt','at','sm','sp'].indexOf(timeagg) > -1 == true) {
    //         el.climate_selected = climateSelected + '_' + timeagg; // for seasonal variables
    //     } else{
    //         el.climate_selected = climateSelected + timeagg; // for jan - dec
    //     }

    //     return el.climate_selected;
    // }

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

    function replot() {
        $(".bec-focal-selector, .bec-unit-variables, .climate-variables, .timescale-selector, .bec-comparison-selector, .climate-variables-map, .timerange-select").change(function(e) {
            // el.focal_name = $(".bec-focal-selector select").val();
            // el.comparison_name = $(".bec-comparison-selector select").val();
            
            plotTimeSeries2();
        });
    }




    function addFocalPin() {
        $('.add-focal-pin').click(function() {
            if (el.focal_pin == null) {
                var location = el.map.getCenter();
                el.focal_pin = new L.marker(location, {
                    draggable: true
                }).addTo(el.map);

                var marker;
                var position;
                el.focal_pin.on("drag", function(e) {
                    marker = e.target;
                    position = marker.getLatLng();
                    el.focal_poly.clearLayers();
                }).on("dragend", function(e) {
                    showComparisonUnit(position, el.focal_poly, "focal");
                });
            } else {
                console.log("focal pin already added");
            }
        });
    }

    function addComparisonPin() {
        $('.add-comparison-pin').click(function() {
            if (el.comparison_pin == null) {
                var location = el.map.getCenter();
                el.comparison_pin = new L.marker(location, {
                    draggable: true
                }).addTo(el.map);

                var marker;
                var position;
                el.comparison_pin.on("drag", function(e) {
                    marker = e.target;
                    position = marker.getLatLng();
                    el.comparison_poly.clearLayers();
                }).on("dragend", function(e) {
                    showComparisonUnit(position, el.comparison_poly, "comparison");
                });
            } else {
                console.log("comparison pin already added");
            }
        });
    }

    function clearComparisonPins() {
        $('.reset-comparison-pins').click(function() {
            console.log('reset clicked');
            el.map.removeLayer(el.focal_pin);
            el.map.removeLayer(el.comparison_pin);
            el.focal_pin = null;
            el.comparison_pin = null;
            el.focal_poly.clearLayers();
            el.comparison_poly.clearLayers();
        })
    }

    function showComparisonUnit(location, polyobj, selectDropdown) {
        var lat = location.lat;
        var lng = location.lng;
        
        var query = 'SELECT * from bgcv10beta_200m_wgs84 WHERE ST_Intersects( ST_SetSRID(ST_Point(' + lng + ',' + lat + '),4326), bgcv10beta_200m_wgs84.the_geom)'
        var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
        sql.execute(query).done(function(data) {
            polyobj.addData(data);
            
            
            if (selectDropdown == "focal") {
                console.log('focal');
                updateSelectedFocalDropdown(data.features[0].properties.map_label);
            } else {
                console.log('comparison');
                updateSelectedComparisonDropdown(data.features[0].properties.map_label);
            }
        });
    }

    function updateSelectedFocalDropdown(selectedUnit) {
        console.log(selectedUnit);
        $(".bec-focal-selector-timeseries select, .bec-focal-selector-scatter select").val(selectedUnit);
        el.focal_name = selectedUnit;
        plotTimeSeries2();
        $('select').material_select();
    }

    function updateSelectedComparisonDropdown(selectedUnit) {
        console.log(selectedUnit);
        $(".bec-comparison-selector-timeseries select, .bec-comparison-selector-scatter select").val(selectedUnit);
        el.comparison_name = selectedUnit;
        plotTimeSeries2();
        $('select').material_select();
    }

    

    function toggleTimeSeriesChartOptions(){
        $('.timeseries-options-expander').click(function(){
            $('.timeseries-options').toggleClass('active');
        });
    }

    function updatedFCDropdown(){
        $('.bec-unit-variables, .timescale-selector').change(function(){
            
            if($(this).hasClass('bec-comparison-selector-scatter') || $(this).hasClass('bec-focal-selector-scatter')){
                el.focal_name = $('.bec-focal-selector-scatter :selected').text();
                el.comparison_name = $('.bec-comparison-selector-scatter :selected').text();
                console.log(el.focal_name, el.comparison_name);
            } else {
                el.focal_name = $('.bec-focal-selector-timeseries :selected').text();
                el.comparison_name = $('.bec-comparison-selector-timeseries :selected').text();
                console.log(el.focal_name, el.comparison_name);
            }
            $(".bec-focal-selector-timeseries select, .bec-focal-selector-scatter select").val(el.focal_name);
            $(".bec-comparison-selector-timeseries select, .bec-comparison-selector-scatter select").val(el.comparison_name);
            $('select').material_select();
            plotTimeSeries2();
        })
    }


    var init = function() {
        el = app.main.el;
        plotTimeSeries2();
        replot();
        addFocalPin();
        addComparisonPin();
        clearComparisonPins();
        updatedFCDropdown();
        toggleTimeSeriesChartOptions();
    };

    return {
        init: init
    }

})();



// // var query = "SELECT DISTINCT id2, year," + tsvar + " FROM " + el.climateNormals_1901_2014 + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + el.timeRange_to;
// $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {

//     // $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query_45, function(data_45) {
//     data.rows.sort(function(a, b) {
//         return parseFloat(a.year) - parseFloat(b.year);
//     });

//     // data_45.rows.sort(function(a, b) {
//     //     return parseFloat(a.year) - parseFloat(b.year);
//     // });

//     var xdat1 = [],
//         ydat1 = [],
//         xdat1_45 = [],
//         ydat1_45 = [],
//         xdat2 = [],
//         ydat2 = [],
//         xdat2_45 = [],
//         ydat2_45 = [];



//     data.rows.forEach(function(d) {

//         if (d.id2 == el.focal_name) {
//             ydat1.push(d[tsvar]);
//             xdat1.push(d.year);

//         } else if (d.id2 == el.comparison_name) {
//             ydat2.push(d[tsvar]);
//             xdat2.push(d.year);
//         }
//     });

//     // data_45.rows.forEach(function(d) {

//     //     if (d.id2 == el.focal_name) {
//     //         xdat1_45.push(d[tsvar]);
//     //         ydat1_45.push(d.year);

//     //     } else if (d.id2 == el.comparison_name) {
//     //         xdat2_45.push(d[tsvar]);
//     //         ydat2_45.push(d.year);
//     //     }
//     // });

//     var ts1 = {
//         x: xdat1,
//         y: ydat1,
//         text: el.focal_name,
//         type: "scatter",
//         name: el.focal_name
//     }

//     var ts2 = {
//         x: xdat2,
//         y: ydat2,
//         text: el.comparison_name,
//         type: "scatter",
//         name: el.comparison_name
//     }

//     // var ts1_45 =  {
//     //     x: xdat1_45,
//     //     y: ydat1_45,
//     //     text: el.focal_name + " RCP 4.5",
//     //     type: "scatter",
//     //     name: el.focal_name + " RCP 4.5"
//     // }

//     // var ts2_45 = {
//     //     x: xdat2_45,
//     //     y: ydat2_45,
//     //     text: el.comparison_name + " RCP 4.5",
//     //     type: "scatter",
//     //     name: el.comparison_name + " RCP 4.5"
//     // }

//     // var ts = [ts1, ts2, ts1_45, ts2_45];
//     var ts = [ts1, ts2];

//     var layout = {
//         yaxis: { title: el.ts_yName, type: 'linear' },
//         width: 400,
//         margin: {
//             l: 60,
//             r: 40,
//             b: 60,
//             t: 10,
//             pad: 2
//         },
//         hovermode: 'closest'
//     };

//     Plotly.newPlot("timeseries-chart", ts, layout, { staticPlot: false, displayModeBar: false });

//     var update = {
//         width: 400, // or any new width
//     };

//     Plotly.relayout('timeseries-chart', update);

// });
// });var plotTimeSeries = function() {
    //     console.log("init timeseries");
    //     el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/

    //     var tsvar = $(".climate-variables-map option:selected").val();
    //     var msuffix = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    //     var ssuffix = ['at', 'wt', 'sp', 'sm'];

    //     // check if it is annual, seasonal, or monthly
    //     if (msuffix.indexOf(tsvar.slice(-2)) >= 1) {
    //         el.ts_ySelector = [];
    //         msuffix.forEach(function(d, i) {
    //             var output = tsvar.substring(0, tsvar.length - 2) + d;
    //             el.ts_ySelector.push(output);
    //         })
    //         el.ts_xName = "Monthly (Jan-Dec)";
    //         el.ts_yName = tsvar.substring(0, tsvar.length - 2);
    //     } else if (ssuffix.indexOf(tsvar.slice(-2)) >= 1) {
    //         el.ts_ySelector = [];
    //         ssuffix.forEach(function(d, i) {
    //             var output = tsvar.substring(0, tsvar.length - 2) + d;
    //             el.ts_ySelector.push(output);
    //         })
    //         el.ts_xName = "seasonal (autumn, winter, spring, summer)";
    //         el.ts_yName = tsvar.substring(0, tsvar.length - 3); // -3 to remove the underscore
    //     } else {
    //         el.ts_ySelector = [tsvar];
    //         el.ts_xName = "Annual (By Year)";
    //     }

    //     var query = "SELECT DISTINCT id2, year," + el.ts_ySelector.join(", ") + " FROM " + el.climateNormals_1901_2014 + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + el.timeRange_to;
    //     $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {

    //         data.rows.sort(function(a, b) {
    //             return parseFloat(a.year) - parseFloat(b.year);
    //         });

    //         var xdat1 = [],
    //             ydat1 = [],
    //             xdat2 = [],
    //             ydat2 = [];

    //         data.rows.forEach(function(d) {
    //             if (d.id2 == el.focal_name) {
    //                 el.ts_ySelector.forEach(function(j, i) {
    //                     ydat1.push(d[j]);

    //                     if (el.ts_ySelector.length == 1) {
    //                         xdat1.push(d.year);
    //                     } else if (el.ts_ySelector.length == 4) {
    //                         xdat1.push(d.year + "-0" + i * 3); // *3 to evenly space across seasons
    //                     } else {
    //                         xdat1.push(d.year + "-" + i);
    //                     }
    //                 });
    //             } else if (d.id2 == el.comparison_name) {
    //                 el.ts_ySelector.forEach(function(j, i) {
    //                     ydat2.push(d[j]);

    //                     if (el.ts_ySelector.length == 1) {
    //                         xdat2.push(d.year);
    //                     } else if (el.ts_ySelector.length == 4) {
    //                         xdat2.push(d.year + "-0" + i * 3); // *3 to evenly space across seasons
    //                     } else {
    //                         xdat2.push(d.year + "-" + i);
    //                     }
    //                 });
    //             }

    //         })

    //         var ts1 = {
    //             x: xdat1,
    //             y: ydat1,
    //             text: el.focal_name,
    //             type: "scatter",
    //             name: el.focal_name
    //         }

    //         var ts2 = {
    //             x: xdat2,
    //             y: ydat2,
    //             text: el.comparison_name,
    //             type: "scatter",
    //             name: el.comparison_name
    //         }

    //         var ts = [ts1, ts2];

    //         var layout = {
    //             yaxis: { title: el.ts_yName, type: 'linear' },
    //             height: 300,
    //             width: 500,
    //             margin: {
    //                 l: 60,
    //                 r: 40,
    //                 b: 60,
    //                 t: 10,
    //                 pad: 2
    //             },
    //             hovermode: 'closest'
    //         };

    //         Plotly.newPlot("timeseries-chart", ts, layout, { staticPlot: false, displayModeBar: false });

    //         var update = {
    //             width: 500, // or any new width
    //             height: 300
    //         };

    //         Plotly.relayout('timeseries-chart', update);
    //     });

    // }