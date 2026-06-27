"use client";
import { useState, useEffect, useRef } from "react";
import { verifyAdminPassword } from "./actions";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [data, setData] = useState({ isOpen: false, iceCreams: [], mainMenu: [] });
  const [isLoading, setIsLoading] = useState(true);

  // New Ice Cream Form State
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newType, setNewType] = useState("Cone");

  // New Main Menu Form State
  const [mainMenuName, setMainMenuName] = useState("");
  const [mainMenuDesc, setMainMenuDesc] = useState("");
  const [mainMenuImage, setMainMenuImage] = useState(null);
  const [mainMenuVariants, setMainMenuVariants] = useState([{ name: "", price: "" }]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Contact Info State
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [contactMapUrl, setContactMapUrl] = useState("");

  const [usingKV, setUsingKV] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data", { cache: 'no-store' });
      const json = await res.json();
      if (!json.mainMenu) json.mainMenu = [];
      if (!json.contact) json.contact = { phone: "", address: "" };
      setData(json);
      setUsingKV(json.usingKV !== false);
      setContactPhone(json.contact.phone || "");
      setContactAddress(json.contact.address || "");
      setContactMapUrl(json.contact.mapUrl || "");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const saveData = async (newData) => {
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      setData(newData);
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const toggleStatus = () => {
    saveData({ ...data, isOpen: !data.isOpen });
  };

  const saveContactInfo = () => {
    const newContact = { ...(data.contact || {}), phone: contactPhone, address: contactAddress, mapUrl: contactMapUrl };
    saveData({ ...data, contact: newContact });
    alert("Contact info updated!");
  };

  const addIceCream = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    
    const newIceCream = {
      id: Date.now().toString(),
      name: newName,
      price: Number(newPrice),
      type: newType
    };

    saveData({ ...data, iceCreams: [...data.iceCreams, newIceCream] });
    setNewName("");
    setNewPrice("");
  };

  const removeIceCream = (id) => {
    const updatedIceCreams = data.iceCreams.filter(item => item.id !== id);
    saveData({ ...data, iceCreams: updatedIceCreams });
  };

  // Main Menu functions
  const addVariant = () => {
    setMainMenuVariants([...mainMenuVariants, { name: "", price: "" }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...mainMenuVariants];
    newVariants[index][field] = value;
    setMainMenuVariants(newVariants);
  };

  const removeVariant = (index) => {
    const newVariants = [...mainMenuVariants];
    newVariants.splice(index, 1);
    setMainMenuVariants(newVariants);
  };

  const addMainMenuItem = async (e) => {
    e.preventDefault();
    if (!mainMenuName) return;

    const validVariants = mainMenuVariants.filter(v => v.name.trim() !== "" && v.price !== "");
    if (validVariants.length === 0) {
      alert("Please add at least one price option with a name and price.");
      return;
    }

    setIsUploading(true);
    let imageUrl = "/sugarcane_juice.png"; // Fallback image

    if (mainMenuImage) {
      const formData = new FormData();
      formData.append("file", mainMenuImage);
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
        } else {
          alert("Image upload failed: " + uploadData.error);
        }
      } catch (err) {
        console.error("Upload error", err);
        alert("Image upload error.");
      }
    }

    const newItem = {
      id: "menu-" + Date.now().toString(),
      name: mainMenuName,
      description: mainMenuDesc,
      image: imageUrl,
      variants: validVariants.map(v => ({ name: v.name, price: Number(v.price) }))
    };

    const newMainMenu = [...(data.mainMenu || []), newItem];
    await saveData({ ...data, mainMenu: newMainMenu });

    setMainMenuName("");
    setMainMenuDesc("");
    setMainMenuImage(null);
    setMainMenuVariants([{ name: "", price: "" }]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploading(false);
  };

  const removeMainMenuItem = (id) => {
    const updatedMenu = (data.mainMenu || []).filter(item => item.id !== id);
    saveData({ ...data, mainMenu: updatedMenu });
  };

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-light)" }}>
        <div className="glass-card" style={{ padding: "3rem", width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "1.5rem", textAlign: "center", fontWeight: 800 }}>Admin Login</h1>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>Login</button>
          </form>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href="/" style={{ color: "var(--text-light)", textDecoration: "none" }}>&larr; Back to Shop</a>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return <main style={{ padding: "4rem", textAlign: "center" }}>Loading...</main>;
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-light)", padding: "2rem 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary-dark)" }}>Admin Dashboard</h1>
          <a href="/" className="btn" style={{ border: "1px solid var(--text-light)", color: "var(--text-dark)" }}>View Live Site</a>
        </div>

        {!usingKV && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #f87171' }}>
            <strong>Warning:</strong> Vercel KV Database is not connected! Changes made here will not be saved on the live site. Please set up Vercel KV in your Vercel Dashboard.
          </div>
        )}

        {/* Shop Settings (Status & Contact) */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-dark)", marginBottom: "1.5rem" }}>Shop Settings</h2>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem" }}>
            {/* Status */}
            <div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "1rem" }}>Current Status</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>{data.isOpen ? <span style={{color: "var(--primary-green)"}}>OPEN</span> : <span style={{color: "#ef4444"}}>CLOSED</span>}</span>
                <label className="switch">
                  <input type="checkbox" checked={data.isOpen} onChange={toggleStatus} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Phone & Address */}
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>Phone Number</h3>
                <input 
                  type="text" 
                  value={contactPhone} 
                  onChange={e => setContactPhone(e.target.value)} 
                  className="input-field" 
                  placeholder="e.g. +91 98765 43210" 
                  style={{ width: "100%", maxWidth: "400px" }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>Address</h3>
                <textarea 
                  value={contactAddress} 
                  onChange={e => setContactAddress(e.target.value)} 
                  className="input-field" 
                  placeholder="e.g. 123 Main Street<br />Cityville" 
                  style={{ width: "100%", maxWidth: "400px", minHeight: "80px", resize: "vertical" }}
                />
                <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.2rem" }}>You can use &lt;br /&gt; for line breaks.</p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>Google Maps Embed URL</h3>
                <input 
                  type="text" 
                  value={contactMapUrl} 
                  onChange={e => setContactMapUrl(e.target.value)} 
                  className="input-field" 
                  placeholder="Paste the Google Maps 'src' link here..." 
                  style={{ width: "100%", maxWidth: "400px" }}
                />
                <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.2rem" }}>From Google Maps: Share &gt; Embed a map &gt; Copy only the 'src' link.</p>
              </div>
              <button onClick={saveContactInfo} className="btn btn-primary" style={{ padding: "10px 20px", alignSelf: "flex-start" }}>Save Contact Info</button>
            </div>
          </div>
        </div>

        {/* Main Menu Management */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-dark)", marginBottom: "1.5rem" }}>Manage Main Menu (Juices, Sodas, etc.)</h2>
          
          <form onSubmit={addMainMenuItem} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>Item Name</label>
                <input type="text" value={mainMenuName} onChange={e => setMainMenuName(e.target.value)} className="input-field" placeholder="e.g., Fresh Sugarcane Juice" required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>Description</label>
                <input type="text" value={mainMenuDesc} onChange={e => setMainMenuDesc(e.target.value)} className="input-field" placeholder="Short description" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>Image Upload</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setMainMenuImage(e.target.files[0])} className="input-field" style={{ padding: "8px" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>Pricing Options / Sizes</label>
                {mainMenuVariants.map((variant, index) => (
                  <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <input type="text" value={variant.name} onChange={e => updateVariant(index, 'name', e.target.value)} className="input-field" placeholder="Size (e.g., Regular Glass)" required />
                    <input type="number" value={variant.price} onChange={e => updateVariant(index, 'price', e.target.value)} className="input-field" placeholder="Price (₹)" required style={{ width: '100px' }} />
                    {mainMenuVariants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(index)} style={{ padding: "0 10px", color: "#ef4444", background: "none", border: "1px solid #ef4444", borderRadius: "8px", cursor: "pointer" }}>X</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addVariant} style={{ fontSize: "0.9rem", color: "var(--primary-green)", background: "none", border: "none", cursor: "pointer", fontWeight: "bold", padding: "5px 0" }}>+ Add another price option</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "14px 24px" }} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Add to Menu"}
            </button>
          </form>

          {/* List Main Menu */}
          <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            {(data.mainMenu || []).map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{item.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                      {item.variants.length} option(s) starting at ₹{Math.min(...item.variants.map(v => v.price))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeMainMenuItem(item.id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600, padding: "8px" }}
                >
                  Remove
                </button>
              </div>
            ))}
            {(!data.mainMenu || data.mainMenu.length === 0) && (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-light)" }}>No items in main menu.</div>
            )}
          </div>
        </div>

        {/* Inventory Management */}
        <div className="glass-card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-dark)", marginBottom: "1.5rem" }}>Manage Ice Creams</h2>
          
          {/* Add New */}
          <form onSubmit={addIceCream} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", marginBottom: "2rem", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>Name</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="input-field" placeholder="e.g., Mango Bite" required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>Price (₹)</label>
              <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="input-field" placeholder="e.g., 10" required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>Type</label>
              <select value={newType} onChange={e => setNewType(e.target.value)} className="input-field">
                <option value="Cone">Cone</option>
                <option value="Bite">Bite</option>
                <option value="Cup">Cup</option>
                <option value="Family Pack">Family Pack</option>
                <option value="Stick">Stick</option>
                <option value="Shake">Shake</option>
                <option value="Ball">Ball</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "14px 24px" }}>Add Item</button>
          </form>

          {/* List */}
          <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            {data.iceCreams.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{item.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>{item.type} • ₹{item.price}</div>
                </div>
                <button 
                  onClick={() => removeIceCream(item.id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600, padding: "8px" }}
                >
                  Remove
                </button>
              </div>
            ))}
            {data.iceCreams.length === 0 && (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-light)" }}>No ice creams available.</div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
