var app = app || {};

app.fillSelectorDropdowns = (function() {
    var el = null;

    function getColumns() {
        var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
        sql.execute("SELECT * FROM " + el.dataset_selected + " WHERE cartodb_id = 1").done(function(data) {

            sql.execute("SELECT * FROM variables_climatebc").done(function(variables_data) {
                // console.log("the number of variable names: ", variables_data.features);

                // var variableNames = [];    
                // variables_data.features.forEach(function(d){
                //     variables_data.push({"long_name": d.properties. , })
                // })

                variables_data.features.forEach(function(j){
                    el.column_names.push(j.properties);
                    if(j.properties.category == "Annual"){
                        el.annual_columns.push(j.properties);
                    } else if (j.properties.category == "Seasonal"){
                        el.seasonal_columns.push(j.properties);
                    } else if (j.properties.category == "Monthly"){
                        el.monthly_columns.push(j.properties);
                    } 

                })

                // console.log(el.annual_columns);

                // Object.keys(data.features[0].properties).forEach(function(d) {
                //     variables_data.features.forEach(function(j) {
                //         if (d != 'cartodb_id') {
                //             if(d == j.properties.code){

                //             }
                //         }
                //     })
                // })

                // for (var k in data.features[0].properties) {
                //     // get all the columns
                //     // console.log(k);
                //     if (k != "cartodb_id") {
                //         el.column_names.push(k);
                //     }
                //     // selectively choose
                //     if (k.endsWith('01') || k.endsWith('02') || k.endsWith('03') || k.endsWith('04') || k.endsWith('05') || k.endsWith('06') ||
                //         k.endsWith('07') || k.endsWith('08') || k.endsWith('09') || k.endsWith('10') || k.endsWith('11') || k.endsWith('12' || k == "zone" || k == "map_label")) {
                //         el.monthly_columns.push(k);
                //     } else if (k.endsWith('_at') || k.endsWith('_sm') || k.endsWith('_sp') || k.endsWith('_wt' || k == "zone" || k == "map_label")) {
                //         el.seasonal_columns.push(k);
                //     } else if (k != "cartodb_id") {
                //         el.annual_columns.push(k);
                //     }
                // };

                $('.climate-variables select').children().remove().end();

                populateClimate('.climate-variables select', el.column_names);

                // // // call material select AFTER updating all the options to get the material style
                // // // otherwise it wont work !! 
                $("select").material_select();

                setClimateSelected();
                setTimeSelected();
            });
        });
    }

    function setClimateSelected() {
        el.climate_selected = $('.climate-variables-map :selected').text();
        console.log("setClimateSelected is:", el.climate_selected);
        $("select").material_select();
    }

    function setTimeSelected() {
        $('.timescale-selector :selected').val('all');
        $("select").material_select();
    }


    function fillTimeRangeDropdown() {
        var timeRange = [];
        for (var i = 1901; i < 2101; i++) { timeRange.push(i) };
        $('.timerange-select select').children().remove().end();
        populate('.timerange-select select', timeRange);
        $("select").material_select();
    }

    function setTimeRangeSelected() {
        $('.timerange-select-from select').val(el.timeRange_from);
        $('.timerange-select-to select').val(el.timeRange_to);
        // update the dropdown
        $("select").material_select();

        $('.timerange-select').change(function() {
            el.timeRange_to = $('.timerange-select-to :selected').text();
            el.timeRange_from = $('.timerange-select-from :selected').text();
            $("select").material_select();
        });
    }

    function populateClimate(selector, objlist) {
        objlist.forEach(function(d, i) {
            if (i == 0) {
                $(selector)
                    .append('<option value="' + d.code.toLowerCase() + '" selected>' + d.variable + '</option>')
            } else {
                $(selector)
                    .append('<option value="' + d.code.toLowerCase() + '">' + d.variable + '</option>')
            }
        })
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



    function feedBecUnitSelector() {
        var query = "SELECT DISTINCT map_label FROM " + el.dataset_selected + " WHERE map_label IS NOT NULL";
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            data.rows.forEach(function(d) {
                el.bec_names.push(d.map_label);
            })
            $('.bec-unit-variables select').children().remove().end();
            populate('.bec-unit-variables select', el.bec_names);

            // console.log($('.bec-focal-selector :selected').text());
            el.focal_name = $('.bec-focal-selector :selected').text();
            el.comparison_name = $('.bec-comparison-selector :selected').text();
            // make sure that the material select is called to update the dropdown
            $("select").material_select();
        });

    }

    function updateTimeScaleSelected() {
        $('.timescale-selector select').change(function() {
            el.timescale_selected = $(this).val();
            console.log("timescale-selector changed!: ", el.timescale_selected);
            if (el.timescale_selected == "all") {
                $('.climate-variables select').children().remove().end();
                populateClimate('.climate-variables select', el.column_names);
            } else if (el.timescale_selected == "monthly") {
                $('.climate-variables select').children().remove().end();
                populateClimate('.climate-variables select', el.monthly_columns);
            } else if (el.timescale_selected == "seasonal") {
                $('.climate-variables select').children().remove().end();
                populateClimate('.climate-variables select', el.seasonal_columns);
            } else if (el.timescale_selected == "annual") {
                $('.climate-variables select').children().remove().end();
                populateClimate('.climate-variables select', el.annual_columns);
            }

            $('select').material_select();
        });
    }



    var init = function() {
        el = app.main.el;
        getColumns();
        fillTimeRangeDropdown();
        setTimeRangeSelected();
        feedBecUnitSelector();
        updateTimeScaleSelected();
        // setTimeSelected();

    }

    return {
        init: init
    }

})();
