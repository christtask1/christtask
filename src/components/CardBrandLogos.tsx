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
            onError={(e) => console.error('Failed to load VISA logo:', e)}
            onLoad={() => console.log('VISA logo loaded successfully')}
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
            onError={(e) => console.error('Failed to load Mastercard logo:', e)}
            onLoad={() => console.log('Mastercard logo loaded successfully')}
          />
        );
      
      case 'amex':
      case 'discover':
        // Don't show anything for brands we don't have logos for
        return null;
      
      default:
        return null;
    }
  };

  // Only render if we have a logo for this brand
  const logo = getLogo(cardBrand);
  
  if (!logo) {
    return null; // Don't render anything if no logo
  }

  return (
    <div className={`card-brand-icon ${isAnimating ? 'animating' : ''}`}>
      {logo}
    </div>
  );
};

export default CardBrandLogos;
