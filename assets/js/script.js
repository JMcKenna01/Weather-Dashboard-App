// OpenWeatherMap API key
const apiKey = 'febfb2aa061328db35073ec1c10c0665';

// Elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('searchInput');
const currentWeatherData = document.getElementById('currentWeather'); // Ensure this matches your HTML
const forecastContainer = document.getElementById('forecastContainer'); // Ensure this matches your HTML
const historyList = document.getElementById('savedList'); // Ensure this matches your HTML

// Fetch weather data for a city
function fetchWeatherForCity(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;

    console.log(`Fetching weather for city: ${city}`);

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data received:', data);
            displayCurrentWeather(data);
            displayForecast(data.list);
            saveToHistory(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Display current weather data
function displayCurrentWeather(data) {
    const current = data.list[0];
    const weatherDescription = current.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}.png`;

    // Clear previous data
    currentWeatherData.innerHTML = '';

    // Append new current weather data
    currentWeatherData.innerHTML = `
        <div class="card bg-secondary mb-3">
            <div class="card-body">
                <h5 class="card-title dateDisplay mb-3">${new Date(current.dt * 1000).toLocaleDateString()}</h5>
                <p class="humidityDisplay">Humidity: ${current.main.humidity}%</p>
                <p class="windDisplay">Wind: ${current.wind.speed} MPH</p>
                <div id="tempCard" class="d-flex align-items-center">
                    <img class="iconDisplay" src="${iconUrl}" alt="Weather condition icon">
                    <p class="tempDisplay">${current.main.temp}°F</p>
                </div>
            </div>
        </div>
    `;

    console.log('Current weather displayed.');
}

// Display 5-day forecast data
function displayForecast(forecastData) {
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Filter out the forecast data for midday for each day
    forecastData.filter((_, index) => index % 8 === 0).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        forecastContainer.innerHTML += `
            <div class="card bg-dark text-light m-2 col-12 col-md-5 col-lg border border-2 border-info">
                <div class="card-body">
                    <h5 class="dateDisplay">${date.toLocaleDateString()}</h5>
                    <img class="iconDisplay" src="${iconUrl}" alt="Weather condition icon">
                    <p class="tempDisplay">Temp: ${forecast.main.temp}°F</p>
                    <p class="humidityDisplay">Humidity: ${forecast.main.humidity}%</p>
                    <p class="windDisplay">Wind: ${forecast.wind.speed} MPH</p>
                </div>
            </div>
        `;
    });

    console.log('Forecast displayed.');
}

// Save search to history in localStorage
function saveToHistory(city) {
    let cities = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!cities.includes(city)) {
        cities.unshift(city); // Add new city to the front of the array
        localStorage.setItem('searchHistory', JSON.stringify(cities));
        renderHistoryList(cities);
    }
}

// Render the search history list
function renderHistoryList(cities) {
    historyList.innerHTML = ''; // Clear previous history

    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'bg-dark', 'text-light'); // Bootstrap classes
        listItem.textContent = city;
        listItem.addEventListener('click', () => fetchWeatherForCity(city));
        historyList.appendChild(listItem);
    });

    console.log('Search history rendered.');
}

// Event listener for search form submission
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherForCity(city);
        cityInput.value = ''; // Clear the input after search
    } else {
        console.log('No city input to search for.');
    }
});

// Load search history on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedCities = JSON.parse(localStorage.getItem('searchHistory')) || [];
    renderHistoryList(savedCities);
    console.log('Page loaded and history rendered.');
});
