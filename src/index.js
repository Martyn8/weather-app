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

  //convert in forecast
  let allRowsTemp = document.querySelectorAll("#forecast-rows-temp");
  console.log(allRowsTemp);

  allRowsTemp.forEach(function (card) {
    console.log(card.children["forecast-max-temp"].innerHTML);

    let currentMaxTemp = card.children["forecast-max-temp"].innerHTML;
    let fMaxTemp = Math.round(currentMaxTemp * (9 / 5) + 32);
    card.children["forecast-max-temp"].innerHTML = fMaxTemp;

    let currentMinTemp = card.children["forecast-min-temp"].innerHTML;
    let fMinTemp = Math.round(currentMinTemp * (9 / 5) + 32);
    card.children["forecast-min-temp"].innerHTML = fMinTemp;

    let currentUnit = card.children["forecast-unit"];
    currentUnit.innerHTML = "°F";
  });

  // console.log(allMaxTemp);

  // allMaxTemp.forEach(function (card) {
  //   console.log(card.innerHTML);
  //   let fTemp = Math.round(card.innerHTML * (9 / 5) + 32);
  //   card.innerHTML = fTemp;
  //   let funit = document.querySelector;
  //});
}

function convertFToC(event) {
  event.preventDefault();

  let convertedTemp = document.querySelector("#current-temp");
  convertedTemp.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  //convert in forecast
  let allRowsTemp = document.querySelectorAll("#forecast-rows-temp");
  console.log(allRowsTemp);

  allRowsTemp.forEach(function (card) {
    console.log(card.children["forecast-max-temp"].innerHTML);

    let currentMaxTemp = card.children["forecast-max-temp"].innerHTML;
    let cfMaxTemp = Math.round((5 / 9) * (currentMaxTemp - 32));
    card.children["forecast-max-temp"].innerHTML = cfMaxTemp;

    let currentMinTemp = card.children["forecast-min-temp"].innerHTML;
    let cMinTemp = Math.round((5 / 9) * (currentMinTemp - 32));
    card.children["forecast-min-temp"].innerHTML = cMinTemp;

    let currentUnit = card.children["forecast-unit"];
    currentUnit.innerHTML = "°C";
  });
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
    <div class="card day-${index + 1}">
      <div class="row icon">
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            day.condition.icon
          }.png"
          alt="forecast icon"
        />
      </div>
      <div class="row temp" id="forecast-rows-temp">
        <span class="forecast-max-temp" id="forecast-max-temp">${maxTemp}</span>/<span id="forecast-min-temp"
        >${minTemp}</span><span id="forecast-unit">°C</span>
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
