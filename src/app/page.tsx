"use client";
import { useState, useEffect } from "react";

const Cities = [
  {
    city: "New York",
    lat: 40.7128,
    lon: -74.0060,
  },
  {
    city: "Los Angeles",
    lat: 34.0522,
    lon: -118.2437,
  },
  {
    city: "Chicago",
    lat: 41.8781,
    lon: -87.6298,
  },
  {
    city: "Houston",
    lat: 29.7604,
    lon: -95.3698,
  }
];

// Weather search app
export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<{city: string, lat: number, lon: number}[]>([]);
  const [weatherForecasts, setWeatherForecasts] = useState<{cityName: string, periods: {time: string, temperature: number, detailedForecast: string}[]}[]>([]);

  const makeSuggestions = async () => {
    const filteredCities = Cities.filter(city => city.city.toLowerCase().includes(inputValue.toLowerCase()));
    setSuggestions(filteredCities);
  };

  const fetchWeather = async (city: string, lat: number, lon: number) => {
    const response = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    const data = await response.json();
    const forecastUrl = data.properties.forecast;

    // Fetch forecast data
    const forecastResponse = await fetch(forecastUrl);
    const {properties} = await forecastResponse.json();
    
    const periods = properties.periods.map((period: {[key: string]: string | number}) => { 
      return {
        time: period.name,
        temperature: period.temperature,
        detailedForecast: period.detailedForecast,
      };
    });

    setWeatherForecasts([...weatherForecasts, {cityName: city, periods}]);
  };

  useEffect(() => {
    if(inputValue.length <= 0) {
      setSuggestions(Cities);
      return;
    } else {
      makeSuggestions();
    }
  }, [inputValue]);

  return (
    <div className="bg-gray-200 h-screen flex flex-col justify-center">
      <nav className="bg-blue-500 p-4 flex justify-center items-center absolute w-full top-0">
        <div className="container mx-auto flex items-center">
          <div className="text-white text-lg font-bold">
            WeatherApp
          </div>
        </div>
      </nav>

      <h1 className="text-4xl text-center mt-4 font-bold">
        Weather Search
      </h1>

      <input 
        type="text"
        className="w-1/2 mx-auto mt-4 p-2 border rounded-s"
        placeholder="Enter city name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      
      {
        suggestions.length > 0 && (
          <div className="w-1/2 mx-auto mt-4">
            {
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white p-2 border rounded-s mt-2 cursor-pointer"
                  onClick={async () => await fetchWeather(suggestion.city, suggestion.lat, suggestion.lon)}
                >
                  <h1>{suggestion.city}</h1>
                </div>
              ))
            }
          </div>
        )
      }

      {
        weatherForecasts.length > 0 && (
            <div className="w-full mx-auto mt-4 overflow-x-auto flex flex-row">
            {
              weatherForecasts.map((city, index) => (
                <div key={index} className="bg-white p-2 border rounded-s mt-2 overflow-y-auto max-h-64 w-1/4 mx-2">
                    <h1 className="text-2xl font-bold">{city.cityName}</h1>
                  {
                    city.periods.map((period, index) => (
                        <div key={index} className="mt-2"> 
                            <h1 className="underline">{period.time}</h1>
                          <h1>{period.temperature}*F</h1>
                          <p>{period.detailedForecast}</p>
                        </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
}
