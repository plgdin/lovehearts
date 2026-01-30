import React, { useState, useRef, useEffect } from 'react';

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
  // FIXED: Changed HTMLElement to HTMLHeadingElement to match the <h2> tag
  const titleRef = useRef<HTMLHeadingElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // --- SCROLL OBSERVER ---
  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);

    serviceRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [stage]);

  // --- HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (Math.random() > 0.3) return;
    const btn = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - btn.left;
    const y = e.clientY - btn.top;
    const newHeart: Heart = {
      id: Date.now() + Math.random(),
      x, y,
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

  const services = [
    {
      id: 'wedding',
      title: 'Wedding Planning',
      img: '/images/wedding.jpg',
      desc: 'We turn your vision into a masterpiece. From grand ceremonies to intimate vows, our end-to-end planning ensures every detail is handled with elegance and precision.'
    },
    {
      id: 'engagement',
      title: 'Engagement',
      img: '/images/engagement.jpg',
      desc: 'Celebrate the beginning of your forever. We create romantic, personalized settings that capture the unique magic of your promise to one another.'
    },
    {
      id: 'birthday',
      title: 'Birthday',
      img: '/images/birthday.jpg',
      desc: 'Milestones deserve extraordinary celebrations. We bring creativity and life to your birthday parties, making them unforgettable experiences for you and your guests.'
    },
    {
      id: 'haldi',
      title: 'Haldi',
      img: '/images/haldi.jpg',
      desc: 'Traditional roots meet vibrant modern aesthetics. We craft joyful, floral-filled environments for your Haldi ceremony that celebrate family and culture.'
    }
  ];

  return (
    <div className="app-container">
      
      {/* --- VIDEO LAYER: INTRO --- */}
      <video
        ref={introVideoRef}
        className={`bg-video ${stage !== 'intro' ? 'fade-out' : ''}`}
        autoPlay muted loop playsInline
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>

      {/* --- VIDEO LAYER: TRANSITION (Church Door) --- */}
      <video
        ref={transitionVideoRef}
        className={`transition-video ${stage === 'transition' ? 'visible' : ''}`}
        muted={false} playsInline
        onEnded={handleTransitionEnd}
      >
        <source src="/videos/church_door.mp4" type="video/mp4" />
      </video>

      {/* --- UI LAYER: INTRO OVERLAY --- */}
      {stage === 'intro' && (
        <div className="intro-overlay">
          <h1 className="title">Lovehearts Wedding & Event Planners</h1>
          <button className="start-btn" onClick={handleStartClick} onMouseMove={handleMouseMove}>
            Start Planning
            {hearts.map((heart: Heart) => (
              <span key={heart.id} className="heart-particle" style={{ left: heart.x, top: heart.y, transform: `rotate(${heart.angle}deg)` }}>
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
            <li>Gallery</li>
            <li>Contact</li>
          </ul>
        </nav>

        <header className="hero">
          <div className="trailer-wrapper">
            <video autoPlay muted loop playsInline>
              <source src="/videos/trailer.mp4" type="video/mp4" />
            </video>
          </div>
        </header>

        {/* --- SERVICES SECTION --- */}
        <section className="services-section">
          <h2 ref={titleRef} className="services-title-scroll">
            Our Services
          </h2>
          
          <div className="services-list">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                ref={(el) => (serviceRefs.current[index] = el)}
                className="service-item"
                style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
              >
                <div className="service-photo">
                  <img src={service.img} alt={service.title} />
                </div>
                <div className="service-info">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;