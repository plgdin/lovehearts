import React from 'react';
import { motion } from 'framer-motion';

// The animation physics - feels like a natural "spring" bloom
const bloomTransition = {
  duration: 0.8,
  type: "spring",
  stiffness: 60,
  damping: 12,
  mass: 1.2
};

// Variants for the Top-Left Flower Cluster
const topLeftVariant = {
  hidden: { 
    scale: 0.5, 
    opacity: 0, 
    x: 20, 
    y: 20, 
    rotate: -15 
  },
  visible: { 
    scale: 1, 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotate: 0,
    transition: bloomTransition
  }
};

// Variants for the Bottom-Right Flower Cluster
const bottomRightVariant = {
  hidden: { 
    scale: 0.5, 
    opacity: 0, 
    x: -20, 
    y: -20, 
    rotate: 15 
  },
  visible: { 
    scale: 1, 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotate: 0,
    transition: { ...bloomTransition, delay: 0.1 } 
  }
};

export const Blooms: React.FC = () => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      overflow: 'visible' 
    }}>
      
      {/* 1. TOP LEFT FLOWERS */}
      <motion.img 
        // CHANGED: Updated to .jpg
        src="/images/flower-frame.jpg" 
        alt="flower decoration"
        variants={topLeftVariant}
        style={{
          position: 'absolute',
          top: '-15%', 
          left: '-15%',
          width: '70%', 
          height: 'auto',
          transformOrigin: 'bottom right',
          zIndex: 0,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          // OPTIONAL: Tries to blend the image if it has a background
          mixBlendMode: 'lighten' 
        }}
      />

      {/* 2. BOTTOM RIGHT FLOWERS */}
      <motion.img 
        // CHANGED: Updated to .jpg
        src="/images/flower-frame.jpg"
        alt="flower decoration"
        variants={bottomRightVariant}
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-15%',
          width: '70%',
          height: 'auto',
          transformOrigin: 'top left',
          zIndex: 0,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          // OPTIONAL: Tries to blend the image if it has a background
          mixBlendMode: 'lighten'
        }}
      />
    </div>
  );
};