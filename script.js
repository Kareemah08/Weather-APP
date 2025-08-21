const apiKey = "82273e6ac90204d2a2d661b0787fe23b"; 
const button = document.getElementById("getWeather");
const resultDiv = document.getElementById("result");
const recentDiv = document.getElementById("recent");
const toggleBtn = document.getElementById("toggleTheme");

let recentCities = [];
let animationContainer;


toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark") 
    ? "Switch to Light Mode" 
    : "Switch to Dark Mode";
});


function updateRecent() {
  recentDiv.innerHTML = "";
  recentCities.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.addEventListener("click", () => fetchWeather(city));
    recentDiv.appendChild(btn);
  });
}


function clearAnimation() {
  const existing = document.getElementById("animation-container");
  if (existing) existing.remove();
}

function createRain() {
  clearAnimation();
  const container = document.createElement("div");
  container.id = "animation-container";
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement("div");
    drop.classList.add("rain-drop");
    drop.style.left = Math.random() * window.innerWidth + "px";
    drop.style.animationDuration = (0.5 + Math.random() * 0.5) + "s";
    drop.style.animationDelay = (Math.random() * 2) + "s"; // stagger drops
    container.appendChild(drop);
  }
  document.body.appendChild(container);
}

function createSnow() {
  clearAnimation();
  const container = document.createElement("div");
  container.id = "animation-container";
  for (let i = 0; i < 30; i++) {
    const snow = document.createElement("div");
    snow.classList.add("snowflake");
    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.fontSize = 10 + Math.random() * 10 + "px";
    snow.style.animationDuration = (5 + Math.random() * 5) + "s";
    snow.style.animationDelay = (Math.random() * 5) + "s";
    container.appendChild(snow);
  }
  document.body.appendChild(container);
}



function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === 200) {
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

   
        const timezoneOffset = data.timezone; 
        const localTime = new Date(Date.now() + timezoneOffset * 1000);
        const timeStr = localTime.toUTCString().slice(17, 22);

        resultDiv.innerHTML = `
          <p><strong>${data.name}</strong></p>
          <img src="${iconUrl}" alt="${data.weather[0].description}">
          <p>🕒 Local Time: ${timeStr}</p>
          <p>🌡 Temperature: ${data.main.temp}°C</p>
          <p>🌥 Condition: ${data.weather[0].description}</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>💨 Wind: ${data.wind.speed} m/s</p>
        `;
        resultDiv.classList.add("show");


        if (!recentCities.includes(data.name)) {
          recentCities.unshift(data.name);
          if (recentCities.length > 5) recentCities.pop();
          updateRecent();
        }

   
        const weatherMain = data.weather[0].main.toLowerCase();
        document.body.classList.remove("sun","clouds","rain","snow","thunderstorm","mist");
        clearAnimation();

        if (["clear"].includes(weatherMain)) document.body.classList.add("sun");
        else if (["clouds"].includes(weatherMain)) document.body.classList.add("clouds");
        else if (["rain","drizzle"].includes(weatherMain)) {
          document.body.classList.add("rain");
          createRain();
        }
        else if (["snow"].includes(weatherMain)) {
          document.body.classList.add("snow");
          createSnow();
        }
        else if (["thunderstorm"].includes(weatherMain)) document.body.classList.add("thunderstorm");
        else if (["mist","fog","haze"].includes(weatherMain)) document.body.classList.add("mist");

      } else {
        resultDiv.innerHTML = `<p style="color:red;">City not found. Try again!</p>`;
      }
    })
    .catch(err => {
      console.error(err);
      resultDiv.innerHTML = `<p style="color:red;">Error fetching data. Try again later.</p>`;
    });
}