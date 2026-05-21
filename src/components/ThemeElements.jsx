import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const Fireflies = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [fireflies, setFireflies] = useState([]);

  useEffect(() => {
    // Initialize fireflies
    const initial = Array.from({ length: 150 }).map(() => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      originX: Math.random() * window.innerWidth,
      originY: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 10 + 10,
    }));
    setFireflies(initial);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Continuous wandering logic
    const wanderInterval = setInterval(() => {
      setFireflies(prev => prev.map(f => {
        // Drift up to 40px in random direction
        const newOriginX = f.originX + (Math.random() - 0.5) * 80;
        const newOriginY = f.originY + (Math.random() - 0.5) * 80;
        
        // Wrap around screen edges
        const wrappedX = newOriginX < 0 ? window.innerWidth : (newOriginX > window.innerWidth ? 0 : newOriginX);
        const wrappedY = newOriginY < 0 ? window.innerHeight : (newOriginY > window.innerHeight ? 0 : newOriginY);
        
        return { ...f, originX: wrappedX, originY: wrappedY };
      }));
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(wanderInterval);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {fireflies.map((f) => {
        const dx = mousePos.x - f.originX;
        const dy = mousePos.y - f.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = dist < 200 ? (200 - dist) / 200 : 0;
        
        // Repel from cursor
        const tx = (dx / (dist || 1)) * force * -80;
        const ty = (dy / (dist || 1)) * force * -80;

        return (
          <motion.div
            key={f.id}
            className="firefly"
            initial={{ x: f.x, y: f.y }}
            animate={{ 
              x: f.originX + tx, 
              y: f.originY + ty,
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{ 
              x: { duration: 2, ease: "easeOut" },
              y: { duration: 2, ease: "easeOut" },
              opacity: { duration: f.duration, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ 
              width: f.size, 
              height: f.size,
              boxShadow: `0 0 ${f.size * 3}px #22c55e`
            }}
          />
        );
      })}
    </div>
  );
};

export const LeopardEyes = ({ top, right, left, bottom, scale = 1, delayOffset = 0 }) => {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeout = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      
      if (moveTimeout.current) clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => setIsMoving(false), 500);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const dx = mousePos.x - window.innerWidth / 2;
  const dy = mousePos.y - window.innerHeight / 2;
  
  // Parallax tracking
  const trackX = dx * 0.015;
  const trackY = dy * 0.015;

  return (
    <div 
      style={{
        position: 'fixed',
        top, right, left, bottom,
        pointerEvents: 'none',
        zIndex: 0,
        display: 'flex',
        gap: '3rem',
        opacity: 0.9,
        mixBlendMode: 'screen',
        transform: `translate(${trackX}px, ${trackY}px) scale(${scale})`
      }}
    >
      
      {/* Left Eye */}
      <motion.div 
        style={{
          width: '3rem',
          height: '1.5rem',
          backgroundColor: '#eab308',
          borderRadius: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        animate={{ 
          opacity: [0.3, 0.9, 0.3],
          scaleY: [1, 0.1, 1, 1, 1], // Blinking
          boxShadow: isMoving 
            ? ['0 0 20px 5px rgba(234, 179, 8, 0.4)', '0 0 50px 20px rgba(234, 179, 8, 0.8)', '0 0 20px 5px rgba(234, 179, 8, 0.4)']
            : '0 0 10px 2px rgba(234, 179, 8, 0.3)'
        }}
        transition={{ 
          opacity: { duration: 4, repeat: Infinity, delay: delayOffset },
          scaleY: { duration: 5, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1], delay: delayOffset },
          boxShadow: { duration: 2, repeat: Infinity, delay: delayOffset }
        }}
      >
        <div style={{ width: '0.5rem', height: '1.5rem', backgroundColor: 'black', borderRadius: '9999px', transform: `translate(${trackX*0.8}px, ${trackY*0.8}px)` }}></div>
      </motion.div>

      {/* Right Eye */}
      <motion.div 
        style={{
          width: '3rem',
          height: '1.5rem',
          backgroundColor: '#eab308',
          borderRadius: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        animate={{ 
          opacity: [0.3, 0.9, 0.3],
          scaleY: [1, 0.1, 1, 1, 1], // Blinking
          boxShadow: isMoving 
            ? ['0 0 20px 5px rgba(234, 179, 8, 0.4)', '0 0 50px 20px rgba(234, 179, 8, 0.8)', '0 0 20px 5px rgba(234, 179, 8, 0.4)']
            : '0 0 10px 2px rgba(234, 179, 8, 0.3)'
        }}
        transition={{ 
          opacity: { duration: 4, repeat: Infinity, delay: 0.1 + delayOffset },
          scaleY: { duration: 5, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1], delay: 0.1 + delayOffset },
          boxShadow: { duration: 2, repeat: Infinity, delay: 0.1 + delayOffset }
        }}
      >
        <div style={{ width: '0.5rem', height: '1.5rem', backgroundColor: 'black', borderRadius: '9999px', transform: `translate(${trackX*0.8}px, ${trackY*0.8}px)` }}></div>
      </motion.div>
      
    </div>
  );
};
