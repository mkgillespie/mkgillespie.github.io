document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData();
    fetchWaterTempData();
});


const weatherIconMap = {
    '01d': 'sunny', // clear sky day
    '01n': 'night', // clear sky night
    '02d': 'cloudySunny', // few clouds day
    '02n': 'cloudyNight', // few clouds night
    '03d': 'cloudySunny', // scattered clouds day
    '03n': 'cloudyNight', // scattered clouds night
    '04d': 'cloudySunny', // broken clouds day
    '04n': 'cloudyNight', // broken clouds night
    '09d': 'raining', // shower rain day
    '09n': 'rainingNight', // shower rain night
    '10d': 'rainingSunny', // rain day
    '10n': 'rainingNight', // rain night
    '11d': 'thunder', // thunderstorm day
    '11n': 'thunderNight', // thunderstorm night
    '13d': 'snowing', // snow day
    '13n': 'snowingNight', // snow night
    '50d': 'windySunny', // mist day
    '50n': 'windyNight' // mist night
};


function getBackgroundColorForTemperature(temp) {
    let color = '#FFCCBC'; // Default to a warm color (pastel orange)

    if (temp <= 0) {
        color = '#B6EEF5'; // Cold (pastel blue)
    } else if (temp <= 14) {
        color = '#84C8C6'; // Cooler
    } else if (temp <= 18) {
        color = '#F5E05F'; // Neutral
    } else if (temp <= 25) {
        color = '#F56A69'; // Warm
    }

    // #ffe963,#ff6d6d,#8ad0ce,#bdf7ff,#4b595e

    return color;
}

function fetchWeatherData() {
    const apiKey = '0d522a2ddfb7896d28f4a11ee4eec33b';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Aghalee,GB&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const rawTemperature = data.main.temp; // Get the raw temperature
            const roundedTemperature = roundToNearestHalf(rawTemperature); // Round it to the nearest 0.5
        
            // Set background color based on temperature
            const backgroundColor = getBackgroundColorForTemperature(roundedTemperature);


            const weatherCode = data.weather[0].icon; // Get the icon code from the API response
            const iconName = weatherIconMap[weatherCode]; // Map the code to your icon names
            const iconElement = document.getElementById('weatherIcon');

            // Update the src attribute of your img tag to point to the correct icon file
            iconElement.src = `./icons/${iconName}.svg`;


            const weatherCondition = data.weather[0].main;
            const weatherTagline = getWeatherTagline(weatherCondition);

            document.getElementById('weatherTagline').innerText = weatherTagline;

            document.getElementById('weather').innerHTML = 
                `${roundedTemperature}`;
                 document.body.style.backgroundColor = backgroundColor;
        })
        .catch(error => {
            console.log(error);
            document.getElementById('weather').innerHTML = 
                'Failed to load weather data.';
        });
}

function fetchWaterTempData() {
    // Assuming water temperature is stored in a file water_temp.json in your repository
    const githubUrl = 'https://raw.githubusercontent.com/mkgillespie/mkgillespie.github.io/main/weather/water_temp.json';

    fetch(githubUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('waterTemp').innerText = `${data.temperature}`;
            fetchLastUpdatedTime();
        })
        .catch(error => {
            document.getElementById('waterTemp').innerText = 
                'Failed to load water temperature.';
        });
}

function fetchLastUpdatedTime() {
    // Replace with the API URL for your repository
    const commitApiUrl = 'https://api.github.com/repos/mkgillespie/mkgillespie.github.io/commits?path=weather/water_temp.json&page=1&per_page=1';

    fetch(commitApiUrl)
        .then(response => response.json())
        .then(data => {
            const lastUpdated = new Date(data[0].commit.committer.date);
            document.getElementById('lastUpdated').innerText = 
                `Last Updated: ${formatDate(lastUpdated)}`;
        })
        .catch(error => {
            document.getElementById('lastUpdated').innerText = 
                'Failed to load update time.';
        });
}

function roundToNearestHalf(value) {
    return Math.round(value * 2) / 2;
}


function formatDate(date) {
    const now = new Date();
    const updateDate = new Date(date);
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  
    const optionsSameDay = { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true };
    const optionsDifferentDay = { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', hour12: true };
    
    // If the update date is today
    if (updateDate.toDateString() === now.toDateString()) {
      return updateDate.toLocaleTimeString('en-US', optionsSameDay);
    }
    // If the update date is more than a week ago
    else if (updateDate < oneWeekAgo) {
      return updateDate.toLocaleDateString('en-US', optionsDifferentDay);
    }
    // If the update date is within the last week but not today
    else {
      return updateDate.toLocaleString('en-US', optionsSameDay);
    }
  }


  function getWeatherTagline(condition) {
    const taglines = {
        'Clear': ["Sun's Out, Fun's Out!", "Blue Skies Ahead!"],
        'Clouds': ["Cloudy with a Chance of Great Day.", "Every Cloud Has a Silver Lining."],
        'Drizzle': ["Liquid Sunshine!", "A Light Touch of Rain."],
        'Rain': ["Pitter-Patter, Let's Get At 'er.", "Great Weather for Ducks."],
        'Thunderstorm': ["Thor's Throwing a Tantrum.", "A Shockingly Good Day."],
        'Snow': ["Winter's Confetti!", "Let it Snow, Let it Show."],
        'Mist': ["Mystical Mist on the Move.", "Foggy Fantasy Land."],
        // Add more mappings as needed
    };

    if (!taglines[condition]) {
        return "Just another day in paradise!";
    }

    const randomIndex = Math.floor(Math.random() * taglines[condition].length);
    return taglines[condition][randomIndex];
}

