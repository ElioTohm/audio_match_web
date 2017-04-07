var toggleableLayerIds = [];

// initialize mapbox object  
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpb3RvaG1lIiwiYSI6ImNqMTRvY2MyMzAwMDYzMm1sYjBobzB5NzUifQ.ZhqOIRqCpCSAt3yv8TZqIw';
var filterGroup = document.getElementById('filter-group');
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [35.606730, 33.834794],
    zoom: 7.8
});

/*
* On loaded map fetch data from server
* and set refresh interval to 5s
*/
map.on('load', function() {
    // Add a GeoJSON source containing place coordinates and information.
    var places = [];
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: JSON.stringify({"timeinterval": 24}),
        url: '/livemapgd',
        type:'GET',
        success: function(point) {
            places = point;
            map.addSource("places", {
                "type": "geojson",
                "data": point
            });    
            createChannelLayer (places) 
        }
    });
    
    //update places dataSource every 5s
    window.setInterval(function() {
        map.getSource('places').setData('/livemapgd');
    }, 5000);
    
});

//popup to show clients detail
var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

//on hover show client details
map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: toggleableLayerIds });
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return;
    }

    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.description)
        .addTo(map);
});

//add layer function
function createChannelLayer (places) {
    places.features.forEach(function(feature) {
        var symbol = feature.properties['icon'];
        var color = feature.properties['icon-color'];
        var layerID = symbol;
         
        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            toggleableLayerIds.push(symbol);
            map.addLayer({
                'id': layerID,
                'type': 'circle',
                'source': 'places',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 6,
                    'circle-color': color
                },
                "filter": ["==", "icon", symbol]
            });

            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = symbol;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', function(e) {
                map.setLayoutProperty(layerID, 'visibility',
                    e.target.checked ? 'visible' : 'none');
            });
        }
    });
}