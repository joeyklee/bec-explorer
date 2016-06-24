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
        // setTimeout(function() { el.map.setView([55.706998, -131.601530], 6) }, 3000);

        // set geojson layers:
        el.focal_poly = L.geoJson(null, el.focal_style).addTo(el.map)
        el.comparison_poly = L.geoJson(null, el.comparison_style).addTo(el.map)
    };


    var initCarto = function() {
        console.log("hello");
        cartodb.createLayer(el.map, 'https://becexplorer.cartodb.com/api/v2/viz/f1dab0f4-29b3-11e6-9b74-0ef7f98ade21/viz.json')
            .addTo(el.map).done(function(layer) {
                // create an empty sublayer to add interactivity and color
                el.data_layer = layer.getSubLayer(0);
                // change the query for the first layer
                var subLayerOptions = {
                    sql: "SELECT * FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy",
                    cartocss: el.bec_cartocss.zone,
                    interactivity: "cartodb_id, map_label",
                    infowindow: true
                }

                el.data_layer.set(subLayerOptions)
                    .setInteraction(true);

                // el.map.on('click', function(e) {        
                //         var popLocation= e.latlng;
                //         var popup = L.popup()
                //         .setLatLng(popLocation)
                //         .setContent('<div class="my-info-window"></div>\
                //             <div><button>Focal</button><button>Comparison</button></div>')
                //         .openOn(el.map);        
                //     });
                // // when you create a visualization from scratch you need to 
                // // use cdb.vis.Vis.addInfowindow to set the params
                // // if you use viz.json the infowindow params are inside it
                // cdb.vis.Vis.addInfowindow(el.map, el.data_layer, ['cartodb_id','map_label'], {
                //   // we provide a nice default template, if you want yours uncomment this
                //   infowindowTemplate: $('#infowindow_template').html()
                // });

                // create the tooltip
                // el.data_layer.on('featureClick', function(e, latlng, pos, data, subLayerIndex) {
                //     el.selected_unit = data['map_label'];
                //     $('.my-info-window').text(el.selected_unit);
                // })

                el.data_layer.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
                    el.selected_unit = data['map_label'];
                    highlightSelectedUnit();

                }).on('featureOut', function(e, latlng, pos, data, layer) {
                    // console.log("out");
                });

                // cartodb tooltip overlay template
                layer.leafletMap.viz.addOverlay({
                    type: 'tooltip',
                    layer: el.data_layer,
                    template: '<p>{{map_label}}</p>',
                    position: 'top|left',
                    fields: [{ name: 'map_label' }]
                });
            }).error(function(err) {
                console.log("some error occurred: " + err);
            });
    };

    var highlightSelectedUnit = function() {
        // console.log(el.selected_unit);
    };

    var changeMapDisplay = function() {
        $('.map-display-buttons').click(function() {
            var sel = $(this).text().toUpperCase()
            if (sel == "CLIMATE") {
                console.log("climate button clicked");
                el.data_layer.setCartoCSS(el.bec_cartocss[el.selected_unit]);
            } else if (sel == "BEC UNITS") {
                el.data_layer.setCartoCSS(el.bec_cartocss.unit);
            } else if (sel == "ZONES") {
                el.data_layer.setCartoCSS(el.bec_cartocss.zone);
            };
        });
    };


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
        
        var query = 'SELECT * from bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE ST_Intersects( ST_SetSRID(ST_Point(' + lng + ',' + lat + '),4326), bgcv10beta_200m_wgs84.the_geom)'


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
        $(".bec-focal-selector select").val(selectedUnit);
        $('select').material_select();
    }

    function updateSelectedComparisonDropdown(selectedUnit) {
        console.log(selectedUnit);
        $(".bec-comparison-selector select").val(selectedUnit);
        $('select').material_select();
    }




    var init = function() {
        el = app.main.el;
        initMap();
        initCarto();
        changeMapDisplay();
        addFocalPin();
        addComparisonPin();
        clearComparisonPins();
        // updateClimateMap();
      
    };

    return {
        init: init
    };


})();
