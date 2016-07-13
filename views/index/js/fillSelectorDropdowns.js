var app = app || {};

app.fillSelectorDropdowns = (function() {
    var el = null;


    function sortClimateVariables(){
        var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
        sql.execute("SELECT * FROM variables_climatebc_revised").done(function(variables_data_revised) {
            // sort the columns into annual and nonannual
            variables_data_revised.features.forEach(function(d){
                if(d.properties.time_scalable == 'No'){
                    el.annual_columns.push(d.properties);
                } else if (d.properties.time_scalable == 'Yes'){
                    el.nonannual_columns.push(d.properties);
                }
            });

            // populate the climate variable with the annual variable first
            populateClimateVariable('.climate-variables select', el.annual_columns);
            setScatterY();
        });
    }

    function fillTimeAggregationDropdown(){
        var timeAggregateValues = ['annual', 'wt', 'sp', 'sm', 'at', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        var timeAggregateText = ['Annual', 'Winter', 'Spring', 'Summer', 'Fall', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', "November", "December"];
        var timeAggregateOptions = [];

        timeAggregateValues.forEach(function(d,i){
            var timeAggregateModel = {
                value: timeAggregateValues[i],
                text: timeAggregateText[i]
            }
            timeAggregateOptions.push(timeAggregateModel);
        });

        // populate the time aggregates        
        populateTimeAggregates('.timescale-selector select', timeAggregateOptions);
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

    function setScatterY() {
        $('.scatter-y select').val('map');
        // $('.scatter-y select').text('MAP (Annual precipitation (mm)) ');
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

    

    function populateClimateVariable(selector, objlist) {
        $(selector).children().remove().end();

        objlist.forEach(function(d, i) {
            if (i == 0) {
                $(selector)
                    .append('<option value="' + d.element.toLowerCase() + '" selected>' + d.element + ' (' + d.element_name + ') ' + '</option>');
            } else {
                $(selector)
                    .append('<option value="' + d.element.toLowerCase() + '">' + d.element + ' (' +  d.element_name + ') ' + '</option>');
            }
        });
        $("select").material_select();
    }


    function populateTimeAggregates(selector, objlist) {
        $(selector).children().remove().end();

        objlist.forEach(function(d, i) {
            if (i == 0) {
                $(selector)
                    .append('<option value="' + d.value.toLowerCase() + '" selected>' + d.text + '</option>')
            } else {
                $(selector)
                    .append('<option value="' + d.value.toLowerCase() + '">' + d.text + '</option>')
            }
        })
        $("select").material_select();
    }

    function populate(selector, objlist) {
        $(selector).children().remove().end();

        objlist.forEach(function(d, i) {
            if (i == 0) {
                $(selector)
                    .append('<option value="' + d + '" selected>' + d + '</option>')
            } else {
                $(selector)
                    .append('<option value="' + d + '">' + d + '</option>')
            }
        })
        // make sure that the material select is called to update the dropdown
        $("select").material_select();
    }

    function feedBecUnitSelector() {
        var query = "SELECT DISTINCT map_label FROM " + el.dataset_selected + " WHERE map_label IS NOT NULL";
        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            // data.rows.sort(function(a, b){
            //     return a.map_label - b.map_label;
            // });

            data.rows.forEach(function(d) {
                el.bec_names.push(d.map_label);
            })
            el.bec_names.sort();
            
            populate('.bec-unit-variables select', el.bec_names);

            // set the bec focal and comparison selector to the first one that is found
            el.focal_name = $('.bec-focal-selector :selected:first').text();
            el.comparison_name = $('.bec-comparison-selector :selected:first').text();
            console.log(el.focal_name, el.comparison_name);
        });

    }

    

    function updateTimeScaleSelected3(){
        $('.timescale-selector-map select, .timescale-selector-timeseries select').change(function() {
            el.timescale_selected = $(this).val();
             var climateSelected = $('.climate-variables select').val();

             // el.climate_selected
             if (el.timescale_selected == 'annual'){
                 el.climate_selected = climateSelected;
                 populateClimateVariable('.climate-variables select', el.annual_columns);
             } else if ( ['wt','at','sm','sp'].indexOf(el.timescale_selected) > -1 == true) {
                 el.climate_selected = climateSelected + '_' + el.timescale_selected; // for seasonal variables
                 populateClimateVariable('.climate-variables select', el.nonannual_columns);
             } else{
                 el.climate_selected = climateSelected + el.timescale_selected; // for jan - dec
                 populateClimateVariable('.climate-variables select', el.nonannual_columns);
             }

             console.log("***the climate selected is: ", el.climate_selected);

        });
    }

    function updateTimeScaleSelectedScatter(){
        var scatter_climate_selected;
        var scatter_timescale_selected;

        $('.timescale-selector-scatterx select').change(function() {
            scatter_timescale_selected = $(this).val();
             var climateSelected = $('.scatter-x select').val();
             console.log(scatter_timescale_selected);
             // el.climate_selected
             if (scatter_timescale_selected == 'annual'){
                 scatter_climate_selected = climateSelected;
                 populateClimateVariable('.scatter-x select', el.annual_columns);
             } else if ( ['wt','at','sm','sp'].indexOf(el.timescale_selected) > -1 == true) {
                 scatter_climate_selected = climateSelected + '_' + el.timescale_selected; // for seasonal variables
                 populateClimateVariable('.scatter-x select', el.nonannual_columns);
             } else{
                 scatter_climate_selected = climateSelected + el.timescale_selected; // for jan - dec
                 populateClimateVariable('.scatter-x select', el.nonannual_columns);
             }

        });

        $('.timescale-selector-scattery select').change(function() {
            scatter_timescale_selected = $(this).val();
            var climateSelected = $('.scatter-y select').val();

             // el.climate_selected
             if (scatter_timescale_selected == 'annual'){
                 scatter_climate_selected = climateSelected;
                 populateClimateVariable('.scatter-y select', el.annual_columns);
             } else if ( ['wt','at','sm','sp'].indexOf(el.timescale_selected) > -1 == true) {
                 scatter_climate_selected = climateSelected + '_' + el.timescale_selected; // for seasonal variables
                 populateClimateVariable('.scatter-y select', el.nonannual_columns);
             } else{
                 scatter_climate_selected = climateSelected + el.timescale_selected; // for jan - dec
                 populateClimateVariable('.scatter-y select', el.nonannual_columns);
             }
        });
    }

    function updateFocalAndComparisonVals(){
        $(".bec-comparison-selector-scatter, .bec-comparison-selector-timeseries").change(function(){
            el.focal_name = $('select', this).val();
        })

        $(".bec-focal-selector-scatter, .bec-focal-selector-timeseries").change(function(){
            el.comparison_name = $('select', this).val();
        })
    }



    var init = function() {
        el = app.main.el;
        // getColumns();
        sortClimateVariables(); // sort the columns between annual and nonannual
        fillTimeRangeDropdown();
        setTimeRangeSelected();
        feedBecUnitSelector();
        // updateTimeScaleSelected();
        updateTimeScaleSelected3();
        updateFocalAndComparisonVals();
        // new climate variables fill:
        fillTimeAggregationDropdown();
        updateTimeScaleSelectedScatter();
        
         // fillClimateVariableDropdown();
        // setTimeSelected();
        // getSelectedClimateVariable(); // set the global variable for selected climate

    }

    return {
        init: init
    }

})();





// function getColumns() {
    //     var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
    //     sql.execute("SELECT * FROM " + el.dataset_selected + " WHERE cartodb_id = 1").done(function(data) {

    //         sql.execute("SELECT * FROM variables_climatebc").done(function(variables_data) {
    //             // console.log("the number of variable names: ", variables_data.features);

    //             // var variableNames = [];    
    //             // variables_data.features.forEach(function(d){
    //             //     variables_data.push({"long_name": d.properties. , })
    //             // })

    //             variables_data.features.forEach(function(j){
    //                 el.column_names.push(j.properties);
    //                 if(j.properties.category == "Annual"){
    //                     el.annual_columns.push(j.properties);
    //                 } else if (j.properties.category == "Seasonal"){
    //                     el.seasonal_columns.push(j.properties);
    //                 } else if (j.properties.category == "Monthly"){
    //                     el.monthly_columns.push(j.properties);
    //                 } 

    //             })

    //             // console.log(el.annual_columns);

    //             // Object.keys(data.features[0].properties).forEach(function(d) {
    //             //     variables_data.features.forEach(function(j) {
    //             //         if (d != 'cartodb_id') {
    //             //             if(d == j.properties.code){

    //             //             }
    //             //         }
    //             //     })
    //             // })

    //             // for (var k in data.features[0].properties) {
    //             //     // get all the columns
    //             //     // console.log(k);
    //             //     if (k != "cartodb_id") {
    //             //         el.column_names.push(k);
    //             //     }
    //             //     // selectively choose
    //             //     if (k.endsWith('01') || k.endsWith('02') || k.endsWith('03') || k.endsWith('04') || k.endsWith('05') || k.endsWith('06') ||
    //             //         k.endsWith('07') || k.endsWith('08') || k.endsWith('09') || k.endsWith('10') || k.endsWith('11') || k.endsWith('12' || k == "zone" || k == "map_label")) {
    //             //         el.monthly_columns.push(k);
    //             //     } else if (k.endsWith('_at') || k.endsWith('_sm') || k.endsWith('_sp') || k.endsWith('_wt' || k == "zone" || k == "map_label")) {
    //             //         el.seasonal_columns.push(k);
    //             //     } else if (k != "cartodb_id") {
    //             //         el.annual_columns.push(k);
    //             //     }
    //             // };

    //             $('.climate-variables select').children().remove().end();

    //             populateClimate('.climate-variables select', el.column_names);

    //             // // // call material select AFTER updating all the options to get the material style
    //             // // // otherwise it wont work !! 
    //             $("select").material_select();

    //             setClimateSelected();
    //             setTimeSelected();
    //         });
    //     });
    // }

    // function fillClimateVariableDropdown(){
    //     var sql = new cartodb.SQL({ user: el.username, format: "geojson" });
    //     sql.execute("SELECT * FROM variables_climatebc_revised").done(function(variables_data_revised) {
    //         var climateVariablesDropdown = [];
    //         variables_data_revised.features.forEach(function(d){
    //             climateVariablesDropdown.push(d.properties);
    //         })

    //         $('.climate-variables select').children().remove().end();
    //         populateClimateVariable('.climate-variables select', climateVariablesDropdown);
    //         $("select").material_select();

    //     });
    // }


    // function updateTimeScaleSelected() {
    //     $('.timescale-selector select').change(function() {
    //         el.timescale_selected = $(this).val();
    //         console.log("timescale-selector changed!: ", el.timescale_selected);
    //         if (el.timescale_selected == "all") {
    //             $('.climate-variables select').children().remove().end();
    //             populateClimate('.climate-variables select', el.column_names);
    //         } else if (el.timescale_selected == "monthly") {
    //             $('.climate-variables select').children().remove().end();
    //             populateClimate('.climate-variables select', el.monthly_columns);
    //         } else if (el.timescale_selected == "seasonal") {
    //             $('.climate-variables select').children().remove().end();
    //             populateClimate('.climate-variables select', el.seasonal_columns);
    //         } else if (el.timescale_selected == "annual") {
    //             $('.climate-variables select').children().remove().end();
    //             populateClimate('.climate-variables select', el.annual_columns);
    //         }

    //         $('select').material_select();
    //     });
    // }

    // function updateTimeScaleSelected2(){
    //     $('.timescale-selector select').change(function() {
    //         var timeagg = $(this).val();
    //         var climateSelected = $('.climate-variables select').val();
    //         // el.climate_selected
    //         if (timeagg == 'annual'){
    //             if(climateSelected == "tave"){
    //                 el.climate_selected = 'mat'
    //             } else{
    //                 el.climate_selected = climateSelected;
    //             }
    //         } else if ( ['wt','at','sm','sp'].indexOf(timeagg) > -1 == true) {
    //             el.climate_selected = climateSelected + '_' + timeagg; // for seasonal variables
    //         } else{
    //             el.climate_selected = climateSelected + timeagg; // for jan - dec
    //         }

    //         console.log("***the climate selected is: ", el.climate_selected);
    //     });
    // }


    // function populateClimate(selector, objlist) {
    //     objlist.forEach(function(d, i) {
    //         if (i == 0) {
    //             $(selector)
    //                 .append('<option value="' + d.code.toLowerCase() + '" selected>' + d.variable + '</option>')
    //         } else {
    //             $(selector)
    //                 .append('<option value="' + d.code.toLowerCase() + '">' + d.variable + '</option>')
    //         }
    //     })
    // }