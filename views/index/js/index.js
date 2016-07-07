var app = app || {};

app.main = (function() {
    // store variables in el and expose them to other js files
    var el = {
        map: null,
        dataset_selected: 'bgcv10beta_200m_wgs84_merge_normal_1981_2010msy',
        climateNormals_1901_2014: 'bec10centroid_1901_2014msyt',
        username: "becexplorer",
        bec_cartocss:{
        	zone: null,
        	unit: null
        },
        data_layer: null,
        selected_unit: null,
        chart_div: null,
        tschart_div: null,
        timescale_selected: 'all',
        scatter_labels: null,
        hover_poly: null,
        climate_selected: null,
        hover_style: {
            color: "#ffffff",
            weight: 2,
            opacity: 0.85,
            fillOpacity: 0
        },
        focal_style: {
            color: "#d32f2f", // red darken-2
            weight: 2,
            opacity: 0.85,
            fillOpacity: 0.15
        },
        comparison_style: {
            color: "#303f9f", //indigo darken-2
            weight: 2,
            opacity: 0.85,
            fillOpacity: 0.15
        },
        xSelector: null,
        xSelector_axis: 'linear',
        ySelector_axis: 'linear',
        ySelector: null,
        annual_columns: [], // annual columns
        nonannual_columns: [], // seasonal columns
        bec_names:[],
        focal_pin:null,
        focal_name: 'ESSFdv2',
        comparison_name: 'ESSFdv2',
        comparison_pin:null,
        focal_poly: null,
        comparison_poly: null,
        ts_yName: null,
        ts_xName: null,
        timeRange_from: 1950, // initialize to 2011
        timeRange_to: 2013, // init to 2013

    };

    return {
        el: el
    };


})();

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    app.fillSelectorDropdowns.init();
	app.mapcolors.init();
    app.mapapp.init();
    app.sidebarix.init();
    app.mapui.init();
    app.climatetimeseries.init();
    app.scatterplot.init();
    
});