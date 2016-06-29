var app = app || {};

app.climatetimeseries = (function() {
    var el = null;

    var plotTimeSeries = function() {
        console.log("init timeseries");
        el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/
        // el.xSelector = $(".scatter-x select option:selected").val();
        // if (el.ts_ySelector == null) {
        //     el.ts_ySelector = ['tmin01', 'tmin02', 'tmin03', 'tmin04', 'tmin05', 'tmin06', 'tmin07', 'tmin08', 'tmin09', 'tmin10', 'tmin11', 'tmin12'];
        //     el.ts_yName = "tmin";
        // }

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
        console.log(query);
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            console.log(data);
            var ts = [];

            // el.ts_xSelector = [];
            // el.ts_ySelector = [];
            // console.log(el.ts_ySelector);

            data.rows.forEach(function(d) {
                var ydat = [];
                var xdat = [];
                Object.keys(d).forEach(function(j) {
                    if (j !== "id2" && j !== "year") {
                        console.log(d[j]);
                        ydat.push(d[j]);

                        if (msuffix.indexOf(tsvar.slice(-2)) >= 1) {
                            xdat.push(d.year + "-" + j.slice(-2));
                        } else if (ssuffix.indexOf(tsvar.slice(-2)) >= 1) {
                            ssuffix.forEach(function(k,i){
                                xdat.push(d.year + "-0" + i+1);
                            });
                        } else{
                            xdat.push(d.year);
                        }
                    }
                });

                var output = {
                    x: xdat,
                    y: ydat,
                    text: d.id2,
                    type: "scatter",
                    name: d.id2
                }

                ts.push(output);
            });
            console.log(ts);
            
            var layout = {
                // xaxis: { title: el.ts_xName, type: 'linear' },
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

            // var ydat = [];
            // var xdat = [];
            // var clabel = []
            // data.rows.forEach(function(d){

            //     Object.keys(d).forEach(function(j){

            //         if(j !== "id2" && j !== "year"){
            //            console.log(d[j]);
            //            ydat.push(d[j]);
            //            xdat.push(d.year + "-" + j.slice(-2));
            //         }
            //     });


            // })
            // console.log(ydat);
            // console.log(xdat);

            // var output = {
            //     x: xdat;
            //     y: ydat;
            //     text:
            // }

            // data.rows.forEach(function(d) {
            //     if (d.map_label == $(".bec-focal-selector select").val() || d.map_label == $(".bec-comparison-selector select").val()) {
            //      var yvar = [];
            //      el.ts_ySelector.forEach(function(j){
            //          yvar.push(d[j]);
            //      })
            //         var output = {
            //             x: el.ts_xSelector,
            //             y: yvar,
            //             text: d.map_label,
            //             type: "scatter",
            //             name: d.map_label
            //         }
            //         ts.push(output);
            //     } 
            // })
            // var layout = {
            //     xaxis: { title: el.ts_xName, type: 'linear' },
            //     yaxis: { title: el.ts_yName, type: 'linear' },
            //     width: 400,
            //     margin: {
            //         l: 60,
            //         r: 40,
            //         b: 60,
            //         t: 10,
            //         pad: 2
            //     },
            //     hovermode: 'closest'
            // };

            // Plotly.newPlot("timeseries-chart", ts, layout, { staticPlot: false, displayModeBar: false });

            // var update = {
            //     width: 400, // or any new width
            // };

            // Plotly.relayout('timeseries-chart', update);
        });

    }

    function replot() {
        $(".bec-focal-selector, .bec-comparison-selector, .climate-variables-map, .timerange-select").change(function(e) {
            // el.xData = 
            plotTimeSeries();
        });
    }


    var init = function() {
        el = app.main.el;
        plotTimeSeries();
        replot();
    };

    return {
        init: init
    }

})();
