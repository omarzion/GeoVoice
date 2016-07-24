

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
  
  getLocation().then(function(loc) {
  	map.setCenter(loc);
  //	placeMarker(loc);
  	//placeSoundMarker({ 'location':loc, 'sound': 'http://soundbible.com/grab.php?id=2135&type=mp3'});
  });
  
  google.maps.event.addListener(map, 'click', function(event) {
  		getLocation().then(placeMarker);
	});
	
	google.maps.event.addListener(map, 'idle', getMarkers);
}

function getMarkers() {
	//var bounds = map.getBounds();
	// TODO create ajax request for markers, then delete current markers and show new
	// https://developers.google.com/maps/articles/toomanymarkers#distancebasedclustering	
	
	$.ajax({
		url : "get_markers",
		type: "GET",
		success: function(data) {
			var markers = jQuery.parseJSON(data);
			for (i = 0; i<markers.length; i++) {
				placeSoundMarker(markers[i]);
			}
		},
		error: function() {
			alert("Error retrieving sound bytes");
		}
	});
}

function placeMarker(place) {
		var marker = new google.maps.Marker({position: place, map:map, title: "Add sound here"});
		
		var infowindow = new google.maps.InfoWindow({
			content: createInputWindow()
		});
		
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
}

function getLocation() {
	return new Promise( function(resolve, reject) {
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(function(position) {
		  	resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  }, function() {
		    handleLocationError(true, infoWindow, map.getCenter());
		  });
		} else {
		  // Browser doesn't support Geolocation
		  handleLocationError(false, infoWindow, map.getCenter());
		}
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
