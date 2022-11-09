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
var Type;

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
      console.log(data);
      weatherForcast = data.current;
      travelDatesQuestion();
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
  contentContainerEl.html(` <h3>What type of travel?</h3>
      <select id="travelTypeInput">
        <option>Adventure</option>
        <option>Leisure</option>
        <option>Business</option>
      </select>
      <button type="button" class="btn btn-primary" id="travelTypeBtn">Next</button>`);

  var travelTypeEl = $("#travelTypeInput");

  $("#travelTypeBtn").click(function () {
    type = travelTypeEl.val();
    //call next step
    console.log(type);
    whatToPack();
  });
}

function whatToPack() {
  contentContainerEl.html(` <h3>This is what you should pack</h3>`);
  //write logic for what to pack using if statements
}

//get api key when application starts
getApiKey();

searchBtn.on("click", function () {
  //grab input value from inputEl,
  //call searchCity
  var inputVal = inputEl.val();
  searchCity(inputVal);
});
