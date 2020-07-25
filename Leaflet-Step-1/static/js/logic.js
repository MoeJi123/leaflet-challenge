var API_KEY = "pk.eyJ1IjoibW9lamkxMjMiLCJhIjoiY2thdHpnbXZ6MWYwcDJ1bnI5ZDFyOXZoNyJ9.HwssV9G3aj7xVtpXxLnz-w"
var MAP_URL = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var streetmap = L.tileLayer(MAP_URL, {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var myMap = L.map("map", {
    center: [39.7, -95.7],
    zoom: 4,
});

streetmap.addTo(myMap);

d3.json(earthquake_url, function(data){

    //change the color of markers 
    function fillcolor(magnitude) {
        switch(true) {
            case magnitude > 5:
                return "#ce2714";
            case magnitude > 4: 
                return "#ce5514";
            case magnitude > 3:
                return "#ce6e14";
            case magnitude > 2: 
                return "#ce9914";
            case magnitude > 1: 
                return "#ceb514"
            case magnitude > 0: 
                return "#b2ce14"
        };
    };

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
        }

    function circle_style(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: fillcolor(feature.properties.mag),
            opacity: 1, 
            fillOpacity: 1,
            weight: 0.5
        };
    };

    L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        
        style: circle_style,
        
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
        }).addTo(myMap);
    

        var legend = L.control({
        position: "bottomright"
        });
    
        // Then add all the details for the legend
        legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
    
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#b2ce14",
            "#ceb514",
            "#ce9914",
            "#ce6e14",
            "#ce5514",
            "#ce2714"
        ];
    
        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
        };
    
        legend.addTo(myMap);
    });