document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData();
    fetchWaterTempData();
});

function fetchWeatherData() {
    const apiKey = '0d522a2ddfb7896d28f4a11ee4eec33b';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Aghalee,GB&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('weather').innerHTML = 
                `Temperature: ${data.main.temp} °C<br>
                 Weather: ${data.weather[0].main}`;
        })
        .catch(error => {
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
            document.getElementById('waterTemp').innerText = `Temperature: ${data.temperature} °C`;
            fetchLastUpdatedTime();
        })
        .catch(error => {
            document.getElementById('waterTemp').innerText = 
                'Failed to load water temperature.';
        });
}

function fetchLastUpdatedTime() {
    // Replace with the API URL for your repository
    const commitApiUrl = 'https://api.github.com/repos/mkgillespie/mkgillespie.github.io/commits?path=water_temp.json&page=1&per_page=1';

    fetch(commitApiUrl)
        .then(response => response.json())
        .then(data => {
            const lastUpdated = new Date(data[0].commit.committer.date);
            document.getElementById('lastUpdated').innerText = 
                `Last Updated: ${lastUpdated.toLocaleString()}`;
        })
        .catch(error => {
            document.getElementById('lastUpdated').innerText = 
                'Failed to load update time.';
        });
}
