document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("grid_container").style.height = document.documentElement.scrollHeight - document.getElementById("header").style.height - document.getElementById("settings_btn").style.height - 290 + "px";
    document.getElementById("heatmap_btn").onclick = function() {
        document.getElementById("heatmap").style.display = "block";    
        setup_map();
    }
    document.getElementById("heatmap_back_button").onclick = function() {
        document.getElementById("heatmap").style.display = "none";    
    }
    document.getElementById("forecast_btn").onclick = function() {
        document.getElementById("forecast").style.display = "block";    
    }
    document.getElementById("forecast_back_button").onclick = function() {
        document.getElementById("forecast").style.display = "none";    
    }
    document.getElementById("country_code_btn").onclick = function() {
        doCORSRequest({
            method: 'GET',
            url: "https://safe-badlands-28245.herokuapp.com/crovid-go-api/" + document.getElementById("country_code_input").value,
          }, function printResult(result) {
            result_json=JSON.parse(result.split("\n")[3]);
            for (var key in result_json) {
                if (result_json.hasOwnProperty(key)) {
                    document.getElementById("forecast_output").innerHTML += key + " -> " + result_json[key] + "<br>";
                }
            }
          });
    }
}, false);


function setup_map() {
    map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: -34.397, lng: 150.644 },
        zoom: 13,
        disableDefaultUI: true
	  });
	  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

	
	infoWindow = new google.maps.InfoWindow();

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		setTimeout(function(){ 
			navigator.geolocation.getCurrentPosition(
				(position) => {
				  const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				  };
				  infoWindow.setPosition(pos);
				  
				  infoWindow.open(map);
				  map.setCenter(pos);
				},
				() => {
				  handleLocationError(true, infoWindow, map.getCenter());
				}
			  );
		}, 100);
	  
	} else {
	  // Browser doesn't support Geolocation
	  handleLocationError(false, infoWindow, map.getCenter());
	}
  }
  
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(
	  browserHasGeolocation
		? "Error: The Geolocation service failed."
		: "Error: Your browser doesn't support geolocation."
	);
	infoWindow.open(map);
}


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + options.url);
  x.onload = x.onerror = function() {
    printResult(
      options.method + ' ' + options.url + '\n' +
      x.status + ' ' + x.statusText + '\n\n' +
      (x.responseText || '')
    );
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  x.send(options.data);
}