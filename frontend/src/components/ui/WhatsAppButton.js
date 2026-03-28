import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappNumber = "919533866777";
  const defaultMessage = "Hi Sri Govinda Collections! I would like to know more about your products.";
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.assign(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <button 
        onClick={handleWhatsAppClick}
        className="wa-btn animate-fade-in"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      <style>{`
        .wa-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background-color: #25d366;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
          cursor: pointer;
          z-index: 999;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .wa-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
        }
        
        @media (max-width: 768px) {
          .wa-btn {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </>
  );
}
