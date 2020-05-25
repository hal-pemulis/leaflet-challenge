function createFeatures(earthquakeData, plateData) {

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    const earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
                var magColor = ""
                if (feature.properties.mag > 5) {
                        magColor = "red";}
                else if (feature.properties.mag > 4) {
                        magColor = "orange";}
                else if (feature.properties.mag > 3) {
                        magColor = "yellow";}
                else if (feature.properties.mag > 2) {
                        magColor = "lightgreen";}
                else if (feature.properties.mag > 1) {
                        magColor = "green";}
                else {
                        magColor = "blue";}
                return L.circleMarker(latlng, {radius:feature.properties.mag*4, color:"black", opacity:0, fillColor:magColor, fillOpacity:.5})
                        .bindPopup("<h3>" + feature.properties.place + 
                                "</h3><hr><p>" + new Date(feature.properties.time) + 
                                "</p>" + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    });

    var plateStyle = {
        color: "orange",
        fillOpacity: 0,
        weight: 2
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const tectonicPlates = L.geoJSON(plateData, {
        style: plateStyle
    });


    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes, tectonicPlates);
}

function createMap(earthquakes, tectonicPlates) {

    // Define streetmap and darkmap layers
    const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Light Map": lightmap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            "Earthquakes": earthquakes,
            "Tectonic Plates": tectonicPlates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37, -114],
            zoom: 4,
            layers: [darkmap, tectonicPlates]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);
}

(async function(){
    const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
    const plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
    const quakeData = await d3.json(earthquakeURL);
    const plateData = await d3.json(plateURL);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(quakeData.features, plateData);
})()
