import BackgroundGraph from './components/BackgroundGraph';
import MouseGlow from './components/MouseGlow';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import BeyondTheCode from './components/BeyondTheCode';
import Footer from './components/Footer';
import './legacy.css';

function App() {
  return (
    <div className="app">
      <BackgroundGraph />
      <MouseGlow />
      <Header />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <BeyondTheCode />
      </main>
      <Footer />
    </div>
  );
}

export default App;
