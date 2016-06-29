var app = app || {};

app.main = (function() {
    // store variables in el and expose them to other js files
    var el = {
        map: null,
        dataset_selected: 'bgcv10beta_200m_wgs84_merge_normal_1981_2010msy',
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
            color: "#00e6ac",
            weight: 2,
            opacity: 0.85,
            fillOpacity: 0.15
        },
        comparison_style: {
            color: "#6699ff",
            weight: 2,
            opacity: 0.85,
            fillOpacity: 0.15
        },
        xSelector: null,
        xSelector_axis: 'log',
        ySelector_axis: 'log',
        ySelector: null,
        column_names:[], // all columns
        monthly_columns:[], // monthly columns
        annual_columns: [], // annual columns
        seasonal_columns: [], // seasonal columns
        bec_names:[],
        focal_pin:null,
        comparison_pin:null,
        focal_poly: null,
        comparison_poly: null,
        ts_yName: null,
        ts_xName: null,
    };

    return {
        el: el
    };


})();

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    app.getTemporalColumns.init();
	app.mapcolors.init();
    app.mapapp.init();
    app.mapui.init();
    app.scatterplot.init();
    app.climatetimeseries.init();
    
});