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
let celsiusTemp = null;

startLocation();
function startLocation() {
  let startUrl = `https://api.openweathermap.org/data/2.5/weather?q=Warsaw&appid=${apiKey}&units=metric`;
  axios.get(startUrl).then(displayWeather);
}

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
  // let temperatureDispDay = document.querySelector("#min-max-temp");
  let currentWInd = document.querySelector("#wind-speed");
  let icon = document.querySelector("#today-icon");
  celsiusTemp = response.data.main.temp;
  let currentTemp = Math.round(celsiusTemp);
  let description = document.querySelector("#desc");
  let maxTemp = Math.round(response.data.main.temp_max);
  let minTemp = Math.round(response.data.main.temp_min);
  let detail = response.data.weather[0].description;
  let wind = Math.round(response.data.wind.speed);

  console.log(response.data);
  console.log(detail);

  temperatureDispNow.innerHTML = `${currentTemp}`;
  description.innerHTML = `${detail}`;
  //temperatureDispDay.innerHTML = `${maxTemp}°C / ${minTemp}°C`;
  currentWInd.innerHTML = `${wind} `;
  console.log(icon);
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  cityPlace.innerHTML = response.data.name;
}

//UNIT CONVESION

let fahrenheitLink = document.querySelector("#fahrenheit-conv");
fahrenheitLink.addEventListener("click", convertCToF);

let celsiusLink = document.querySelector("#celsius-conv");
celsiusLink.addEventListener("click", convertFToC);

function convertCToF(event) {
  event.preventDefault();

  let convertedTemp = document.querySelector("#current-temp");
  fahrenheitTemp = Math.round(celsiusTemp * (9 / 5) + 32);
  console.log(fahrenheitTemp);
  convertedTemp.innerHTML = fahrenheitTemp;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function convertFToC(event) {
  event.preventDefault();

  let convertedTemp = document.querySelector("#current-temp");
  convertedTemp.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}
