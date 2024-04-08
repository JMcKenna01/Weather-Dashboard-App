// OpenWeatherMap API key
const apiKey = 'febfb2aa061328db35073ec1c10c0665';

// Elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('searchInput');
const currentWeatherData = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecastContainer');
const historyList = document.getElementById('savedList');

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
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };

    currentWeatherData.innerHTML = `
        <h2>Today in ${data.city.name} (${now.toLocaleDateString("en-US", options)})</h2>
        <div class="card bg-secondary mb-3">
            <div class="card-body">
                <img src="${iconUrl}" alt="${weatherDescription}" class="float-start me-3">
                <p>Temp: ${current.main.temp}°F</p>
                <p>Wind: ${current.wind.speed} MPH</p>
                <p>Humidity: ${current.main.humidity}%</p>
            </div>
        </div>
    `;

    console.log('Current weather displayed.');
}

// Display 5-day forecast data
function displayForecast(forecastData) {
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecastData.filter((_, index) => index % 8 === 0).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        forecastContainer.innerHTML += `
            <div class="card bg-dark text-light m-2 col-12 col-md-5 col-lg border border-2 border-info">
                <div class="card-body">
                    <h5>${date.toLocaleDateString()}</h5>
                    <img src="${iconUrl}" alt="${forecast.weather[0].description}">
                    <p>Temp: ${forecast.main.temp}°F</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind: ${forecast.wind.speed} MPH</p>
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
        cities.unshift(city);
        localStorage.setItem('searchHistory', JSON.stringify(cities));
        renderHistoryList(cities);
    }
}

// Render the search history list
function renderHistoryList(cities) {
    historyList.innerHTML = '';

    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'bg-dark', 'text-light');
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
