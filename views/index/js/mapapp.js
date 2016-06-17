var app = app || {};

app.mapapp = (function() {
    // store variables in el and expose them to other js files
    var el = null;

    var initMap = function() {
        var Stamen_TonerLite,
            Stamen_TonerLines,
            Stamen_TonerLabels,
            params;
        // map paramaters to pass to Leaflet
        params = {
            center: [50.536104, -120.947768],
            zoom: 9,
            zoomControl: false,
            attributionControl: false
        };

        // Initialize the map
        el.map = new L.Map('mapid', params);

        Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        }).addTo(el.map);

        Stamen_TonerLines = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        }).addTo(el.map);
        Stamen_TonerLines.bringToFront();

        Stamen_TonerLabels = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        }).addTo(el.map);
        Stamen_TonerLabels.bringToFront();

        // set timeout to zoom out on whole map
        setTimeout(function() { el.map.setView([55.706998, -131.601530], 6) }, 3000);
    };


    var initCarto = function() {
        console.log("hello");
        // cartodb.createLayer(el.map, {
        //     user_name: el.username,
        //     type: 'cartodb',
        //     https: true,
        //     sublayers: [{
        //         sql: "SELECT * FROM bgcv10beta_200m_wgs84",
        //         cartocss: el.bec_cartocss.zone,
        //         interactivity: "cartodb_id, map_label"
        //     }]
        // }).addTo(el.map).done(function(layer) {
        //     el.data_layer = layer.getSubLayer(0);
        //     el.data_layer.setInteraction(true);

        //     layer.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
        //             el.selected_unit = data['map_label'];
        //             highlightSelectedUnit();
        //         }).on('featureOut', function(e, latlng, pos, data, layer) {
        //             // console.log("out");
        //         })
        //         // cartodb tooltip overlay template
        //     layer.leafletMap.viz.addOverlay({
        //         type: 'tooltip',
        //         layer: el.data_layer,
        //         // template: '<div class="cartodb-tooltip-content-wrapper"><br>\
        //         // <center><h5>{{map_label}}</h5></center><br></div>', 
        //         template: '<p>{{map_label}}</p>',
        //         position: 'top|left',
        //         fields: [{ name: 'map_label' }]
        //     });
        // }).error(function(err) {
        //     console.log("some error occurred: " + err);
        // });

        cartodb.createLayer(el.map, 'https://becexplorer.cartodb.com/api/v2/viz/f1dab0f4-29b3-11e6-9b74-0ef7f98ade21/viz.json')
        .addTo(el.map).done(function(layer) {
            console.log(layer);
            el.data_layer = layer.getSubLayer(0);
            el.data_layer.setInteraction(true);

            layer.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
                    el.selected_unit = data['map_label'];
                    highlightSelectedUnit();
                }).on('featureOut', function(e, latlng, pos, data, layer) {
                    // console.log("out");
                })
                // cartodb tooltip overlay template
            layer.leafletMap.viz.addOverlay({
                type: 'tooltip',
                layer: el.data_layer,
                // template: '<div class="cartodb-tooltip-content-wrapper"><br>\
                // <center><h5>{{map_label}}</h5></center><br></div>', 
                template: '<p>{{map_label}}</p>',
                position: 'top|left',
                fields: [{ name: 'map_label' }]
            });
        }).error(function(err) {
            console.log("some error occurred: " + err);
        });

        
    };

    var highlightSelectedUnit = function() {
        console.log(el.selected_unit);
    };

    var changeMapDisplay = function() {
        $('.map-display-buttons').click(function() {
            var sel = $(this).text().toUpperCase()
            if (sel == "CLIMATE") {
                console.log("climate button clicked");
            } else if (sel == "BEC UNITS") {
                el.data_layer.setCartoCSS(el.bec_cartocss.unit);
            } else if (sel == "ZONES") {
                el.data_layer.setCartoCSS(el.bec_cartocss.zone);
            };
        });
    };




    var init = function() {
        el = app.main.el;
        initMap();
        initCarto();
        changeMapDisplay();
    };

    return {
        init: init
    };


})();
