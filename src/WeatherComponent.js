// src/WeatherComponent.js
import React, { useState } from 'react';
import { getWeather, generateDynamicResponse } from './api';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [dynamicResponse, setDynamicResponse] = useState('');
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    try {
      setError('');
      const data = await getWeather(city, countryCode);

      if (data) {
        setWeatherData(data);
        const response = await generateDynamicResponse(city, data.weatherCondition, data.temperature, data.humidity);
        setDynamicResponse(response || 'No money to buy a GPT-3 API key!');
      }
    } catch (error) {
      setError('Error fetching weather data. Please check your inputs and try again.');
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form>
        <label>
          City:
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label>
          Country:
          <input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
        </label>
        <button type="button" onClick={fetchWeatherData}>
          Get Weather
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>Weather Information:</h2>
          <p>Weather: {weatherData.weatherCondition}</p>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      )}
      {dynamicResponse && (
        <div>
          <h2>Dynamic Response:</h2>
          <p>{dynamicResponse}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
