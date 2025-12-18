const weatherContainer = document.getElementById("weather-container");
const weatherCard = document.getElementById("weather-card");
const mainCityName = document.getElementById("main-city-name");
const cityTemperature = document.getElementById("city-temperature");
const weatherCondition = document.getElementById("weather-condition");
const feelsLikeTemp = document.getElementById("feels-like");
const tempMax = document.getElementById("temp_max");
const tempMin = document.getElementById("temp_min");
const otherCityName = document.getElementById("other-city-name");
const humidity = document.getElementById("humidity");
const searchContainer = document.getElementById("search-container");
const search = document.getElementById("search");
const errorMessage = document.getElementById("error-message");
const fahrenheitBtn = document.getElementById("fahrenheit");
const celsiusBtn = document.getElementById("celsius");
const degNotation = document.querySelectorAll(".deg-notation");
const loader = document.getElementById("loader");
const city1 = document.getElementById("city-1");
const cityTemp1 = document.getElementById("city-temp-1");
const cityName1 = document.getElementById("city-name-1");
const city2 = document.getElementById("city-2");
const cityTemp2 = document.getElementById("city-temp-2");
const cityName2 = document.getElementById("city-name-2");
const city3 = document.getElementById("city-3");
const cityTemp3 = document.getElementById("city-temp-3");
const cityName3 = document.getElementById("city-name-3");
const city4 = document.getElementById("city-4");
const cityTemp4 = document.getElementById("city-temp-4");
const cityName4 = document.getElementById("city-name-4");

const API_KEY = "2e362a2bbc766ceb82b15aba7c617f38";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cities = ["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Delhi"];

let temp_scale = "C";
let cData = {};

async function fetchWeather(city) {
  try {
    container.style.display = "none";
    loader.style.display = "block";
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}`;
    const response = await fetch(url);
    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";
    search.style.color = "";
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      errorMessage.textContent = "City not found!";
      errorMessage.classList.toggle("hidden");
      search.style.color = "#f40909";
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

async function fetchAllCitiesWeather(temp_scale) {
  try {
    const allCitiesWeather = cities.map((city) => fetchWeather(city));
    const responses = await Promise.all(allCitiesWeather);

    loader.style.display = "none";
    container.style.display = "flex";

    displayCityDetails(responses[0], temp_scale);
    cData = { ...responses[0] };

    cityTemp1.textContent =
      temp_scale == "F"
        ? Math.ceil((responses[1].main.temp - 273.15) * (9 / 5) + 32)
        : Math.ceil(responses[1].main.temp - 273.15);
    cityName1.textContent = responses[1].name;
    cityTemp2.textContent =
      temp_scale == "F"
        ? Math.ceil((responses[2].main.temp - 273.15) * (9 / 5) + 32)
        : Math.ceil(responses[2].main.temp - 273.15);
    cityName2.textContent = responses[2].name;
    cityTemp3.textContent =
      temp_scale == "F"
        ? Math.ceil((responses[3].main.temp - 273.15) * (9 / 5) + 32)
        : Math.ceil(responses[3].main.temp - 273.15);
    cityName3.textContent = responses[3].name;
    cityTemp4.textContent =
      temp_scale == "F"
        ? Math.ceil((responses[4].main.temp - 273.15) * (9 / 5) + 32)
        : Math.ceil(responses[4].main.temp - 273.15);
    cityName4.textContent = responses[4].name;
  } catch (error) {
    console.log("error: ", error);
    loader.style.display = "none";
    container.style.display = "flex";
  }
}

fetchAllCitiesWeather(temp_scale);

async function displayCityDetails(data) {
  loader.style.display = "none";
  container.style.display = "flex";
  mainCityName.textContent = data.name;
  cityTemperature.textContent =
    temp_scale == "F"
      ? Math.ceil((data.main.temp - 273.15) * (9 / 5) + 32)
      : Math.ceil(data.main.temp - 273.15);

  tempMax.textContent =
    temp_scale == "F"
      ? Math.ceil((data.main.temp_max - 273.15) * (9 / 5) + 32)
      : Math.ceil(data.main.temp_max - 273.15);
  tempMin.textContent =
    temp_scale == "F"
      ? Math.ceil((data.main.temp_min - 273.15) * (9 / 5) + 32)
      : Math.ceil(data.main.temp_min - 273.15);
  humidity.textContent = data.main.humidity;

  const feelsLikeTempVal =
    temp_scale == "F"
      ? Math.ceil((data.main.feels_like - 273.15) * (9 / 5) + 32)
      : Math.ceil(data.main.feels_like - 273.15);
  feelsLikeTemp.textContent = feelsLikeTempVal;
  if (feelsLikeTempVal >= 18 && feelsLikeTempVal <= 27) {
    weatherCondition.textContent = "Cloudy";
  } else if (feelsLikeTempVal >= 28 && feelsLikeTempVal <= 40) {
    weatherCondition.textContent = "Sunny";
  }
}

searchContainer.addEventListener("submit", async function (event) {
  event.preventDefault();
  loader.style.display = "none";
  container.style.display = "flex";
  try {
    let searchVal = search.value;

    const city = fetchWeather(searchVal);
    const cityData = await Promise.resolve(city);
    if (cityData) {
      displayCityDetails(cityData, "C");
    }
    loader.style.display = "none";
    container.style.display = "flex";
  } catch (e) {
    console.log("error: ", e);
    loader.style.display = "none";
    container.style.display = "flex";
  }
});

fahrenheitBtn.addEventListener("click", function () {
  temp_scale = "F";
  console.log("f temp_scale: ", temp_scale);
  fetchAllCitiesWeather(temp_scale);
  degNotation.forEach((deg) => {
    deg.textContent = "°F";
  });
  fahrenheitBtn.classList.add("select-temp-scale");
  celsiusBtn.classList.remove("select-temp-scale");
  celsiusBtn.classList.add("deselect-temp-scale");
});

celsiusBtn.addEventListener("click", function () {
  temp_scale = "C";
  console.log("c temp_scale: ", temp_scale);
  fetchAllCitiesWeather(temp_scale);
  degNotation.forEach((deg) => {
    deg.textContent = "°C";
  });
  celsiusBtn.classList.add("select-temp-scale");
  fahrenheitBtn.classList.remove("select-temp-scale");
  fahrenheitBtn.classList.add("deselect-temp-scale");
});
