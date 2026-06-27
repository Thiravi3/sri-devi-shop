import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const KVDB_URL = 'https://kvdb.io/KM3MdUap18RMXcTfSv5LBU/shop_data';

export async function GET() {
  try {
    const fetchRes = await fetch(KVDB_URL + '?_t=' + Date.now(), { cache: 'no-store' });
    const data = await fetchRes.json();
    return NextResponse.json({ ...data, usingKV: true });
  } catch (error) {
    console.error('Failed to read data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const newData = await req.json();
    
    await fetch(KVDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    console.error('Failed to write data:', error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
