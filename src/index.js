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
    //console.log(axios.get(url).then(displayWeather));
  }
});

function makeUrl(x, y) {
  let url = `https://api.shecodes.io/weather/v1/current?lon=${y}&lat=${x}&key=${apiKey}&units=metric`;

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
  console.log(response);
  let temperatureDispNow = document.querySelector("#current-temp");
  // let temperatureDispDay = document.querySelector("#min-max-temp");
  let currentWInd = document.querySelector("#wind-speed");
  let icon = document.querySelector("#today-icon");
  console.log(icon);
  icon.setAttribute(
    "src",
    `    http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png
`
  );
  celsiusTemp = response.data.temperature.current;
  let currentTemp = Math.round(celsiusTemp);
  let description = document.querySelector("#desc");
  // let maxTemp = Math.round(response.data.main.temp_max);
  // let minTemp = Math.round(response.data.main.temp_min);
  let detail = response.data.condition.description;
  let wind = Math.round(response.data.wind.speed);

  console.log(response.data);
  console.log(detail);

  temperatureDispNow.innerHTML = `${currentTemp}`;
  description.innerHTML = `${detail}`;
  //temperatureDispDay.innerHTML = `${maxTemp}°C / ${minTemp}°C`;
  currentWInd.innerHTML = `${wind} `;

  cityPlace.innerHTML = response.data.city;

  getForecast();
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

//Forecast
function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElem = document.querySelector("#row-forecast");

  let forecastHTML = "";

  let days = ["mon", "Tue", "WED", "Thu", "fri"];

  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `            
  <div class="col">
    <div class="card day-one">
      <div class="row icon">
        <i class="fa-solid fa-cloud-sun"></i>
      </div>
      <div class="row temp">
        <span class="forecast-max-temp">18°C</span>/<span
        ="forecast-min-temp"
        >8°C</span>
      </div>
      <div class="row day">${day}</div>
    </div>
  </div>`;
  });

  //forecastHTML += `</div>`;

  forecastElem.innerHTML = forecastHTML;
}

function getForecast() {
  //

  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=warsaw&key=${apiKey}&units=metric`;
  //https://api.shecodes.io/weather/v1/forecast?lon={lon}&lat=latitude&key={key}
  console.log(forecastUrl);

  axios.get(forecastUrl).then(displayForecast);
}
