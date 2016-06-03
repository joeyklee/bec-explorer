var app = app || {};

app.pages = (function() {
    // create empty el to take on attributes of the main el
    var el = null


    function sayHello() {
        console.log("hello");
    }

    function displaySelectedPage() {
        var pagelist = ["about", "current-research", "contact"];
        var pageClass, pageId, buttonName;


        $(".nav li a").click(function() {
        	// set the display of the map to none
        	$('#cartodb-map').css("display", "none");
            // console.log($(this)[0].id);
            // get the name of the button clicked
            buttonName = $(this)[0].id;
            // set the page class and id which match in the html file
            pageClass = "." + buttonName;
            pageId = "#" + buttonName;
            // run through the list of pages and make visible that which was selected
            pagelist.forEach(function(d) {
                $("."+d).css("display", "none");
                if (buttonName == d) {
                    $(pageClass).css("display", "block");
                }
            });
        });
    }


    function init() {
        sayHello();
        displaySelectedPage();
    }

    return {
        init: init
    }
})();
