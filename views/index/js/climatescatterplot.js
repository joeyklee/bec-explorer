var app = app || {};

app.scatterplot = (function(){

	var el= null;

	var plotScatter = function(){
		console.log("initscatter");
		el.chart_div = document.getElementById('scatter-chart'); // weird issue with jquery selector, use vanilla js - https://plot.ly/javascript/hover-events/
		el.xSelector = $(".scatter-x select option:selected").val();
		el.ySelector = $(".scatter-y select option:selected").val();
		// console.log(xSelector, ySelector)

		 var query = "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM bgcv10beta_200m_wgs84_merge WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";

		$.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
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
		        title: 'PLOTS PLOTS PLOTS'
		    };

		    var layout = {
		        xaxis: { title: el.xSelector, type: 'log' },
		        yaxis: { title: el.ySelector, type: 'log' },
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

		    var traces = [trace];
		    Plotly.newPlot("scatter-chart", traces, layout, { staticPlot: false, displayModeBar: false });

		    var update = {
			  width: 400,  // or any new width
			  // height: 500  // " "
			};

			Plotly.relayout('scatter-chart', update);
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
	            sql.execute("SELECT * FROM bgcv10beta_200m_wgs84 WHERE bgc_label LIKE '{{unit}}'", { unit: selected_label })
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
	        sql.execute("SELECT * FROM bgcv10beta_200m_wgs84 WHERE bgc_label LIKE '{{unit}}'", { unit: selected_label })
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
	    $(".scatter-x, .scatter-y").change(function(e) {
	    	// el.xData = 
	        plotScatter();
	    });
	}

	var init = function(){
		el = app.main.el;
		plotScatter();
		replot();
	}

	return {
		init:init
	}
})();