var app = app || {};

app.sidebarix = (function(){
	var el = null;

	// if the expander is clicked, open the sidebar
	function initExpander() {
	    $('.sidebar-expander').click(function() {
	        $('.sidebar').toggleClass('active');
	        $('.sidebar-expander').toggleClass('active');
	    });
	};

	// show the selected feature in the sidebar if clicked
	function activateSidebarDisplayOptions() {
	    $('.sidebar-display-buttons').click(function() {
	        var selected = $(this);
	        console.log("icon selected:", selected.text());
	        // disable all the buttons
	        $('.sidebar-display-buttons').addClass("disabled");
	        $('.map-selection-row, .timeseries-row, .scatterplot-row').removeClass('active');
	        // then toggle the selected disabled class
	        selected.toggleClass("disabled");
	        // use the name of the icon to trigger sidebar
	        if (selected.text() == "explore") {
	            $('.map-selection-row').toggleClass('active');
	        } else if (selected.text() == "timeline") {
	            $('.timeseries-row').toggleClass('active');
	        } else if (selected.text() == "grain"){
	            $('.scatterplot-row').toggleClass('active');
	        }
	    });
	}


	// initialize the page with these clicks
	function initializePage(){
	    $('.sidebar-expander').click();
	    $('.sidebar-display-map').click();
	}

	function init(){
		el = app.main.el;
		initExpander();
		activateSidebarDisplayOptions();
		initializePage();
	}

	return{
		init: init
	}
})();