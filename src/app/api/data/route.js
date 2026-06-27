import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const dataFilePath = path.join(process.cwd(), 'data.json');

export async function GET() {
  try {
    // Try to get data from KV first
    let data = null;
    
    if (process.env.KV_REST_API_URL) {
      data = await kv.get('shop_data');
    }
    
    // If no data in KV, fallback to local file (e.g., for initial load)
    if (!data) {
      const fileContents = fs.readFileSync(dataFilePath, 'utf8');
      data = JSON.parse(fileContents);
      // Seed the KV with initial data
      if (process.env.KV_REST_API_URL) {
        await kv.set('shop_data', data);
      }
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read data:', error);
    // If KV fails (e.g., local dev without KV configured), fallback to file
    try {
      const fileContents = fs.readFileSync(dataFilePath, 'utf8');
      const data = JSON.parse(fileContents);
      return NextResponse.json(data);
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
  }
}

export async function POST(request) {
  try {
    const newData = await request.json();
    
    // Try to save to KV
    if (process.env.KV_REST_API_URL) {
       await kv.set('shop_data', newData);
    }
    
    // Also save to local file for local dev environments
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
    } catch (e) {
      // Ignore write errors in serverless environments (Vercel)
      console.warn("Could not write to local file (expected on Vercel), relying on KV");
    }
    
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    console.error('Failed to write data:', error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
