# The Chop Method

A modern web application for chopping and processing audio samples with precision timing and beat synchronization.

## 🎵 Overview

The Chop Method is an interactive audio processing tool that allows users to import audio files, visualize waveforms, and manipulate audio samples with beat-accurate timing divisions. Built with React and powered by Tone.js and WaveSurfer.js, it provides a seamless experience for music producers, DJs, and audio enthusiasts.

## ✨ Features

- **Audio File Import**: Support for various audio formats
- **Interactive Waveform Visualization**: Real-time waveform display with zoom capabilities
- **BPM-Based Audio Chopping**: Precision timing based on musical beat divisions
- **Multiple Beat Divisions**: Support for various note values including:
  - Standard divisions (1/1, 1/2, 1/4, 1/8, 1/16, 1/32)
  - Dotted notes (1/2 dotted, 1/4 dotted, etc.)
  - Triplets (1/1 triplet, 1/2 triplet, etc.)
- **Audio Playback Control**: Play, pause, and seek functionality
- **Zoom Controls**: Horizontal zoom for detailed waveform editing
- **Modern UI**: Clean, responsive interface

## 🛠️ Technologies Used

- **Frontend Framework**: React 18
- **Audio Processing**: Tone.js
- **Waveform Visualization**: WaveSurfer.js
- **Build Tool**: Webpack
- **Styling**: CSS3
- **Audio Codec Support**: FFmpeg integration

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser with Web Audio API support

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:JoshuaHirakawa/The-Chop-Method.git
   cd The-Chop-Method
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

## 📦 Available Scripts

- `npm start` - Start the development server with hot reload
- `npm run build` - Build the project for production
- `npm run dev` - Run webpack in development mode

## 🎛️ How to Use

1. **Import Audio**: Click the import button to load your audio file
2. **Set BPM**: Enter the BPM of your audio track
3. **Choose Division**: Select the desired beat division for chopping
4. **Navigate**: Use the waveform to seek through your audio
5. **Zoom**: Adjust zoom level for precise editing
6. **Process**: Use the controls to manipulate your audio samples

## 🏗️ Project Structure

```
The-Chop-Method/
├── public/
│   ├── index.html          # Main HTML template
│   └── assets/             # Static assets (icons, images)
├── src/
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   ├── style.css           # Global styles
│   ├── components/
│   │   ├── Waveform.js     # Waveform visualization component
│   │   └── Controls.js     # Audio control interface
│   └── utils/
│       └── bpmDivisions.js # BPM calculation utilities
├── package.json            # Project dependencies and scripts
└── webpack.config.js       # Webpack configuration
```

## 🔧 Key Components

### Waveform Component

- Renders interactive audio waveform
- Handles user interactions (click, drag, zoom)
- Integrates with WaveSurfer.js for visualization

### Controls Component

- Provides playback controls
- BPM input and beat division selection
- Zoom and audio processing controls

### BPM Divisions Utility

- Calculates precise timing for various musical note values
- Supports standard, dotted, and triplet divisions
- Handles BPM validation (1-250 BPM range)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Joshua Hirakawa**

## 🚧 Future Enhancements

- Additional audio effects
- Playlist management
- Cloud storage integration
- Real-time collaboration features

---

_Built with ❤️ for music producers and audio enthusiasts_
