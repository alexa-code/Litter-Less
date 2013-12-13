$(function() {
	$(document).foundation();
	
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
		for (var i = 0; i < other_markers.length; i++) {
			var coords = other_markers[i];
			var coordX = coords[0];
			var coordY = coords[1];
			var marker = new google.maps.Marker({
		    	position: new google.maps.LatLng(coordX, coordY),
		    	icon: 
		      		'img/recycling.png'
		    	,
		    	draggable: true,
		    	map: map
		  	});
		}
	}

	function initialize(x, y) {
	  var mapOptions = {
	    zoom: 17,
	    center: new google.maps.LatLng(x, y),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  };
	  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
          function (position) {
          	  var currLat = position.coords.latitude;
          	  var currLng = position.coords.longitude;
          	  currX = currLat;
          	  currY = currLng;
              var initialLocation = new google.maps.LatLng(currLat, currLng);
              map.setCenter(initialLocation);
              updateCurrPos(currLat, currLng);
          }, function(error) { console.log(error.message);
          }
          );
      }
	  map = new google.maps.Map(document.getElementById('map_canvas'),
	      mapOptions);
	  updateMarkers();

	}

	function reinitialize(x, y) {
		google.maps.event.addDomListener(window, 'load', initialize(x, y));
	}
	reinitialize(currX, currY);

	function attempt_sign_in() {
		var username = $("#username-input").val();
		var password = $("#password-input").val();
		$(".reveal-modal-bg").remove();
		// Check if username exists in "database"
		if (db_usernames.indexOf(username) > -1 && (password == db_password)) {
			$("#user").html("<h1 style='margin-top:20px'>Hi, " + username + "!</h1>");
			$(".sign-in").html("<h4>View Profile</h4>");
			$(".sign-in").addClass("view-profile").removeClass("sign-in");
		} else {
			$("#signInPopup").attr("class","reveal-modal");
		}
		// Clear previous inputs
		$("#signInPopup input").val("");
		$("#signInPopup").hide();
	}

	$(".sign-in").on("click", function() {
		if ($(this).text() == "Sign In") {
			$("#signInPopup").foundation("reveal", {
				dismissModalClass: "close-reveal-modal"
			});
			$("#signInPopup").foundation("reveal","open");

			$("#sign-in-btn").on("click", function() {
				attempt_sign_in();
			});

			$("#signInPopup input").bind("keypress", function(evt) {
				if (evt.keyCode == 13) {
					attempt_sign_in();
				}
			});
		}

	});

	$(".under-construction").on("click", function() {
		$("#home-screen").css("display","none");
		$("#construction-screen").css("display","inline");
	});

	$(document).on("click", ".view-profile", function() {
		$("#home-screen").css("display","none");
		$("#profile-screen").css("display", "inline");
	});

		$(".back-button").on("click", function() {
		$("#home-screen").css("display","inline");
		reinitialize(currX, currY);
		$("#map-screen").css("display","none");
		$("#profile-screen").css("display","none");
		$("#construction-screen").css("display","none");
	});
});