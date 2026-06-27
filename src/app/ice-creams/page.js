import Image from "next/image";
import Link from "next/link";
import fs from 'fs';
import path from 'path';

import { BillEstimator } from "./BillEstimator";

// Revalidate every 0 seconds to ensure fresh data since we read from a local file
export const revalidate = 0;

export default async function IceCreamsPage() {
  // Read data directly in the server component
  const dataFilePath = path.join(process.cwd(), 'data.json');
  let data = { iceCreams: [] };
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read data.json', error);
  }

  const { iceCreams } = data;

  const categories = ["Cone", "Bite", "Cup", "Family Pack", "Stick", "Shake", "Ball", "Other"];

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem', backgroundColor: '#eef5d9' }}>
      {/* Header */}
      <section style={{
        backgroundColor: 'var(--primary-dark)',
        padding: '2rem 1rem',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>
          Ice Cream Menu
        </h1>
        <p style={{ color: '#eef5d9', marginTop: '0.5rem', fontSize: '1.2rem' }}>
          Explore our delicious flavors and bites!
        </p>
      </section>

      {/* Content Section */}
      <section className="container" style={{ marginTop: '3rem', maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" className="btn" style={{ border: '1px solid var(--text-light)', color: 'var(--text-dark)', textDecoration: 'none' }}>
            &larr; Back to Shop
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
            <Image
              src="/arun_icecream.jpg"
              alt="Arun Ice Creams"
              fill
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
            />
          </div>
          
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '2rem', textAlign: 'center' }}>
            Available Flavors
          </h2>

          {iceCreams && iceCreams.length > 0 ? (
            <BillEstimator iceCreams={iceCreams} categories={categories} />
          ) : (
            <p style={{ textAlign: 'center', color: '#ef4444', fontStyle: 'italic', marginTop: '1rem', fontSize: '1.2rem' }}>
              Currently out of stock. Check back later!
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
