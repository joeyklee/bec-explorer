var app = app || {};

app.pages = (function(){
	// create empty el to take on attributes of the main el
	var el = null


	function sayHello(){
		console.log("hello");
	}

	function displaySelectedPage(domid){
		var pagelist = []

		$(domid).click(function(){
			$('#cartodb-map').css("display","none");

			
		})
	}


	function init(){
		sayHello();
		displaySelectedPage("#about");
	}

	return {
		init: init
	}
})();

