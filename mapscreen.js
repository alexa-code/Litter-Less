$(function() {

	var map;
	var markers_latlng = [(new google.maps.LatLng(38.9825, -76.94355)), 
		(new google.maps.LatLng(38.989404, -76.936427)),
		(new google.maps.LatLng(38.989799, -76.936526)),
		(new google.maps.LatLng(38.991099, -76.937226))];
	var currX = 38.986067;
	var currY = -76.942666;
	var currLatLng = new google.maps.LatLng(38.986067, -76.942666);

	function updateCurrPos(x, y) {
		var marker = new google.maps.Marker({
	    	position: new google.maps.LatLng(x, y),
	    	icon: 
	      		'img/bluecircle.png'
	    	,
	  	   	draggable: false,
		   	map: map
		});
	}
	function updateMarkers(x, y) {
		if (x != null && y != null) {
			markers.push([x,y]);
			markers_latlng.push(new google.maps.LatLng(x,y));
		}
		var map_markers = [];
		for (var i = 0; i < markers.length; i++) {
			var coords = markers[i];
			var coordX = coords[0];
			var coordY = coords[1];
			var marker = new google.maps.Marker({
		    	position: new google.maps.LatLng(coordX, coordY),
		    	icon: 
		      		'img/trash-icon.png'
		    	,
		    	draggable: false,
		    	map: map
		  	});
			map_markers.push(marker);
		}

		var not_full = '<div style="width:85px;height:75px"><h6>Trash Bin</h6><h3 style="margin-top:-7px">' +
			'<small><strong>Status:</strong></small></h3><h3 style="margin-top:-22px">' +
			'<small>Not full</small></h3>' +
			'<h3 style="margin-top:-7px"><small><strong>Distance:</strong></small></h3><h3 style="margin-top:-22px">' +
			'</div>';

		var full = '<div style="width:85px;height:75px"><h6>Trash Bin</h6><h3 style="margin-top:-7px">' +
			'<small><strong>Status:</strong></small></h3><h3 style="margin-top:-22px">' +
			'<small>Overflowing</small></h3>' + 
			'<h3 style="margin-top:-7px"><small><strong>Distance:</strong></small></h3><h3 style="margin-top:-22px">' +
			'</div>';

		var infowindow = new google.maps.InfoWindow({
			content: not_full 
		});
		var fullinfowindow = new google.maps.InfoWindow({
			content: full 
		});	
		for (var i = 0; i < map_markers.length; i++) {
			if (i!=1) {
				google.maps.event.addListener(map_markers[i], 'click', function() {
	    			infowindow.open(map,this);
	  			});
			} else {
				google.maps.event.addListener(map_markers[i], 'click', function() {
	    			fullinfowindow.open(map,this);
	  			});
			}
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
              currLatLng = new google.maps.LatLng(currLat, currLng);
              map.setCenter(currLatLng);
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

	$("#main-page-add").on("click", function() {
		$("#home-screen").css("display","none");
		
		add_bin();

		$("#map-screen").css("display","inline");
		$("#successfully-added").foundation("reveal","open");
		setTimeout(function() {$("#successfully-added").hide();
		$(".reveal-modal-bg").remove();
		$("#successfully-added").attr("class","reveal-modal");
		}, 3000);
	});
	
	$(".new-bin").on("click", function() {
		add_bin();

		$("#successfully-added").foundation("reveal","open");
		setTimeout(function() {$("#successfully-added").hide();
					$(".reveal-modal-bg").remove();
					$("#successfully-added").attr("class","reveal-modal");
		}, 3000);
	});


});