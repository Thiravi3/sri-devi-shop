"use client";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function StatusBanner() {
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    // Fetch the initial status
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/data?_t=" + Date.now(), { cache: 'no-store' });
        const json = await res.json();
        setIsOpen(json.isOpen);
      } catch (error) {
        console.error("Failed to fetch shop status", error);
      }
    };

    fetchStatus();

    // Optionally poll every 10 seconds to keep it updated for customers
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isOpen === null) return null; // Don't show anything while loading to avoid layout shift

  return (
    <div style={{
      width: '100%',
      backgroundColor: isOpen ? 'var(--primary-green)' : '#ef4444',
      color: 'white',
      textAlign: 'center',
      padding: '10px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      fontWeight: 'bold',
      letterSpacing: '1px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: '10px',
      transition: 'background-color 0.5s ease',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div></div> {/* Spacer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {isOpen ? (
        <>
          <span style={{ fontSize: '1.2rem', animation: 'pulse 2s infinite', display: 'inline-block', borderRadius: '50%', width: '12px', height: '12px', backgroundColor: 'white' }}></span>
          WE ARE CURRENTLY OPEN FOR ORDERS!
        </>
      ) : (
        <>
          <span style={{ fontSize: '1.2rem' }}>⛔</span>
          SORRY, WE ARE CURRENTLY CLOSED.
        </>
      )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ThemeToggle />
      </div>
    </div>
  );
}
