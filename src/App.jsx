import { useEffect } from 'react';
import { installAnchorScrolling } from './lib/scrollToSection';
import BackgroundGraph from './components/BackgroundGraph';
import MouseGlow from './components/MouseGlow';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Work from './components/Work';
import BeyondTheCode from './components/BeyondTheCode';
import Footer from './components/Footer';

function App() {
  useEffect(() => installAnchorScrolling(), []);

  return (
    <div className="app">
      <BackgroundGraph />
      <MouseGlow />
      <Header />
      <main>
        <Hero />
        <Work />
        <Experience />
        <BeyondTheCode />
      </main>
      <Footer />
    </div>
  );
}

export default App;
