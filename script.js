const searchBox = document.querySelector(".search-box input");
const searchBtn = document.querySelector("#search");
const weatherIcon = document.querySelector(".weather-icon");
const appContainer = document.querySelector(".app-container");

const weatherApiKey = 'b2fa3271ab55c9c76e1b2a2d1afd0478';
const weatherURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const imageApiKey = "2BsfBnNAfcAGF3oX4F_fRIlYnOXYBGYyJpeHfo8AWp4";
const imageURL = "https://api.unsplash.com/search/photos?page=1&query=";

let recentCities = [];

// Weather API call
async function checkWeather(city) {
    const response = await fetch(weatherURL + city + `&appid=${weatherApiKey}`);
    const data = await response.json();

    if (response.status === 404 || data.cod === '404') {
        document.querySelector(".error").style.display = 'block';
        document.querySelector(".weather").style.visibility = "hidden";
        appContainer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("images/weather.jpg")`;
    } else {
        setTimeout(() => {
            updateData(data);
        }, 500);
    }
}

// Update DOM with weather data
async function updateData(data) {
    document.querySelector("#city").textContent = data.name;
    document.querySelector("#temp").textContent = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").textContent = data.main.humidity + '%';
    document.querySelector(".wind").textContent = data.wind.speed + "Km/h";

    const weatherCondition = data.weather[0].main;

    if (weatherCondition === 'Clear') {
        weatherIcon.src = "images/clear.png";
    } else if (weatherCondition === 'Clouds') {
        weatherIcon.src = "images/clouds.png";
    } else if (weatherCondition === 'Haze') {
        weatherIcon.src = "images/drizzle.png";
    } else if (weatherCondition === 'Mist') {
        weatherIcon.src = "images/mist.png";
    } else if (weatherCondition === 'Rain') {
        weatherIcon.src = "images/rain.png";
    } else if (weatherCondition === 'Snow') {
        weatherIcon.src = "images/snow.png";
    }

    document.querySelector("#condition").textContent = data.weather[0].main;
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = 'none';
}

// Unsplash Image API call
async function generateImage(city) {
    try {
        const response = await fetch(imageURL + city + `&client_id=${imageApiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const img = data.results[0].urls.full;
            appContainer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${img})`;
        }
    } catch (err) {
        console.error("Image load failed:", err);
    }
}

// Add a city to recent list and localStorage
function updateRecentCities(city) {
    const formattedCity = city.toLowerCase();
    if (!formattedCity || recentCities.includes(formattedCity)) return;

    recentCities.unshift(formattedCity);
    if (recentCities.length > 5) {
        recentCities.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(recentCities));
    renderRecentCities();
}

// Render recent cities from array
function renderRecentCities() {
    const recentBox = document.querySelector("#recent");
    if (!recentBox) return;

    recentBox.innerHTML = '';

    recentCities.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city.charAt(0).toUpperCase() + city.slice(1);
        btn.addEventListener("click", () => {
            document.querySelector("#city-input").value = city;
            generateImage(city);
            checkWeather(city);
        });
        recentBox.appendChild(btn);
    });
}

// Load from localStorage on page load
function loadRecentCities() {
    const saved = localStorage.getItem("recentCities");
    if (saved) {
        recentCities = JSON.parse(saved);
        renderRecentCities();
    }
}

// Handle search
searchBtn.addEventListener('click', () => {
    const city = searchBox.value.trim();
    if (city === '') return;

    generateImage(city);
    checkWeather(city);
    updateRecentCities(city);
});

// Initial load
loadRecentCities();
checkWeather("kolkata");
generateImage("kolkata");
updateRecentCities("kolkata");
