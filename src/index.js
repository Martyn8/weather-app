let dayTime = document.querySelector("#dayTimePlace");
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let dayTimeFormatted = `${
  days[now.getDay()]
} ${now.getHours()}:${now.getMinutes()}`;
dayTime.innerHTML = dayTimeFormatted;

//WEATHER API
let apiKey = "210d99196a88b9257ed8cb3535a0a0c5";

let submitButton = document.querySelector("form");

submitButton.addEventListener("submit", function (event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let cityPlace = document.querySelector("#cityPlace");

  if (cityInput.value) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;

    axios.get(url).then(displayWeather);
    //console.log(axios.get(url).then(displayWeather));
  }
});

function makeUrl(x, y) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${x}&lon=${y}&appid=${apiKey}&units=metric`;

  console.log(url);

  axios.get(url).then(displayWeather);
}

function locateMe(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(lat);
  console.log(lon);
  makeUrl(lat, lon);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", function (event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(locateMe);
});

function displayWeather(response) {
  let temperatureDispNow = document.querySelector("#current-temp");
  let temperatureDispDay = document.querySelector("#min-max-temp");
  let currentTemp = Math.round(response.data.main.temp);
  let maxTemp = Math.round(response.data.main.temp_max);
  let minTemp = Math.round(response.data.main.temp_min);
  let detail = response.data.weather[0].description;

  console.log(response.data);
  console.log(detail);

  temperatureDispNow.innerHTML = `${currentTemp}°C  <br/>${detail}`;
  temperatureDispDay.innerHTML = `${maxTemp}°C / ${minTemp}°C`;

  cityPlace.innerHTML = response.data.name;
}
