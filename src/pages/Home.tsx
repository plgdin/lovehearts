import React, { useState, useRef } from 'react';

// --- TYPES ---
type AppStage = 'intro' | 'transition' | 'main';

interface Heart {
  id: number;
  x: number;
  y: number;
  angle: number;
}

const Home: React.FC = () => {
  // --- STATE ---
  const [stage, setStage] = useState<AppStage>('intro');
  const [hearts, setHearts] = useState<Heart[]>([]);
  
  // --- REFS ---
  const transitionVideoRef = useRef<HTMLVideoElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  // --- HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (Math.random() > 0.3) return;

    const btn = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - btn.left;
    const y = e.clientY - btn.top;

    const newHeart: Heart = {
      id: Date.now() + Math.random(),
      x,
      y,
      angle: Math.random() * 40 - 20,
    };

    setHearts((prev: Heart[]) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev: Heart[]) => prev.filter((h: Heart) => h.id !== newHeart.id));
    }, 1000);
  };

  const handleStartClick = () => {
    setStage('transition');
    if (transitionVideoRef.current) {
      transitionVideoRef.current.currentTime = 0;
      transitionVideoRef.current.play().catch(err => console.error("Video play error:", err));
    }
  };

  const handleTransitionEnd = () => {
    setStage('main');
  };

  return (
    <div className="app-container">
      
      {/* --- VIDEO LAYER: INTRO --- */}
      <video
        ref={introVideoRef}
        className={`bg-video ${stage !== 'intro' ? 'fade-out' : ''}`}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>

      {/* --- VIDEO LAYER: TRANSITION --- */}
      <video
        ref={transitionVideoRef}
        className={`transition-video ${stage === 'transition' ? 'visible' : ''}`}
        muted={false}
        playsInline
        onEnded={handleTransitionEnd}
      >
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

export default Home;