// Get user's location
async function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('Location obtained:', position.coords);
                resolve(position);
            },
            error => {
                console.error('Geolocation error:', error);
                reject(new Error(`Location access failed: ${error.message}`));
            },
            { timeout: 10000 }
        );
    });
}

// Get weather data
async function getWeatherData(latitude, longitude) {
    console.log('Fetching weather for:', { latitude, longitude });
    // Try the direct API first
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
    
    try {
        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Authorization': `Bearer ${process.env.OPENWEATHER_API_KEY}`
            }
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Weather API returned status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weather data received:', data);
        
        return {
            temp: Math.round(data.main.temp),
            conditions: data.weather[0].description,
            city: data.name
        };
    } catch (error) {
        console.error('Primary weather API error:', error);
        
        // Try backup API (OpenMeteo - no API key needed)
        try {
            console.log('Trying backup weather API...');
            const backupUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
            const backupResponse = await fetch(backupUrl);
            
            if (!backupResponse.ok) {
                throw new Error(`Backup API returned status: ${backupResponse.status}`);
            }

            const backupData = await backupResponse.json();
            console.log('Backup weather data received:', backupData);

            // Get city name from reverse geocoding
            const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            
            return {
                temp: Math.round(backupData.current_weather.temperature),
                conditions: backupData.current_weather.weathercode === 0 ? "clear sky" : 
                          backupData.current_weather.weathercode < 3 ? "partly cloudy" : "cloudy",
                city: geoData.city || geoData.locality || "your location"
            };
        } catch (backupError) {
            console.error('Backup weather API error:', backupError);
            throw new Error(`Weather data not available. Please try again later.`);
        }
    }
}

export { getLocation, getWeatherData }; 