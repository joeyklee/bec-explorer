var dataLayer;
var plotDiv = document.getElementById('plot');

var xData;
var yData;
var labels;

function filterByProperty() {
  var filterProperty = $("#filter_property").val();
  var lowerLimit = $("#lower_limit").val();
  var upperLimit = $("#upper_limit").val();
  
  var query = "SELECT * FROM bgcv10beta_200m_wgs84_merge " + generateQueryFilter(filterProperty, lowerLimit, upperLimit);
  console.log(query);
  dataLayer.setSQL(query);
}

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

$("#apply_filter").click(function(e) {
  filterByProperty();
});

function pointSelected(cartodb_id, area) {
  console.log(cartodb_id, area);
}

function plotData() {
  var xSelector = $("#x_data").val();
  var ySelector = $("#y_data").val();
  var query = "SELECT DISTINCT bgc_label, "+ xSelector + ", + " + ySelector + " FROM bgcv10beta_200m_wgs84_merge WHERE bgc_label IS NOT NULL AND " + xSelector+ " IS NOT NULL AND " + ySelector + " IS NOT NULL";


  $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + query, function(data) {
    xData = data.rows.map(function(obj) { return obj[xSelector]; });
    yData = data.rows.map(function(obj) { return obj[ySelector]; });
    labels = data.rows.map(function(obj) { return obj.bgc_label; });
    var trace = {
      x: xData,
      y: yData,
      text: labels,
      mode: 'markers',
      type: 'scatter',
      title: 'PLOTS PLOTS PLOTS'
    };

    var layout = {
      xaxis: { title: xSelector },
      yaxis: { title: ySelector },
      hovermode: 'closest'
    };

    var traces = [trace];
    Plotly.newPlot("plot", traces, layout);

    plotDiv.on('plotly_hover', function(data){
      var pointNumber = data.points[0].pointNumber;
      console.log(labels[pointNumber]);
    })
    .on('plotly_unhover', function(data){
      // console.log("Unhovering");
    });
  });
}

$("#replot").click(function(e) {
  plotData();
});

function main() {
  var map = L.map('map', {zoom: 5, center: [55.33539361201609, -120.91552734375]});

  L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: 'Stamen'})
    .addTo(map);

  cartodb.createLayer(map, {
    user_name: 'becexplorer',
    type: 'cartodb',
    sublayers: [{
      sql: "SELECT * FROM bgcv10beta_200m_wgs84",
      cartocss: '#bgcv10beta_200m_wgs84 { polygon-fill: #5EB840; polygon-opacity: 0.5; line-color: #B85E40; line-width: 0.5; line-opacity: 0.5;}',
      interactivity: "cartodb_id, area"
    }]
  })
  .addTo(map)
  .done(function(layer) {
    dataLayer = layer.getSubLayer(0);

    layer.getSubLayer(0).setInteraction(true);
    layer
      .on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
        var cartodb_id = data["cartodb_id"];
        var area = data["area"];
        pointSelected(cartodb_id, area);
      })
      .on('error', function(err) {
        console.log('error: ' + err);
      });
  })
  .error(function(err) {
    console.log("some error occurred: " + err);
  });

  plotData();
}


window.onload = main;