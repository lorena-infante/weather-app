import axios from 'axios';

export function getWeather(lat,long, timezone){
    return axios.get('https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime',{
        params:{
            latitude: lat,
            longitude: long,
            timezone,
        },
    }).then(({data})=>{
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data)
        }
    })
}

function parseCurrentWeather({current_weather,daily}){
    const {
        temperature: currentTemp,
        weathercode: iconCode,
        windspeed: windSpeed
    } = current_weather;
    const {
        //most recent temp from API
        temperature_2m_max:[max_temp],
        temperature_2m_min:[min_temp],
        apparent_temperature_max:[maxFeelsLike],
        apparent_temperature_min:[minFeelsLike],
        precipitation_sum:[precip]
    } = daily;
    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(max_temp),
        lowTemp: Math.round(min_temp) ,
        highFeelsLike: Math.round(maxFeelsLike),
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        iconCode
    }
}
function parseDailyWeather({daily}){
    return daily.time.map((time, index)=> {
        return {
            //time multiplies times 1000 for the API data format is in ms
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index])
        }
    });
}

function parseHourlyWeather({ hourly, current_weather}){
    return hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature[index]),
            windSpeed: Math.round(hourly.windspeed_10m[index]),
            precip: Math.round(hourly.precipitation[index]*100)/100,

        }
    }).filter(({ timestamp }) => timestamp >= current_weather.time * 1000);
}