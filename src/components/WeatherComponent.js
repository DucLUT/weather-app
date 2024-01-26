// src/WeatherComponent.js
import React, { useState } from 'react'
import { getWeather, generateDynamicResponse } from '../api'
import Card from './Card'

const WeatherComponent = () => {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('/forecast1.avif')
  const [activities, setActivities] = useState([])

  const fetchWeatherData = async () => {
    try {
      setError('')
      setIsLoading(true)
      const data = await getWeather(city)

      if (data) {
        setWeatherData(data)
        const response = await generateDynamicResponse(
          city,
          data.weatherCondition,
          data.temperature,
          data.humidity
        )
        setIsLoading(false)
        if (response) {
          //console.log("respons!e", response) 
          const activitiesArray = response.split('\n').filter((i) => !!i)
          setActivities(activitiesArray)
        }
        if (data.temperature < 10) {
          setBackgroundImage('/cold3.jpg')
        } else if (data.temperature >= 11 && data.temperature <= 21) {
          setBackgroundImage('/fresh.avif')
        } else {
          setBackgroundImage('/hot.jpg')
        }
      } else {
        // Set a timer to re-enable (in case the input is wrong) the search button after 5 seconds
        setError('I cannot find your place. Please try again!')
        setTimeout(() => {
          setIsLoading(false)
          setError('')
        }, 5000)
      }
    } catch (error) {
      setError(
        'Error fetching weather data. Please check your inputs and try again.'
      )
      
    }
  }

  return (
    <div className="container app-wrapper">
      <div
        className="left"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="right">
        <h1>Weather App</h1>
        <p style={{ marginBottom: '16px' }}>
          Type in a city to search for the weather:
        </p>
        <form>
          <label>
            <input
              type="text"
              placeholder="Search"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              id="input"
            />
          </label>

          <button type="button" onClick={fetchWeatherData} disabled={isLoading}>
            {isLoading ? 'Searching...' : ' Get Weather ⛅️ '}
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
              <div>
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
              </div>
            )}
          </div>
        )}
        {activities.length > 0 ? (
          <div className="dynamic-response">
            <h2 style={{ textAlign: 'center' }}>Recommended activities:</h2>
            <div className="card-list">
              {activities.map((i, idx) => (
                <Card key={idx} content={i} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default WeatherComponent
