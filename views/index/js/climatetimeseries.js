var app = app || {};

app.climatetimeseries = (function() {
    var el = null;

    var plotTimeSeries = function() {
        console.log("init timeseries");
        el.tschart_div = document.getElementById('timeseries-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/
        // el.xSelector = $(".scatter-x select option:selected").val();
        // el.ySelector = $(".scatter-y select option:selected").val();
        el.ts_xSelector = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        el.ts_ySelector = ['tmin01', 'tmin02', 'tmin03', 'tmin04', 'tmin05', 'tmin06', 'tmin07', 'tmin08', 'tmin09', 'tmin10', 'tmin11', 'tmin12']
            // console.log(xSelector, ySelector)

        var query = "SELECT DISTINCT map_label, " + 'tmin01,tmin02,tmin03,tmin04,tmin05,tmin06,tmin07,tmin08,tmin09,tmin10,tmin11,tmin12' + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL";
        // var query = "SELECT * FROM bgcv10beta_200m_wgs84_merge WHERE map_label IS NOT NULL";
        console.log(query);
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            // console.log(data);
            var ts = [];
            data.rows.forEach(function(d) {
                if (d.map_label == $(".bec-focal-selector select").val() || d.map_label == $(".bec-comparison-selector select").val()) {
                    var output = {
                        x: el.ts_xSelector,
                        y: [d.tmin01, d.tmin02, d.tmin03, d.tmin04, d.tmin05, d.tmin06, d.tmin07, d.tmin08, d.tmin09, d.tmin10, d.tmin11, d.tmin12],
                        text: d.map_label,
                        type: "scatter",
                        name: d.map_label
                    }
                    ts.push(output);
                } 
            })
            var layout = {
                xaxis: { title: 'months', type: 'linear' },
                yaxis: { title: 'temp', type: 'linear' },
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
        $(".bec-focal-selector, .bec-comparison-selector").change(function(e) {
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
