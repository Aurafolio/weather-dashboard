// script.js

// Created by ASTA and the Aurafolio Team

const apiKey = '50f91390883655f7004f89c895fc95e4'; // Replace with your OpenWeatherMap API key

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getCoordinates(city);
    } else {
        alert('Please enter a city name');
    }
});

async function getCoordinates(city) {
    try {
        const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        console.log('Geo Response:', geoResponse); // Debugging line
        if (!geoResponse.ok) {
            throw new Error('Failed to fetch city coordinates');
        }
        const geoData = await geoResponse.json();
        console.log('Geo Data:', geoData); // Debugging line
        if (geoData.length > 0) {
            const { lat, lon } = geoData[0];
            getWeather(lat, lon);
        } else {
            alert('City not found');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        alert('Error fetching city coordinates');
    }
}

async function getWeather(lat, lon) {
    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        console.log('Weather Response:', weatherResponse); // Debugging line
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await weatherResponse.json();
        console.log('Weather Data:', weatherData); // Debugging line
        displayCurrentWeather(weatherData);
        displayForecast(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    }
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <div class="weather-card">
            <h2>${data.timezone}</h2>
            <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="${data.current.weather[0].description}">
            <p>${data.current.weather[0].description}</p>
            <div class="weather-info">
                <p>Temp: ${data.current.temp}°C</p>
                <p>Humidity: ${data.current.humidity}%</p>
                <p>Wind: ${data.current.wind_speed} m/s</p>
            </div>
        </div>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const forecast = data.daily[i];
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('weather-card');
        forecastCard.innerHTML = `
            <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
            <p>${forecast.weather[0].description}</p>
            <div class="weather-info">
                <p>Temp: ${forecast.temp.day}°C</p>
                <p>Humidity: ${forecast.humidity}%</p>
            </div>
        `;
        forecastDiv.appendChild(forecastCard);
    }
}
