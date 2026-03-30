# Livingstone Rwagatare - Personal Portfolio

A modern, responsive personal portfolio built with **React** and **Vite**. Features interactive design elements with a focus on visual storytelling. Open source — feel free to fork it and adapt it as your own portfolio.

## Features

- **Interactive Knowledge Graph Background**: A custom HTML5 Canvas animation with floating labeled nodes ("Empathy", "Algorithms", "MIT", "Rwanda", etc.) that repel from the mouse cursor and draw connecting edges between nearby nodes. Clicking a node smoothly scrolls to its related section.
- **Mouse Glow Effect**: A radial gradient spotlight that follows the cursor with a smooth easing animation, adding depth to the dark background.
- **Light / Dark Theme Toggle**: Persistent theme preference stored in `localStorage`, with the background graph and all UI elements adapting to both themes.
- **Narrative-Driven Sections**: About, Experience, Projects, Education, Beyond the Code, and a Bento-style skills/highlights grid — each designed to tell a cohesive story of technical expertise and social impact.
- **Beyond the Code**: Tabbed section covering Books, Community, and Travel — with filterable community cards (Volunteering, Mentorship, Clubs, Education), a Typewriter animation, and card tilt effects on hover.
- **Project Cards**: Expandable project cards with a detailed modal view.
- **Responsive Layout**: Fully responsive design including a hamburger mobile nav that adapts from desktop to mobile.
- **Glassmorphism Header**: Scroll-aware header with smooth scroll navigation to all sections.

## Tech Stack

- **Frontend**: React 19, JavaScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS custom properties / global variables)
- **Animation**: HTML5 Canvas (background graph), CSS transitions, `requestAnimationFrame` (mouse glow, typewriter)
- **Deployment**: GitHub Pages (via `gh-pages`)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Rwagatare/Rwagatare.github.io.git
   cd Rwagatare.github.io
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

This project is configured for deployment to **GitHub Pages**.

To deploy updates:

```bash
npm run deploy
```

This command builds the project (using `vite build`) and pushes the `dist` folder to the `gh-pages` branch.

## License

[MIT](LICENSE) © 2025 Livingstone Rwagatare
