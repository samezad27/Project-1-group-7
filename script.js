var inputEl = $("#cityInput");
var searchBtn = $("#searchBtn");
var contentContainerEl = $(".content");
var grayLuggage = $("#luggage-gray-container");
var orangeLuggage = $("#luggage-orange-container");
var yellowLuggage = $("#luggage-yellow-container");
var blueLuggage = $("#luggage-blue-container");
var redLuggage = $("#luggage-red-container");
var weatherForcast;
var dateOfTravel;
var duration;
var apikey;
var type;
var cityName;
var isRaining;
var whatToPackItems = [];

function getApiKey() {
  $("#luggage-container").sortable({
    revert: true,
  });
  $("#luggage-container").disableSelection();

  $("#trolley").draggable({
    axis: "x",
  });
  var keyHash = "dY2UA0fTD_8azsRD7YFEg";
  fetch(
    `https://ljgvrb40q2.execute-api.us-west-2.amazonaws.com/dev/keyprr/${keyHash}`
  )
    .then((res) => res.json())
    .then(({ data }) => (apikey = data));
}

function searchCity(city) {
  var requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`;
  fetch(requestURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      cityName = data[0].local_names.en
      //get back geocode data here
      var lon = data[0].lon;
      var lat = data[0].lat;
      searchWeatherByLatLng(lat, lon);
    });
}

function searchWeatherByLatLng(lat, lon) {
  var requestURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apikey}&units=imperial`;
  fetch(requestURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      //here I'm getting the one call data, need to now convert to view
      //save this data globally
      console.log(data)
      weatherForcast = data.current;
      travelDatesQuestion();
      console.log(weatherForcast)
    });
  //   displayWeatherData(data)
}

function travelDatesQuestion() {
  grayLuggage.removeClass("active");
  orangeLuggage.addClass("active");
  contentContainerEl.html(` <h3>What day are you travelling?</h3>
<input type="date" id="dateInput">
<button type="button" class="btn btn-primary" id="dateBtn">Next</button>`);

  var dateEl = $("#dateInput");

  $("#dateBtn").click(function () {
    var dateTravel = dateEl.val();
    //validation first
    if (!dateTravel) {
      return;
    }
    //more validation for past dates or soemthing if you want
    console.log("date", dateTravel);
    dateOfTravel = dateTravel;
    travelDuration();
  });
}

function travelDuration() {
  orangeLuggage.removeClass("active");
  yellowLuggage.addClass("active");
  contentContainerEl.html(` <h3>How many days are you traveling</h3>
    <input id="durationInput" min=0 max=30 type="number"/>
    <button type="button" class="btn btn-primary" id="durationBtn">Next</button>`);

  var durationEl = $("#durationInput");

  $("#durationBtn").click(function () {
    duration = durationEl.val();
    //call next step
    travelType();
  });
}

function travelType() {
  yellowLuggage.removeClass("active");
  blueLuggage.addClass("active");
  contentContainerEl.html(` <h3>What type of travel?</h3>
      <select id="travelTypeInput">
        <option>Adventure</option>
        <option>Leisure</option>
        <option>Business</option>
      </select>
      <button type="button" class="btn btn-primary" id="travelTypeBtn">Next</button>`);

  $("#travelTypeBtn").click(function () {
    type = $("#travelTypeInput option:selected").text()
    whatToPack();
  });
}

function whatToPack() {
    //first list all data collected
    console.log("you're going to  ---- ", cityName);
    console.log("you're traveling for --- ", duration, " days");
    console.log("Travel type is --- ", type);
 
   
    blueLuggage.removeClass("active");
    redLuggage.addClass("active");
    contentContainerEl.html(` <h3>This is what you should pack</h3>`);
    //write logic for what to pack using if statements
    //INSERT IF STATEMENTS HERE ---- 
    //this packs some items based on travel type
    packTravelType();
    packRain();
    packTemperature();


    //TODO -- after doing what to pack, display them
    for(var i = 0 ; i< whatToPackItems.length; i ++){
        var item = whatToPackItems[i];
        contentContainerEl.append(`
        <h5>${item.name} x ${item.quantity}</h5>
        `)
        console.log("your item");
    }
}

function packTravelType(){
    if(type === "Adventure"){
        whatToPackItems.push({name: "Hiking Boots", quantity: 1});
    }else if(type === "Business") {
        whatToPackItems.push({name: "Dress Shoes", quantity: 1})
    }else {
        whatToPackItems.push({name: "Running Shoes", quantity: 1})
    }
}

function packRain(){
    var isRaining = weatherForcast.temp < weatherForcast.dew_point;
    if(isRaining){
        whatToPackItems.push({name: "Umbrella", quantity: 1}, {name: "Rain Jacket", quantity: 1})
        
    }else{
        //whatToPackItems.push({name: "No Rain!"})
        contentContainerEl.append(`
        <h5>Lucky for you! No rain expected during your travels.</h5>
        `)

    }
}

function packTemperature(){
    if(weatherForcast.temp<30){
        whatToPackItems.push({name: "Winter Hat", quantity: 1},{name: "Scarf", quantity: 1},{name: "Thermals", quantity: 1})
    }else if(weatherForcast.temp>30.1 && weatherForcast.temp<60){
        whatToPackItems.push({name: "Thermals", quantity: 1})
    }else if(weatherForcast.temp>80){
        whatToPackItems.push({name: "Sandals", quantity: 1},{name: "Swimsuit", quantity: 1},{name: "Shorts", quantity: 1},{name: "SPF-100", quantity: 1})

    }

}

//get api key when application starts
getApiKey();

searchBtn.on("click", function () {
  //grab input value from inputEl,
  //call searchCity
  var inputVal = inputEl.val();
  searchCity(inputVal);
});
