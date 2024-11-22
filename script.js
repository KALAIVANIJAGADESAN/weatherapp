"use strict";

const API = "959916491a41341ff3c44cb43cf9d550";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");
const locationBtnEl = document.querySelector(".btn_location");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
   "Sunday",
   "Monday",
   "Tuesday",
   "Wednesday",
   "Thursday",
   "Friday",
   "Saturday",
];

// Display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = date + " " + month + " " + year;

// Search button event
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // Check for empty input
  if (inputEl.value !== "") {
    const searchLocation = inputEl.value;
    inputEl.value = "";
    findLocation(searchLocation);
  } else {
    console.log("Please enter a city or country name");
  }
});

// Current Location button event
locationBtnEl.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      findLocationByCoords(latitude, longitude);
    }, error => {
      console.error("Error retrieving location:", error.message);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});

// Function to find location by city name
async function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();

    if (result.cod !== "404") {
      // Display image content and right-side content
      displayWeatherData(result);
      displayForeCast(result.coord.lat, result.coord.lon);
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Function to find location by coordinates
async function findLocationByCoords(lat, lon) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();

    if (result.cod !== "404") {
      // Display image content and right-side content
      displayWeatherData(result);
      displayForeCast(result.coord.lat, result.coord.lon);
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Display weather data (image and temperature)
function displayWeatherData(data) {
  const ImageContent = displayImageContent(data);
  const rightSide = rightSideContent(data);

  setTimeout(() => {
    iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
    iconsContainer.classList.add("fadeIn");
    dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
  }, 1500);
}

// Image and temperature display content
function displayImageContent(data) {
  const kelvinTemp = data.main.temp;
  const celsiusTemp = kelvinTemp - 273.15;
  const fahrenheitTemp = (celsiusTemp * 9 / 5) + 32;

  return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="" />
    <h2 class="weather_temp">${Math.round(celsiusTemp)}°C / ${Math.round(fahrenheitTemp)}°F</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// Right-side content for detailed weather info
function rightSideContent(result) {
  const kelvinTemp = result.main.temp;
  const celsiusTemp = kelvinTemp - 273.15;
  const fahrenheitTemp = (celsiusTemp * 9 / 5) + 32;

  return `<div class="content">
          <p class="title">NAME</p>
          <span class="value">${result.name}</span>
        </div>
        <div class="content">
          <p class="title">TEMP</p>
          <span class="value">${Math.round(celsiusTemp)}°C / ${Math.round(fahrenheitTemp)}°F</span>
        </div>
        <div class="content">
          <p class="title">HUMIDITY</p>
          <span class="value">${result.main.humidity}%</span>
        </div>
        <div class="content">
          <p class="title">WIND SPEED</p>
          <span class="value">${result.wind.speed} Km/h</span>
        </div>`;
}

// Display forecast data
async function displayForeCast(lat, lon) {
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
  const data = await fetch(ForeCast_API);
  const result = await data.json();
 
  const uniqueForecastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      return uniqueForecastDays.push(forecastDate);
    }
  });

  daysForecast.forEach((content, index) => {
    if (index <= 3) {
      listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
    }
  });
}

// Forecast display content
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()].slice(0, 3);

  const kelvinTemp = frContent.main.temp;
  const celsiusTemp = kelvinTemp - 273.15;
  const fahrenheitTemp = (celsiusTemp * 9 / 5) + 32;

  return `<li>
    <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png"/>
    <span>${dayName}</span>
    <span class="day_temp">${Math.round(celsiusTemp)}°C / ${Math.round(fahrenheitTemp)}°F</span>
  </li>`;
}

