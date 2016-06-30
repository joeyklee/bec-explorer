var app = app || {};

app.climatetimeseries = (function() {
    var el = null;

    var plotTimeSeries = function() {
        console.log("init timeseries");
        el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/

        var tsvar = $(".climate-variables-map option:selected").val();
        var msuffix = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        var ssuffix = ['at', 'wt', 'sp', 'sm'];

        // check if it is annual, seasonal, or monthly
        if (msuffix.indexOf(tsvar.slice(-2)) >= 1) {
            el.ts_ySelector = [];
            msuffix.forEach(function(d, i) {
                var output = tsvar.substring(0, tsvar.length - 2) + d;
                el.ts_ySelector.push(output);
            })
            el.ts_xName = "Monthly (Jan-Dec)";
            el.ts_yName = tsvar.substring(0, tsvar.length - 2);
        } else if (ssuffix.indexOf(tsvar.slice(-2)) >= 1) {
            el.ts_ySelector = [];
            ssuffix.forEach(function(d, i) {
                var output = tsvar.substring(0, tsvar.length - 2) + d;
                el.ts_ySelector.push(output);
            })
            el.ts_xName = "seasonal (autumn, winter, spring, summer)";
            el.ts_yName = tsvar.substring(0, tsvar.length - 3); // -3 to remove the underscore
        } else {
            el.ts_ySelector = [tsvar];
            el.ts_xName = "Annual (By Year)";
        }

        var query = "SELECT DISTINCT id2, year," + el.ts_ySelector.join(", ") + " FROM " + el.climateNormals_1901_2014 + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + el.timeRange_to;
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {

            data.rows.sort(function(a, b) {
                return parseFloat(a.year) - parseFloat(b.year);
            });

            var xdat1 = [],
                ydat1 = [],
                xdat2 = [],
                ydat2 = [];

            data.rows.forEach(function(d) {
                if (d.id2 == el.focal_name) {
                    el.ts_ySelector.forEach(function(j, i) {
                        ydat1.push(d[j]);

                        if (el.ts_ySelector.length == 1) {
                            xdat1.push(d.year);
                        } else if (el.ts_ySelector.length == 4) {
                            xdat1.push(d.year + "-0" + i * 3); // *3 to evenly space across seasons
                        } else {
                            xdat1.push(d.year + "-" + i);
                        }
                    });
                } else if (d.id2 == el.comparison_name) {
                    el.ts_ySelector.forEach(function(j, i) {
                        ydat2.push(d[j]);

                        if (el.ts_ySelector.length == 1) {
                            xdat2.push(d.year);
                        } else if (el.ts_ySelector.length == 4) {
                            xdat2.push(d.year + "-0" + i * 3); // *3 to evenly space across seasons
                        } else {
                            xdat2.push(d.year + "-" + i);
                        }
                    });
                }

            })

            var ts1 = {
                x: xdat1,
                y: ydat1,
                text: el.focal_name,
                type: "scatter",
                name: el.focal_name
            }

            var ts2 = {
                x: xdat2,
                y: ydat2,
                text: el.comparison_name,
                type: "scatter",
                name: el.comparison_name
            }

            var ts = [ts1, ts2];

            var layout = {
                yaxis: { title: el.ts_yName, type: 'linear' },
                width: 400,
                margin: {
                    l: 60,
                    r: 40,
                    b: 60,
                    t: 10,
                    pad: 2
                },
                hovermode: 'closest'
            };

            Plotly.newPlot("timeseries-chart", ts, layout, { staticPlot: false, displayModeBar: false });

            var update = {
                width: 400, // or any new width
            };

            Plotly.relayout('timeseries-chart', update);
        });

    }

    function plotTimeSeries2() {
        console.log("init timeseries");
        el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/

        var tsvar = $(".climate-variables-map option:selected").val();
        var query = "SELECT DISTINCT id2, year," + tsvar + " FROM " + el.climateNormals_1901_2014 + " WHERE id2 IS NOT NULL AND (id2 = '" + el.focal_name + "' OR id2 = '" + el.comparison_name + "') AND year >= " + el.timeRange_from + " AND year <= " + el.timeRange_to;
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {


            data.rows.sort(function(a, b) {
                return parseFloat(a.year) - parseFloat(b.year);
            });


            var xdat1 = [],
                ydat1 = [],
                xdat2 = [],
                ydat2 = [];

            data.rows.forEach(function(d) {

                if (d.id2 == el.focal_name) {
                        ydat1.push(d[tsvar]);
                        xdat1.push(d.year);
                    
                } else if (d.id2 == el.comparison_name) {
                        ydat2.push(d[tsvar]);
                        xdat2.push(d.year);
                }
            });

            var ts1 = {
                x: xdat1,
                y: ydat1,
                text: el.focal_name,
                type: "scatter",
                name: el.focal_name
            }

            var ts2 = {
                x: xdat2,
                y: ydat2,
                text: el.comparison_name,
                type: "scatter",
                name: el.comparison_name
            }

            var ts = [ts1, ts2];

            var layout = {
                yaxis: { title: el.ts_yName, type: 'linear' },
                width: 400,
                margin: {
                    l: 60,
                    r: 40,
                    b: 60,
                    t: 10,
                    pad: 2
                },
                hovermode: 'closest'
            };

            Plotly.newPlot("timeseries-chart", ts, layout, { staticPlot: false, displayModeBar: false });

            var update = {
                width: 400, // or any new width
            };

            Plotly.relayout('timeseries-chart', update);


        });

    }

    function replot() {
        $(".bec-focal-selector, .bec-comparison-selector, .climate-variables-map, .timerange-select").change(function(e) {
            // el.xData = 
            // plotTimeSeries();
            plotTimeSeries2()
        });
    }


    var init = function() {
        el = app.main.el;
        plotTimeSeries2();
        replot();
    };

    return {
        init: init
    }

})();
