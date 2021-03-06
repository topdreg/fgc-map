var Location = function(data) {
	var self = this;

	self.title = data.title;
	self.position = data.position;
	self.visibleBool = ko.observable(true);
	self.infowindow = new google.maps.InfoWindow();
	self.infoBool = true;
	self.picBool = true;

	// Instantiate marker here.
	self.marker = new google.maps.Marker({
		position: self.position,
		title: self.title,
		animation: google.maps.Animation.DROP,
		icon: normalIcon
	});


	// Add listeners for if the mouse hovers over the marker.
	self.marker.addListener('mouseover', function() {
		this.setIcon(highlightedIcon);
	});

	self.marker.addListener('mouseout', function() {
		this.setIcon(normalIcon);
	});

	// Functionality for hovering over an item on the sidebar.
	self.highlightMarker = function(location) {
		self.marker.setIcon(highlightedIcon);
	};

	self.normalizeMarker = function(location) {
		self.marker.setIcon(normalIcon);
	};

	/* Infowindow code. */

	// Info from Foursquare API about the location to be placed into an info window.

	var foursquareSearchURL = 'https://api.foursquare.com/v2/venues/search?ll=' + self.position.lat + ', ' + self.position.lng + '&query=' + self.title + '&limit=1&client_id=XJFBLWTBV3O5NOPX2CDBQ3EXHPZNE1Z1FA05PZIK045TQWYG&client_secret=ADHJZLNBC5W0RSADMUSBNTMZKPYDXT15X5G32YLCGKAQHJHZ&v=20180323';

	self.locationInfo = '';
	self.hours;

	$.ajax({
		type: 'GET',
		url: foursquareSearchURL,
		datatype: 'jsonp'
	}).done(function(data) {

		var searchInfo = data.response.venues[0];

		self.locationInfo = searchInfo.location.formattedAddress[0] + '<br>' + searchInfo.location.formattedAddress[1];


		var venueID = searchInfo.id;

		// Get a tip about the place.

		var tipsURL = 'https://api.foursquare.com/v2/venues/' + venueID + '/tips?&client_id=XJFBLWTBV3O5NOPX2CDBQ3EXHPZNE1Z1FA05PZIK045TQWYG&client_secret=ADHJZLNBC5W0RSADMUSBNTMZKPYDXT15X5G32YLCGKAQHJHZ&v=20180323';

		$.ajax({
			type: 'GET',
			url: tipsURL,
			datatype: 'jsonp'
		}).done(function(tipsData) {

			var tipsInfo = tipsData.response.tips.items[0];

			if (tipsInfo != undefined)
				self.tips = 'Tip: ' + tipsInfo.text;
			else self.tips = "No tips have been registered for this area.";


		}).fail(function() {
			self.tips = '(Error) The tips system is presently down.';
		});

		// Get a photo.

		var photosURL = 'https://api.foursquare.com/v2/venues/' + venueID + '/photos?client_id=XJFBLWTBV3O5NOPX2CDBQ3EXHPZNE1Z1FA05PZIK045TQWYG&client_secret=ADHJZLNBC5W0RSADMUSBNTMZKPYDXT15X5G32YLCGKAQHJHZ&v=20180323';

		$.ajax({
			type: 'GET',
			url: photosURL,
			datatype: 'jsonp'
		}).done(function(photosData) {

			var photoInfo = photosData.response.photos.items[0];

			if (photoInfo != undefined) {
				self.photo =  photoInfo.prefix + '200x200' + photoInfo.suffix;
				self.picBool = true;
			}
			else self.picBool = false;

		}).fail(function() {
			self.picBool = false;
		});

		self.infoBool = true;

	}).fail(function() {;
		self.infoBool = false;
	});

	// Show an info window for when a marker is clicked on directly.
	self.marker.addListener('click', function() {
		setInfoWindow();
		self.infowindow.open(map, this);
		this.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){ self.marker.setAnimation(null); } , 1500);
	});

	// Function to be used for opening an infowindow when an item in the sidebar is clicked.
	self.openInfoWindow = function() {
		setInfoWindow();
		self.infowindow.open(map, self.marker);
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){ self.marker.setAnimation(null); } , 1500);
	};

	// Initialize marker.
	self.marker.setMap(map);
	bounds.extend(self.marker.position);

	map.fitBounds(bounds);

	// Functions to be used for when a user types stuff into the search field.
	self.showMarker = function() {
		self.marker.setMap(map);
		bounds.extend(self.marker.position);
	};

	self.hideMarker = function() {
		self.marker.setMap(null);
	};

	function setInfoWindow() {
		var contentString = '';
		var picString = '';

		if (self.infoBool === false)
			contentString = "Foursquare API failed to load."
		else {
			if (self.picBool === true)
				picString = '<img src="' + self.photo + '">';
			contentString =
			'<div style="width: 400px">' +
				'<br>' +
				'<div style="display: flex">' +
					'<div style="width: 300px">' +
						'<strong id="venueName">' + self.title + '</strong>' +
						'<br><br>' +
						'<div id="venueLocation">' + self.locationInfo + '</div>' +
						'<br>' +
						'<div id="venueTips">' + self.tips + '</div>' +
						'<br><br>' +
						'<p>Data provided by Foursquare</p>' +
					'</div>' +
					'<div style="margin-left: 20px">' +
						picString +
					'</div>' +
				'</div>';
		}
		self.infowindow.setContent(contentString);
	}
};


