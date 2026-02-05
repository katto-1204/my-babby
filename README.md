# A GIGI Surprise 💝

A beautiful, interactive Valentine's Day surprise web application built with React, TypeScript, and Three.js. This romantic journey includes multiple features designed to create memorable moments.

## 🌟 Features

### Core Valentine Experience
- **Interactive Envelope Opening** - Realistic 3D envelope with smooth animations and sound effects
- **Love Letter** - Personalized letter page with romantic animations
- **Flower Gallery** - Beautiful animated flowers (Tulip, Daisy, Lily, Four-Leaf Clover)
- **Memories Page** - Photo gallery with filters and animated reveals
- **Question Page** - Interactive Q&A with romantic themes
- **Closing Page** - Final message with replay option

### Additional Features
- **Countdown Timer** - Countdown to special dates with particle effects
- **Love Letter Builder** - Create and save custom love letters with rich text editing
- **Date Planner** - Plan and manage dates with activity suggestions
- **Love Language Quiz** - Discover love languages through interactive quiz
- **Scrapbook Creator** - Digital scrapbook with drag-and-drop elements
- **Voice Recorder** - Record and play voice messages with waveform visualization
- **3D Flower Viewer** - Interactive 3D flower models using Three.js
- **Secret Message Decoder** - Decode encrypted messages and puzzles
- **Flashcard Generator** - Upload lessons (text/PDF) and generate study flashcards with multiple choice questions
- **Photobooth** - Take photos with webcam, apply filters, and add design templates
- **F1 Racing Game** - 3D Formula 1 racing game with competitors, realistic physics, and Grand Prix experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd a-gigi-surprise
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics and animations
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **PDF.js** - PDF text extraction for flashcards
- **Web Audio API** - Sound effects and music

## 📁 Project Structure

```
src/
├── components/
│   ├── valentine/        # Valentine's journey components
│   └── ui/              # Reusable UI components
├── pages/               # Feature pages
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── App.tsx             # Main app with routing
```

## 🎮 Controls

### F1 Racing Game
- **UP / W** - Accelerate
- **LEFT / A** - Steer left
- **RIGHT / D** - Steer right

### General Navigation
- Use the navigation menu to access different features
- Most features save data to localStorage automatically

## 💾 Data Persistence

The application uses localStorage to save:
- Countdown target dates
- Love letters
- Date plans
- Voice messages
- Photobooth photos
- Flashcard sets
- F1 racing best times

## 🎨 Features Highlights

### Sound System
- Custom sound effects for interactions
- Background romantic music
- Mute/unmute controls

### Animations
- Smooth page transitions
- Particle effects
- Floating hearts and sparkles
- 3D transformations

### 3D Graphics
- Three.js powered 3D flowers
- 3D F1 cars and racing track
- Realistic lighting and shadows

## 📝 License

This project is a personal gift project.

## 🙏 Acknowledgments

Built with love using modern web technologies.
