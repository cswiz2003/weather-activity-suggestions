require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Weather API endpoints
async function getWeatherData(lat, lon) {
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

// Backup weather service
async function getBackupWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching backup weather:', error);
        return null;
    }
}

// Generate activity suggestions based on weather
function generateSuggestions(weather) {
    const temp = weather.main.temp;
    const conditions = weather.weather[0].main.toLowerCase();
    
    let suggestions = [];
    
    if (temp > 25) {
        suggestions.push({
            activity: "Swimming",
            reason: "Perfect weather for a refreshing swim!"
        });
        suggestions.push({
            activity: "Ice cream social",
            reason: "Great time to enjoy a cold treat"
        });
    } else if (temp > 15) {
        suggestions.push({
            activity: "Outdoor picnic",
            reason: "Pleasant temperature for outdoor dining"
        });
        suggestions.push({
            activity: "Nature walk",
            reason: "Comfortable conditions for exploring nature"
        });
    } else {
        suggestions.push({
            activity: "Indoor movie marathon",
            reason: "Stay cozy inside with some great films"
        });
        suggestions.push({
            activity: "Visit a museum",
            reason: "Perfect weather to explore indoor attractions"
        });
    }

    if (conditions.includes('rain')) {
        suggestions.push({
            activity: "Visit a café",
            reason: "Stay dry while enjoying a warm drink"
        });
    } else if (conditions.includes('clear')) {
        suggestions.push({
            activity: "Photography session",
            reason: "Great visibility for taking pictures"
        });
    }

    return suggestions;
}

// API Routes
app.get('/api/weather/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;
        let weatherData = await getWeatherData(lat, lon);
        
        if (!weatherData || weatherData.cod !== 200) {
            weatherData = await getBackupWeather(lat, lon);
            if (!weatherData) {
                throw new Error('Weather data unavailable');
            }
        }

        const suggestions = generateSuggestions(weatherData);
        
        res.json({
            weather: weatherData,
            suggestions: suggestions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
