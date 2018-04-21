var map;
var bounds;
var normalIcon;
var highlightedIcon;

// Markers representing the locations of various FGC areas in the Bay Area. 
var locations = [
	{
		title: 'Folsom Street Foundary, SF', 
		position: {lat: 37.775972, lng: -122.413925}
	},
	{
		title: 'Oakland Esports Arena', 
		position: {lat: 37.799773, lng: -122.273383}
	},
	{
		title: 'Orange County Esports Arena', 
		position: {lat: 33.755922, lng: -117.867516}
	},
	{
		title: 'Razer Store San Francisco', 
		position: {lat: 37.787988, lng: -122.405310}
	},
	{
		title: 'Capitol Event Center, Sacramento', 
		position: {lat: 38.585785, lng: -121.494274}
	}
];


function initMap() {
	// Load the map.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.773972, lng: -122.431297},
		zoom: 13
	});

	bounds = new google.maps.LatLngBounds();

	highlightedIcon = makeMarkerIcon('FFFF24');
	normalIcon = makeMarkerIcon('0091FF');

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
