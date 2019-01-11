var mapStyle = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "32"
            },
            {
                "lightness": "-3"
            },
            {
                "visibility": "on"
            },
            {
                "weight": "1.18"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-70"
            },
            {
                "lightness": "14"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "100"
            },
            {
                "lightness": "-14"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "12"
            }
        ]
    }
];
window.lat = 8.475340;
window.lng = 4.648040;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePosition);
    }
    return null;
};

function updatePosition(position) {
    if (position) {
        window.lat = position.coords.latitude;
        window.lng = position.coords.longitude;

        var geo = document.getElementById("geolocation");
        geo.innerText = ("Lat = " + lat + " and Long = " + lng)
    }
}

setInterval(function(){updatePosition(getLocation());}, 5000);

function currentLocation() {
    return {lat:window.lat, lng:window.lng};
};

var map;
var mark;
var lineCoords = [];

var initMap = function() {
    map  = new google.maps.Map(document.getElementById('map'), {
            center:{lat:lat,lng:lng}, 
            zoom:14, 
            mapTypeId: 'terrain',
            styles: mapStyle
        });
    mark = new google.maps.Marker({
        position:{lat:lat, lng:lng}, 
        map:map, 
        title:"TeraRave's Vehicle in Transit...",
        icon: {
            url: "https://teraraveweb.herokuapp.com//img/markers/pickup.png",
            scaledSize: new google.maps.Size(34, 36)
        }
    });

    var destGeo = {
        lat: localStorage.getItem("destLat"),
        lng: localStorage.getItem("destLng")
    }

    destMark = new google.maps.Marker({
        position: destGeo, 
        map:map, 
        title:"Delivery Location",
        icon: {
            url: "https://teraraveweb.herokuapp.com//img/markers/hut.png",
            scaledSize: new google.maps.Size(34, 36)
        }
    });
};

window.initMap = initMap;

var redraw = function(payload) {
    lat = payload.message.lat;
    lng = payload.message.lng;

    map.setCenter({lat:lat, lng:lng, alt:0});
    mark.setPosition({lat:lat, lng:lng, alt:0});

    lineCoords.push(new google.maps.LatLng(lat, lng));

    var lineCoordinatesPath = new google.maps.Polyline({
        path: lineCoords,
        geodesic: true,
        strokeColor: '#704528',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    lineCoordinatesPath.setMap(map);
};


// var pnChannel = "map-channel";
var id = localStorage.getItem("id")
var pnChannel = "channel" + id;

var pubnub = new PubNub({
    publishKey: "pub-c-3378cef2-1c01-416d-a988-94f8f9000322",
    subscribeKey: "sub-c-3eff2ea8-15b8-11e9-923b-9ef472141036"
    // publishKey:   'pub-c-85ef4a91-eeed-402e-8435-abf39153644d',
    // subscribeKey: 'sub-c-e60ecfd2-69c4-11e8-9499-26ede0a09d22',
    // ssl: true
});

function initPubNub(){
    pubnub.subscribe({channels: [pnChannel]});
    pubnub.addListener({message:redraw});

    setInterval(function() {
        pubnub.publish({channel:pnChannel, message:currentLocation()});
    }, 5000);
}


// $(document).delegate("#transaction-page", "pagebeforecreate", function () {
    
// });