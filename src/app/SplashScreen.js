"use client";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if we've already shown the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (!hasSeenSplash) {
      setShowSplash(true);
      
      // Mark as seen for this session
      sessionStorage.setItem("hasSeenSplash", "true");
      
      // Start fade out after 2 seconds
      setTimeout(() => {
        setFadeOut(true);
      }, 2000);
      
      // Remove completely from DOM after fade out completes (2.5s total)
      setTimeout(() => {
        setShowSplash(false);
      }, 2500);
    }
  }, []);

  if (!showSplash) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--primary-dark)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: 'none'
    }}>
      {/* Sugarcane Juice Glass Animation */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '120px',
        border: '4px solid white',
        borderTop: 'none',
        borderRadius: '0 0 10px 10px',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        {/* Juice filling up */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'var(--accent-yellow)',
          animation: 'fillJuice 1.5s ease-out forwards'
        }}></div>
      </div>
      
      <h1 style={{
        color: 'white',
        fontSize: '2rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '3px',
        animation: 'pulse 1.5s infinite'
      }}>
        Sri Devi Shop
      </h1>
      
      <p style={{
        color: 'var(--accent-yellow)',
        marginTop: '0.5rem',
        fontStyle: 'italic',
        animation: 'fadeInUp 1s ease'
      }}>
        Fresh & Natural
      </p>

      <style jsx>{`
        @keyframes fillJuice {
          0% { height: 0%; }
          100% { height: 90%; }
        }
      `}</style>
    </div>
  );
}
