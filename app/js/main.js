var app = app || {};

app.map = (function() {
    var el = {
        map: null
    };


    var initMap = function() {

        // map paramaters to pass to Leaflet
        var params = {
            center: [53.979608, -124.066386],
            zoom: 5,
            zoomControl: false
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
    }


    // get it all going!
    var init = function() {
        initMap();
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
    // app.domix.init();
    // app.drawings.init();
});
