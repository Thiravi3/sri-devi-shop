import Image from "next/image";
import Link from "next/link";
import { ClientInteractive } from "./ClientInteractive";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Home() {
  let data = { isOpen: false, iceCreams: [], mainMenu: [], contact: { phone: "+91 98765 43210", address: "123 Main Street<br />Cityville, State 12345" } };
  
  // Hardcode localhost for absolute URL during SSR
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/data?_t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error('Failed to read data from API', error);
  }

  const { isOpen, iceCreams } = data;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'transparent',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}>


        {/* Shop Name Header */}
        <h1 style={{
          color: '#2d6a4f',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: '900',
          textAlign: 'center',
          margin: '0 1rem 1rem 1rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          zIndex: 5
        }}>
          Sri Devi Sugarcane Shop
        </h1>

        {/* Full Banner Image */}
        <div style={{ width: '100%', maxWidth: '800px', marginBottom: '1rem' }}>
          <img
            src="/new_banner.jpg"
            alt="Sweet Cane Juice Logo"
            className="hero-banner-img"
            style={{ width: '100%', height: 'auto', display: 'block', padding: '0 1rem' }}
          />
        </div>

        {/* Status Indicator (Below Image) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 1s ease'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#2d6a4f', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Current Status</span>
          <div style={{
            display: 'inline-block',
            padding: '10px 28px',
            borderRadius: '50px',
            backgroundColor: isOpen ? 'var(--primary-green)' : '#ef4444',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 800,
            boxShadow: isOpen ? '0 0 20px rgba(217, 119, 6, 0.5)' : '0 0 20px rgba(239, 68, 68, 0.5)',
            animation: isOpen ? 'pulse 2s infinite' : 'pulse-red 2s infinite',
            letterSpacing: '1px',
            border: '2px solid white'
          }}>
            {isOpen ? 'WE ARE OPEN' : 'WE ARE CLOSED'}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="container reveal" style={{ marginTop: '5rem' }}>
        <h2 className="section-title">Our Menu</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {/* Dynamic Main Menu */}
          {(data.mainMenu || []).map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <Image
                  src={item.image || "/sugarcane_juice.png"}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{item.name}</h3>
              {item.description && (
                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{item.description}</p>
              )}
              
              {item.variants && item.variants.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginTop: '1rem' }}>
                  {item.variants.map((variant, idx) => (
                    <li key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 0', 
                      borderBottom: idx === item.variants.length - 1 ? 'none' : '1px solid #e2e8f0' 
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{variant.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-green)' }}>₹{variant.price}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Arun Ice Creams Card */}
          <Link href="/ice-creams" style={{ textDecoration: 'none', display: 'block' }}>
            <div className="glass-card" style={{ padding: '2rem', height: '100%', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
                <Image
                  src="/arun_icecream.jpg"
                  alt="Arun Ice Creams"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', textAlign: 'center' }}>Arun Ice Creams</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem', textAlign: 'center' }}>Click to view Available Flavors & Bites</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <div style={{ 
                  backgroundColor: 'var(--primary-green)', 
                  color: 'white', 
                  padding: '10px 24px', 
                  borderRadius: '50px', 
                  fontWeight: 600,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  View Ice Cream Menu
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>


      {/* Location & Contact Section */}
      <section className="container reveal" style={{ marginTop: '5rem', marginBottom: '5rem' }}>
        <h2 className="section-title">Visit Us</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '3rem' }}>
          
          {/* Contact Info Card */}
          <div className="glass-card" style={{ flex: '1 1 300px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Contact & Hours</h3>
            
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📍</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Address</strong>
                <p style={{ color: 'var(--text-light)', margin: 0 }} dangerouslySetInnerHTML={{ __html: data.contact?.address || "123 Main Street<br />Cityville, State 12345" }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📞</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Phone</strong>
                <p style={{ color: 'var(--text-light)', margin: 0 }}>{data.contact?.phone || "+91 98765 43210"}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>⏰</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Working Hours</strong>
                <p style={{ color: 'var(--text-light)', margin: 0 }}>Mon - Sun: 10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <div className="glass-card" style={{ flex: '2 1 400px', padding: '1rem', height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
            <iframe 
              src={data.contact?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15553.30948950489!2d77.5855268!3d12.9493976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15b1fb4b0b1f%3A0x868b446a815a133!2sLalbagh%20Botanical%20Garden!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '8px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Shop Location"
            ></iframe>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '5rem', padding: '2rem', borderTop: '1px solid #e2e8f0', color: 'var(--text-light)' }}>
        <p>© {new Date().getFullYear()} S.Thiravia Raj. All rights reserved.</p>
      </footer>

      <ClientInteractive />
    </main>
  );
}
