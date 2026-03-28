import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ui/ProductCard';

export default function Wishlist() {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div className="container section-padding animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-primary)', marginBottom: '1rem' }}>Your Curated Wishlist</h1>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem' }}>Save the masterpieces that speak to your soul.</p>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--color-ivory)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-gold)' }}>
           <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.2rem', fontWeight: '500' }}>Your wishlist is currently empty.</p>
           <p style={{ color: 'var(--color-gray-text)', marginTop: '0.5rem' }}>Save items you love while browsing to see them here.</p>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
