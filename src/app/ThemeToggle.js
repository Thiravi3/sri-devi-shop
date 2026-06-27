"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark theme is already set
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      setIsDark(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: '1px solid currentColor',
        color: 'inherit',
        padding: '4px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
