import './style.css';
import { getWeather } from './weather';
import { ICON_MAP } from './iconMap.js';

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
    renderDailyWeather(daily);
    //renderHourlyWeather(hourly);
    document.body.classList.remove('blurred');

}

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).innerText = `${value}`;
}
function getIconURL(iconCode) {
    //console.log(`ICON_MAP: ${ICON_MAP.get(iconCode)}`);
    return `/icons/${ICON_MAP.get(iconCode)}.svg`
}
const currentIcon = document.querySelector('.weather-icon');
function renderCurrentWeather(current) {
    //document.querySelector(`[data-current-temp]`).innerText = current.currentTemp;
    currentIcon.src = getIconURL(current.iconCode);
    setValue('current-temp', current.currentTemp);
    setValue('current-high', current.highTemp);
    setValue('current-low', current.lowTemp);
    setValue('current-fl-high', current.highFeelsLike);
    setValue('current-fl-low', current.lowFeelsLike);
    setValue('current-wind', current.windSpeed);
    setValue('current-precip', current.precip);
}
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'long' })
const dailySection = document.querySelector('[data-day-section]');
const dayCardTemplate = document.getElementById('day-card-template');

function renderDailyWeather(daily) {
    //currentIcon.src = getIconURL(daily.iconCode);
    //let iconCode = document.querySelector('.day-card-date');
    dailySection.innerHTML = '';
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true);
        setValue('temp', day.maxTemp, { parent: element });
        //console.log(`day.maxTemp: ${day.maxTemp}`);
        setValue('date', DAY_FORMATTER.format(day.timestamp), { parent: element });
        element.querySelector('[data-icon]').src = getIconURL(day.iconCode);
        //console.log(`${element.querySelector('[data-icon]').src = getIconURL(day.iconCode)}`);
        dailySection.append(element);

        //console.log(`DAY_FORMATTER: ${DAY_FORMATTER.format(day.timestamp)}`);
    })

}