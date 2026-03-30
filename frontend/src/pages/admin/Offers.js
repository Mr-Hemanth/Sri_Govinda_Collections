import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, Calendar, Percent, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL } from '../../apiConfig';

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        code: '',
        discountValue: '',
        discountType: 'percent',
        expiryDate: '',
        minAmount: '',
        description: ''
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/offers`);
            if (res.ok) {
                const data = await res.json();
                setOffers(data);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId 
            ? `${API_BASE_URL}/offers/${editingId}`
            : `${API_BASE_URL}/offers`;
        
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                setEditingId(null);
                setFormData({ code: '', discountValue: '', discountType: 'percent', expiryDate: '', minAmount: '', description: '' });
                fetchOffers();
            }
        } catch (error) {
            console.error('Error saving offer:', error);
        }
    };

    const handleEdit = (offer) => {
        setEditingId(offer.id);
        setFormData({
            code: offer.code,
            discountValue: offer.discountValue,
            discountType: offer.discountType,
            expiryDate: offer.expiryDate ? offer.expiryDate.split('T')[0] : '',
            minAmount: offer.minAmount || '',
            description: offer.description || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/offers/${id}`, { method: 'DELETE' });
            if (res.ok) fetchOffers();
        } catch (error) {
            console.error('Error deleting offer:', error);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '8rem 0 3rem' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-primary)' }}>Promotions & Offers</h1>
                    <p style={{ color: 'var(--color-gray-text)' }}>Create and manage system-wide discounts and coupons.</p>
                </div>
                <Button variant="primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {showForm ? 'Close Form' : <><Plus size={18} /> New Promotion</>}
                </Button>
            </div>

            {showForm && (
                <div className="card glass animate-slide-down" style={{ padding: '2.5rem', marginBottom: '3rem', borderRadius: '32px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{editingId ? 'Edit Promotion' : 'Create New Promotion'}</h3>
                    <form onSubmit={handleSubmit} className="flex-col gap-6">
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Coupon Code</label>
                                <input required className="input-field" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. FESTIVAL20" />
                            </div>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Discount Type</label>
                                <select className="input-field" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}>
                                    <option value="percent">Percentage (%)</option>
                                    <option value="flat">Flat Amount (₹)</option>
                                </select>
                            </div>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Value</label>
                                <input required type="number" className="input-field" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} placeholder="e.g. 20" />
                            </div>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Min. Purchase (₹)</label>
                                <input type="number" className="input-field" value={formData.minAmount} onChange={e => setFormData({...formData, minAmount: e.target.value})} placeholder="Optional" />
                            </div>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Expiry Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input type="date" className="input-field" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                                </div>
                            </div>
                            <div className="flex-col gap-2" style={{ gridColumn: 'span 1' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Description</label>
                                <input className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Short label for users..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3" style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '2rem' }}>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" style={{ padding: '0.8rem 3rem' }}>{editingId ? 'Update Promotion' : 'Publish Offer'}</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {offers.length > 0 ? offers.map((offer) => (
                    <div key={offer.id} className="card" style={{ padding: '2rem', borderLeft: `6px solid ${new Date(offer.expiryDate) < new Date() ? '#ccc' : 'var(--color-primary)'}` }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{offer.code}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-dark)', fontWeight: '700', textTransform: 'uppercase' }}>
                                    {offer.discountType === 'percent' ? `${offer.discountValue}% Off` : `₹${offer.discountValue} Off`}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(offer)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                <button onClick={() => handleDelete(offer.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <p style={{ color: 'var(--color-gray-text)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{offer.description}</p>
                        
                        <div className="flex justify-between items-center" style={{ fontSize: '0.8rem', color: '#888', borderTop: '1px solid #f5f5f5', paddingTop: '1rem' }}>
                            <span className="flex items-center gap-1"><Calendar size={14} /> {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : 'Never Expire'}</span>
                            <span className="flex items-center gap-1"><Tag size={14} /> Min: ₹{offer.minAmount || 0}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center" style={{ gridColumn: '1 / -1', padding: '6rem' }}>
                        <AlertCircle size={48} color="var(--color-gray-border)" />
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-gray-text)', marginTop: '1rem' }}>No offers created yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOffers;
