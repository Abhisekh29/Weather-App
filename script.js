const userLocation = document.getElementById("userLocation");
convertor = document.getElementById("convertor");
weatherIcon = document.querySelector(".weatherIcon");
temperature = document.querySelector(".temperature");
feelsLike = document.querySelector(".feelsLike");
description = document.querySelector(".description");
date = document.querySelector(".date");
city = document.querySelector(".city");

HValue = document.getElementById("HValue");
WValue = document.getElementById("WValue");
SRValue = document.getElementById("SRValue");
SSValue = document.getElementById("SSValue");
CValue = document.getElementById("CValue");
UVValue = document.getElementById("UVValue");
PValue = document.getElementById("PValue");

forecast = document.querySelector(".forecast");

WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=8de699e9fe718df06c1b759314347cd6&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/3.0/onecall?appid=8de699e9fe718df06c1b759314347cd6&exclude=minutely&units=metric&`;

function findUserLocation()
{
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response)=>response.json())
    .then((data) => {
        if (data.cod != "" && data.cod != 200){
            alert(data.message);
            return;
        }
        console.log(data);

        city.innerHTML = data.name + ", " + data.sys.country;
        weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`

        fetch(WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((response)=>response.json())
        .then((data) => {
            console.log(data);

            temperature.innerHTML = tempConvertor(data.current.temp);
            feelsLike.innerHTML = "Feels Like " + tempConvertor(data.current.feels_like);
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;` + data.current.weather[0].description;

            const options = {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };

            date.innerHTML = getLongFormatDateTime(data.current.dt, data.timezone_offset, options);

            HValue.innerHTML = Math.round(data.current.humidity) + "%";
            WValue.innerHTML = Math.round(data.current.wind_speed) + " kmph";
            HValue.innerHTML = Math.round(data.current.humidity) + "%";
            HValue.innerHTML = Math.round(data.current.humidity) + "%";

            const options1 = {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }

            SRValue.innerHTML = getLongFormatDateTime(data.current.sunrise, data.timezone_offset, options1);
            SSValue.innerHTML = getLongFormatDateTime(data.current.sunset, data.timezone_offset, options1);

            CValue.innerHTML = data.current.clouds + "%";
            UVValue.innerHTML = data.current.uvi;
            PValue.innerHTML = Math.round(data.current.pressure) + " hPa";

            forecast.innerHTML = "";

            data.daily.forEach(weather => {
                let div = document.createElement("div");

                const options={
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                };
                let daily = getLongFormatDateTime(weather.dt, 0, options).split(" at ");
                div.innerHTML = daily[0];
                div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>`;
                div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}`;

                div.innerHTML += `<span><span>Low ${tempConvertor(weather.temp.min)}</span>
                &nbsp;&nbsp;<span>High ${tempConvertor(weather.temp.max)}</span></span>`

                forecast.append(div)
            });
            applyDarkModeToDynamicElements();
        });
    });
}


function formatUnixTime(dtValue, offSet, options = {}) {
    const date = new Date((dtValue + offSet) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options});
}

function getLongFormatDateTime(dtValue, offset, options) {
    return formatUnixTime(dtValue, offset, options);
}

function tempConvertor(temp){
    let tempVal = Math.round(temp);
    let message = "";
    if(convertor.value == "°C")
    {
        message = tempVal + "°C";
    }
    else
    {
        let ctof = (tempVal * 9) / 5 + 32;
        ctof = Math.round(ctof);
        message = ctof + "°F";
    }
    return message;
}

// Dark mode toggle and icon change logic

// Select the dark mode toggle button and the sun/moon icons
const darkModeToggle = document.getElementById("darkModeToggle");
const sunIcon = document.getElementById("sunIcon");  // Icon to display when in light mode
const moonIcon = document.getElementById("moonIcon"); // Icon to display when in dark mode

/**
 * Applies dark mode styles to dynamically created elements such as forecast tiles and highlight cards.
 */
function applyDarkModeToDynamicElements() {
    const isDarkMode = document.body.classList.contains("dark-mode"); // Check if dark mode is active

    // Apply or remove dark mode class to forecast and highlight cards
    document.querySelectorAll(".forecast div, .highlights div").forEach(tile => {
        tile.classList.toggle("dark-mode", isDarkMode);
    });
}

/**
 * Event listener for dark mode toggle button.
 * This toggles the dark mode for the entire page and adjusts the icons and styles accordingly.
 */
darkModeToggle.addEventListener("click", function () {
    // Toggle dark mode class on body and main container elements
    document.body.classList.toggle("dark-mode");
    document.querySelector(".weather-input").classList.toggle("dark-mode");
    document.querySelector(".weather-output").classList.toggle("dark-mode");

    // Toggle dark mode class for input fields
    const inputs = document.querySelectorAll(".input-group input");
    inputs.forEach(input => input.classList.toggle("dark-mode"));

    // Apply dark mode styles to dynamic elements like forecast and highlight cards
    applyDarkModeToDynamicElements();

    // Toggle the visibility of sun and moon icons based on current mode
    if (document.body.classList.contains('dark-mode')) {
        sunIcon.style.display = 'none';  // Hide sun icon when in dark mode
        moonIcon.style.display = 'inline'; // Show moon icon when in dark mode
    } else {
        sunIcon.style.display = 'inline'; // Show sun icon when in light mode
        moonIcon.style.display = 'none';  // Hide moon icon when in light mode
    }
});





