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
const vinePath1 = "M50,50 Q 90,20 130,40"; 
const vinePath2 = "M50,50 Q 20,90 40,130";
const vinePath3 = "M50,50 Q 90,90 130,50";

// --- VARIANTS ---

// Dynamic corner movement
const topLeftCornerVariant = {
  hidden: { top: 0, left: 0 },
  visible: { 
    top: -50, 
    left: -50,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const bottomRightCornerVariant = {
  hidden: { bottom: 0, right: 0 },
  visible: { 
    bottom: -50, 
    right: -50,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

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
        duration: 0.5,
        ease: "easeOut",
        delay: i * 0.03 
    }
  })
};

// --- COMPONENT: DENSE ROSE ---
const DenseRose: React.FC<{ color: string; delayBase: number }> = ({ color, delayBase }) => {
  
  // Petal Shape: Wide and soft
  const petalShape = "M0,0 C -15,-10 -25,-25 0,-40 C 25,-25 15,-10 0,0";

  // Helper to render rings
  const renderRing = (count: number, radius: number, angleOffset: number, scale: number, zIndex: number, hasOutline: boolean) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 360 + angleOffset;
      const radian = (angle * Math.PI) / 180;
      
      const x = 50 + radius * Math.cos(radian);
      const y = 50 + radius * Math.sin(radian);
      const rotation = angle + 90;

      return (
        <motion.path
          key={`${radius}-${i}`}
          d={petalShape}
          fill={`url(#grad-${color})`}
          
          // CONDITIONAL STROKE: Removes outline for inner petals
          stroke={hasOutline ? (color === 'pink' ? "#800f2f" : "#a05a2c") : "none"} 
          strokeWidth={hasOutline ? "0.4" : "0"}
          
          variants={petalVariant}
          custom={delayBase + (zIndex * 0.1) + (i * 0.02)}
          
          style={{
            translateX: x,
            translateY: y,
            rotate: rotation,
            scale: scale,
            zIndex: zIndex
          }}
        />
      );
    });
  };

  return (
    <motion.svg width="150" height="150" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`grad-${color}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={color === 'pink' ? "#641220" : "#5c3a21"} />
          <stop offset="60%" stopColor={color === 'pink' ? "#e01e37" : "#e08d55"} />
          <stop offset="100%" stopColor={color === 'pink' ? "#ffb3c1" : "#fff"} />
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

      <g filter="url(#shadow)">
        {/* LAYER 1: OUTER (12 Petals, Radius 22, Has Outline) */}
        {renderRing(12, 22, 0, 1.0, 1, true)}

        {/* LAYER 2: MIDDLE (12 Petals, Radius 14, Offset to fill gaps, Has Outline) */}
        {renderRing(12, 14, 15, 0.85, 2, true)}

        {/* LAYER 3: INNER (10 Petals, Radius 6, NO OUTLINE) */}
        {renderRing(10, 6, 0, 0.55, 3, false)}

        {/* LAYER 4: THE BLOOMING BUD (Added) */}
        {/* Very tight center cluster (6 Petals, Radius 0, Tiny Scale) */}
        {renderRing(6, 0, 0, 0.25, 4, false)}
      </g>
      
    </motion.svg>
  );
};


// --- MAIN EXPORT ---
export const DetailedBlooms: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      
      {/* TOP LEFT */}
      <motion.div 
        style={{ position: 'absolute', zIndex: 10 }}
        variants={topLeftCornerVariant}
      >
        <DenseRose color="pink" delayBase={0} />
      </motion.div>

      {/* SECONDARY ACCENT */}
      <motion.div 
        style={{ position: 'absolute', zIndex: 9, transform: 'scale(0.6) translate(40px, 40px)' }}
        variants={topLeftCornerVariant}
      >
         <DenseRose color="peach" delayBase={0.2} />
      </motion.div>

      {/* BOTTOM RIGHT */}
      <motion.div 
        style={{ position: 'absolute', zIndex: 10, transform: 'rotate(180deg)' }}
        variants={bottomRightCornerVariant}
      >
        <DenseRose color="pink" delayBase={0.1} />
      </motion.div>

    </div>
  );
};