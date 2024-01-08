// src/api.js
import axios from 'axios'

const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'
const weatherApiKey = 'd86d3f5a3ca87a0cb18861f1a608c4da'


//const openaiApiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'
const openaiApiUrl = 'https://api.openai.com/v1/chat/completions'

const openaiApiKey = process.env.REACT_APP_OPEN_API_KEY || ''

const getWeather = async (city, country_code = '') => {
  try {
    const response = await axios.get(weatherApiUrl, {
      params: {
        q: `${city},${country_code}`,
        appid: weatherApiKey,
      },
    })

    if (response.status === 200) {
      const weatherData = response.data
      const weatherCondition = weatherData.weather[0].description
      const temperature = (weatherData.main.temp - 273.15).toFixed(2)
      const humidity = weatherData.main.humidity
      const icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`

      return { weatherCondition, temperature, humidity, icon }
    } else {
      console.error(`Error: ${response.status}, ${response.data.message}`)
      return null
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}

const generateDynamicResponse = async (
  city,
  weatherCondition,
  temperature,
  humidity
) => {
  const prompt = `What are some outdoor activities suitable in ${city} when the weather is ${weatherCondition}, with a temperature of ${temperature} degrees Celsius and a humidity of ${humidity}%?`

  try {
    const response = await axios.post(
      openaiApiUrl,
      {
        // prompt,
        // max_tokens: 100,
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "You are a travel assistant, skilled in recommending activities based on weather conditions."
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    )

    if (response.status === 200) {
      return response?.data?.choices[0].message.content;
    } else {
      console.error(`Error: ${response.status}, ${response.data.error.message}`)
      return null
    }
  } catch (error) {
    console.error('Error generating dynamic response:', error)
    return null
  }
}

export { getWeather, generateDynamicResponse }
