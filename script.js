if ("geolocation" in navigator) {
    /* geolocation is available */

    navigator.geolocation.getCurrentPosition(function(position) {
    
        console.log(position.coords.latitude, position.coords.longitude);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let queryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=" + apiKey;
        
        $.ajax({
            url: queryURL,
            method: "GET",
            success: (response) => {
                console.log(response);
                let city = response.name.toUpperCase();
                runAJAX(city);
            },
            error: (xhr) => {
                alert("Error code: " + xhr.response);
            }
        })
    
    });

  } else {
    /* geolocation IS NOT available */
    console.log("no local");
  }

//set city array to empty and api key
var cityArr = [];
var apiKey = "166a433c57516f51dfab1f7edaed8413";

//start by getting values from storage if they exist
getStorage();

//append li elements of cities from the city array
function generateCityList(){

    $("#cities").empty();
    cityArr.forEach((item) => {
        let li = $("<li>").attr({"class": "list-group-item list-link font-weight-bold", "id": item}).text(item);
        $("#cities").prepend(li);
    })

};

//stringify cities array and send to local storage
function pushToStorage() {    
    let jsonData = JSON.stringify(cityArr);
    localStorage.setItem("savedCities", jsonData);
};

//get saved array from storage and generate list of saved cities
function getStorage() {
    let storedData = localStorage.getItem("savedCities");
    console.log(storedData);
    if (storedData !== null){
        cityArr = JSON.parse(storedData);
        generateCityList();
    }
};

function runAJAX(city) {
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + city + ",us&APPID=" + apiKey,
      method: "GET",
      success: function(response){
        
        if ($.inArray(city, cityArr) === -1) {
            //add new city to array and push to storage
            cityArr.push(city);
            pushToStorage();
            //Generate up-to-date city list
            generateCityList();
        }

        //create all of the weather widgets
        currentWeater(city);
        createFiveDay(response);
      },
      error: function(xhr) {
          alert("Error " + xhr.status + ": Not a valid City");
      }
    })
};

function currentWeater(city) {
    
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + ",us&APPID=" + apiKey,
        method: "GET"
    }).then((response) => {
        let currentDate = moment().format("dddd[, ] MMMM Do[, ] YYYY");
        let iconcode = response.weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    
        $("#currentWeaterCard").attr("class", "card");
        $("#selectedCity").text(response.name + " (" + currentDate + ")" );
        $("#wicon").attr("src", iconurl);
        $("#wicon").css("display", "block");
        $("#currentDescription").text(response.weather[0].description);
        $("#currentTemp").text("Temperature: " + response.main.temp + " (F)");
        $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
        $("#currentWind").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#fiveDayH4").text("Five Day Forecast");
    })
}

function createFiveDay(response) {
    console.log(response);

    $("#fiveDay").empty();

    for(i=0 ; i<response.list.length; i+=8) {
        console.log(i);
        let iconcode = response.list[i].weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        let day = moment(response.list[i].dt_txt);
        
        let containerEl = $("<div>").attr("class", "futureDay card");
        let cardContainerEL = $("<div>").attr("class", "card-body");
        let iconEl = $("<img>").attr({"src": iconurl, "alt": "weather image"});
        let dowDiv = $("<div>").text(day.format("dddd")).attr({"class": "font-weight-bold dow"});
        let dateDiv = $("<div>").text(day.format("L"));
        let tempDiv = $("<div>").text("Temp " + response.list[i].main.temp + " (F)");
        let humidityDiv = $("<div>").text("Humidity: " + response.list[i].main.humidity + "%");

        cardContainerEL.append(dowDiv, dateDiv, iconEl, tempDiv, humidityDiv);
        containerEl.append(cardContainerEL);
        $("#fiveDay").append(containerEl);
    }
};

//event listener on serach button
//Search and pull up new city make api call, push to storage, generate updated list of cities
$("#newCity").on("click", function(e){
    e.preventDefault();
    //uppercase the added city
    let city = $("#cityInput").val().toUpperCase();
    //API Call
    runAJAX(city);
    //clear input field before next addition
    $("#cityInput").val("");

});

//event listener on list of cities
//switch views between saved cities
$("#cities").on("click", "li", function(e){
    e.preventDefault();
    let city = $(this).attr("id");
    runAJAX(city);
})
