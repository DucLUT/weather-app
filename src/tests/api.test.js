import { getWeather, generateDynamicResponse } from '../api.js'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// The mock api means that whenever the api is called using get, it will returns with the "fake" data we have defined

// Create a new instance of the MockAdapter with the axois instance
const mock = new MockAdapter(axios)
const weatherApiKey = 'd86d3f5a3ca87a0cb18861f1a608c4da'
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'

describe('Retuns value check', () => {
    beforeEach(() => {
    mock.reset() // Reset the mock adapter instance
})
const mockWeatherData = {
    weather: [
        {
            description: 'snow'
        }
    ],
    name: 'Lahti',
    main: 
        {
            temp: 263.15, //-10 Celsius 
            humidity: 83
        },
    icon: 'https://openweathermap.org/img/wn/undefined@2x.png'
}

    test('getWeather returns something', async() => {
         //Mock the API endpoint and response
         mock.onGet(weatherApiUrl, {
            params: {
                q: 'Lahti',
                appid: weatherApiKey,
            },
        }).reply(200, mockWeatherData)

        const result = await getWeather('Lahti')
        expect(result).not.toBeNull()
    })
    

    test('getWeather returns the right location', async () => {
        //Mock the API endpoint and response
        mock.onGet(weatherApiUrl, {
            params: {
                q: 'Lahti',
                appid: weatherApiKey,
            },
        }).reply(200, mockWeatherData)
        
        const result = await getWeather('Lahti')
        expect(result.name).toEqual('Lahti')

    })

    test('getWeather returns the right weather condition', async () => {
        //Mock the API endpoint and response
        mock.onGet(weatherApiUrl, {
            params: {
                q: 'Lahti',
                appid: weatherApiKey,
            },
        }).reply(200, mockWeatherData)
        const result = await getWeather('Lahti')
        expect(result).toEqual({
            name: 'Lahti',
            weatherCondition: 'snow',
            temperature: '-10.00',
            humidity: 83,
            icon: expect.any(String)
        })
    })

})

describe('Error handling in getWeather', () => {
    //Mock the API endpoint and response
    mock.onGet(weatherApiUrl, {
        params: {
            q: 'Something',
            appid: weatherApiKey,
        },
    }).reply(404, 'Failed to load resource: the server responded with a status of 404')

    let consoleSpy; 
  
    beforeEach(() => {
      // Mock console.error before each test
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      //create a spy that listens to the console.error
      // Temporarily disable console.error to avoid polluting Jest's output
    });
  
    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    test('getWeather returns null when the city is not found', async () => {
        const result = await getWeather('Something')
        expect(result).toBeNull()
    })
    
    test('getWeather returns the error message when the city is not found', async () => {
        const result = await getWeather('Something')
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching weather data:', expect.any(Error)) // assert that the console.error was called with the right arguments

    })
})

// describe('generatedDynamicResponse', () => {

// })

describe('generateDynamicResponse returns value check', () => {
    test('generateDynamicResponse returns a dynamic response', async () => {
      const city = 'London';
      const weatherCondition = 'sunny';
      const temperature = '20';
      const humidity = '30%';
  
      // Mock the API response
      mock.onPost('https://api.openai.com/v1/chat/completions').reply(200, {
        choices: [
          {
            message: {
              content: 'With this weather in London, you can go for a walk in the park, have a picnic, or play outdoor sports.',
            },
          },
        ],
      });
  
      const response = await generateDynamicResponse(city, weatherCondition, temperature, humidity);
  
      expect(response).toEqual('With this weather in London, you can go for a walk in the park, have a picnic, or play outdoor sports.');
    });

    test('generateDynamicResponse returns null when the API call fails', async() => {
        const city = 'Somethingasdfda';
        const weatherCondition = 'sunny';
        const temperature = '1000';
        const humidity = '100%';

        //Mock the API response
        mock.onPost('https://api.openai.com/v1/chat/completions').reply(404, 'Failed to load resource: the server responded with a status of 404')

        // Spy on console.error
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() =>{}) // temperrarily disable console.error to avoid polluting jest's output

        const response = await generateDynamicResponse(city, weatherCondition, temperature, humidity)

        // Check the response
        expect(response).toBeNull()

        // Check if console.error was called
        expect(consoleSpy).toHaveBeenCalled()

        // Restore console.error
        consoleSpy.mockRestore();
    })
  });