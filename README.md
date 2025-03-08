# Weather Activity Suggestions

An AI-powered web application that suggests activities based on your current weather conditions. The app uses your location to fetch real-time weather data and generates personalized activity suggestions using the FLAN-T5 language model.

## Features

- Real-time weather data using OpenWeatherMap API
- Backup weather service using OpenMeteo API
- AI-powered activity suggestions using Hugging Face's FLAN-T5 model
- Fallback suggestions system when AI service is unavailable
- Responsive and clean user interface
- Error handling and loading states
- Smart response format with introduction and conclusion
- Location-aware suggestions

## Response Format

The application provides suggestions in a user-friendly format:
```
Based on your weather conditions, here are some activities I'd suggest for you:

- [Activity 1] - [Brief explanation why it's suitable]
- [Activity 2] - [Brief explanation why it's suitable]
- [Activity 3] - [Brief explanation why it's suitable]

I hope you enjoy these activities! Feel free to check back when the weather changes for new suggestions.
```

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express
- APIs:
  - OpenWeatherMap API (primary weather data)
  - OpenMeteo API (backup weather service)
  - Hugging Face Inference API (FLAN-T5 model)
  - BigDataCloud Reverse Geocoding API (location names)

## Project Structure

```
project/
├── public/           # Static files
│   ├── index.html    # Main HTML file
│   ├── styles/       # CSS styles
│   │   └── main.css
│   └── js/          # JavaScript modules
│       ├── weather.js      # Weather data handling
│       └── suggestions.js  # Activity suggestions logic
├── server/          # Backend files
│   └── server.js    # Express server & AI integration
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your API keys (optional):
   ```
   OPENWEATHER_API_KEY=your_key_here
   HF_API_KEY=your_key_here
   ```
4. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser

## API Keys

The application uses the following APIs:
- OpenWeatherMap API: Required for weather data
- Hugging Face API: Required for AI-powered suggestions

Default API keys are included but it's recommended to replace them with your own in:
- `weather.js` (OpenWeather API key)
- `server.js` (Hugging Face API key)

## Error Handling

The application includes several fallback mechanisms:
- Backup weather API if OpenWeatherMap fails
- Local activity suggestions if the AI service is unavailable
- Comprehensive error messages for users
- Automatic retry with backup services

## Development

To run in development mode with auto-reload:
```bash
npm run dev
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own learning and development. 