import { MapPin, Phone, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Contact() {
  return (
    <div className="container section-padding page-gap animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Get in Touch</h1>
        <p className="text-balance" style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--color-gray-dark)', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Have a specific request or need assistance with your selection? Our team in Amalapuram is ready to provide personalized guidance.
        </p>
      </div>
      
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem', alignItems: 'start' }}>
        
        {/* Contact Info */}
        <div className="flex-col gap-8">
          <div className="flex items-center gap-6">
            <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.5rem', borderRadius: '50%', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}>
              <MapPin size={28} />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.4rem', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Our Boutique</h3>
              <p style={{ color: 'var(--color-gray-dark)', fontWeight: '500' }}>Main Road, Amalapuram, Andhra Pradesh, India</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.5rem', borderRadius: '50%', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}>
              <Phone size={28} />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.4rem', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Direct Line</h3>
              <p style={{ color: 'var(--color-gray-dark)', fontWeight: '500' }}>+91 9533866777</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.5rem', borderRadius: '50%', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}>
              <Mail size={28} />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.4rem', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Electronic Mail</h3>
              <p style={{ color: 'var(--color-gray-dark)', fontWeight: '500' }}>contact@srigovindacollections.com</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', height: '400px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-gray-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3823.9568804115406!2d82.00385229999999!3d16.578678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37ef16bdd0e903%3A0xdc4818ad950d7bb2!2sSri%20Govinda%20German%20Silver!5e0!3m2!1sen!2sin!4v1774259391736!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Send a Message</h2>
          <form className="flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your inquiry has been received.'); }}>
            <div className="flex-col gap-2">
              <label style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Name *</label>
              <input required type="text" className="input-field" placeholder="Full name" />
            </div>
            <div className="flex-col gap-2">
              <label style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address *</label>
              <input required type="email" className="input-field" placeholder="mail@example.com" />
            </div>
            <div className="flex-col gap-2">
              <label style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Message *</label>
              <textarea required className="input-field" rows="6" placeholder="Tell us about the piece you're looking for..." style={{ resize: 'vertical' }}></textarea>
            </div>
            <Button type="submit" variant="primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: '50px' }}>Dispatch Message</Button>
          </form>
        </div>

      </div>
    </div>
  );
}
