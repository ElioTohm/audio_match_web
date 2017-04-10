var toggleableLayerIds ;

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
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: JSON.stringify({"timeinterval": 24}),
        url: '/livemapgd',
        type:'GET',
        success: function(point) {
            var places = point.clientdata;
            console.log(places);
            toggleableLayerIds = point.channelcolor;
            map.addSource("places", {
                "type": "geojson",
                "data": places
            });    
            createChannelLayer (places) 
        }
    });
    
    //update places dataSource every 5s
    window.setInterval(function() {
        map.getSource('places').setData('/livemapdr');
    }, 5000);
    
});

//popup to show clients detail
var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

//on hover show client details
map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['LBCI','MTV','OTV','NBN','ALJADEED','TL','MANAR','FUTURE', 'Offline'] });
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
    for (var channel in toggleableLayerIds) {
        if (!map.getLayer(channel)) {
            map.addLayer({
                'id': channel,
                'type': 'circle',
                'source': 'places',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': {
                        stops:[[8, 2], [16, 6]]
                    },
                    'circle-color': toggleableLayerIds[channel]
                },
                "filter": ["==", "icon", channel]
            });
            
            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = channel;
            input.checked = true;
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', channel);
            label.textContent = channel;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            document.getElementById(channel).addEventListener('change', function(e) {
                var this_channel  = this.id;
                map.setLayoutProperty(this_channel, 'visibility',
                    e.target.checked ? 'visible' : 'none');
            });
        }
    }
}