import React, { useEffect, useState } from 'react';

export default function ProductModal({ product, initialImage, onClose, onAddToCart }) {
  const images = (product.images && product.images.length > 0) ? product.images : [product.thumbnail];
  const [selectedImg, setSelectedImg] = useState(initialImage || images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const title = product.title || product.name || 'تفاصيل المنتج';
  const brand = product.brand || product.category || 'شوبينج بلس';
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  
  const egpUnitPrice = Math.round(product.price * 50);
  const totalEgp = egpUnitPrice * quantity;
  const originalEgp = discount > 0 ? Math.round(totalEgp / (1 - discount / 100)) : null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart({
        ...product,
        title: title,
        selectedImage: selectedImg,
        calculatedPrice: egpUnitPrice
      });
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="jumia-modal" onClick={(e) => e.stopPropagation()}>
        <button className="jumia-close-btn" onClick={onClose} aria-label="إغلاق">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="jumia-modal-grid">
          {/* Gallery View */}
          <div className="jumia-modal-gallery">
            <div className="main-image-display">
              <img src={selectedImg} alt={title} />
              {discount > 0 && (
                <span className="modal-discount-flag">خصم {discount}%</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="modal-thumbs-row">
                {images.map((imgUrl, idx) => (
                  <button
                    key={`${product.id}-modal-${idx}`}
                    type="button"
                    className={`thumb-box ${selectedImg === imgUrl ? 'active' : ''}`}
                    onClick={() => setSelectedImg(imgUrl)}
                  >
                    <img src={imgUrl} alt={`صورة ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="jumia-modal-info">
            <div className="modal-top-meta">
              <span className="brand-tag">الماركة: <strong>{brand}</strong></span>
              <span className="express-badge">
                <i className="fa-solid fa-star" style={{ color: '#f68b1e', marginLeft: '3px' }}></i> PLUS EXPRESS
              </span>
            </div>

            <h2 className="modal-item-title">{title}</h2>

            {product.rating && (
              <div className="modal-stars-row">
                <span className="stars-icon" style={{ display: 'inline-flex', gap: '3px', color: '#f68b1e' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <i 
                      key={s} 
                      className={`fa-star ${s <= Math.round(product.rating) ? 'fa-solid' : 'fa-regular'}`} 
                      style={{ fontSize: '13px' }}
                    ></i>
                  ))}
                </span>
                <span className="rating-num">{product.rating.toFixed(2)} من 5</span>
              </div>
            )}

            <div className="modal-price-box">
              <span className="main-price">{totalEgp.toLocaleString()} جنيه</span>
              {originalEgp && (
                <span className="strike-price">{originalEgp.toLocaleString()} جنيه</span>
              )}
            </div>

            <p className="modal-desc">{product.description}</p>

            {/* Jumia Specifications & Services */}
            <div className="jumia-services-list">
              <div className="service-row">
                <span className="service-icon" style={{ color: '#f68b1e', width: '20px', textAlign: 'center' }}>
                  <i className="fa-solid fa-truck-fast"></i>
                </span>
                <span className="service-text">
                  <strong>الشحن السريع والتوصيل:</strong> {product.shippingInformation || 'التوصيل متاح إلى جميع المحافظات'}
                </span>
              </div>
              <div className="service-row">
                <span className="service-icon" style={{ color: '#f68b1e', width: '20px', textAlign: 'center' }}>
                  <i className="fa-solid fa-shield-halved"></i>
                </span>
                <span className="service-text">
                  <strong>الضمان وسياسة الإرجاع:</strong> {product.returnPolicy || 'إمكانية الإرجاع خلال 14 يوماً'}
                </span>
              </div>
              <div className="service-row">
                <span className="service-icon" style={{ color: '#f68b1e', width: '20px', textAlign: 'center' }}>
                  <i className="fa-solid fa-box"></i>
                </span>
                <span className="service-text">
                  <strong>حالة التوفر:</strong> {product.availabilityStatus || 'متوفر في المخازن جاهز للشحن'}
                </span>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="modal-actions-bar">
              <div className="jumia-stepper">
                <button 
                  type="button" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="إنقاص"
                >
                  <i className="fa-solid fa-minus" style={{ fontSize: '12px' }}></i>
                </button>
                <span>{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="زيادة"
                >
                  <i className="fa-solid fa-plus" style={{ fontSize: '12px' }}></i>
                </button>
              </div>

              <button 
                type="button" 
                className={`jumia-modal-add-btn ${isAdded ? 'success' : ''}`}
                onClick={handleAdd}
              >
                {isAdded ? (
                  <>
                    <i className="fa-solid fa-check" style={{ marginLeft: '6px' }}></i>
                    تمت الإضافة إلى عربة التسوق
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cart-shopping" style={{ marginLeft: '6px' }}></i>
                    أضف إلى العربة ({totalEgp.toLocaleString()} جنيه)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
