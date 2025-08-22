import React from 'react';

interface CardBrandLogosProps {
  cardBrand: string;
  isAnimating?: boolean;
}

const CardBrandLogos: React.FC<CardBrandLogosProps> = ({ cardBrand, isAnimating = false }) => {
  const getLogo = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <img 
            src="/images/card-logos/visa.png" 
            alt="VISA" 
            width="48" 
            height="16"
            style={{ objectFit: 'contain' }}
          />
        );
      
      case 'mastercard':
        return (
          <img 
            src="/images/card-logos/MasterCard.png" 
            alt="Mastercard" 
            width="48" 
            height="16"
            style={{ objectFit: 'contain' }}
          />
        );
      
      case 'amex':
        return (
          <img 
            src="/images/card-logos/amex.png" 
            alt="American Express" 
            width="48" 
            height="16"
            style={{ objectFit: 'contain' }}
          />
        );
      
      case 'discover':
        return (
          <img 
            src="/images/card-logos/discover.png" 
            alt="Discover" 
            width="48" 
            height="16"
            style={{ objectFit: 'contain' }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`card-brand-icon ${isAnimating ? 'animating' : ''}`}>
      {getLogo(cardBrand)}
    </div>
  );
};

export default CardBrandLogos;
