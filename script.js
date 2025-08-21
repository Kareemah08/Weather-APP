const apiKey = "82273e6ac90204d2a2d661b0787fe23b"; 
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityNameEl = document.getElementById("city-name");
const localTimeEl = document.getElementById("local-time");
const weatherIconEl = document.getElementById("weather-icon");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const modeToggleBtn = document.getElementById("mode-toggle");
const animationContainer = document.getElementById("animation-container");


modeToggleBtn.addEventListener("click", () => document.body.classList.toggle("dark"));


searchBtn.addEventListener("click", () => {
  if(cityInput.value) fetchWeather(cityInput.value);
});


function fetchWeather(city){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => displayWeather(data));
}

function displayWeather(data){
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  tempEl.textContent = `${data.main.temp} °C`;
  descEl.textContent = data.weather[0].description;
  humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  windEl.textContent = `Wind: ${data.wind.speed} m/s`;
  weatherIconEl.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;


  const localTime = new Date((data.dt + data.timezone) * 1000);
  localTimeEl.textContent = `Local time: ${localTime.toUTCString().slice(-12, -4)}`;

  updateAnimation(data.weather[0].id);
}


function clearAnimation(){ animationContainer.innerHTML = ""; }

function createRain(){ 
  clearAnimation();
  for(let i=0;i<50;i++){
    const drop = document.createElement("div");
    drop.classList.add("rain-drop");
    drop.style.left = Math.random()*window.innerWidth + "px";
    drop.style.animationDuration = (0.5+Math.random()*0.5)+"s";
    drop.style.animationDelay = Math.random()*2+"s";
    animationContainer.appendChild(drop);
  }
}

function createSnow(){ 
  clearAnimation();
  for(let i=0;i<30;i++){
    const snow = document.createElement("div");
    snow.classList.add("snowflake");
    snow.style.left = Math.random()*window.innerWidth + "px";
    snow.style.fontSize = (10+Math.random()*10)+"px";
    snow.style.animationDuration = (5+Math.random()*5)+"s";
    snow.style.animationDelay = Math.random()*5+"s";
    animationContainer.appendChild(snow);
  }
}

function updateAnimation(weatherId){
  clearAnimation();
  if(weatherId>=200 && weatherId<600){ 
    createRain();
  } else if(weatherId>=600 && weatherId<700){ 
    createSnow();
  }
}