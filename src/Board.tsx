import { CiSearch } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { ImLocation } from "react-icons/im";
import moment from "moment-timezone";

// Import SVGs
import ThunderstormsRain from '/assets/thunderstorms-rain.svg';
import Thunderstorms from '/assets/thunderstorms.svg';
import Drizzle from '/assets/drizzle.svg';
import Rain from '/assets/rain.svg';
import Sleet from '/assets/sleet.svg';
import Snow from '/assets/snow.svg';
import Mist from '/assets/mist.svg';
import Smoke from '/assets/smoke.svg';
import Haze from '/assets/haze.svg';
import Dust from '/assets/dust.svg';
import Fog from '/assets/fog.svg';
import Wind from '/assets/wind.svg';
import Tornado from '/assets/tornado.svg';
import Overcast from '/assets/overcast.svg';
import ClearDay from '/assets/clear-day.svg';
import PartlyCloudyDay from '/assets/partly-cloudy-day.svg';

function Board() {
  type WeatherData = {
    location: string;
    weatherData: any;
    humidity: number;
    temperature: number;
    windSpeed: number;
    sunrise: number;
    sunset: number;
    description: string;
    icon: string;
    latitude: number;
    longitude: number;
    timezone: number;
  };

  const [weatherData, setWeatherData] = useState<WeatherData>({
    weatherData: "",
    location: "",
    humidity: 0,
    temperature: 0,
    windSpeed: 0,
    sunrise: 0,
    sunset: 0,
    description: "",
    icon: "",
    latitude: 0,
    longitude: 0,
    timezone: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [, setError] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState({
    day: "",
    date: "",
    time: "",
  });
  const apiKey = import.meta.env.VITE_API_ID;

  const search = async (city: string) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        alert("Location not found");
        
        return;
      }
      const data = await response.json();
      if (data.weather && data.weather.length > 0) {
        setWeatherData((prevState) => ({
          ...prevState,
          humidity: data.main.humidity,
          temperature: Math.floor(data.main.temp),
          windSpeed: data.wind.speed,
          location: data.name,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          latitude: data.coord.lat,
          longitude: data.coord.lon,
          timezone: data.timezone,
        }));
      } else {
        alert("Weather data not found");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const formattedSunrise = moment
    .unix(weatherData.sunrise)
    .format("hh:mm:ss A");
  const formattedSunset = moment.unix(weatherData.sunset).format("hh:mm:ss A");

  useEffect(() => {
    const updateDateTime = () => {
      const currentTime = moment.utc().add(weatherData.timezone, "seconds");
      const formattedDateTime = {
        day: currentTime.format("dddd"),
        date: currentTime.format("MMMM D, YYYY"),
        time: currentTime.format("h:mm:ss A"),
      };

      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, [weatherData.timezone]);

  useEffect(() => {
    search("London");
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    search(query);
  };

  const weatherIconMap = (description: string) => {
    const map: { [key: string]: string[] } = {
      [ThunderstormsRain]: [
        "thunderstorm with light rain",
        "thunderstorm with rain",
        "thunderstorm with heavy rain",
        "thunderstorm with light drizzle",
        "thunderstorm with drizzle",
        "thunderstorm with heavy drizzle",
      ],
      [Thunderstorms]: [
        "light thunderstorm",
        "thunderstorm",
        "heavy thunderstorm",
        "ragged thunderstorm",
      ],
      [Drizzle]: [
        "light intensity drizzle",
        "drizzle",
        "heavy intensity drizzle",
        "light intensity drizzle rain",
        "drizzle rain",
        "heavy intensity drizzle rain",
        "shower rain and drizzle",
        "heavy shower rain and drizzle",
        "shower drizzle",
      ],
      [Rain]: [
        "light rain",
        "moderate rain",
        "heavy intensity rain",
        "very heavy rain",
        "extreme rain",
        "freezing rain",
        "light intensity shower rain",
        "shower rain",
        "heavy intensity shower rain",
        "ragged shower rain",
      ],
      [Sleet]: [
        "sleet",
        "light shower sleet",
        "shower sleet",
        "light rain and snow",
        "rain and snow",
      ],
      [Snow]: [
        "light snow",
        "snow",
        "heavy snow",
        "light shower snow",
        "shower snow",
        "heavy shower snow",
      ],
      [Mist]: ["mist"],
      [Smoke]: ["smoke"],
      [Haze]: ["haze"],
      [Dust]: ["sand/dust whirls", "sand", "dust"],
      [Fog]: ["fog"],
      [Wind]: ["squalls"],
      [Tornado]: ["tornado"],
      [Overcast]: ["overcast clouds"],
      [ClearDay]: ["clear sky"],
      [PartlyCloudyDay]: [
        "few clouds",
        "scattered clouds",
        "broken clouds",
      ],
    };
    for (const [icon, descriptions] of Object.entries(map)) {
      if (descriptions.includes(description)) {
        return `url(${icon})`;
      }
    }
    return `url(${ClearDay})`;
  };

  const iconUrl = weatherIconMap(weatherData.description);

  return (
    <div className="boardin">
      <div
        className="details-left"
        style={{
          backgroundImage: iconUrl,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          margin: "20px",
          marginTop: "30px",
        }}
      >
        <p>{currentDateTime.day}</p>
        <p>{currentDateTime.date}</p>
        <h1>{weatherData.description}</h1>
        <div className="time">
          <p>{currentDateTime.time}</p>
        </div>
        <div className="weather-image">
          <h2>{weatherData.temperature}°C</h2>
          <h4>
            <ImLocation color="red" /> {weatherData.location}
          </h4>
        </div>
      </div>
      <hr />
      <div className="search">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter City Name"
          className="textfield"
          value={query}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
        />
        <CiSearch className="icon" onClick={handleSubmit} />
        <div className="details-right">
          <h2>Weather Details</h2>
          <table>
            <tbody>
              <tr>
                <th>Humidity</th>
                <td>{weatherData.humidity} %</td>
              </tr>
              <tr>
                <th>Wind Speed</th>
                <td>{weatherData.windSpeed} km/h</td>
              </tr>
              <tr>
                <th>Sunrise</th>
                <td>{formattedSunrise}</td>
              </tr>
              <tr>
                <th>Sunset</th>
                <td>{formattedSunset}</td>
              </tr>
              <tr>
                <th>Latitude</th>
                <td>{weatherData.latitude}</td>
              </tr>
              <tr>
                <th>Longitude</th>
                <td>{weatherData.longitude}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Board;
