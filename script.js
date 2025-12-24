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
const humidityMb = document.getElementById("humidity-mb");
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
const icon1 = document.getElementById("icon-1");
const icon2 = document.getElementById("icon-2");
const icon3 = document.getElementById("icon-3");
const icon4 = document.getElementById("icon-4");

const API_KEY = "2e362a2bbc766ceb82b15aba7c617f38";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cities = ["Hyderabad", "Bangalore", "Delhi", "Mumbai", "Moscow"];

let temp_scale = "C";
let cData = {};
let mainCity;

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
      errorMessage.classList.remove("hidden");
      search.style.color = "#f40909";
    }
  } catch (error) {
    console.log("error: ", error);
    errorMessage.textContent = "Something went wrong. Try again!";
    errorMessage.classList.remove("hidden");
    search.style.color = "#f40909";
  } finally {
    loader.style.display = "none";
  }
}

async function fetchAllCitiesWeather(temp_scale, mainCity) {
  try {
    const allCitiesWeather = cities.map((city) => fetchWeather(city));
    const responses = await Promise.all(allCitiesWeather);

    loader.style.display = "none";
    container.style.display = "flex";

    let mainCityDetails;

    if (mainCity) {
      mainCityDetails = await fetchWeather(mainCity);
    } else {
      mainCityDetails = responses[0];
    }

    displayCityDetails(mainCityDetails, temp_scale);
    cData = { ...mainCityDetails };

    cityTemp1.textContent = fetchTemp(responses[1].main.temp);
    cityName1.textContent = responses[1].name;
    cityTemp2.textContent = fetchTemp(responses[2].main.temp);
    cityName2.textContent = responses[2].name;
    cityTemp3.textContent = fetchTemp(responses[3].main.temp);
    cityName3.textContent = responses[3].name;
    cityTemp4.textContent = fetchTemp(responses[4].main.temp);
    cityName4.textContent = responses[4].name;

    let f_temp_1 = convertKelvinToFahrenheit(responses[1].main.temp);
    let c_temp_1 = convertKelvinToCelsius(responses[1].main.temp);
    let f_temp_2 = convertKelvinToFahrenheit(responses[2].main.temp);
    let c_temp_2 = convertKelvinToCelsius(responses[2].main.temp);
    let f_temp_3 = convertKelvinToFahrenheit(responses[3].main.temp);
    let c_temp_3 = convertKelvinToCelsius(responses[3].main.temp);
    let f_temp_4 = convertKelvinToFahrenheit(responses[4].main.temp);
    let c_temp_4 = convertKelvinToCelsius(responses[4].main.temp);

    fetchIconUrl(icon1, f_temp_1, c_temp_1);
    fetchIconUrl(icon2, f_temp_2, c_temp_2);
    fetchIconUrl(icon3, f_temp_3, c_temp_3);
    fetchIconUrl(icon4, f_temp_4, c_temp_4);
  } catch (error) {
    console.log("error: ", error);
    loader.style.display = "none";
    container.style.display = "flex";
  }
}

fetchAllCitiesWeather(temp_scale, mainCity);

async function displayCityDetails(data) {
  loader.style.display = "none";
  container.style.display = "flex";
  mainCityName.textContent = data.name;
  cityTemperature.textContent = fetchTemp(data.main.temp);

  tempMax.textContent = fetchTemp(data.main.temp_max);
  tempMin.textContent = fetchTemp(data.main.temp_min);
  humidity.textContent = data.main.humidity;
  humidityMb.textContent = data.main.humidity;

  const feelsLikeTempVal = fetchTemp(data.main.feels_like);
  feelsLikeTemp.textContent = feelsLikeTempVal;
  if (feelsLikeTempVal <= 5) {
    weatherCondition.textContent = "Freezing";
  } else if (feelsLikeTempVal >= 18 && feelsLikeTempVal <= 27) {
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
  let mainCity = document.getElementById("search")?.value;
  fetchAllCitiesWeather(temp_scale, mainCity);
  degNotation.forEach((deg) => {
    deg.textContent = "°F";
  });
  fahrenheitBtn.classList.add("select-temp-scale");
  celsiusBtn.classList.remove("select-temp-scale");
  celsiusBtn.classList.add("deselect-temp-scale");
});

celsiusBtn.addEventListener("click", function () {
  temp_scale = "C";
  let mainCity = document.getElementById("search")?.value;
  fetchAllCitiesWeather(temp_scale, mainCity);
  degNotation.forEach((deg) => {
    deg.textContent = "°C";
  });
  celsiusBtn.classList.add("select-temp-scale");
  fahrenheitBtn.classList.remove("select-temp-scale");
  fahrenheitBtn.classList.add("deselect-temp-scale");
});

function convertKelvinToFahrenheit(temp) {
  return Math.ceil((temp - 273.15) * (9 / 5) + 32);
}

function convertKelvinToCelsius(temp) {
  return Math.ceil(temp - 273.15);
}

function fetchTemp(kTemp) {
  return temp_scale == "F"
    ? convertKelvinToFahrenheit(kTemp)
    : convertKelvinToCelsius(kTemp);
}

function fetchIconUrl(icon, f_temp, c_temp) {
  if (f_temp <= 41 || c_temp <= 5) {
    icon.src = "assets/images/snowflake.png";
  } else if (f_temp <= 72 || c_temp <= 22) {
    icon.src = "assets/images/clouds-img.png";
  } else if (f_temp <= 100 || c_temp <= 38) {
    icon.src = "assets/images/sun.png";
  }
}
