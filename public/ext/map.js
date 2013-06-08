(function(google, $, exports, Marrow){

  var Map = function(map, data){

    var that = this;

    that.body = $('body');
    that.google = google;
    that.ele = $(map);
    that.html = $('html');
    that.infoWindows = [];
    that.geoQueue = 0;

    that.LatLng = function(latLng){
      return new google.maps.LatLng(latLng[0], latLng[1]);
    };

    that.geocoder = new google.maps.Geocoder().geocode;

    //our basic variables
    that.map = new google.maps.Map(map, {
      zoom : 13,
      center : that.LatLng([33.9533, -117.3953]),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    });


    //start methods
    that.addMarkers = function(){
      var location = data[that.geoQueue];
        // need to geocode first
      if(location){
        that.markerLocation(location, that.geoQueue, that.addMarkers)
        that.geoQueue++
      }
    };

    that.markerLocation = function(location, i, fn){
      that.geocoder({
        address : location.blockAddress + " Riverside Ca"
      },
      function(res, status){
        if(status === 'OK'){
          var good = res[0];
          location.position = good.geometry.location;
          that.Marker(location, i);
        }
        setTimeout(function(){fn();},700)
      })
    }

    that.Marker = function(location, index){
      var opts = {
        position : new google.maps.LatLng(location.position.lat(), location.position.lng()),
        icon : {
          path : google.maps.SymbolPath.CIRCLE,
          scale : 5,
          fillColor: "#ff4949",
          fillOpacity: 0.7,
          strokeColor: "#ff4949",
          strokeWeight: 2
        },
        map : that.map
      };

      var marker = new google.maps.Marker(opts);

      google.maps.event.addListener(marker, "click", function(){
        that.emit("locationSelected", data[index]);
      });

    };

    that.init = function(){
      if( typeof data === "object" && data.length ){
        that.addMarkers();
      }
    };

    that.Center = function(lat, lng){
      that.map.panTo(that.LatLng([lat, lng]));
    };

    that.init();
    return this;
  };

  Map = Marrow(Map);

  exports.Map = Map;

}(google, jQuery, this, Marrow));