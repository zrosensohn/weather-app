if ("geolocation" in navigator) {
    /* geolocation is available */

    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position);
        //position.coords.latitude, position.coords.longitude
      });

  } else {
    /* geolocation IS NOT available */
    console.log("no local");
  }

