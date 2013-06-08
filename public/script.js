(function( exports ){


  var 
  map,
  $info = $(".crime-info");
  ready = function(){
    map.on("locationSelected", function(crime){
      console.log(crime)
      $info.html("<h3>" + crime.crimeType + "</h3><ul><li>" + crime.callTime + "</ul>")
    });
  };

  $.ajax({
    url : "/latest",
    success : function( res ){
      map = new Map( document.getElementById("map"), res );
      ready();
    }
  });

  exports.map = map;


}( this ));