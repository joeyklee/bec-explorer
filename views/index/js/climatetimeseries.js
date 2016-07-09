var app = app || {};

app.climatetimeseries = (function() {
    var el = null;


    function plotTimeSeries2() {
        console.log("init timeseries");
        el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/
        var tsvar = getSelectedClimate('.climate-variables-chart option:selected', '.timescale-selector-timeseries select')

        function makeTimeSeriesDataObject(hoverText, lineColor, lineWidth, lineOpacity, legendName) {
            var output = {
                x: [],
                y: [],
                text: hoverText, // e.g. el.focal_name
                type: "scatter",
                line: {
                    color: lineColor, //'#d32f2f',
                    width: lineWidth, //3,
                    opacity: lineOpacity
                },
                name: hoverText + legendName // e.g el.focal_name
            }
            return output;
        }

        var tsObject = function() {
            this.climateNormals = null;
            this.access1_45 = null;
            this.access1_85 = null;
            this.canEsm2_45 = null;
            this.canEsm2_85 = null;
            this.ccsm4_45 = null;
            this.ccsm4_85 = null;
            this.cnrm_45 = null;
            this.cnrm_85 = null;
            this.csiro_45 = null;
            this.csiro_85 = null;
            this.inmcm4_45 = null;
            this.inmcm4_85 = null;
        }


        var focalSeries = new tsObject();
        var comparisonSeries = new tsObject();

        focalSeries.climateNormals = makeTimeSeriesDataObject(el.focal_name, '#d32f2f', 3, 1, '');
        focalSeries.access1_45 = makeTimeSeriesDataObject(el.focal_name, 'rgba(228, 129, 129, 0.5)', 1.5, 0.25, 'ACCESS 4.5');
        focalSeries.access1_85 = makeTimeSeriesDataObject(el.focal_name, 'rgb(126, 27, 27, 0.5)', 1.5, 0.25, 'ACCESS 8.5');
        focalSeries.canEsm2_45 = makeTimeSeriesDataObject(el.focal_name, 'rgba(228, 129, 129, 0.5)', 1.5, 0.25, ' canESM 4.5');
        focalSeries.canEsm2_85 = makeTimeSeriesDataObject(el.focal_name, 'rgb(126, 27, 27, 0.5)', 1.5, 0.25, ' canESM 8.5');
        focalSeries.ccsm4_45 = makeTimeSeriesDataObject(el.focal_name, 'rgba(228, 129, 129, 0.5)', 1.5, 0.25, ' ccsm 4.5');
        focalSeries.ccsm4_85 = makeTimeSeriesDataObject(el.focal_name, 'rgb(126, 27, 27, 0.5)', 1.5, 0.25, ' ccsm 8.5');
        focalSeries.cnrm_45 = makeTimeSeriesDataObject(el.focal_name, 'rgba(228, 129, 129, 0.5)', 1.5, 0.25, ' cnrm 4.5');
        focalSeries.cnrm_85 = makeTimeSeriesDataObject(el.focal_name, 'rgb(126, 27, 27, 0.5)', 1.5, 0.25, ' cnrm 8.5');
        focalSeries.csiro_45 = makeTimeSeriesDataObject(el.focal_name, 'rgba(228, 129, 129, 0.5)', 1.5, 0.25, ' Csiro 4.5');
        focalSeries.csiro_85 = makeTimeSeriesDataObject(el.focal_name, 'rgb(126, 27, 27, 0.5)', 1.5, 0.25, ' Csiro 8.5');
        focalSeries.inmcm4_45 = makeTimeSeriesDataObject(el.focal_name, 'rgba(228, 129, 129, 0.5)', 1.5, 0.25, ' Inm 4.5');
        focalSeries.inmcm4_85 = makeTimeSeriesDataObject(el.focal_name, 'rgb(126, 27, 27, 0.5)', 1.5, 0.25, ' Inm 8.5');

        comparisonSeries.climateNormals = makeTimeSeriesDataObject(el.comparison_name, '#303f9f', 3, 1, '');
        comparisonSeries.access1_45 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(98, 113, 208, 0.5)', 1.5, 0.25, ' ACCESS 4.5');
        comparisonSeries.access1_85 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(23, 31, 79, 0.5)', 1.5, 0.25, ' ACCESS 8.5');
        comparisonSeries.canEsm2_45 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(98, 113, 208, 0.5)', 1.5, 0.25, ' canESM 4.5');
        comparisonSeries.canEsm2_85 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(23, 31, 79, 0.5)', 1.5, 0.25, ' canESM 8.5');
        comparisonSeries.ccsm4_45 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(98, 113, 208, 0.5)', 1.5, 0.25, ' ccsm 4.5');
        comparisonSeries.ccsm4_85 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(23, 31, 79, 0.5)', 1.5, 0.25, ' ccsm 8.5');
        comparisonSeries.cnrm_45 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(98, 113, 208, 0.5)', 1.5, 0.25, ' cnrm 4.5');
        comparisonSeries.cnrm_85 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(23, 31, 79, 0.5)', 1.5, 0.25, ' cnrm 8.5');
        comparisonSeries.csiro_45 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(98, 113, 208, 0.5)', 1.5, 0.25, ' Csiro 4.5');
        comparisonSeries.csiro_85 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(23, 31, 79, 0.5)', 1.5, 0.25, ' Csiro 8.5');
        comparisonSeries.inmcm4_45 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(98, 113, 208, 0.5)', 1.5, 0.25, ' Inm 4.5');
        comparisonSeries.inmcm4_85 = makeTimeSeriesDataObject(el.comparison_name, 'rgb(23, 31, 79, 0.5)', 1.5, 0.25, ' Inm 8.5');



        var layout = {
            xaxis: { title: "year" },
            yaxis: { title: tsvar, type: 'linear' },
            width: 500,
            height: 300,
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
            height: 300
        };


        if (el.timeRange_to < 2014) {
            var query = "SELECT DISTINCT id2, year," + tsvar + " FROM " + el.climateNormals_1901_2014 + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + el.timeRange_to;
            $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
                climateNormals(data);
            });
        } else {
            var modelProjectionsData = {
                climateNormals: el.climateNormals_1901_2014,
                access1_45: 'bec10centroid_access1_0_rcp45_2011_2100msyt',
                access1_85: 'bec10centroid_access1_0_rcp85_2011_2100msyt',
                canEsm2_45: 'bec10centroid_canesm2_rcp45_2011_2100msyt',
                canEsm2_85: 'bec10centroid_canesm2_rcp85_2011_2100msyt',
                ccsm4_45: 'bec10centroid_ccsm4_rcp45_2011_2100msyt',
                ccsm4_85: 'bec10centroid_ccsm4_rcp85_2011_2100msyt',
                cnrm_45: 'bec10centroid_cnrm_cm5_rcp45_2011_2100msyt',
                cnrm_85: 'bec10centroid_cnrm_cm5_rcp85_2011_2100msyt',
                // csiro_45: 'bec10centroid_csiro_mk3_6_0_rcp45_2011_2100msyt',
                // csiro_85: 'bec10centroid_csiro_mk3_6_0_rcp85_2011_2100msyt',
                // inmcm4_45: 'bec10centroid_inm_cm4_rcp45_2011_2100msyt',
                // inmcm4_85: 'bec10centroid_inm_cm4_rcp85_2011_2100msyt',
            }

            Object.keys(modelProjectionsData).map(function(obj, i) {
                if (i == 0){
                    modelProjectionsData[obj] = "SELECT DISTINCT id2, year," + tsvar + " FROM " + modelProjectionsData[obj]+ " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + 2014;
                } else{
                    modelProjectionsData[obj] = "SELECT DISTINCT id2, year," + tsvar + " FROM " + modelProjectionsData[obj] + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year > " + 2014 + " AND year <= " + el.timeRange_to;    
                }
            });


            function getData(id) {
                // var thisI = d;
                var url = 'https://becexplorer.cartodb.com/api/v2/sql?q=' + id
                // console.log(url);
                return $.getJSON(url);  // this returns a "promise"
            }

            var AJAX = [];
            Object.keys(modelProjectionsData).forEach(function(d){
                AJAX.push(getData(modelProjectionsData[d]));
            });

            $.when.apply($, AJAX).done(function(){
                //  https://stackoverflow.com/questions/19916894/wait-for-multiple-getjson-calls-to-finish
                // This callback will be called with multiple arguments,
                // one for each AJAX call
                // Each argument is an array with the following structure: [data, statusText, jqXHR]

                // Let's map the arguments into an object, for ease of use
                var obj = [];
                for(var i = 0, len = arguments.length; i < len; i++){
                    obj.push(arguments[i][0]);
                }

                graphAllModels(obj);

            });
        }

       

        function sortByYear(arr){
            arr.rows.sort(function(a,b){
                return parseFloat(a.year) - parseFloat(b.year);    
            });
        }

        function sortByModelAndFocus(arr, id){
            if (arr.id2 == el.focal_name) {
                focalSeries[id].x.push(arr.year);
                focalSeries[id].y.push(arr[tsvar]);
            } else if (arr.id2 == el.comparison_name) {
                comparisonSeries[id].x.push(arr.year);
                comparisonSeries[id].y.push(arr[tsvar]);
            }
        }
        



        function graphAllModels(data){
            // loop through the data and prepare it
            
            data.forEach(function(dat, i){
                // sort by year
                sortByYear(dat);
                // then send the data to the appropriate focal or comparison unit and model
                dat.rows.forEach(function(d){
                    sortByModelAndFocus(d, Object.keys(modelProjectionsData)[i])
                });
            });

            var ts = [];
            Object.keys(focalSeries).forEach(function(d){
                ts.push(focalSeries[d]);
            })
            Object.keys(comparisonSeries).forEach(function(d){
                ts.push(comparisonSeries[d]);
            })

            console.log(ts);

            var d3 = Plotly.d3;
            d3.select("#ts-child").remove();
            var gd3 = d3.select("#timeseries-chart").append('div')
                .attr('id', 'ts-child')
                .style({
                    width: 600 + 'px',
                    'margin-left': 10 + 'px',
                    height: 400 + 'px'
                        // 'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
                });

            var ts_chart = gd3.node();
            Plotly.plot(ts_chart, ts, layout_responsive, { staticPlot: false, displayModeBar: false });
            // window.onresize = function() { Plotly.Plots.resize( Green_Line_E ); };
            window.addEventListener('resize', function() { Plotly.Plots.resize('ts_chart'); });
        }



        function climateNormals(data) {
            data.rows.sort(function(a, b) {
                return parseFloat(a.year) - parseFloat(b.year);
            });

            data.rows.forEach(function(d) {
                if (d.id2 == el.focal_name) {
                    focalSeries.climateNormals.x.push(d.year);
                    focalSeries.climateNormals.y.push(d[tsvar]);
                } else if (d.id2 == el.comparison_name) {
                    comparisonSeries.climateNormals.x.push(d.year);
                    comparisonSeries.climateNormals.y.push(d[tsvar]);
                }
            });

            var ts = [focalSeries.climateNormals, comparisonSeries.climateNormals];

            var d3 = Plotly.d3;

            d3.select("#ts-child").remove();
            var gd3 = d3.select("#timeseries-chart").append('div').attr('id', 'ts-child')
                .style({
                    width: 600 + 'px',
                    'margin-left': 10 + 'px',
                    height: 400 + 'px'
                        // 'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
                });

            var ts_chart = gd3.node();
            Plotly.plot(ts_chart, ts, layout_responsive, { staticPlot: false, displayModeBar: false });
            window.addEventListener('resize', function() { Plotly.Plots.resize('ts_chart'); });
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
                            width: 600 + 'px',
                            'margin-left': 10 + 'px',
                            height: 400 + 'px'
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

    function getSelectedClimate(climateSelector, timeaggSelector) {
        var climateSelected = $(climateSelector).val();
        var timeagg = $(timeaggSelector).val();

        var climate_selected = null;

        if (timeagg == 'annual') {
            climate_selected = climateSelected;
        } else if (['wt', 'at', 'sm', 'sp'].indexOf(timeagg) > -1 == true) {
            climate_selected = climateSelected + '_' + timeagg; // for seasonal variables
        } else {
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

        var query = 'SELECT * FROM bgcv10beta_200m_wgs84 WHERE ST_Intersects( ST_SetSRID(ST_Point(' + lng + ',' + lat + '),4326), bgcv10beta_200m_wgs84.the_geom)'
        var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
        sql.execute(query).done(function(data) {
            var selectedBec = data.features[0].properties.map_label;
            console.log("selectedBEC: ", selectedBec);
            var query_whichPoly = "SELECT * from bgcv10beta_200m_wgs84 WHERE map_label LIKE '" + selectedBec + "'";
            sql.execute(query_whichPoly).done(function(data_poly) {
                console.log("the data poly is: ", data_poly);
                polyobj.addData(data_poly);

                if (selectDropdown == "focal") {
                    console.log('focal');
                    updateSelectedFocalDropdown(data.features[0].properties.map_label);
                } else {
                    console.log('comparison');
                    updateSelectedComparisonDropdown(data.features[0].properties.map_label);
                }
                // plot the scatterplot()
                app.scatterplot.plotScatter();
            });
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



    function toggleTimeSeriesChartOptions() {
        $('.timeseries-options-expander').click(function() {
            $('.timeseries-options').toggleClass('active');
        });
    }

    function updatedFCDropdown() {
        $('.bec-unit-variables, .timescale-selector').change(function() {

            if ($(this).hasClass('bec-comparison-selector-scatter') || $(this).hasClass('bec-focal-selector-scatter')) {
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



// f_climateNormals = {
//     x: null,
//     y: null,
//     text: el.focal_name,
//     type: "scatter",
//     line: {
//         color: '#d32f2f',
//         width: 3,
//         opacity: 1
//     },
//     name: el.focal_name
// }

// f_access_45 = {
//     x: null,
//     y: null,
//     text: el.focal_name + " RCP 4.5",
//     type: "scatter",
//     line: {
//         color: 'rgba(228, 129, 129, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.focal_name + " ACCESS 1-0 RCP 4.5"
// }

// f_access_85 = {
//     x: null,
//     y: null,
//     text: el.focal_name + " RCP 8.5",
//     type: "scatter",
//     line: {
//         color: 'rgb(126, 27, 27, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.focal_name + " ACCESS 1-0 RCP 8.5"
// }

// f_canEsm_45 = {
//     x: null,
//     y: null,
//     text: el.focal_name + " RCP 4.5",
//     type: "scatter",
//     line: {
//         color: 'rgba(228, 129, 129, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.focal_name + " CanESM 2 RCP 4.5"
// }

// f_canEsm_85 = {
//     x: null,
//     y: null,
//     text: el.focal_name + " RCP 8.5",
//     type: "scatter",
//     line: {
//         color: 'rgb(126, 27, 27, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.focal_name + " CanESM 2 RCP 8.5"
// }

// f_canEsm_45 = {
//     x: null,
//     y: null,
//     text: el.focal_name + " RCP 4.5",
//     type: "scatter",
//     line: {
//         color: 'rgba(228, 129, 129, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.focal_name + " CanESM 2 RCP 4.5"
// }

// f_canEsm_85 = {
//     x: null,
//     y: null,
//     text: el.focal_name + " RCP 8.5",
//     type: "scatter",
//     line: {
//         color: 'rgb(126, 27, 27, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.focal_name + " CanESM 2 RCP 8.5"
// }
// c_climateNormals = {
//     x: null,
//     y: null,
//     text: el.comparison_name,
//     type: "scatter",
//     line: {
//         color: '#303f9f',
//         width: 3,
//         opacity: 1
//     },
//     name: el.comparison_name
// }

// c_canEsm_45 = {
//     x: null,
//     y: null,
//     text: el.comparison_name + " RCP 4.5",
//     type: "scatter",
//     line: {
//         color: 'rgb(98, 113, 208, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.comparison_name + " RCP 4.5"
// }



// ts2_85 = {
//     x: null,
//     y: null,
//     text: el.comparison_name + " RCP 8.5",
//     type: "scatter",
//     line: {
//         color: 'rgb(23, 31, 79, 0.5)',
//         width: 2,
//         opacity: 0.25
//     },
//     name: el.comparison_name + " RCP 8.5"
// }



            // var resultObject = {};

            // var promises = Object.keys(modelProjectionsData).map(function(d) {

            //         console.log('fetching data for', d)
            //         return $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + modelProjectionsData[d], function(data) {
            //             resultObject[d] = data;
            //             console.log('fetched data for ', d);
            //         });
            // });

            // $.when(promises).done(function(d){
            //     console.log('finished getting data result: ', d[1]);
            // })  

            // var sql = new cartodb.SQL({ user: 'becexplorer' });

            // var resultObject = {};
            // Object.keys(modelProjectionsData).forEach(function(d){
            //     sql.execute(modelProjectionsData[d]).done(function(data){
            //         resultObject[d] = data;
            //         console.log(resultObject[d]);
            //     }).error(function(errors) {
            //         // errors contains a list of errors
            //         console.log("errors:" + errors);
            //       })
            // });