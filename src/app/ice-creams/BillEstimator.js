"use client";
import { useCart } from "../CartContext";

export function BillEstimator({ iceCreams, categories }) {
  const { cartItems, addItem, removeItem, clearCart, totalAmount } = useCart();

  // Group ice creams by type
  const groupedIceCreams = (iceCreams || []).reduce((acc, iceCream) => {
    const type = iceCream.type || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(iceCream);
    return acc;
  }, {});

  const handleAddItem = (iceCream) => {
    addItem(iceCream);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: cartItems.length > 0 ? '100px' : '0' }}>
        {categories.map((category) => {
          const items = groupedIceCreams[category];
          if (!items || items.length === 0) return null;

          return (
            <div key={category} style={{ animation: 'fadeInUp 0.8s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>
                  {category}s
                </h3>
                <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--accent-yellow)', marginLeft: '1rem' }}></div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {items.map((iceCream) => (
                  <div 
                    key={iceCream.id} 
                    id={`item-${iceCream.id}`}
                    onClick={() => handleAddItem(iceCream)}
                    className="glass-card" 
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid var(--primary-green)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.3s ease',
                      userSelect: 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '1.2rem', lineHeight: '1.3' }}>{iceCream.name}</span>
                      <span style={{ 
                        backgroundColor: 'var(--primary-dark)', 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontWeight: 800, 
                        fontSize: '1rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        ₹{iceCream.price}
                      </span>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {iceCream.type}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItem(iceCream);
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
                          transition: 'transform 0.1s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
