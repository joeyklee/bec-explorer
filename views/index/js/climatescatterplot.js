var app = app || {};

app.scatterplot = (function() {

    var el = null;

    var plotScatter = function() {
        console.log("initscatter");
        
        el.xSelector = $(".scatter-x select option:selected").val();
        el.ySelector = $(".scatter-y select option:selected").val();
        console.log(el.xSelector, el.ySelector);

        var query = "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";
        // var query = "SELECT DISTINCT * FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL";
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            console.log("the number of objects is:", data.rows.length);
            el.xData = data.rows.map(function(obj) {
                return obj[el.xSelector];
            });
            el.yData = data.rows.map(function(obj) {
                return obj[el.ySelector];
            });
            el.scatter_labels = data.rows.map(function(obj) {
                return obj.map_label;
            });
            var trace = {
                x: el.xData,
                y: el.yData,
                text: el.scatter_labels,
                mode: 'markers',
                type: 'scatter',
                title: 'PLOTS PLOTS PLOTS',
                 marker: { size: 12, color: 'rgba(49, 27, 146, 0.75)'}
            };

            var layout = {
                xaxis: { title: el.xSelector, type: el.xSelector_axis },
                yaxis: { title: el.ySelector, type: el.ySelector_axis },
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
                legend: { "orientation": "h" }
            };

            var traces = [trace];
            // Plotly.newPlot("scatter-chart", traces, layout, { staticPlot: false, displayModeBar: false });

            // var update = {
            //     width: 400, // or any new width
            //     // height: 500  // " "
            // };

            // Plotly.relayout('scatter-chart', update);
            var d3 = Plotly.d3;
            
            // var WIDTH_IN_PERCENT_OF_PARENT = 1,
            //     HEIGHT_IN_PERCENT_OF_PARENT = 10;
            d3.select("#scatter-child").remove();
            var gd3 = d3.select("#scatter-chart").append('div').attr('id', 'scatter-child')
                .style({
                    width: 550 + 'px',
                    'margin-left': 10 + 'px',
                    height: 400+ 'px'
                    // 'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
                });
            el.chart_div = document.getElementById('scatter-child'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/

            var scatter_chart = gd3.node();
            Plotly.plot(scatter_chart, traces, layout_responsive, { staticPlot: false, displayModeBar: false });
            // window.onresize = function() { Plotly.Plots.resize( Green_Line_E ); };
            window.addEventListener('resize', function() { Plotly.Plots.resize('scatter_chart'); });

            highlightUnit();
        });

    }

    function highlightUnit() {
        el.chart_div.on('plotly_hover', function(data) {
                // add geojson polygon for hovered poly

                el.hover_poly = L.geoJson(null, el.hover_style).addTo(el.map);
                var pointNumber = data.points[0].pointNumber;
                // console.log(el.scatter_labels[pointNumber]);
                var selected_label = el.scatter_labels[pointNumber];
                // set the selected unit as the selected label
                el.selected_unit = selected_label;
                // console.log(selected_label);
                var sql = new cartodb.SQL({ user: 'becexplorer', format: 'geojson' });
                sql.execute("SELECT cartodb_id, the_geom FROM " + el.dataset_selected + " WHERE map_label LIKE '{{unit}}'", { unit: selected_label })
                    .done(function(data) {
                        // console.log(data);
                        el.hover_poly.addData(data);
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
            var pointNumber = data.points[0].pointNumber;
            var selected_label = el.scatter_labels[pointNumber];
            sql.execute("SELECT cartodb_id, the_geom FROM  " + el.dataset_selected + " WHERE map_label LIKE '{{unit}}'", { unit: selected_label })
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
        $(".scatter-x, .scatter-y, .climate-variables-map, .timescale-selector").change(function(e) {
            // el.xData = 
            plotScatter();
        });
    }

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
            console.log("x switch toggled");
            if (el.xSelector_axis == 'log') {
                el.xSelector_axis = "linear";
            } else {
                el.xSelector_axis = "log";
            }
        });

        $('.scatter-y-axis input').change(function() {
            console.log("y switch toggled");
            // if y selector is log
            if (el.ySelector_axis == 'log') {
                el.ySelector_axis = "linear";
            } else {
                el.ySelector_axis = "log";
            }
        });
    }




    var init = function() {
        el = app.main.el;
        plotScatter();
        replot();
        initAxesSwitch();
        toggleLogLinearAxes();
    }

    return {
        init: init
    }
})();
