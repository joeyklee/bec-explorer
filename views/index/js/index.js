var app = app || {};

app.main = (function() {
    // store variables in el and expose them to other js files
    var el = {
        map: null,
        bec_cartocss:{
        	zone: null,
        	unit: null
        },
        data_layer: null,
        selected_unit: null,
        chart_div: null,
        scatter_labels: null,
        hover_poly: null,
        hover_style: {
            color: "#ffffff",
            weight: 2,
            opacity: 0.85,
            fillOpacity: 0
        },
        xSelector: null,
        ySelector: null
    };

    return {
        el: el
    };


})();

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
	app.mapcolors.init();
    app.mapapp.init();
    app.mapui.init();
    app.scatterplot.init();
});