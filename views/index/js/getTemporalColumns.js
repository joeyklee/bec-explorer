var app = app || {};

app.getTemporalColumns = (function() {
    var el = null;

    function getColumns() {
        var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
        sql.execute("SELECT * FROM " + el.dataset_selected + " WHERE cartodb_id = 1").done(function(data) {

            for (var k in data.features[0].properties) {
                // get all the columns
                el.column_names.push(k);
                // selectively choose
                if (k.endsWith('01') || k.endsWith('02') || k.endsWith('03') || k.endsWith('04') || k.endsWith('05') || k.endsWith('06') ||
                        k.endsWith('07') || k.endsWith('08') || k.endsWith('09') || k.endsWith('10') || k.endsWith('11') || k.endsWith('12' || k == "zone" ||k == "map_label")) {
                    el.monthly_columns.push(k);
                } else if (k.endsWith('_at') || k.endsWith('_sm') || k.endsWith('_sp') || k.endsWith('_wt' || k == "zone" ||k == "map_label")) {
                    el.seasonal_columns.push(k);
                } else {
                    el.annual_columns.push(k);
                }
            };

            $('.climate-variables select').children().remove().end();

            populate('.climate-variables select', el.column_names);

            // // call material select AFTER updating all the options to get the material style
            // // otherwise it wont work !! 
            $("select").material_select();

            setClimateSelected();
            setTimeSelected();
        });
    }

    function setClimateSelected() {
        el.climate_selected = $('.climate-variables-map :selected').text();
        console.log(el.climate_selected);
    }

    function setTimeSelected(){
    	$('.timescale-selector :selected').val('all');
    	console.log(el.timescale_selected);
    	$("select").material_select();
    }

    function populate(selector, objlist) {
        objlist.forEach(function(d, i) {
            if (i == 0) {
                $(selector)
                    .append('<option value="' + d + '" selected>' + d + '</option>')
            } else {
                $(selector)
                    .append('<option value="' + d + '">' + d + '</option>')
            }
        })
    }


    var init = function() {
        el = app.main.el;
        getColumns();
    }

    return {
        init: init
    }

})();
