import React, { useState } from "react";

import { FaCloudRain, FaSun, FaCloud } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

function Home() {
  const [countryName, setCountryName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unsplashData, setUnsplashData] = useState([]);
  const limit = 1;
  const apiKey = "enter your own api key"; // Replace with your actual API key from OpenWeatherApi

  const accessKey = "enter your own api key"; // Replace with your actual API key from  Unsplash Api

  const weatherIconMap = {
    "01d": FaSun, // Clear sky
    "02d": FaCloud, // Few clouds
    "03d": FaCloud, // Scattered clouds
    "04d": FaCloud, // Broken clouds
    "09d": FaCloudRain, // Shower rain
    "10d": FaCloudRain, // Rain
    "11d": FaCloudRain, // Thunderstorm
    "13d": FaCloudRain, // Snow
    "50d": FaCloud, // Mist
  };

  let photoCityUrl;

  const fetchWeather = async () => {
    try {
      // Fetch data from the first API - Rest Countries API
      const countryResponse = await fetch(
        `https://restcountries.com/v2/name/${countryName}`
      );
      const countryData = await countryResponse.json();

      if (countryData.length === 0) {
        console.log("Country not found.");
        return;
      }

      // Extract city name, state code, and country code
      const cityName = countryData[0].capital || "";
      const stateCode = countryData[0].regionCodes?.iso2a || "";
      const countryCode = countryData[0].codes?.iso2 || "";

      // Construct the API URL for Unsplash
      const apiUrl = `https://api.unsplash.com/search/photos?query=${countryName}&client_id=${accessKey}`;
      const apiResponse = await fetch(apiUrl);
      const unplashData = await apiResponse.json();
      console.log(unplashData);
      
      // Construct URL for the second API - OpenWeatherMap's Geo API
      const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;
      // Fetch data from the second API - Geo API
      const geoResponse = await fetch(geoApiUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        console.log("Location not found.");
        return;
      }

      // Extract latitude and longitude
      const lat = geoData[0].lat || "";
      const lon = geoData[0].lon || "";

      // Construct URL for the third API - OpenWeatherMap's Weather API
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      // Fetch weather data from the third API - Weather API
      const weatherResponse = await fetch(weatherApiUrl);
      const weatherData = await weatherResponse.json();

      // Set the weather data in state
      setWeatherData(weatherData);
      // After fetching Unsplash data
      setUnsplashData(unplashData.results);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  function convertToCelsius(value, unit) {
    if (typeof value !== "number") {
      return "Invalid input. Please provide a numeric temperature value.";
    }

    unit = unit.toLowerCase();

    switch (unit) {
      case "c":
      case "celsius":
        return value.toFixed(1); // Round to one decimal place
      case "f":
      case "fahrenheit":
        return (((value - 32) * 5) / 9).toFixed(1); // Round to one decimal place
      case "k":
      case "kelvin":
        return (value - 273.15).toFixed(1); // Round to one decimal place
      default:
        return 'Unsupported unit. Please use "C", "F", or "K".';
    }
  }

  return (
    <div className="home-container">
      <div
        className="home-nav"
        style={{
          backgroundImage:
            unsplashData.length > 0
              ? `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${unsplashData[0].urls.full})`
              : "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(https://images.pexels.com/photos/109629/pexels-photo-109629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
        }}
      >
        <h1>Weather App</h1>
        <input
          type="search"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          placeholder="Enter a country name"
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {weatherData === null ? (
        <div className="home-data">
          <div className="main-weather">
            <h1>No Country To Show</h1>
            <p>Please enter a country name above!</p>
          </div>
        </div>
      ) : (
        <div className="home-data">
          <div className="main-weather">
            <div className="weather-icon">
              <img
                srcSet={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].main}
              />
              <p>{}</p>
            </div>
            <div className="weather-info">
              <div className="weather-info-title">
                <h1>{convertToCelsius(weatherData.main.temp, "K")}°</h1>
                <p>{weatherData.weather[0].description}</p>
              </div>
              <div className="weather-info-icon">
                <p>{weatherData.name}</p>
                <FaLocationDot />
              </div>
              <p className="temps">
                {convertToCelsius(weatherData.main.temp_min, "K")}° /{" "}
                {convertToCelsius(weatherData.main.temp_max, "K")}° Feels like{" "}
                {convertToCelsius(weatherData.main.feels_like, "K")}°
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
