import React from 'react';
import { motion } from 'framer-motion';

// --- CONFIG ---
const springConfig = {
  type: "spring",
  stiffness: 80, 
  damping: 15,
  mass: 1
};

// --- SVG PATHS ---
const vinePath1 = "M50,50 Q 100,20 140,40"; 
const vinePath2 = "M50,50 Q 10,100 30,140";
const vinePath3 = "M50,50 Q 100,100 140,60";

// --- VARIANTS ---
const vineVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut", delay: delay }
  })
};

const petalVariant = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { 
        duration: 0.6,
        ease: "easeOut",
        delay: i * 0.04 
    }
  })
};

// --- COMPONENT: PERFECT SYMMETRY ROSE (No Center Dots) ---
const PerfectRose: React.FC<{ color: string; delayBase: number }> = ({ color, delayBase }) => {
  
  // Layer 1: Outer Ring (8 petals)
  const outerPetals = Array.from({ length: 8 }).map((_, i) => i);
  // Layer 2: Inner Ring (8 petals - Matched for symmetry)
  const innerPetals = Array.from({ length: 8 }).map((_, i) => i);

  // Wide, rounded petal shape
  const petalShape = "M0,0 C -12,-15 -25,-35 0,-45 C 25,-35 12,-15 0,0";

  return (
    // INCREASED SIZE: 180x180
    <motion.svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`grad-${color}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={color === 'pink' ? "#641220" : "#5c3a21"} />
          <stop offset="60%" stopColor={color === 'pink' ? "#e01e37" : "#e08d55"} />
          <stop offset="100%" stopColor={color === 'pink' ? "#ffccd5" : "#fff"} />
        </radialGradient>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2"/>
        </filter>
      </defs>

      {/* --- VINES --- */}
      <motion.g stroke="#6b9c6b" strokeWidth="2" fill="none" strokeLinecap="round" style={{ transformOrigin: "50px 50px" }}>
        <motion.path d={vinePath1} variants={vineVariant} custom={delayBase} />
        <motion.path d={vinePath2} variants={vineVariant} custom={delayBase + 0.1} />
        <motion.path d={vinePath3} variants={vineVariant} custom={delayBase + 0.2} strokeWidth="1" />
      </motion.g>

      {/* --- OUTER RING (8 Petals) --- */}
      <g filter="url(#shadow)">
      {outerPetals.map((i) => {
        const count = 8;
        const radius = 24; 
        const angle = (i / count) * 360;
        const radian = (angle * Math.PI) / 180;
        
        const x = 50 + radius * Math.cos(radian);
        const y = 50 + radius * Math.sin(radian);
        const rotation = angle + 90; 

        return (
          <motion.path
            key={`outer-${i}`}
            d={petalShape}
            fill={`url(#grad-${color})`}
            stroke={color === 'pink' ? "#800f2f" : "#a05a2c"} 
            strokeWidth="0.5"
            variants={petalVariant}
            custom={delayBase + (i * 0.05)}
            style={{
              translateX: x,
              translateY: y,
              rotate: rotation,
              scale: 1.1, // Slightly larger outer petals
            }}
          />
        );
      })}
      </g>

      {/* --- INNER RING (8 Petals - Interlocked) --- */}
      <g filter="url(#shadow)">
      {innerPetals.map((i) => {
        const count = 8;
        const radius = 12; 
        // OFFSET: 360 / 8 / 2 = 22.5 deg. This places inner petals EXACTLY in the gaps.
        const angle = (i / count) * 360 + 22.5; 
        const radian = (angle * Math.PI) / 180;
        
        const x = 50 + radius * Math.cos(radian);
        const y = 50 + radius * Math.sin(radian);
        const rotation = angle + 90;

        return (
          <motion.path
            key={`inner-${i}`}
            d={petalShape}
            fill={`url(#grad-${color})`}
            stroke={color === 'pink' ? "#800f2f" : "#a05a2c"} 
            strokeWidth="0.5"
            variants={petalVariant}
            custom={delayBase + 0.4 + (i * 0.05)}
            style={{
              translateX: x,
              translateY: y,
              rotate: rotation,
              scale: 0.75, // Smaller inner petals
            }}
          />
        );
      })}
      </g>
      
      {/* --- CENTER BUD REMOVED --- */}

    </motion.svg>
  );
};


// --- MAIN EXPORT ---
export const DetailedBlooms: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      
      {/* TOP LEFT - Adjusted position for larger flower */}
      <div style={{ position: 'absolute', top: '-60px', left: '-60px', zIndex: 10 }}>
        <PerfectRose color="pink" delayBase={0} />
      </div>

      {/* SECONDARY ACCENT */}
      <div style={{ position: 'absolute', top: '-10px', left: '-50px', zIndex: 9, transform: 'scale(0.5)' }}>
         <PerfectRose color="peach" delayBase={0.2} />
      </div>

      {/* BOTTOM RIGHT (Rotated) */}
      <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', zIndex: 10, transform: 'rotate(180deg)' }}>
        <PerfectRose color="pink" delayBase={0.1} />
      </div>

    </div>
  );
};