import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

// Helper to check API Key
function checkAuth(request) {
  const apiKey = request.headers.get('Authorization') || request.headers.get('x-api-key');
  if (apiKey !== process.env.API_KEY) {
    return false;
  }
  return true;
}

// Helper to read data
function readData() {
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Fetch all ice creams
export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = readData();
    return NextResponse.json({ success: true, iceCreams: data.iceCreams }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
  }
}

// POST: Add a new ice cream
export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newIceCream = await request.json();
    const data = readData();
    
    // Add an ID if not provided
    if (!newIceCream.id) {
      newIceCream.id = Date.now().toString();
    }
    
    data.iceCreams.push(newIceCream);
    writeData(data);
    
    return NextResponse.json({ success: true, iceCream: newIceCream }, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add ice cream' }, { status: 500 });
  }
}

// DELETE: Remove an ice cream by ID
export async function DELETE(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Ice cream ID is required' }, { status: 400 });
    }
    
    const data = readData();
    const initialLength = data.iceCreams.length;
    
    // Filter out the ice cream with the matching ID
    data.iceCreams = data.iceCreams.filter(item => item.id !== id);
    
    if (data.iceCreams.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Ice cream not found' }, { status: 404 });
    }
    
    writeData(data);
    
    return NextResponse.json({ success: true, message: 'Ice cream deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete ice cream' }, { status: 500 });
  }
}
