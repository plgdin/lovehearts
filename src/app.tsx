import React, { useState, useRef } from 'react';
import './App.css';

// --- TYPES ---
// Define the stages of the website animation
type AppStage = 'intro' | 'transition' | 'main';

// Define the shape of a Heart particle object
interface Heart {
  id: number;
  x: number;
  y: number;
  angle: number;
}

const App: React.FC = () => {
  // --- STATE ---
  // Tracks which part of the site we are showing
  const [stage, setStage] = useState<AppStage>('intro');
  // Tracks the array of heart particles
  const [hearts, setHearts] = useState<Heart[]>([]);
  
  // --- REFS ---
  // References to the video elements so we can control playback
  const transitionVideoRef = useRef<HTMLVideoElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  // --- HANDLERS ---

  // 1. Handle Heart Particle Generation on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Throttle: Only add heart 30% of the time to prevent too many elements
    if (Math.random() > 0.3) return;

    const btn = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - btn.left; // X position relative to button
    const y = e.clientY - btn.top;  // Y position relative to button

    const newHeart: Heart = {
      id: Date.now() + Math.random(),
      x,
      y,
      angle: Math.random() * 40 - 20, // Random rotation between -20 and 20 deg
    };

    // Add new heart to state
    // We explicitly type 'prev' here to solve your TS error 7006
    setHearts((prev: Heart[]) => [...prev, newHeart]);

    // Cleanup heart after animation (1s) to prevent memory leaks
    setTimeout(() => {
      setHearts((prev: Heart[]) => prev.filter((h: Heart) => h.id !== newHeart.id));
    }, 1000);
  };

  // 2. Start the Transition Sequence
  const handleStartClick = () => {
    setStage('transition');
    
    // Play the transition video (Church Door)
    // We unmute it because the user interacted (click), so audio is allowed
    if (transitionVideoRef.current) {
      transitionVideoRef.current.currentTime = 0;
      transitionVideoRef.current.play().catch(err => console.error("Video play error:", err));
    }
  };

  // 3. Handle End of Transition Video
  const handleTransitionEnd = () => {
    setStage('main');
  };

  return (
    <div className="app-container">
      
      {/* --- VIDEO LAYER: INTRO --- */}
      {/* This video fades out when stage is NOT 'intro' */}
      <video
        ref={introVideoRef}
        className={`bg-video ${stage !== 'intro' ? 'fade-out' : ''}`}
        autoPlay
        muted
        loop
        playsInline
      >
        {/* CHANGED: Now points to local public/videos folder */}
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>

      {/* --- VIDEO LAYER: TRANSITION (Church Door) --- */}
      {/* Visible only during transition, plays once */}
      <video
        ref={transitionVideoRef}
        className={`transition-video ${stage === 'transition' ? 'visible' : ''}`}
        muted={false} // User clicked, so we can have sound
        playsInline
        onEnded={handleTransitionEnd}
      >
        {/* CHANGED: Now points to local public/videos folder */}
        <source src="/videos/church_door.mp4" type="video/mp4" />
      </video>

      {/* --- UI LAYER: INTRO OVERLAY --- */}
      {stage === 'intro' && (
        <div className="intro-overlay">
          <h1 className="title">Lovehearts Wedding & Event Planners</h1>
          
          <button 
            className="start-btn" 
            onClick={handleStartClick}
            onMouseMove={handleMouseMove}
          >
            Start Planning
            {/* Render Hearts */}
            {hearts.map((heart: Heart) => (
              <span
                key={heart.id}
                className="heart-particle"
                style={{
                  left: heart.x,
                  top: heart.y,
                  transform: `rotate(${heart.angle}deg)`
                }}
              >
                ❤
              </span>
            ))}
          </button>
        </div>
      )}

      {/* --- MAIN SITE CONTENT --- */}
      {/* Renders but is hidden until stage is 'main' for smooth fade in */}
      <div className={`main-site ${stage === 'main' ? 'fade-in' : ''}`}>
        
        <nav className="navbar">
          <h2>Lovehearts</h2>
          <ul>
            <li>Home</li>
            <li>Gallery</li>
            <li>Contact</li>
          </ul>
        </nav>

        <header className="hero">
          <h1>Welcome to your Dream Event</h1>
          
          <div className="trailer-wrapper">
             {/* CHANGED: Now points to local public/videos folder */}
            <video controls width="100%" height="100%">
              <source src="/videos/trailer.mp4" type="video/mp4" />
            </video>
          </div>

          <button className="view-services-btn">View Services</button>
        </header>

        <section className="services-placeholder">
          <p>Scroll down to see our packages...</p>
        </section>
      </div>

    </div>
  );
};

export default App;