# PixelPerfect PNG Converter

A powerful SVG to PNG converter that generates multiple sizes and formats for different platforms including web, iOS, Android, and social media.

## Features

- **Multi-platform Support**: Generate icons for web, iOS, Android, and social media platforms
- **Custom Sizes**: Create custom PNG sizes with aspect ratio preservation
- **Preset Library**: Built-in presets for common use cases (favicons, app icons, social media)
- **Batch Export**: Generate multiple sizes at once
- **Local Storage**: Save your custom presets and favorites locally
- **Modern UI**: Clean, intuitive interface built with React and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pixelperfect-png-converter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`.

## Usage

1. **Upload SVG**: Click the upload area or drag and drop an SVG file
2. **Set Sizes**: Use preset sizes or create custom dimensions
3. **Configure Options**: 
   - Toggle aspect ratio preservation
   - Set specific dimensions for different platforms
4. **Export**: Download all generated PNG files as a ZIP archive

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **html2canvas & jsPDF** - Export functionality

## Project Structure

```
src/
├── components/
│   ├── converter/     # Main converter components
│   └── ui/          # Reusable UI components
├── lib/              # Utility functions
└── App.jsx           # Main application component
```

## License

This project is open source and available under the [MIT License](LICENSE).
