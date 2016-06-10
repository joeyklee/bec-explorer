var app = app || {};

app.map = (function() {
    var el = {
        map: null,
        data_layer: null,
        xdata: null,
        ydata: null,
        scatter_labels: null,
        chart_div: null,
        chart_options: false,
        explore_toggle: false,
        map_options: false,
        bec_cartocss: {
            zone: null,
            subzone: null,
            unit: null    
        }
    };



    var initMap = function() {

        // map paramaters to pass to Leaflet
        var params = {
            center: [53.979608, -130.066386],
            zoom: 5,
            zoomControl: false,
            attributionControl: false
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

        // add cartodb data
        cartodb.createLayer(el.map, {
                user_name: 'becexplorer',
                type: 'cartodb',
                sublayers: [{
                    sql: "SELECT * FROM bgcv10beta_200m_wgs84",
                    cartocss: el.bec_cartocss.zone,
                    interactivity: "cartodb_id, area, bgc_label"
                }]
            })
            .addTo(el.map)
            .done(function(layer) {
                el.data_layer = layer.getSubLayer(0);

                layer.getSubLayer(0).setInteraction(true);
                layer
                    .on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
                        var cartodb_id = data["cartodb_id"];
                        console.log(data);
                        var area = data["area"];
                        // var bgcl = data["bgc_label"];
                        updateSelectedUnit(data['bgc_label']);
                        pointSelected(cartodb_id, area);
                    })
                    .on('error', function(err) {
                        console.log('error: ' + err);
                    });
            })
            .error(function(err) {
                console.log("some error occurred: " + err);
            });
    }

    

    // log the point selected
    function pointSelected(cartodb_id, area) {
        console.log(cartodb_id, area);
    }

    function updateSelectedUnit(istring){
    	$("#bec-area-name").html(istring)
    }

    // filter by property
    function filterByProperty() {
        var filterProperty = $("#filter_property").val();
        var lowerLimit = $("#lower_limit").val();
        var upperLimit = $("#upper_limit").val();

        var query = "SELECT * FROM bgcv10beta_200m_wgs84_merge " + generateQueryFilter(filterProperty, lowerLimit, upperLimit);
        console.log(query);
        el.data_layer.setSQL(query);
    }

    // generate query Filter
    function generateQueryFilter(filterProperty, lowerLimit, upperLimit) {
        var lowerFilter;
        if (!lowerLimit) { lowerFilter = ''; } else { lowerFilter = filterProperty + " > " + lowerLimit; }
        var upperFilter;
        if (!upperLimit) { upperFilter = ''; } else { upperFilter = filterProperty + " < " + upperLimit; }

        var filterRequired;
        if (lowerLimit || upperLimit) { filterRequired = "WHERE "; } else { filterRequired = ''; }
        var doubleFilter;
        if (lowerLimit && upperLimit) { doubleFilter = " AND "; } else { doubleFilter = ''; }

        var queryFilter = filterRequired + lowerFilter + doubleFilter + upperFilter;
        return queryFilter;
    }

    // plot the data on a scatterplot
    function plotData() {
        el.chart_div = $("#chart");
        var xSelector = $("#x_data").val();
        var ySelector = $("#y_data").val();

        var query = "SELECT DISTINCT bgc_label, " + xSelector + ", + " + ySelector + " FROM bgcv10beta_200m_wgs84_merge WHERE bgc_label IS NOT NULL AND " + xSelector + " IS NOT NULL AND " + ySelector + " IS NOT NULL";

        $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
            el.xData = data.rows.map(function(obj) {
                return obj[xSelector];
            });
            el.yData = data.rows.map(function(obj) {
                return obj[ySelector];
            });
            el.scatter_labels = data.rows.map(function(obj) {
                return obj.bgc_label;
            });
            var trace = {
                x: el.xData,
                y: el.yData,
                text: el.scatter_labels,
                mode: 'markers',
                type: 'scatter',
                title: 'PLOTS PLOTS PLOTS'
            };

            var layout = {
                xaxis: { title: xSelector, type:'log' },
                yaxis: { title: ySelector, type:'log' },
                width: 100,
                margin: {
                    l: 40,
                    r: 20,
                    b: 40,
                    t: 10,
                    pad: 2
                },
                hovermode: 'closest'

            };

            var traces = [trace];
            Plotly.newPlot("chart", traces, layout, { staticPlot: false, displayModeBar: false });

            el.chart_div.on('plotly_hover', function(data) {
                    var pointNumber = data.points[0].pointNumber;
                    console.log(el.scatter_labels[pointNumber]);
                })
                .on('plotly_unhover', function(data) {
                    // console.log("Unhovering");
                });
        });
    }

    function applyFilter() {
        $("#apply_filter").click(function(e) {
            console.log("applyFilter");
            filterByProperty();
        });
    }

    function replot() {
        $("#replot").click(function(e) {
            plotData();
        });
    }

    function initializeColors() {
       // console.log(el.el);
       // for the bec zones
        el.bec_cartocss.zone = '#bgcv10beta_200m_wgs84[zone="CMA"]{polygon-fill:#136400 }\
                            #bgcv10beta_200m_wgs84[zone="ESSF"]{polygon-fill:#229A00 }\
                            #bgcv10beta_200m_wgs84[zone="BAFA"]{polygon-fill:#B81609 }\
                            #bgcv10beta_200m_wgs84[zone="MH"]{polygon-fill:#D6301D }\
                            #bgcv10beta_200m_wgs84[zone="SBS"]{polygon-fill:#D6301D }\
                            #bgcv10beta_200m_wgs84[zone="CWH"]{polygon-fill:#F84F40 }\
                            #bgcv10beta_200m_wgs84[zone="MS"]{polygon-fill:#41006D }\
                            #bgcv10beta_200m_wgs84[zone="IDF"]{polygon-fill:#7B00B4 }\
                            #bgcv10beta_200m_wgs84[zone="IMA"]{polygon-fill:#A53ED5 }\
                            #bgcv10beta_200m_wgs84[zone="ICH"]{polygon-fill:#2E5387 }\
                            #bgcv10beta_200m_wgs84[zone="PP"]{polygon-fill:#3E7BB6 }\
                            #bgcv10beta_200m_wgs84[zone="BG"]{polygon-fill:#FF6600 }\
                            #bgcv10beta_200m_wgs84[zone="SBPS"]{polygon-fill:#FF9900 }\
                            #bgcv10beta_200m_wgs84[zone="SWB"]{polygon-fill:#FFCC00 }\
                            #bgcv10beta_200m_wgs84[zone="BWBS"]{polygon-fill:#FF5C00 }\
                            #bgcv10beta_200m_wgs84[zone="CDF"]{polygon-fill:#FFA300 }';
       // for the bec units                            
        el.bec_cartocss.unit = '#bgcv10beta_200m_wgs84[map_label="CMAun"]{polygon-fill:rgb(53,177,242)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmc"]{polygon-fill:rgb(179,32,225)} \
                            #bgcv10beta_200m_wgs84[map_label="BAFAun"]{polygon-fill:rgb(245,171,249)} \
                            #bgcv10beta_200m_wgs84[map_label="MHmmp"]{polygon-fill:rgb(209,244,110)} \
                            #bgcv10beta_200m_wgs84[map_label="MHwhp"]{polygon-fill:rgb(249,170,125)} \
                            #bgcv10beta_200m_wgs84[map_label="MHwh1"]{polygon-fill:rgb(51,195,126)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmkp"]{polygon-fill:rgb(188,226,188)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmcp"]{polygon-fill:rgb(240,189,227)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmc2"]{polygon-fill:rgb(115,2,84)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHws2"]{polygon-fill:rgb(110,92,22)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmv1"]{polygon-fill:rgb(205,214,113)} \
                            #bgcv10beta_200m_wgs84[map_label="MHwh"]{polygon-fill:rgb(143,91,92)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHwh2"]{polygon-fill:rgb(95,3,71)} \
                            #bgcv10beta_200m_wgs84[map_label="CMAunp"]{polygon-fill:rgb(21,57,58)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmk"]{polygon-fill:rgb(69,100,76)} \
                            #bgcv10beta_200m_wgs84[map_label="CMAwh"]{polygon-fill:rgb(70,64,122)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvh2"]{polygon-fill:rgb(235,134,179)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmc3"]{polygon-fill:rgb(246,108,75)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmvp"]{polygon-fill:rgb(204,25,222)} \
                            #bgcv10beta_200m_wgs84[map_label="BAFAunp"]{polygon-fill:rgb(236,209,50)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHwh1"]{polygon-fill:rgb(182,108,3)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxv1"]{polygon-fill:rgb(158,244,116)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHms2"]{polygon-fill:rgb(154,32,162)} \
                            #bgcv10beta_200m_wgs84[map_label="MSxv"]{polygon-fill:rgb(99,100,246)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHds2"]{polygon-fill:rgb(18,113,51)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxvp"]{polygon-fill:rgb(214,111,147)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmw"]{polygon-fill:rgb(151,221,101)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFww"]{polygon-fill:rgb(189,109,116)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdw"]{polygon-fill:rgb(127,145,161)} \
                            #bgcv10beta_200m_wgs84[map_label="MSun"]{polygon-fill:rgb(13,191,92)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdc2"]{polygon-fill:rgb(231,96,235)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmwp"]{polygon-fill:rgb(98,70,21)} \
                            #bgcv10beta_200m_wgs84[map_label="IMAunp"]{polygon-fill:rgb(109,121,199)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHdm"]{polygon-fill:rgb(58,54,49)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHxm2"]{polygon-fill:rgb(114,21,49)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHmm1"]{polygon-fill:rgb(214,33,140)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHmm2"]{polygon-fill:rgb(102,136,48)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvm1n"]{polygon-fill:rgb(230,199,242)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvm1s"]{polygon-fill:rgb(37,117,2)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvm1w"]{polygon-fill:rgb(13,38,186)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvm2w"]{polygon-fill:rgb(59,40,169)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvm2s"]{polygon-fill:rgb(225,190,52)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvm2n"]{polygon-fill:rgb(81,226,50)} \
                            #bgcv10beta_200m_wgs84[map_label="MHmm1n"]{polygon-fill:rgb(208,7,216)} \
                            #bgcv10beta_200m_wgs84[map_label="MHmm1s"]{polygon-fill:rgb(144,68,235)} \
                            #bgcv10beta_200m_wgs84[map_label="MHmm1w"]{polygon-fill:rgb(190,208,191)} \
                            #bgcv10beta_200m_wgs84[map_label="MHmm2n"]{polygon-fill:rgb(12,118,103)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdc3"]{polygon-fill:rgb(200,242,50)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdm3"]{polygon-fill:rgb(124,65,131)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxvw"]{polygon-fill:rgb(139,97,81)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxcp"]{polygon-fill:rgb(195,184,233)} \
                            #bgcv10beta_200m_wgs84[map_label="IMAun"]{polygon-fill:rgb(75,59,47)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmk2"]{polygon-fill:rgb(120,84,186)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdk3"]{polygon-fill:rgb(19,139,173)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdm3w"]{polygon-fill:rgb(105,166,141)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdc3"]{polygon-fill:rgb(48,196,104)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdvp"]{polygon-fill:rgb(15,134,240)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdvw"]{polygon-fill:rgb(16,177,77)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmw3"]{polygon-fill:rgb(209,247,62)} \
                            #bgcv10beta_200m_wgs84[map_label="PPxh2"]{polygon-fill:rgb(79,118,105)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdv2"]{polygon-fill:rgb(189,171,39)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdk1"]{polygon-fill:rgb(164,133,177)} \
                            #bgcv10beta_200m_wgs84[map_label="MSxk3"]{polygon-fill:rgb(199,0,36)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxc3"]{polygon-fill:rgb(40,41,80)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmw5"]{polygon-fill:rgb(145,195,174)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdc"]{polygon-fill:rgb(34,79,16)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxcw"]{polygon-fill:rgb(223,254,130)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdcw"]{polygon-fill:rgb(224,57,226)} \
                            #bgcv10beta_200m_wgs84[map_label="PPxh2a"]{polygon-fill:rgb(36,79,230)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdcp"]{polygon-fill:rgb(190,77,84)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmh"]{polygon-fill:rgb(114,77,96)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdc1"]{polygon-fill:rgb(237,64,141)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxh2"]{polygon-fill:rgb(74,217,226)} \
                            #bgcv10beta_200m_wgs84[map_label="BGxh2"]{polygon-fill:rgb(178,243,28)} \
                            #bgcv10beta_200m_wgs84[map_label="MSxk2"]{polygon-fill:rgb(109,36,4)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxc2"]{polygon-fill:rgb(113,188,92)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFmw2"]{polygon-fill:rgb(133,157,114)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxh2a"]{polygon-fill:rgb(20,188,40)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxc"]{polygon-fill:rgb(62,165,66)} \
                            #bgcv10beta_200m_wgs84[map_label="BGxw1"]{polygon-fill:rgb(47,24,147)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdc1"]{polygon-fill:rgb(103,168,104)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdk2"]{polygon-fill:rgb(0,94,221)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdv1"]{polygon-fill:rgb(145,130,210)} \
                            #bgcv10beta_200m_wgs84[map_label="MSmw2"]{polygon-fill:rgb(23,235,50)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHdw4"]{polygon-fill:rgb(197,21,107)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdk1a"]{polygon-fill:rgb(16,139,184)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmw2"]{polygon-fill:rgb(48,170,109)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFww1"]{polygon-fill:rgb(88,231,181)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHms1"]{polygon-fill:rgb(32,49,102)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmk1"]{polygon-fill:rgb(26,107,203)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmww"]{polygon-fill:rgb(71,25,206)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHds1"]{polygon-fill:rgb(185,88,212)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdm2"]{polygon-fill:rgb(39,91,201)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFmw1"]{polygon-fill:rgb(90,37,69)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxh1a"]{polygon-fill:rgb(61,222,235)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdc2"]{polygon-fill:rgb(147,62,45)} \
                            #bgcv10beta_200m_wgs84[map_label="MSxk1"]{polygon-fill:rgb(166,75,236)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdm1"]{polygon-fill:rgb(25,16,62)} \
                            #bgcv10beta_200m_wgs84[map_label="PPxh1"]{polygon-fill:rgb(153,220,47)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmw1"]{polygon-fill:rgb(35,117,162)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxh1"]{polygon-fill:rgb(134,168,181)} \
                            #bgcv10beta_200m_wgs84[map_label="MSmw1"]{polygon-fill:rgb(95,100,229)} \
                            #bgcv10beta_200m_wgs84[map_label="PPxh1a"]{polygon-fill:rgb(24,135,105)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxc1"]{polygon-fill:rgb(25,77,192)} \
                            #bgcv10beta_200m_wgs84[map_label="BGxh1"]{polygon-fill:rgb(232,173,155)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdk1b"]{polygon-fill:rgb(251,120,147)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHxm1"]{polygon-fill:rgb(181,119,58)} \
                            #bgcv10beta_200m_wgs84[map_label="MHmm2s"]{polygon-fill:rgb(185,164,180)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdkp"]{polygon-fill:rgb(23,45,31)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwcp"]{polygon-fill:rgb(115,192,240)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHvk1"]{polygon-fill:rgb(138,100,45)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwcw"]{polygon-fill:rgb(170,41,18)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmk5"]{polygon-fill:rgb(232,212,208)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwc4"]{polygon-fill:rgb(214,237,27)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdk2"]{polygon-fill:rgb(144,15,194)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdkw"]{polygon-fill:rgb(60,159,247)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmw2"]{polygon-fill:rgb(134,51,88)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHwk1"]{polygon-fill:rgb(0,169,151)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdk"]{polygon-fill:rgb(231,77,59)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwh1"]{polygon-fill:rgb(78,109,222)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFdk1"]{polygon-fill:rgb(129,179,14)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwmp"]{polygon-fill:rgb(205,190,153)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwh2"]{polygon-fill:rgb(168,77,130)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwm2"]{polygon-fill:rgb(243,223,16)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwmw"]{polygon-fill:rgb(215,57,9)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdw"]{polygon-fill:rgb(14,99,210)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdm2"]{polygon-fill:rgb(128,21,31)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHdw1"]{polygon-fill:rgb(74,188,64)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxx2"]{polygon-fill:rgb(246,64,148)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwm1"]{polygon-fill:rgb(207,37,62)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmk4"]{polygon-fill:rgb(200,23,208)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHdm"]{polygon-fill:rgb(176,150,153)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwm4"]{polygon-fill:rgb(189,164,3)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwm3"]{polygon-fill:rgb(184,170,142)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwh3"]{polygon-fill:rgb(32,78,80)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHxw"]{polygon-fill:rgb(60,141,47)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdm1"]{polygon-fill:rgb(216,194,16)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmw4"]{polygon-fill:rgb(205,201,68)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHxwa"]{polygon-fill:rgb(249,33,46)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdh"]{polygon-fill:rgb(140,188,35)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxx1"]{polygon-fill:rgb(208,84,59)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwk2"]{polygon-fill:rgb(184,137,39)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwc3"]{polygon-fill:rgb(142,232,1)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmv2"]{polygon-fill:rgb(94,170,133)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHvk2"]{polygon-fill:rgb(76,245,77)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmh"]{polygon-fill:rgb(20,237,206)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmk1"]{polygon-fill:rgb(136,235,129)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHwk4"]{polygon-fill:rgb(55,46,57)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSvk"]{polygon-fill:rgb(244,127,75)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSdw3"]{polygon-fill:rgb(170,65,64)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwk1"]{polygon-fill:rgb(54,136,158)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmmp"]{polygon-fill:rgb(242,170,219)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmm1"]{polygon-fill:rgb(159,84,247)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHwk3"]{polygon-fill:rgb(204,219,247)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmw"]{polygon-fill:rgb(101,218,242)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSdw2"]{polygon-fill:rgb(30,214,250)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmm"]{polygon-fill:rgb(24,77,24)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSdh1"]{polygon-fill:rgb(181,100,89)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSdw1"]{polygon-fill:rgb(16,177,127)} \
                            #bgcv10beta_200m_wgs84[map_label="SBPSdc"]{polygon-fill:rgb(17,9,220)} \
                            #bgcv10beta_200m_wgs84[map_label="SBPSmk"]{polygon-fill:rgb(241,8,245)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSwk1"]{polygon-fill:rgb(155,40,100)} \
                            #bgcv10beta_200m_wgs84[map_label="SBPSmc"]{polygon-fill:rgb(144,226,162)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHwk2"]{polygon-fill:rgb(196,100,30)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHvk1c"]{polygon-fill:rgb(87,100,66)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmc1"]{polygon-fill:rgb(210,54,212)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwc2"]{polygon-fill:rgb(34,184,125)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmmw"]{polygon-fill:rgb(53,42,208)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmk3"]{polygon-fill:rgb(105,18,160)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHwk1c"]{polygon-fill:rgb(100,48,54)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxm"]{polygon-fill:rgb(81,72,179)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdk4"]{polygon-fill:rgb(94,253,244)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHdw3"]{polygon-fill:rgb(222,37,80)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFvcp"]{polygon-fill:rgb(77,99,209)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHdk"]{polygon-fill:rgb(127,205,78)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwc2w"]{polygon-fill:rgb(81,119,114)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFvc"]{polygon-fill:rgb(123,55,4)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmm"]{polygon-fill:rgb(35,53,107)} \
                            #bgcv10beta_200m_wgs84[map_label="SBPSxc"]{polygon-fill:rgb(26,62,63)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFvcw"]{polygon-fill:rgb(184,182,227)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFmw2b"]{polygon-fill:rgb(67,152,117)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFxv2"]{polygon-fill:rgb(213,165,83)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFvmp"]{polygon-fill:rgb(237,7,217)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFvmw"]{polygon-fill:rgb(177,103,45)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFvk"]{polygon-fill:rgb(133,160,74)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmw1"]{polygon-fill:rgb(92,73,180)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmm3"]{polygon-fill:rgb(135,110,76)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFvm"]{polygon-fill:rgb(184,141,104)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFunp"]{polygon-fill:rgb(148,69,73)} \
                            #bgcv10beta_200m_wgs84[map_label="SWBmk"]{polygon-fill:rgb(20,244,77)} \
                            #bgcv10beta_200m_wgs84[map_label="SWBmks"]{polygon-fill:rgb(36,130,90)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmv4"]{polygon-fill:rgb(228,26,162)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFun"]{polygon-fill:rgb(123,13,229)} \
                            #bgcv10beta_200m_wgs84[map_label="BWBSdk"]{polygon-fill:rgb(187,174,36)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSun"]{polygon-fill:rgb(98,95,65)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHwc"]{polygon-fill:rgb(134,131,114)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwvp"]{polygon-fill:rgb(111,244,110)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFwv"]{polygon-fill:rgb(91,78,205)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHvc"]{polygon-fill:rgb(19,43,152)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmv3"]{polygon-fill:rgb(195,157,70)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHwm"]{polygon-fill:rgb(203,141,243)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmc1"]{polygon-fill:rgb(232,14,216)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSwk3"]{polygon-fill:rgb(63,152,211)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmc1a"]{polygon-fill:rgb(39,18,115)} \
                            #bgcv10beta_200m_wgs84[map_label="ICHmc2"]{polygon-fill:rgb(43,50,199)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHws1"]{polygon-fill:rgb(136,22,119)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSdk"]{polygon-fill:rgb(10,183,62)} \
                            #bgcv10beta_200m_wgs84[map_label="SWBvks"]{polygon-fill:rgb(32,165,75)} \
                            #bgcv10beta_200m_wgs84[map_label="SWBvk"]{polygon-fill:rgb(124,122,247)} \
                            #bgcv10beta_200m_wgs84[map_label="BWBSvk"]{polygon-fill:rgb(163,176,16)} \
                            #bgcv10beta_200m_wgs84[map_label="SWBuns"]{polygon-fill:rgb(17,79,102)} \
                            #bgcv10beta_200m_wgs84[map_label="SWBun"]{polygon-fill:rgb(166,229,53)} \
                            #bgcv10beta_200m_wgs84[map_label="MHunp"]{polygon-fill:rgb(97,16,111)} \
                            #bgcv10beta_200m_wgs84[map_label="MHun"]{polygon-fill:rgb(230,147,208)} \
                            #bgcv10beta_200m_wgs84[map_label="BWBSwk3"]{polygon-fill:rgb(156,110,176)} \
                            #bgcv10beta_200m_wgs84[map_label="BWBSmk"]{polygon-fill:rgb(54,43,232)} \
                            #bgcv10beta_200m_wgs84[map_label="BWBSwk2"]{polygon-fill:rgb(1,141,64)} \
                            #bgcv10beta_200m_wgs84[map_label="BWBSmw"]{polygon-fill:rgb(108,249,96)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSwk2"]{polygon-fill:rgb(63,29,143)} \
                            #bgcv10beta_200m_wgs84[map_label="BWBSwk1"]{polygon-fill:rgb(181,147,86)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvh3"]{polygon-fill:rgb(232,149,104)} \
                            #bgcv10beta_200m_wgs84[map_label="CWHvh1"]{polygon-fill:rgb(40,254,231)} \
                            #bgcv10beta_200m_wgs84[map_label="CDFmm"]{polygon-fill:rgb(248,105,251)} \
                            #bgcv10beta_200m_wgs84[map_label="BGxw2"]{polygon-fill:rgb(174,48,112)} \
                            #bgcv10beta_200m_wgs84[map_label="BGxh3"]{polygon-fill:rgb(172,201,237)} \
                            #bgcv10beta_200m_wgs84[map_label="MSdv"]{polygon-fill:rgb(81,47,165)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxw"]{polygon-fill:rgb(240,44,241)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFdk5"]{polygon-fill:rgb(208,166,178)} \
                            #bgcv10beta_200m_wgs84[map_label="IDFxk"]{polygon-fill:rgb(194,48,207)} \
                            #bgcv10beta_200m_wgs84[map_label="ESSFmm2"]{polygon-fill:rgb(177,193,52)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSdh2"]{polygon-fill:rgb(6,46,238)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSmk2"]{polygon-fill:rgb(30,80,168)} \
                            #bgcv10beta_200m_wgs84[map_label="SBSwk3a"]{polygon-fill:rgb(112,149,4)}';
    }

    // get it all going!
    var init = function() {
        initializeColors();
        initMap();
        plotData();
        replot();
        applyFilter();
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
    app.pages.init();
    app.mapix.init();
    // app.mapcols.init();
});
