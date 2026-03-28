import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '../../components/ui/Button';
import {
  Package,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '1 Gram Gold',
    description: '',
    image: '',
    stock: '10',
    isFeatured: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL?.trim();
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/products`);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error("Fetch products failed", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
    });
    return () => { if (unsub) unsub(); };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit check
        alert("Image size exceeds 1MB. Please use a smaller file for optimal system performance.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productPayload = {
      name: formData.name,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      category: formData.category,
      description: formData.description,
      images: [formData.image],
      stock: Number(formData.stock || 10),
      isFeatured: formData.isFeatured || false
    };

    try {
      const url = `${process.env.REACT_APP_API_BASE_URL}/products${isEditing ? `/${editId}` : ''}`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productPayload)
      });
      if (res.ok) {
        fetchProducts();
        setFormData({ name: '', price: '', originalPrice: '', category: '1 Gram Gold', description: '', image: '', stock: '10', isFeatured: false });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (e) { alert("Action failed"); }
  };

  const handleEdit = (p) => {
    setFormData({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      category: p.category,
      description: p.description || '',
      image: p.images?.[0] || '',
      stock: String(p.stock || 10),
      isFeatured: p.isFeatured || false
    });
    setIsEditing(true);
    setEditId(p.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (e) { alert("Delete failed"); }
  };

  if (!user || user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '8rem 0 3rem', maxWidth: '1400px' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '4rem' }}>
        <div>
          <h1 className="text-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--color-primary)' }}>Inventory Catalog</h1>
          <p style={{ color: 'var(--color-gray-text)' }}>Manage your premium jewelry collections and stock levels.</p>
        </div>
        <Button variant="primary" onClick={() => { setIsEditing(false); setFormData({ name: '', price: '', originalPrice: '', category: '1 Gram Gold', description: '', image: '', stock: '10', isFeatured: false }); }}>
           Add New Product
        </Button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(380px, 1fr) 2fr', gap: '4rem', alignItems: 'start' }}>
        {/* Form Column */}
        <div className="card glass sticky-top" style={{ padding: '2.5rem', top: '2rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>{isEditing ? 'Update Selection' : 'Register New Piece'}</h2>

          <form className="flex-col gap-6" onSubmit={handleSubmit}>
            {/* Image Upload Area */}
            <div className="flex-col gap-2">
              <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Product Visual</label>

              {formData.image ? (
                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-gray-border)' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={removePhoto}
                    style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerFileUpload}
                  style={{ width: '100%', height: '200px', borderRadius: '16px', border: '2px dashed var(--color-gray-border)', backgroundColor: '#fcfcfc', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  className="hover-gold"
                >
                  <Upload size={32} color="#999" style={{ marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Upload from Device</p>
                  <p style={{ fontSize: '0.7rem', color: '#999' }}>PNG, JPG or JPEG up to 1MB</p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
              />

              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#999', textAlign: 'center', marginBottom: '0.5rem' }}>— OR USE EXTERNAL URL —</p>
                <input
                  placeholder="https://cloud-storage.com/image.jpg"
                  name="image"
                  value={formData.image.startsWith('data:image') ? 'Uploaded Local File' : formData.image}
                  onChange={handleChange}
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Product Identity</label>
              <input required placeholder="e.g. Traditional Matte Finish Haram" name="name" value={formData.name} onChange={handleChange} className="input-field" />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Display Price (₹)</label>
                <input required type="number" placeholder="Net Price" name="price" value={formData.price} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>MRP (₹)</label>
                <input required type="number" placeholder="Original price" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Inventory Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option>1 Gram Gold</option>
                  <option>Premium Matte</option>
                  <option>German Silver</option>
                  <option>Bridal Collection</option>
                  <option>Gift Articles</option>
                </select>
              </div>
            </div>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Story Details</label>
              <textarea placeholder="Describe the craftsmanship..." name="description" value={formData.description} onChange={handleChange} className="input-field" rows="3" style={{ resize: 'none' }}></textarea>
            </div>

            <div className="flex items-center gap-3" style={{ padding: '0.5rem', backgroundColor: 'var(--color-ivory)', borderRadius: '12px', border: '1px solid var(--color-gray-border)' }}>
               <input 
                  type="checkbox" 
                  id="isFeatured" 
                  name="isFeatured" 
                  checked={formData.isFeatured} 
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
               />
               <label htmlFor="isFeatured" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', cursor: 'pointer' }}>Showcase on Home Page (Featured)</label>
            </div>

            <div className="flex-col gap-3" style={{ marginTop: '1rem' }}>
              <Button type="submit" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', borderRadius: '50px' }}>
                 {isEditing ? 'Confirm Updates' : 'Add to Catalog'}
              </Button>
              {isEditing && <Button variant="outline" type="button" onClick={() => setIsEditing(false)} style={{ width: '100%', padding: '1.2rem', borderRadius: '50px' }}>Cancel Selection</Button>}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Live Exhibition ({products.length})</h2>
          </div>

          {loading ? (
             <div className="text-center" style={{ padding: '5rem' }}>Inducting treasures...</div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {products.map(p => (
                <div key={p.id} className="card overflow-hidden animate-fade-in" style={{ border: '1px solid var(--color-gray-border)' }}>
                  <div style={{ width: '100%', height: '260px', overflow: 'hidden', position: 'relative' }}>
                    <img src={p.images?.[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        <span style={{
                          padding: '0.3rem 0.8rem', fontSize: '0.65rem', fontWeight: '800', borderRadius: '50px', backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: 'var(--shadow-sm)'
                        }}>
                          {p.category}
                        </span>
                     </div>
                     {p.isFeatured && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                           <span style={{
                             padding: '0.3rem 0.8rem', fontSize: '0.65rem', fontWeight: '800', borderRadius: '50px', backgroundColor: 'var(--color-gold)', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: 'var(--shadow-sm)'
                           }}>
                             Showcased
                           </span>
                        </div>
                     )}
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', maxWidth: '65%' }}>{p.name}</h4>
                        <div style={{ textAlign: 'right' }}>
                           <p style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-primary)' }}>₹{p.price}</p>
                           {p.originalPrice > p.price && (
                             <p style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'line-through' }}>₹{p.originalPrice}</p>
                           )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f9f9f9' }}>
                       <span style={{
                         fontSize: '0.75rem', fontWeight: '700',
                         color: (p.stock || 0) > 0 ? '#166534' : '#dc2626'
                       }}>
                         {(p.stock || 0) > 0 ? `Stock: ${p.stock}` : 'OUT OF STOCK'}
                       </span>
                       <div className="flex gap-2">
                         <button onClick={() => handleEdit(p)} style={{ background: 'var(--color-ivory)', border: '1px solid #eee', padding: '0.5rem', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.3s' }} className="hover-gold"><Edit2 size={16} /></button>
                         <button onClick={() => handleDelete(p.id)} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.5rem', borderRadius: '50px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '10rem 2rem', background: 'white', borderRadius: '32px', border: '2px dashed var(--color-gray-border)' }}>
                   <Package size={48} color="#ccc" style={{ marginBottom: '1.5rem' }} />
                   <p style={{ fontSize: '1.2rem', color: '#999' }}>Your catalog is currently silent.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
