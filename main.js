import './style.css';
import { getWeather } from './weather';

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWeather)
    .catch((e) => {
        console.error(e);
        alert(`Data couldn't be fetched. Error: ${e}`);
    })
    .finally(() => {
        //console.log('promise finished');
    });

function renderWeather({ current, daily, hourly }) {
    renderCurrentWeather(current);
    //renderDailyWeather(daily);
    //renderHourlyWeather(hourly);
    document.body.classList.remove('blurred');

}

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).innerText = `${value}`;
}
function setIcon() {

}

function renderCurrentWeather(current) {
    //document.querySelector(`[data-current-temp]`).innerText = current.currentTemp;
    setValue('current-temp', current.currentTemp);
    setValue('current-high', current.highTemp);
    setValue('current-low', current.lowTemp);
    setValue('current-fl-high', current.highFeelsLike);
    setValue('current-fl-low', current.lowFeelsLike);
    setValue('current-wind', current.windSpeed);
    setValue('current-precip', current.precip);


}