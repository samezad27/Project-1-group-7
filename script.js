var inputEl = $("#cityInput");
var searchBtn = $("#searchBtn")
var apikey;

function getApiKey(){
    var keyHash = "dY2UA0fTD_8azsRD7YFEg"
    fetch(
        `https://ljgvrb40q2.execute-api.us-west-2.amazonaws.com/dev/keyprr/${keyHash}`
      )
        .then((res) => res.json())
        .then(({ data }) => (apikey = data));
};

function searchCity(city){
    var requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`
    fetch(requestURL)
    .then(function(res){
        return res.json()
    }).then(function(data){
        console.log(data);
        //get back geocode data here
        var lon = data[0].lon;
        var lat = data[0].lat;
        searchWeatherByLatLng(lat, lon)
    })
}

function searchWeatherByLatLng(lat, lon){
    var requestURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apikey}&units=imperial`;
    fetch(requestURL)
    .then(function(res){
        return res.json()
    }).then(function(data){
        //here I'm getting the one call data, need to now convert to view
        console.log(data);})
        displayWeatherData(data)
}

function displayWeatherData(weatherData){

}


//get api key when application starts
getApiKey();

searchBtn.on("click", function(){
    //grab input value from inputEl,
    //call searchCity
    var inputVal = inputEl.val();
    searchCity(inputVal)
})
