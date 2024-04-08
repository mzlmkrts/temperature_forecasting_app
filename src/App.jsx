import React, { useEffect, useState } from 'react';
import './App.css';
import moment from 'moment';

function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');

  const weatherBackgrounds = {
    Clear: '#f7d794',
    Clouds: '#dfe4ea',
    Rain: '#74b9ff',
    Snow: '#b2bec3',
    Mist: '#D3D3D3',
    default: '#e0f7fa',
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      error => setError(error.message)
    );
  }, []);

  useEffect(() => {
    if (lat && long) {
      const fetchData = async () => {
        try {
          const url = `${import.meta.env.VITE_APP_API_URL}/data/2.5/weather?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_APP_API_KEY}&units=metric`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const result = await response.json();
          setData(result);
          setWeatherCondition(result.weather[0].main);
        } catch (error) {
          console.error('There was an error fetching the weather data:', error);
          setError('Failed to fetch weather data. Please try again later.');
        }
      };
      fetchData();
    }
  }, [lat, long]);

  return (
    <div className="App" style={{ backgroundColor: weatherBackgrounds[weatherCondition] || weatherBackgrounds.default }}>
      {error ? (
        <div>Error: {error}</div>
      ) : data ? (
        <div>
          <h1>Weather in {data.name}</h1>
          <p>Temperature: {data.main.temp}°C</p>
          <p>Weather: {data.weather[0].main}</p>
          <p>Detailed Weather: {data.weather[0].description}</p>
          <p>Wind Speed: {data.wind.speed} m/s</p>
          <p className="day">Day: {moment().format('dddd')}</p>
          <p className="day">{moment().format('LL')}</p>
          <p className="time">Time: {moment().format('LTS')}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}

export default App;
