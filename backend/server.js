const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const KVDB_URL = 'https://kvdb.io/KM3MdUap18RMXcTfSv5LBU/shop_data';

app.get('/api/data', async (req, res) => {
  try {
    const fetchRes = await fetch(KVDB_URL + '?_t=' + Date.now());
    const data = await fetchRes.json();
    res.json({ ...data, usingKV: true });
  } catch (error) {
    console.error('Failed to read data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    
    await fetch(KVDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    
    res.json({ success: true, data: newData });
  } catch (error) {
    console.error('Failed to write data:', error);
    res.status(500).json({ error: 'Failed to write data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
