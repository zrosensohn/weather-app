// if ("geolocation" in navigator) {
//     /* geolocation is available */

//     navigator.geolocation.getCurrentPosition(function(position) {
//         console.log(position);
//         //position.coords.latitude, position.coords.longitude
//       });

//   } else {
//     /* geolocation IS NOT available */
//     console.log("no local");
//   }

var cityArr = [];

function generateCityList(){

    $("#cities").empty();
    cityArr.forEach((item) => {
        let li = $("<li>").attr({"class": "list-group-item", "id": item}).text(item);
        $("#cities").prepend(li);
    })

};

function runAJAX(city) {
    let apiKey = "166a433c57516f51dfab1f7edaed8413";
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + city + ",us&APPID=" + apiKey,
      method: "GET"
    }).then(function(response){
      console.log(response);
    })
  };


$("#newCity").on("click", function(e){
    e.preventDefault();
    
    let city = $("#cityInput").val().toUpperCase();
    cityArr.push(city);

    //API Call
    runAJAX(city);
    
    // pushToStorage();
    generateCityList();

    //clear input field
    $("#cityInput").val("");

});