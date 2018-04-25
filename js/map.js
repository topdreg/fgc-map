var map;
var bounds;
var normalIcon;
var highlightedIcon;

function googleMapsAPIError() {
	alert("An error has occurred with the Google Maps API. Please come back another time.");
}

function initMap() {

	// Load the map.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.773972, lng: -122.431297},
		zoom: 13
	});

	bounds = new google.maps.LatLngBounds();

	// Icons to use for the map markers.
	highlightedIcon = makeMarkerIcon('FFFF2D');
	normalIcon = makeMarkerIcon('3D9EEF');

	ko.applyBindings( new ViewModel() );

}


function makeMarkerIcon(markerColor) {
	var markerImage = {
	  url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	  '|40|_|%E2%80%A2',
	  size: new google.maps.Size(21, 34),
	  origin: new google.maps.Point(0, 0),
	  anchor: new google.maps.Point(10, 34),
	  scaledSize: new google.maps.Size(21,34)
	};
	return markerImage;
}
