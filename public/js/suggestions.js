// Get AI-powered activity suggestions
async function suggestActivities(weatherData) {
    console.log('Generating suggestions for weather:', weatherData);
    try {
        const prompt = `Location: ${weatherData.city}
Temperature: ${weatherData.temp}°C
Weather: ${weatherData.conditions}`;

        const response = await fetch('/api/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Response:', errorText);
            throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        console.log('AI response:', data);

        if (!data || !data[0] || !data[0].generated_text) {
            throw new Error('Invalid response format from AI');
        }

        return data[0].generated_text;
    } catch (error) {
        console.error('AI suggestion error:', error);
        // Fallback to local suggestions if AI fails
        return getFallbackSuggestions(weatherData);
    }
}

// Fallback function for when AI fails
function getFallbackSuggestions(weatherData) {
    const temp = weatherData.temp;
    const conditions = weatherData.conditions.toLowerCase();
    let suggestions = [];

    // Hot weather suggestions (above 30°C)
    if (temp > 30) {
        suggestions = [
            "Based on your weather conditions, here are some activities I'd suggest for you:\n",
            "- Indoor swimming at a local pool - Perfect for staying cool and getting exercise in this hot weather",
            "- Visit an air-conditioned museum or mall - Ideal for enjoying cultural activities while escaping the heat",
            "- Early morning or evening walk - Best time to enjoy outdoor activities when the temperature is more comfortable",
            "\nI hope you enjoy these activities! Feel free to check back when the weather changes for new suggestions."
        ];
    }
    // Warm weather suggestions (20-30°C)
    else if (temp > 20) {
        suggestions = [
            "Based on your weather conditions, here are some activities I'd suggest for you:\n",
            "- Outdoor picnic in a shaded area - Great temperature for enjoying food outdoors",
            "- Cycling or jogging - Perfect weather for outdoor exercise",
            "- Visit a local park - Ideal conditions for outdoor recreation",
            "\nI hope you enjoy these activities! Feel free to check back when the weather changes for new suggestions."
        ];
    }
    // Cool weather suggestions (10-20°C)
    else if (temp > 10) {
        suggestions = [
            "Based on your weather conditions, here are some activities I'd suggest for you:\n",
            "- Nature hiking - Comfortable temperature for exploring outdoor trails",
            "- Outdoor photography - Great conditions for capturing nature shots",
            "- Sports activities - Perfect weather for outdoor games",
            "\nI hope you enjoy these activities! Feel free to check back when the weather changes for new suggestions."
        ];
    }
    // Cold weather suggestions (below 10°C)
    else {
        suggestions = [
            "Based on your weather conditions, here are some activities I'd suggest for you:\n",
            "- Indoor rock climbing - Great way to stay active while staying warm inside",
            "- Visit a cozy café - Perfect weather for enjoying hot beverages",
            "- Indoor workout or yoga - Ideal for staying active while avoiding the cold",
            "\nI hope you enjoy these activities! Feel free to check back when the weather changes for new suggestions."
        ];
    }

    // Modify suggestions based on weather conditions
    if (conditions.includes('rain') || conditions.includes('shower')) {
        suggestions = [
            "Based on your weather conditions, here are some activities I'd suggest for you:\n",
            "- Visit a local library - Perfect indoor activity during rainy weather",
            "- Indoor cooking or baking class - Great way to learn new skills while staying dry",
            "- Watch a movie at a cinema - Ideal entertainment for rainy conditions",
            "\nI hope you enjoy these activities! Feel free to check back when the weather changes for new suggestions."
        ];
    }

    return suggestions.join('\n');
}

export { suggestActivities }; 