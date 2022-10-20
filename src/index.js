let dayTime = document.querySelector("#dayTimePlace");
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let dayTimeFormatted = `${
  days[now.getDay()]
} ${now.getHours()}:${now.getMinutes()}`;
dayTime.innerHTML = dayTimeFormatted;

//WEATHER API
let apiKey = "a19ca124f94a77a526tb0d337eo726eb";
let celsiusTemp = null;

startLocation();
function startLocation() {
  let startUrl = `https://api.shecodes.io/weather/v1/current?query=Warsaw&key=${apiKey}&units=metric`;
  axios.get(startUrl).then(displayWeather);
}

let submitButton = document.querySelector("form");

submitButton.addEventListener("submit", function (event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let cityPlace = document.querySelector("#cityPlace");

  if (cityInput.value) {
    let url = `https://api.shecodes.io/weather/v1/current?query=${cityInput.value}&key=${apiKey}&units=metric`;

    axios.get(url).then(displayWeather);
  }
});

function makeUrl(x, y) {
  let url = `https://api.shecodes.io/weather/v1/current?lon=${y}&lat=${x}&key=${apiKey}&units=metric`;

  axios.get(url).then(displayWeather);
}

function locateMe(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  makeUrl(lat, lon);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", function (event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(locateMe);
});

function displayWeather(response) {
  let temperatureDispNow = document.querySelector("#current-temp");
  let currentWInd = document.querySelector("#wind-speed");
  let icon = document.querySelector("#today-icon");

  icon.setAttribute(
    "src",
    `    http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png
`
  );
  celsiusTemp = response.data.temperature.current;
  let currentTemp = Math.round(celsiusTemp);
  let description = document.querySelector("#desc");
  let detail = response.data.condition.description;
  let wind = Math.round(response.data.wind.speed);
  temperatureDispNow.innerHTML = `${currentTemp}`;
  description.innerHTML = `${detail}`;
  currentWInd.innerHTML = `${wind} `;

  cityPlace.innerHTML = response.data.city;

  getForecast(response.data.city);
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

//Forecast

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);

  let day = date.getDay();

  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecastElem = document.querySelector("#row-forecast");

  let forecastHTML = "";

  let forecastData = response.data.daily;

  forecastData.forEach(function (day, index) {
    if (index < 5) {
      let maxTemp = Math.round(day.temperature.maximum);
      let minTemp = Math.round(day.temperature.minimum);
      forecastHTML =
        forecastHTML +
        `            
  <div class="col">
    <div class="card day-one">
      <div class="row icon">
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            day.condition.icon
          }.png"
          alt="forecast icon"
        />
      </div>
      <div class="row temp">
        <span class="forecast-max-temp">${maxTemp}°C</span>/<span
        ="forecast-min-temp"
        >${minTemp}C</span>
      </div>
      <div class="row day">${formatDay(day.time)}</div>
    </div>
  </div>`;
    }
  });

  forecastElem.innerHTML = forecastHTML;
}

function getForecast(city) {
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
}
