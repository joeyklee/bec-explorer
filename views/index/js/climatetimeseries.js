var app = app || {};

app.climatetimeseries = (function() {
    var el = null;

    var plotTimeSeries = function() {
        console.log("init timeseries");
        el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/
        // el.xSelector = $(".scatter-x select option:selected").val();
        if (el.ts_ySelector == null) {
            el.ts_ySelector = ['tmin01', 'tmin02', 'tmin03', 'tmin04', 'tmin05', 'tmin06', 'tmin07', 'tmin08', 'tmin09', 'tmin10', 'tmin11', 'tmin12'];
            el.ts_yName = "tmin";
        }

        var tsvar = $(".climate-variables-map option:selected").val();
        console.log(tsvar);
        var msuffix = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        var ssuffix = ['at', 'wt', 'sp', 'sm'];


        if (msuffix.indexOf(tsvar.slice(-2)) >= 1) {
            el.ts_ySelector = [];
            msuffix.forEach(function(d) {
                var output = tsvar.substring(0, tsvar.length - 2) + d;
                el.ts_ySelector.push(output);
            })
            el.ts_xSelector = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            el.ts_xName = "Monthly (Jan-Dec)";
            el.ts_yName = tsvar.substring(0, tsvar.length - 2);
        }

        if (ssuffix.indexOf(tsvar.slice(-2)) >= 1) {
            el.ts_ySelector = [];
            ssuffix.forEach(function(d) {
                var output = tsvar.substring(0, tsvar.length - 2) + d;
                el.ts_ySelector.push(output);
            })
            el.ts_xSelector = [1, 2, 3, 4];
            el.ts_xName = "seasonal (autumn, winter, spring, summer)";
            el.ts_yName = tsvar.substring(0, tsvar.length - 3); // -3 to remove the underscore
        }

        var query = "SELECT DISTINCT map_label, " + el.ts_ySelector.join(", ") + " FROM " + el.dataset_selected + " WHERE map_label IS NOT NULL";
        console.log(query);
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            // console.log(data);
            var ts = [];
            data.rows.forEach(function(d) {
                if (d.map_label == $(".bec-focal-selector select").val() || d.map_label == $(".bec-comparison-selector select").val()) {
                	var yvar = [];
                	el.ts_ySelector.forEach(function(j){
                		yvar.push(d[j]);
                	})
                    var output = {
                        x: el.ts_xSelector,
                        y: yvar,
                        text: d.map_label,
                        type: "scatter",
                        name: d.map_label
                    }
                    ts.push(output);
                } 
            })
            var layout = {
                xaxis: { title: el.ts_xName, type: 'linear' },
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
        $(".bec-focal-selector, .bec-comparison-selector, .climate-variables-map").change(function(e) {
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
