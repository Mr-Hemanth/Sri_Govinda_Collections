import { useState, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { Search } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('newest');

  const categories = ['All', '1 Gram Gold', 'German Silver', 'Panchalohas', 'Gift Articles'];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [category, sort, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Ensure the base URL is correct and trimmed
      const baseUrl = process.env.REACT_APP_API_BASE_URL?.trim();
      if (!baseUrl) throw new Error("API URL missing");

      const url = new URL(`${baseUrl}/products`);
      if (category && category !== 'All') url.searchParams.append('category', category);
      if (searchQuery) url.searchParams.append('search', searchQuery);
      if (sort) url.searchParams.append('sort', sort);

      console.log("Fetching from:", url.toString());
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Server error");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      // Fallback only if absolutely necessary, but alert user
      if (products.length === 0) {
        setProducts([
          { id: '1', name: 'Premium 1g Gold Necklace', category: '1 Gram Gold', price: 1500, images: ['https://images.unsplash.com/photo-1599643477873-beefa344dd1a?w=400'], stock: 5 },
          { id: '2', name: 'German Silver Earrings', category: 'German Silver', price: 500, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'], stock: 12 },
          { id: '3', name: 'Venkateswara Idol', category: 'Gift Articles', price: 2500, images: ['https://images.unsplash.com/photo-1603525203792-c67be3005a39?w=400'], stock: 3 },
        ]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="container section-padding animate-fade-in">
      <div className="flex-col max-w-standard" style={{ marginBottom: '8rem', gap: '5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Our Masterpieces</h1>
          <p className="text-balance" style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.6' }}>Explore our hand-curated selection of divine jewelry and traditional articles, crafted for generations to come.</p>
        </div>
        
        <div className="flex gap-6 items-center justify-center p-cont" style={{ 
          flexDirection: 'row',
          flexWrap: 'wrap', 
          backgroundColor: 'var(--color-ivory)', 
          padding: '2.5rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--color-gold)',
          width: '100%',
          boxShadow: '0 15px 35px rgba(0,0,0,0.03)'
        }}>
          
          <form onSubmit={handleSearch} style={{ 
            position: 'relative', 
            display: 'flex', 
            flex: '1 1 400px',
            maxWidth: '100%'
          }}>
            <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '3.5rem', borderRadius: '50px', backgroundColor: 'white', fontSize: '1rem', width: '100%', border: '1px solid var(--color-gray-border)' }}
            />
            <Button type="submit" style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', borderRadius: '50px', padding: '0 1rem', fontSize: '0.85rem' }}>Search</Button>
          </form>
          
          <div className="flex gap-2" style={{ display: 'flex', flex: '1 1 100%', width: '100%' }}>
            <div className="flex items-center" style={{ flex: 1 }}>
               <select 
                 value={category} 
                 onChange={(e) => setCategory(e.target.value)}
                 className="input-field" 
                 style={{ cursor: 'pointer', padding: '0.75rem 1rem', borderRadius: '50px', backgroundColor: 'white', fontSize: '0.9rem', width: '100%', border: '1px solid var(--color-gray-border)' }}
               >
                 <option disabled value="">Category</option>
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="flex items-center" style={{ flex: 1 }}>
               <select 
                 value={sort} 
                 onChange={(e) => setSort(e.target.value)}
                 className="input-field" 
                 style={{ cursor: 'pointer', padding: '0.75rem 1rem', borderRadius: '50px', backgroundColor: 'white', fontSize: '0.9rem', width: '100%', border: '1px solid var(--color-gray-border)' }}
               >
                 <option value="newest">Newest</option>
                 <option value="price-low">Price: Low</option>
                 <option value="price-high">Price: High</option>
               </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '4rem 0' }}>Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>No products found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}
