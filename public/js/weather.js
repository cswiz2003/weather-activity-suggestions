// Get user's location
export function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        }
        
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
            reject(new Error(`Unable to retrieve your location: ${error.message}`));
        });
    });
}

// Get weather data from our backend
export async function getWeatherData(latitude, longitude) {
    try {
        const response = await fetch(`/api/weather/${latitude}/${longitude}`);
        if (!response.ok) {
            throw new Error('Weather service unavailable');
        }
        
        const data = await response.json();
        
        return {
            temp: Math.round(data.weather.main.temp),
            conditions: data.weather.weather[0].main,
            city: data.weather.name || 'your location',
            suggestions: data.suggestions
        };
    } catch (error) {
        throw new Error(`Failed to get weather data: ${error.message}`);
    }
} 
