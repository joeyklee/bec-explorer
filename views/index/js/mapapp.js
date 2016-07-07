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
            // center: [50.536104, -120.947768],
            center: [53.706998, -131.601530],
            // zoom: 9,
            zoom: 6,
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

        var MapQuestOpen_Aerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
                type: 'sat',
                ext: 'jpg',
                attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
                subdomains: '1234'
            })
        // .addTo(el.map).bringToBack();

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

        // initialize dataset_selected:
        // el.dataset_selected = 'bgcv10beta_200m_wgs84_merge_normal_1981_2010msy';

        // initialize the timescale selected:
        el.timescale_selected = 'all';
    };


    var initCarto = function() {
        // console.log("hello");
        cartodb.createLayer(el.map, 'https://becexplorer.cartodb.com/api/v2/viz/f1dab0f4-29b3-11e6-9b74-0ef7f98ade21/viz.json')
            .addTo(el.map).done(function(layer) {
                // create an empty sublayer to add interactivity and color
                el.data_layer = layer.getSubLayer(0);
                // change the query for the first layer

                // if el.timeseries_selected is monthly, then give me back everything with 01-12 at the end

                var subLayerOptions = {
                    sql: "SELECT * FROM " + el.dataset_selected,
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

    function changeBaseMap(){
        $('.aerial-imagery-button').click(function(){
            console.log('aerialimagery');

            var MapQuestOpen_Aerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
                type: 'sat',
                ext: 'jpg',
                attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
                subdomains: '1234'
            })

            // el.map.remove(el.baselayer);
            el.baselayer = null;

            var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            })

            el.baselayer = Esri_WorldImagery;

            el.baselayer.addTo(el.map).setZIndex(1);

        })
    }



    var init = function() {
        el = app.main.el;
        initMap();
        initCarto();   
        changeBaseMap();   
    };

    return {
        init: init
    };


})();
