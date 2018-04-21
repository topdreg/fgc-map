var Location = function(data) {
	var self = this; 
	
	self.title = data.title; 
	self.position = data.position; 

	var infowindow = new google.maps.InfoWindow();

	self.marker = new google.maps.Marker({
		position: self.position,
		title: self.title,
		animation: google.maps.Animation.DROP,
		icon: normalIcon
	});


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

	// Info from Yelp about the location. 

	yelpURL = 'https://api.yelp.com/v3/businesses/search?term=' + self.title + '&latitude=' + self.position.lat + '&longitude=' + self.position.lng;

	$.ajax({
		url: yelpURL,
		data: data,
		cache: true,
		datatype: 'jsonp',
		success: function(data) { console.log(data); },
		beforeSend: setHeader
	});
	
	function setHeader(xhr) {
		xhr.setRequestHeader('Authorization', 'Bearer 9GebwPmtIo935qUfXufdtmsmr25z09IaOmTd9x126LG1T9J45UPKi_Ht58wqvLFX-irOUuH-WUEHrdGhXHWTq-NQA2bqmxXMXfa52AF8a7EyTVzi8PMmjpAyobjZWnYx');
	}

	self.marker.setMap(map); 
	bounds.extend(self.marker.position); 

	map.fitBounds(bounds); 
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


}; 

/* Binding handlers to deal with the side navigation bar if the hamburger-looking menu is clicked. */


// Handler to deal with the sidebar if the hamburger menu is clicked. 
ko.bindingHandlers.slide = {
	update: function(element, valueAccessor) {
		var value = valueAccessor(); 
		var valueUnwrapped = ko.unwrap(value); 

		if (valueUnwrapped == true) {
			if ($(element).width() == 0)
				$(element).width(350); 
			else 
				$(element).width(0); 
		}
	}
};


// Handler deals with the content if the hamburger menu is clicked. 
ko.bindingHandlers.adjust350LeftMargin = {
	update: function(element, valueAccessor) {
		var value = valueAccessor(); 
		var valueUnwrapped = ko.unwrap(value); 
		if (valueUnwrapped == true) {
			if ($(element).css("margin-left") == '350px')
				$(element).css("margin-left", "0px");
			else 
				$(element).css("margin-left", "350px");
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
					$(element).css("margin-left", "350px");
			}
			else {
				if ($(element).css("margin-left") == '350px')
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
					$(element).width(350);
			}		
			else {
					if ($(element).width() == 350)
						$(element).width(0);
			}
		}
	}
};

