import BackgroundGraph from './components/BackgroundGraph';
import MouseGlow from './components/MouseGlow';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import BeyondTheCode from './components/BeyondTheCode';
import Education from './components/Education';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <BackgroundGraph />
      <MouseGlow />
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <BeyondTheCode />
        <Education />
      </main>
      <Footer />
    </div>
  );
}

export default App;
