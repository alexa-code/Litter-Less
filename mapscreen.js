$(function() {

	var map;
	var currX = 38.986067;
	var currY = -76.942666;
	function updateCurrPos(x, y) {
		var marker = new google.maps.Marker({
	    	position: new google.maps.LatLng(x, y),
	    	icon: 
	      		'img/bluecircle.png'
	    	,
	  	   	draggable: true,
		   	map: map
		});
	}
	function updateMarkers(x, y) {
		if (x != null && y != null) {
			markers.push([x,y]);
		}
		for (var i = 0; i < markers.length; i++) {
			var coords = markers[i];
			var coordX = coords[0];
			var coordY = coords[1];
			var marker = new google.maps.Marker({
		    	position: new google.maps.LatLng(coordX, coordY),
		    	icon: 
		      		'img/trash-icon.png'
		    	,
		    	draggable: true,
		    	map: map
		  	});
		}
	}

	function initialize_big_map(x, y, coordX, coordY) {
	  var mapOptions = {
	    zoom: 19,
	    center: new google.maps.LatLng(x, y),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  };

      updateCurrPos(x, y);

	  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
          function (position) {
          	  var currLat = position.coords.latitude;
          	  currX = currLat;
          	  var currLng = position.coords.longitude;
          	  currY = currLng;
              var initialLocation = new google.maps.LatLng(currLat, currLng);
              map.setCenter(initialLocation);
              updateCurrPos(currLat, currLng);
          }, function(error) { console.log("failed");
          }, {maximumAge:Infinity, timeout:2000}
          );
      }
      map = new google.maps.Map(document.getElementById('full_map_canvas'),
	      mapOptions);
     updateMarkers(coordX, coordY);
      $("#full_map_canvas").show();
    }

    initialize_big_map(currX, currY, null, null);

	$(".nearest-bin").on("click", function() {
		$("#home-screen").css("display","none");
		$("#map-screen").css("display","inline");
		if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
          function (position) {
              var lat = position.coords.latitude;
              var lng = position.coords.longitude;
              initialize_big_map(lat, lng, null, null);
          }, function(error) { console.log("failed");
          }, {maximumAge:Infinity, timeout:2000}
        );
      }
	});

	function add_bin() {
		if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
          function (position) {
              var lat = position.coords.latitude;
              var lng = position.coords.longitude;
              initialize_big_map(lat, lng, lat, lng);
          }, function(error) { console.log("failed"); add_bin();
          }, {maximumAge:Infinity, timeout:1000}
        );
      }
	}
	$(".new-bin").on("click", function() {
		add_bin();
	});


});