import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DetailedBlooms } from './DetailedBlooms';

interface Heart {
  id: number;
  angle: number;    
  velocity: number; 
  size: number;
}

// Added interface to define the prop received from App.tsx
interface HomeProps {
  setGlobalStarted: (val: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setGlobalStarted }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [introUnmounted, setIntroUnmounted] = useState(false);

  const trailerRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset internal state and hide navbar when navigating back to Home
  useEffect(() => {
    setHasStarted(false);
    setIntroUnmounted(false);
    setGlobalStarted(false);
  }, [setGlobalStarted]);

  useEffect(() => {
    if (hasStarted) {
      const video = trailerRef.current;
      if (video) {
        video.currentTime = 0;
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Autoplay blocked, attempting muted fallback", error);
            video.muted = true;
            video.play();
          });
        }
      }

      const timer = setTimeout(() => {
        setIntroUnmounted(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || !trailerRef.current) return;

    const videoElement = trailerRef.current;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoElement.play().catch(e => console.log("Scroll play prevented:", e));
        } 
        else {
          videoElement.pause();
        }
      });
    }, {
      threshold: 0.5 
    });

    videoObserver.observe(videoElement);
    return () => videoObserver.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    setTimeout(() => {
        if (titleRef.current) observer.observe(titleRef.current);
        serviceRefs.current.forEach((el) => {
          if (el) observer.observe(el);
        });
    }, 100);

    return () => observer.disconnect();
  }, [hasStarted]);

  const handleStartClick = () => {
    const newHearts: Heart[] = [];
    for (let i = 0; i < 40; i++) {
      newHearts.push({
        id: i,
        angle: Math.random() * 360, 
        velocity: 80 + Math.random() * 120, 
        size: 0.8 + Math.random() * 1.2
      });
    }
    setHearts(newHearts);

    setTimeout(() => {
      setHasStarted(true);
      setGlobalStarted(true); // Updates the global state to fade in the Navbar
    }, 800);
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
      {!introUnmounted && (
        <div className={`intro-layer ${hasStarted ? 'fade-out' : ''}`}>
          <video className="bg-video" autoPlay muted loop playsInline>
            <source src="/videos/intro.mp4" type="video/mp4" />
          </video>

          <div className="intro-overlay">
            <div className="btn-wrapper">
              <button className="start-btn" onClick={handleStartClick}>
                Start Planning
              </button>
              {hearts.map((heart: Heart) => (
                <span 
                  key={heart.id} 
                  className="heart-particle" 
                  style={{ 
                      '--angle': `${heart.angle}deg`, 
                      '--velocity': `${heart.velocity}px`,
                      fontSize: `${heart.size}rem`
                  } as React.CSSProperties}
                >
                  ❤
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`main-site ${hasStarted ? 'visible' : ''}`}>
        {/* Global Navbar handles navigation */}

        <header className="hero">
          <div className="trailer-wrapper">
            <video 
              ref={trailerRef}
              loop 
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src="/videos/trailer.mp4" type="video/mp4" />
            </video>
          </div>
        </header>

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
                <motion.div 
                  className="service-photo-wrapper"
                  initial="hidden"       
                  whileHover="visible"   
                >
                  <DetailedBlooms />
                  <img src={service.img} className="main-img" alt={service.title} />
                </motion.div>
                
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