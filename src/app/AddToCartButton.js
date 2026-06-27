"use client";

import { useCart } from "./CartContext";

export function AddToCartButton({ item, label = "Add +", styleOverrides = {} }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(item);
      }}
      style={{
        backgroundColor: 'var(--primary-green)',
        color: 'white',
        border: 'none',
        padding: '6px 16px',
        borderRadius: '20px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.1s',
        ...styleOverrides
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    >
      {label}
    </button>
  );
}
