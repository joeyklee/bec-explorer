var app = app || {};

app.map = (function() {
    var el = {
        map: null,
        data_layer: null,
        xdata: null,
        ydata: null,
        scatter_labels: null,
        chart_div: null,
    };



    var initMap = function() {

        // map paramaters to pass to Leaflet
        var params = {
            center: [53.979608, -124.066386],
            zoom: 5,
            zoomControl: false,
            attributionControl: false
        };

        // Initialize the map
        el.map = new L.Map('cartodb-map', params);

        // L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
        //     attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
        // }).addTo(el.map);
        // console.log(el);
        //  set the map tiles
        var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        }).addTo(el.map);

        // add cartodb data
        cartodb.createLayer(el.map, {
                user_name: 'becexplorer',
                type: 'cartodb',
                sublayers: [{
                    sql: "SELECT * FROM bgcv10beta_200m_wgs84",
                    cartocss: '#bgcv10beta_200m_wgs84 { polygon-fill: #5EB840; polygon-opacity: 0.5; line-color: #B85E40; line-width: 0.5; line-opacity: 0.5;}',
                    interactivity: "cartodb_id, area"
                }]
            })
            .addTo(el.map)
            .done(function(layer) {
                el.data_layer = layer.getSubLayer(0);

                layer.getSubLayer(0).setInteraction(true);
                layer
                    .on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
                        var cartodb_id = data["cartodb_id"];
                        var area = data["area"];
                        pointSelected(cartodb_id, area);
                    })
                    .on('error', function(err) {
                        console.log('error: ' + err);
                    });
            })
            .error(function(err) {
                console.log("some error occurred: " + err);
            });
    }

    // log the point selected
    function pointSelected(cartodb_id, area) {
        console.log(cartodb_id, area);
    }

    // filter by property
    function filterByProperty() {
        var filterProperty = $("#filter_property").val();
        var lowerLimit = $("#lower_limit").val();
        var upperLimit = $("#upper_limit").val();

        var query = "SELECT * FROM bgcv10beta_200m_wgs84_merge " + generateQueryFilter(filterProperty, lowerLimit, upperLimit);
        console.log(query);
        el.data_layer.setSQL(query);
    }

    // generate query Filter
    function generateQueryFilter(filterProperty, lowerLimit, upperLimit) {
        var lowerFilter;
        if (!lowerLimit) { lowerFilter = ''; } else { lowerFilter = filterProperty + " > " + lowerLimit; }
        var upperFilter;
        if (!upperLimit) { upperFilter = ''; } else { upperFilter = filterProperty + " < " + upperLimit; }

        var filterRequired;
        if (lowerLimit || upperLimit) { filterRequired = "WHERE "; } else { filterRequired = ''; }
        var doubleFilter;
        if (lowerLimit && upperLimit) { doubleFilter = " AND "; } else { doubleFilter = ''; }

        var queryFilter = filterRequired + lowerFilter + doubleFilter + upperFilter;
        return queryFilter;
    }

    // plot the data on a scatterplot
    function plotData() {
        el.chart_div = $("#chart");
        var xSelector = $("#x_data").val();
        var ySelector = $("#y_data").val();
        // var xSelector = "elevation";
        // var ySelector = "elevation";


        var query = "SELECT DISTINCT bgc_label, " + xSelector + ", + " + ySelector + " FROM bgcv10beta_200m_wgs84_merge WHERE bgc_label IS NOT NULL AND " + xSelector + " IS NOT NULL AND " + ySelector + " IS NOT NULL";


        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            el.xData = data.rows.map(function(obj) {
                return obj[xSelector];
            });
            el.yData = data.rows.map(function(obj) {
                return obj[ySelector];
            });
            el.scatter_labels = data.rows.map(function(obj) {
                return obj.bgc_label;
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
                xaxis: { title: xSelector },
                yaxis: { title: ySelector },
                width: 100,
                margin: {
                    l : 40,
                    r: 20,
                    b: 40,
                    t: 10,
                    pad: 2
                },
                hovermode: 'closest'

            };

            var traces = [trace];
            Plotly.newPlot("chart", traces, layout, {staticPlot:false, displayModeBar: false});

            el.chart_div.on('plotly_hover', function(data) {
                    var pointNumber = data.points[0].pointNumber;
                    console.log(el.scatter_labels[pointNumber]);
                })
                .on('plotly_unhover', function(data) {
                    // console.log("Unhovering");
                });
        });
    }

    function applyFilter() {
        $("#apply_filter").click(function(e) {
        	console.log("applyFilter");
            filterByProperty();
        });
    }

    function replot(){
    	$("#replot").click(function(e) {
		  plotData();
		});
    }

    // get it all going!
    var init = function() {
        initMap();
        plotData();
        replot();
        applyFilter();

    }


    // only return init() and the stuff in the el object
    return {
        init: init,
        el: el
    }


})();

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    app.map.init();
    app.pages.init();
    app.mapix.init();
});
