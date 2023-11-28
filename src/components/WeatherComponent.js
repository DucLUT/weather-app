// src/WeatherComponent.js
import React, { useState } from 'react'
import { getWeather, generateDynamicResponse } from '../api'

const WeatherComponent = () => {
  const [city, setCity] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [dynamicResponse, setDynamicResponse] = useState('')
  const [error, setError] = useState('')

  const fetchWeatherData = async () => {
    try {
      setError('')
      const data = await getWeather(city, countryCode)

      if (data) {
        setWeatherData(data)
        const response = await generateDynamicResponse(
          city,
          data.weatherCondition,
          data.temperature,
          data.humidity
        )
        setDynamicResponse(response || 'Unable to generate response')
        const image = '/hot.jpg'
      }
    } catch (error) {
      setError(
        'Error fetching weather data. Please check your inputs and try again.'
      )
    }
  }

  return (
    <div className="container" style={{ backgroundImage: 'url("/hot.jpg")' }}>
      <h1>Weather App</h1>
      <form>
        <label>
          City or places:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            id="input"
          />
        </label>
        <label>
          Country Code:
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          />
        </label>
        <button type="button" onClick={fetchWeatherData}>
          Get Weather ⛅️
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h2 style={{ textAlign: 'center' }}>Weather Information:</h2>
          <p style={{ textAlign: 'center' }}>
            Weather: {weatherData.weatherCondition}
          </p>
          <p style={{ textAlign: 'center' }}>
            Temperature: {weatherData.temperature}°C
          </p>
          <p style={{ textAlign: 'center' }}>
            Humidity: {weatherData.humidity}%
          </p>

          {weatherData.icon && (
            <>
              <img
                className="icon-left"
                src={weatherData.icon}
                alt="Weather icon"
              />
              <img
                className="icon-right"
                src={weatherData.icon}
                alt="Weather icon"
              />
            </>
          )}
        </div>
      )}
      {dynamicResponse && (
        <div className="dynamic-response">
          <h2 style={{ textAlign: 'center' }}>Recommended activities:</h2>
          <p style={{ textAlign: 'center' }}>{dynamicResponse}</p>
        </div>
      )}
    </div>
  )
}

export default WeatherComponent
