import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [user, setUser] = useState(null);
  
  // Reviews & Eligibility
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);

  // UX states
  const [zoom, setZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => { if (unsub) unsub(); };
  }, [id]);

  useEffect(() => {
    if (product) {
      let viewed = JSON.parse(localStorage.getItem('sgc_recently_viewed') || '[]');
      const filtered = viewed.filter(p => p.id !== product.id);
      setRecentlyViewed(filtered.slice(0, 4));
      
      const newViewed = [product, ...filtered].slice(0, 8);
      localStorage.setItem('sgc_recently_viewed', JSON.stringify(newViewed));
    }
  }, [product]);

  useEffect(() => {
    if (user && product) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/orders?userId=${user.uid}`)
        .then(r => r.json())
        .then(orders => {
           // Check if user has a delivered order containing this specific product ID
           const isEligible = orders.some(o => 
             o.status === 'Delivered' && 
             o.products?.some(p => String(p.id) === String(product.id))
           );
           setHasPurchased(isEligible);
        }).catch(err => console.error("Verification error:", err));
    }
  }, [user, product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || '');
        
        // Fetch Related Products from same category
        if (data.category) {
          fetch(`${process.env.REACT_APP_API_BASE_URL}/products?category=${encodeURIComponent(data.category)}`)
            .then(r => r.json())
            .then(related => {
               setRelatedProducts(related.filter(p => String(p.id) !== String(data.id)).slice(0, 4));
            }).catch(() => {});
        }
      } else {
        throw new Error('API fetch failed');
      }
    } catch (error) {
       console.error(error);
    }
    setLoading(false);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to leave a review.");
    if (!hasPurchased) return alert("You can only review products that have been delivered to you.");
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          userName: user.displayName || user.email.split('@')[0],
          userId: user.uid
        })
      });
      if (res.ok) {
        setReviewComment('');
        setReviewRating(5);
        showToast('Verified review submitted successfully!');
        fetchProduct(); // Refresh reviews
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      alert("Error submitting review.");
    }
  };

  const handleQuantity = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', fontSize: '1.2rem' }}>Loading masterpiece details...</div>;
  if (!product) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Product not found.</div>;

  return (
    <div className="container section-padding animate-fade-in" style={{ maxWidth: '1400px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8rem', alignItems: 'flex-start' }}>
        
        {/* Massive Image Gallery */}
        <div className="flex-col gap-4" style={{ flex: '1 1 500px', minWidth: '300px' }}>
          <div 
            style={{ backgroundColor: 'var(--color-ivory)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'zoom-in', border: '1px solid var(--color-gray-border)' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              style={{ 
                width: '100%', height: 'auto', display: 'block', aspectRatio: '4/5', objectFit: 'cover',
                transform: zoom ? 'scale(2.5)' : 'scale(1)',
                transformOrigin: zoomOrigin,
                transition: zoom ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }} 
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto" style={{ paddingBottom: '0.5rem' }}>
              {product.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`Thumbnail ${i + 1}`} 
                  onClick={() => setMainImage(img)}
                  style={{ width: '100px', height: '100px', flexShrink: 0, objectFit: 'cover', cursor: 'pointer', border: mainImage === img ? '2px solid var(--color-primary)' : '2px solid transparent', borderRadius: 'var(--radius-sm)', transition: 'border-color 0.3s ease' }} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex-col" style={{ flex: '1 1 400px', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          <div>
             <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <p style={{ color: 'var(--color-gray-dark)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', fontWeight: '600' }}>{product.category}</p>
                <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', backgroundColor: 'var(--color-ivory)', padding: '0.2rem 0.8rem', borderRadius: '50px', border: '1px solid var(--color-gold)' }}>CODE: {product.id}</p>
             </div>
             <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: '1.2' }}>{product.name}</h1>
          </div>
          
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-ivory)', borderLeft: '6px solid var(--color-primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <div className="flex items-center gap-3">
                <p style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--color-primary)', fontWeight: '700', margin: 0 }}>₹{product.price}</p>
                {product.originalPrice > product.price && (
                   <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.6rem', color: '#777', textDecoration: 'line-through', fontWeight: '500' }}>₹{product.originalPrice}</span>
                      <span style={{ backgroundColor: '#22c55e', color: 'white', fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: '800' }}>
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                   </div>
                )}
             </div>
             {product.originalPrice > product.price && (
                <p style={{ color: '#166534', fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>✓ You Save: ₹{product.originalPrice - product.price} today!</p>
             )}
          </div>
          
          {product.avgRating ? (
             <div style={{ color: '#fbbf24', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span>{'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))}</span>
               <span style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', fontWeight: '500' }}>({product.reviews?.length} Verified Reviews)</span>
             </div>
          ) : (
             <span style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: '500' }}>No reviews yet</span>
          )}

          <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>The Details</h3>
            <p style={{ color: 'var(--color-gray-dark)', lineHeight: '1.8', fontSize: '1.05rem' }}>{product.description}</p>
          </div>

          <div className="flex-col gap-4" style={{ marginTop: '2rem' }}>
            <div className="flex gap-4 items-center">
               <label style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--color-primary)' }}>Select Quantity:</label>
               <div className="flex gap-4 items-center" style={{ backgroundColor: '#f9f9f9', border: '1px solid var(--color-gray-border)', borderRadius: '50px', padding: '0.6rem 1.4rem' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: 'var(--color-primary)', fontWeight: 'bold' }} onClick={() => handleQuantity(quantity - 1)}>-</button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '900', fontSize: '1.1rem' }}>{quantity}</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: 'var(--color-primary)', fontWeight: 'bold' }} onClick={() => handleQuantity(quantity + 1)}>+</button>
               </div>
            </div>

            <div className="flex gap-4" style={{ width: '100%', flexWrap: 'wrap' }}>
              <Button onClick={() => { 
                  if (!auth.currentUser) return navigate('/login');
                  addToCart(product, quantity); 
                  showToast(`${quantity} x ${product.name} added to Cart!`); 
                }} 
                variant="outline" 
                style={{ flex: '1 1 200px', fontSize: '1.1rem', padding: '1.2rem', borderRadius: '50px', letterSpacing: '1px' }}
              >
                Add to Cart
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  if (!auth.currentUser) return navigate('/login');
                  navigate(`/checkout?product=${product.id}&qty=${quantity}`);
                }}
                style={{ flex: '1 1 200px', fontSize: '1.1rem', padding: '1.2rem', borderRadius: '50px', letterSpacing: '1px' }}
              >
                Buy It Now
              </Button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 1.5rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)', marginTop: '1rem', border: '1px solid #bbf7d0' }}>
            <span style={{ color: '#166534', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </span>
            <p style={{ fontSize: '0.95rem', color: '#166534', fontWeight: '500', lineHeight: '1.4' }}>Guaranteed authentic craftsmanship.<br/>Fast delivery & Secure WhatsApp checkout.</p>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '10rem', borderTop: '2px solid var(--color-primary)', paddingTop: '6rem' }}>
         <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>More from {product.category}</h2>
         {relatedProducts.length > 0 ? (
            <div className="product-grid">
               {relatedProducts.map(prod => <ProductCard key={prod.id} product={prod} />)}
            </div>
         ) : (
            <p style={{ textAlign: 'center', color: 'var(--color-gray-dark)' }}>No related products available at this time.</p>
         )}
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '10rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '6rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--color-primary)' }}>Customer Reviews</h2>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
           <div>
              {product.reviews && product.reviews.length > 0 ? (
                 <div className="flex-col gap-6">
                    {product.reviews.map((rev, idx) => (
                       <div key={idx} style={{ padding: '2rem', backgroundColor: 'var(--color-ivory)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-border)' }}>
                          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                             <div className="flex items-center gap-2">
                                <strong style={{ fontWeight: 600, fontSize: '1.1rem' }}>{rev.userName}</strong>
                                <span style={{ backgroundColor: '#22c55e', color: 'white', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Buyer</span>
                             </div>
                             <span style={{ color: '#fbbf24', fontSize: '1.2rem', letterSpacing: '2px' }}>{'★'.repeat(rev.rating)}</span>
                          </div>
                          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: '1.6' }}>{rev.comment}</p>
                          <small style={{ color: 'var(--color-primary)', marginTop: '1rem', display: 'block', fontWeight: '600' }}>{new Date(rev.createdAt).toLocaleDateString()}</small>
                       </div>
                    ))}
                 </div>
              ) : (
                 <p style={{ color: 'var(--color-gray-text)', fontSize: '1.1rem', fontStyle: 'italic' }}>No reviews yet. Only actual buyers can leave a review!</p>
              )}
           </div>

           <div>
              {!user ? (
                 <div style={{ backgroundColor: 'var(--color-gray-light)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--color-gray-border)' }}>🔒</div>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Members Only</h3>
                    <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2rem', lineHeight: '1.6' }}>Please log in to leave a review. We require reviewers to have a delivered purchase profile to prevent spam and fake reviews.</p>
                    <Link to="/login"><Button variant="primary" style={{ padding: '1rem 2rem' }}>Log in to Verify</Button></Link>
                 </div>
              ) : !hasPurchased ? (
                 <div style={{ backgroundColor: 'var(--color-ivory)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-border)' }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: '#fef08a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#854d0e', fontSize: '1.5rem' }}>📦</div>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', color: '#854d0e' }}>Purchase Required</h3>
                    <p style={{ color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>You must have a <strong style={{color: '#166534'}}>Delivered</strong> order containing this exact item to leave a verified review. Thank you for maintaining the integrity of Sri Govinda Collections!</p>
                 </div>
              ) : (
                 <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: 'var(--color-primary)' }}>Share Your Experience</h3>
                    <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>Thank you for purchasing! Your feedback helps others shop with confidence.</p>
                    <form onSubmit={submitReview} className="flex-col gap-5">
                       <div>
                          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Quality Rating</label>
                          <select value={reviewRating} onChange={e => setReviewRating(e.target.value)} className="input-field" style={{ padding: '1rem' }}>
                             <option value="5">⭐⭐⭐⭐⭐ - Divine Quality</option>
                             <option value="4">⭐⭐⭐⭐ - Beautiful</option>
                             <option value="3">⭐⭐⭐ - Good</option>
                             <option value="2">⭐⭐ - Average</option>
                             <option value="1">⭐ - Disappointing</option>
                          </select>
                       </div>
                       <div>
                          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Your Review</label>
                          <textarea required value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows="4" className="input-field" placeholder="Tell us about the craftsmanship, finish, and packaging..." style={{ padding: '1rem' }}></textarea>
                       </div>
                       <Button type="submit" variant="primary" style={{ padding: '1rem', width: '100%', fontSize: '1.05rem', marginTop: '1rem' }}>Publish Verified Review</Button>
                    </form>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginTop: '10rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '6rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '2rem', textAlign: 'center' }}>Recently Viewed</h2>
          <div className="product-grid">
            {recentlyViewed.map(prod => <ProductCard key={prod.id} product={prod} />)}
          </div>
        </div>
      )}

    </div>
  );
}
