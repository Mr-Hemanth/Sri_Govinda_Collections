import React, { useState, useEffect } from 'react';
import { Tag, Copy, CheckCircle, Clock, Percent } from 'lucide-react';
import Button from '../components/ui/Button';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/offers`);
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

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (loading) return <div className="container section-padding text-center">Loading amazing offers...</div>;

    return (
        <div className="container section-padding animate-fade-in">
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Exclusive Offers</h1>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Indulge in luxury with our curated collection of offers and seasonal discounts.
                </p>
            </header>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {offers.length > 0 ? offers.map((offer) => (
                    <div key={offer.id} className="card overflow-hidden" style={{ position: 'relative', background: 'white', borderRadius: '24px' }}>
                        {/* Decorative Tag */}
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem', borderRadius: '12px', color: 'var(--color-primary)' }}>
                           <Percent size={20} />
                        </div>

                        <div style={{ padding: '2.5rem' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                <Tag size={16} />
                                <span>{offer.discountType === 'percent' ? `${offer.discountValue}% Off` : `₹${offer.discountValue} Off`}</span>
                            </div>
                            
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>{offer.code}</h3>
                            <p style={{ color: 'var(--color-gray-text)', marginBottom: '2rem', minHeight: '3rem' }}>{offer.description}</p>
                            
                            <div className="flex-col gap-3" style={{ background: 'var(--color-gray-light)', padding: '1.5rem', borderRadius: '16px' }}>
                                <div className="flex justify-between items-center">
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Min. Purchase:</span>
                                    <span style={{ fontWeight: '700' }}>₹{offer.minAmount || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Valid Until:</span>
                                    <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={14} /> {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : 'Limited Time'}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => copyToClipboard(offer.code)}
                                className="flex justify-between items-center" 
                                style={{ 
                                    width: '100%', 
                                    marginTop: '1.5rem', 
                                    padding: '1.2rem', 
                                    border: '2px dashed var(--color-primary)', 
                                    borderRadius: '16px', 
                                    background: copiedCode === offer.code ? 'var(--color-primary)' : 'transparent',
                                    color: copiedCode === offer.code ? 'white' : 'var(--color-primary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '700'
                                }}
                            >
                                <span>{copiedCode === offer.code ? 'CODE COPIED!' : offer.code}</span>
                                {copiedCode === offer.code ? <CheckCircle size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
                        <Tag size={48} color="var(--color-gray-border)" style={{ marginBottom: '1rem' }} />
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-gray-text)' }}>No active offers at the moment. Check back soon!</p>
                    </div>
                )}
            </div>

            {/* Terms Section */}
            <div style={{ marginTop: '8rem', padding: '4rem', background: 'var(--color-black)', borderRadius: '32px', color: 'white' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>How to use coupons?</h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
                    <div className="flex-col gap-3">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                        <h4 style={{ fontSize: '1.2rem' }}>Copy Coupon Code</h4>
                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Click on any coupon box above to instantly copy the code to your clipboard.</p>
                    </div>
                    <div className="flex-col gap-3">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                        <h4 style={{ fontSize: '1.2rem' }}>Add Products to Cart</h4>
                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Pick your favorite jewelry pieces and add them to your luxury shopping bag.</p>
                    </div>
                    <div className="flex-col gap-3">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                        <h4 style={{ fontSize: '1.2rem' }}>Apply at Checkout</h4>
                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Paste the code in the 'Coupon' field during checkout to enjoy your exclusive discount.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;
