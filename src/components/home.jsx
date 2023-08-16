import React, { useState } from "react";
import { createClient } from "pexels";

import { FaCloudRain, FaSun, FaCloud } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

function Home() {
  const [countryName, setCountryName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const limit = 1;
  const apiKey = "8516cd9860c57e300759a2046655ea22"; // Replace with your actual API key from OpenWeatherApi

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
      // Fetch data from the first API
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

      //fetch the country image api

      //Vq6PWC1OOjZtHb5ohqJ3ncJ5WhMp9LEGAn7TBgJLpNdsY9tMcdVQzegi
      const countryImageApi = `Vq6PWC1OOjZtHb5ohqJ3ncJ5WhMp9LEGAn7TBgJLpNdsY9tMcdVQzegi`;
      const client = createClient(countryImageApi);

      const query = cityName;

      client.photos.search({ query, per_page: 1 }).then((photos) => {
        photoCityUrl = photos.photos[0]?.src.landscape;
        console.log(photoCityUrl);
        const homeNav = document.querySelector(".home-nav");
        homeNav.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${photoCityUrl})`;
      });

      // Construct URL for the second API
      const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;
      // Fetch data from the second API
      const geoResponse = await fetch(geoApiUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        console.log("Location not found.");
        return;
      }

      // Extract latitude and longitude
      const lat = geoData[0].lat || "";
      const lon = geoData[0].lon || "";

      // Construct URL for the third API
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      // Fetch weather data from the third API
      const weatherResponse = await fetch(weatherApiUrl);
      const weatherData = await weatherResponse.json();

      console.log("Weather Icon Code:", weatherData.weather[0].icon);
      // Set the weather data in state
      setWeatherData(weatherData);
      console.log(weatherData);
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
        //style={{ backgroundImage: `url(${photoCityUrl})` }}
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

      {weatherData && (
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