var ViewModel = function() {

	var self = this;

	/* Navigation hamburger-like menu code */

	// Boolean variable for determining if hamburger menu click functions should be accessed.
	self.menuBool = ko.observable(false);

	// Object to hold data on automatic resizing of navigation sidebar.
	var windowData = {
		clickBool: true,
		windowSize: $(window).width()
	};

	self.windowData = ko.observable(windowData);

	// Change the windowData observable whenever the window screen size changes.
	$(window).resize(function() {
		var windowWidth = $(window).width();
			windowDataUnwrapped = ko.unwrap(self.windowData());
			self.windowData({clickBool: windowDataUnwrapped.clickBool, windowSize: $(window).width()});
		}
	);

	// If the sidebar icon is clicked, update the sidebar boolean variable to let the sidebar slide
	// either to the right or left. Also, cease the window size having an effect on the sidebar.
	self.boolUpdate = function() {
		self.menuBool(true);
		var windowData = ko.unwrap(self.windowData());
		windowData.clickBool = false;
		self.windowData(windowData);
	};

	/* Code to deal with the navigation bar information and map stuff */

	self.locationsList = ko.observableArray([]);

	locations.forEach(function(location) {
		self.locationsList.push( new Location(location) );
	});

	// Filter location items in the sidebar if the user types text into the search field.
	self.filterTerm = ko.observable("");

	ko.computed(function() {
		self.locationsList().forEach(function(location) {
			var filterValue = ko.unwrap(self.filterTerm());
			filterValue = filterValue.toUpperCase();
			var title = location.title;
			if (title.toUpperCase().indexOf(filterValue) == 0) {
				location.visibleBool(true);
				location.showMarker();
			}
			else {
				location.visibleBool(false);
				location.hideMarker();
			}
		});
	});

};

/* Binding handlers to deal with the side navigation bar if the hamburger-looking menu is clicked. */


// Handler to deal with the sidebar if the hamburger menu is clicked.
ko.bindingHandlers.slide = {
	update: function(element, valueAccessor) {
		var value = valueAccessor();
		var valueUnwrapped = ko.unwrap(value);

		if (valueUnwrapped == true) {
			if ($(element).width() == 0)
				$(element).width(275);
			else
				$(element).width(0);
		}
	}
};


// Handler deals with the content if the hamburger menu is clicked.
// The inclusion of the #map JQuery is to allow the google.maps resize event to occur. 
ko.bindingHandlers.adjustLeftMargin = {
	update: function(element, valueAccessor) {
		var value = valueAccessor();
		var valueUnwrapped = ko.unwrap(value);
		if (valueUnwrapped == true) {
			if ($(element).css("margin-left") == '275px') {
				$(element).css("margin-left", "0px");
				$("#map").width($("#map").width() + 275);
				google.maps.event.trigger(map, 'resize');
				$("#map").width("100%");
			}
			else {
				$(element).css("margin-left", "275px");
				$("#map").width($("#map").width() - 275);
				google.maps.event.trigger(map, 'resize');
				$("#map").width("100%");
			}
		}
		// Reset the boolean variable of the click event to false.
		value(false);
	}
};


/* Binding handlers to deal with the side navigation bar if the window is resized. */

// This handler is for the resizing of the main content when the window resizes.
ko.bindingHandlers.minMargin = {
	update: function(element, valueAccessor) {
		var value = valueAccessor();
		var valueUnwrapped = ko.unwrap(value);
		if (valueUnwrapped.clickBool == true) {
			if (valueUnwrapped.windowSize > 770) {
				if ($(element).css("margin-left") == '0px')
					$(element).css("margin-left", "275px");
			}
			else {
				if ($(element).css("margin-left") == '275px')
					$(element).css("margin-left", "0px");
			}
		}
	}
};


// This handler is for the resizing of the sidebar when the window resizes.
ko.bindingHandlers.minSlide = {
	update: function(element, valueAccessor) {
		var value = valueAccessor();
		var valueUnwrapped = ko.unwrap(value);
		if (valueUnwrapped.clickBool == true) {
			if (valueUnwrapped.windowSize > 770) {
				if ($(element).width() == 0)
					$(element).width(275);
			}
			else {
					if ($(element).width() == 275)
						$(element).width(0);
			}
		}
	}
};

