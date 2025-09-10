let unit = 'metric';
let lastsCity = '';

const loader = document.getElementById('loader');
const resultElem = document.querySelector('.result');
const darkToggle = document.getElementById('darkModeToggle');
const weatherIconElem = document.querySelector('.weather-icon');
const unitToggle = document.getElementById('unitToggle'); 
const searchButton = document.getElementById('searchButton');
const messageElem = document.querySelector('.message');
const forecastContainer = document.querySelector('.forecast');

const API_KEY = "82273e6ac90204d2a2d661b0787fe23b"; 

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    darkToggle.textContent = '☀️ Light Mode';
  } else {
    darkToggle.textContent = '🌙 Dark Mode';
  }
});

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    darkToggle.textContent = '☀️ Light Mode';
    localStorage.setItem('theme', 'dark');
  } else {
    darkToggle.textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'light');
  }
});

document.getElementById('cityInput').addEventListener('keypress', (e) => {
  if(e.key === 'Enter') getWeather();
});

unitToggle.addEventListener('click', () => {
  unit = (unit === 'metric') ? 'imperial' : 'metric';
  unitToggle.textContent = (unit === 'metric') ? '°F' : '°C';
  getWeather();
});

searchButton.addEventListener('click', getWeather);

function getWeather() {
  let cityname = document.getElementById('cityInput').value.trim();
  if(!cityname && !lastsCity) {
    messageElem.textContent =('Please enter a city name');
    return;
  }
  cityname = cityname || lastsCity;
  lastsCity = cityname;

  messageElem.textContent = ""; 
  fetchWeather(cityname);
}

function fetchWeather(cityname) {
  loader.classList.add('visible');
  loader.classList.remove('fade-out');
  resultElem.classList.remove('visible');
  forecastContainer.innerHTML = '';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "404") {
        loader.classList.remove('visible');
        messageElem.textContent = ('City not found. Please try again.');
        return;
      }
      displayWeather(data);
      hideLoader();
    })
    .catch(err => {
      loader.classList.remove('visible');
      console.error('Error fetching data:', err);
      messageElem.textContent ='Failed to fetch weather data. Check your connection or API key.';
    });

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${API_KEY}&units=${unit}`)
    .then(res => res.json())
    .then(data => displayForecast(data))
    .catch(err => console.error('Forecast error:', err));
}

function hideLoader() {
  loader.classList.add('fade-out');
  setTimeout(() => {
    loader.classList.remove('visible', 'fade-out');
  }, 500);
}

function displayWeather(data) {
  const cityElem = document.querySelector('.city');
  const tempElem = document.querySelector('.temperature');
  const iconElem = document.querySelector('.weather-icon');
  const descElem = document.querySelector('.description');
  const detailsElem = document.querySelector('.details');

  cityElem.textContent = `${data.name}, ${data.sys.country}`;
  const temp = (unit === 'metric') ? Math.round(data.main.temp) : Math.round((data.main.temp * 9/5) + 32);
  tempElem.textContent = `${temp}°${unit === 'metric' ? 'C' : 'F'}`;
  descElem.textContent = data.weather[0].description;

  const weatherMain = data.weather[0].main.toLowerCase();

  iconElem.innerHTML = getIconHTML(weatherMain);
  const iconI = iconElem.querySelector('i');
  iconElem.className = 'weather-icon';
  iconElem.classList.remove('sunny', 'cloudy');
  iconI.classList.remove('rain', 'snow');

document.body.classList.remove('rainy', 'snowy');

  if (weatherMain.includes("rain")) {
    iconElem.classList.add("rain");
    for (let i = 0; i < 10; i++) {
      const drop = document.createElement("div");
      drop.classList.add("raindrop");
      drop.style.left = Math.random() * 50 + "px";
      drop.style.animationDelay = Math.random() + "s";
      iconElem.appendChild(drop);
    }
    document.body.classList.add("rainy");
  }

  if (weatherMain.includes("snow")) {
    iconElem.classList.add("snow");
    for (let i = 0; i < 10; i++) {
      const flake = document.createElement("div");
      flake.classList.add("snowflake");
      flake.style.left = Math.random() * 50 + "px";
      flake.style.animationDelay = Math.random() * 2 + "s";
      iconElem.appendChild(flake);
    }
    document.body.classList.add("snowy");
  }

  if (weatherMain.includes("cloud")) iconElem.classList.add('cloudy');
  if (weatherMain.includes("clear")) iconElem.classList.add('sunny');

  detailsElem.textContent = `Humidity: ${data.main.humidity}% | Wind: ${Math.round(data.wind.speed)} m/s`;

  resultElem.classList.add('visible');
}

function displayForecast(data) {
  forecastContainer.innerHTML = ''; 

  for (let i = 7; i < data.list.length; i += 8) { 
    const forecast = data.list[i];
    const card = document.createElement('div');
    card.classList.add('forecast-card');

    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(forecast.main.temp);
    const weatherMain = forecast.weather[0].main.toLowerCase();

    card.innerHTML = `
      <div class="day">${day}</div>
      <div class="icon">${getIconHTML(weatherMain)}</div>
      <div class="temp">${temp}°${unit === 'metric' ? 'C' : 'F'}</div>
    `;
    forecastContainer.appendChild(card);
  }
}

function getIconHTML(weatherMain) {
  if(weatherMain.includes('cloud')) return '<i class="fas fa-cloud"></i>';
  if(weatherMain.includes('rain')) return '<i class="fas fa-cloud-showers-heavy"></i>';
  if(weatherMain.includes('clear')) return '<i class="fas fa-sun"></i>';
  if(weatherMain.includes('snow')) return '<i class="fas fa-snowflake"></i>';
  if(weatherMain.includes('thunderstorm')) return '<i class="fas fa-bolt"></i>';
  return '<i class="fas fa-smog"></i>';
}
