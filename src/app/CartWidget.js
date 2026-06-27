"use client";

import { useCart } from "./CartContext";
import { useState } from "react";

export function CartWidget() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (cartItems.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '500px',
        backgroundColor: 'var(--primary-dark)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        zIndex: 1000,
        animation: 'fadeInUp 0.3s ease'
      }}>
        <div style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
          <div style={{ fontSize: '0.9rem', color: 'var(--accent-yellow)', fontWeight: 600, textTransform: 'uppercase' }}>
            Shopping Cart {isOpen ? '▼' : '▲'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} = ₹{totalAmount}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={clearCart}
            style={{
              backgroundColor: 'white',
              color: '#ef4444',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Clear
          </button>

        </div>
      </div>

      {/* Expanded Cart View (Optional overlay) */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '500px',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 999,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginTop: 0, color: 'var(--primary-dark)', marginBottom: '1rem' }}>Cart Items</h3>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ color: 'var(--text-dark)' }}>{item.name}</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>₹{item.price}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
