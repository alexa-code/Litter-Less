$(function() {

	var map;
	var markers_latlng = [(new google.maps.LatLng(38.9825, -76.94355)), 
		(new google.maps.LatLng(38.989903, -76.936427))];
	var currX = 38.986067;
	var currY = -76.942666;

	function calculateDistances() {
	    var service = new google.maps.DistanceMatrixService();
	    service.getDistanceMatrix({
	        origins: [new google.maps.LatLng(currX, currY)], 
	        destinations: markers_latlng, 
	        travelMode: google.maps.TravelMode.WALKING,
	        unitSystem: google.maps.UnitSystem.METRIC
	    }, callback);
	}

	function callback(response, status) {
	        var routes = response.rows[0];
	        var lowest = 100000;
	        var tmp;
	        var shortestRouteIdx;
	        for (var i = routes.elements.length - 1; i >= 0; i--) {
	            tmp = routes.elements[i].duration.value;
	            if (tmp < lowest) {
	                lowest = tmp;
	                shortestRouteIdx = i;
	            }
	        }
	        var shortestRoute = markers_latlng[shortestRouteIdx];
	        calculateRoute(new google.maps.LatLng(currX,currY), shortestRoute)
	}

	function calculateRoute(start, end) {
		directionsDisplay = new google.maps.DirectionsRenderer();
	    var request = {
	        origin: start,
	        destination: end,
	        travelMode: google.maps.TravelMode.WALKING
	    };
	    var directionsService = new google.maps.DirectionsService();
	    directionsDisplay.setMap(map);
	    directionsDisplay.setOptions( { suppressMarkers:true, preserveViewport:true } );
	    directionsService.route(request, function (result, status) {
	        if (status == google.maps.DirectionsStatus.OK) {
	            directionsDisplay.setDirections(result);
	        }
	    });
	}


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
			markers_latlng.push(new google.maps.LatLng(x,y));
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
		    	// draggable: true,
		    	map: map
		  	});
		}
	}

	function initialize_big_map(x, y, coordX, coordY) {
	  var mapOptions = {
	    zoom: 18,
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
     calculateDistances();
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

		$("#successfully-added").foundation("reveal","open");
		setTimeout(function() {$("#successfully-added").hide();
					$(".reveal-modal-bg").remove();
					$("#successfully-added").attr("class","reveal-modal");
		}, 3000);
	});


});