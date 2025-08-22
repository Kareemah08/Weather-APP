const API_KEY = "82273e6ac90204d2a2d661b0787fe23b"; 
const loader = document.getElementById('loader');
const resultElem = document.querySelector('.result');
const darkToggle = document.getElementById('darkModeToggle');
const weatherIconElem = document.querySelector('.weather-icon');

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

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    alert('Please enter a city name');
    return;
  }
  fetchWeather(city);
}

function fetchWeather(city) {
  loader.classList.add('visible');
  loader.classList.remove('fade-out');
  resultElem.classList.remove('visible');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "404") {
        loader.classList.remove('visible');
        alert('City not found. Please try again.');
        return;
      }
      displayWeather(data);
      hideLoader();
    })
    .catch(err => {
      loader.classList.remove('visible');
      console.error('Error fetching data:', err);
      alert('Failed to fetch weather data. Check your connection or API key.');
    });
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
  tempElem.textContent = `${Math.round(data.main.temp)}°C`;
  descElem.textContent = data.weather[0].description;

  const weatherMain = data.weather[0].main.toLowerCase();
  let iconHTML = '';
  iconElem.className = 'weather-icon'; // reset classes

  if (weatherMain.includes('cloud')) {
    iconHTML = `<i class="fas fa-cloud"></i>`;
    iconElem.classList.add('cloudy');
  } else if (weatherMain.includes('rain')) {
    iconHTML = `<i class="fas fa-cloud-showers-heavy"></i>`;
  } else if (weatherMain.includes('clear')) {
    iconHTML = `<i class="fas fa-sun"></i>`;
    iconElem.classList.add('sunny');
  } else if (weatherMain.includes('snow')) {
    iconHTML = `<i class="fas fa-snowflake"></i>`;
  } else if (weatherMain.includes('thunderstorm')) {
    iconHTML = `<i class="fas fa-bolt"></i>`;
  } else {
    iconHTML = `<i class="fas fa-smog"></i>`;
  }

  iconElem.innerHTML = iconHTML;
  detailsElem.textContent = `Humidity: ${data.main.humidity}% | Wind: ${Math.round(data.wind.speed)} m/s`;

  resultElem.classList.add('visible');
}
