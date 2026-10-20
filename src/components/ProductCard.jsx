import React, { useState } from 'react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickView,
  isFavorite = false,
  onToggleWishlist,
  onSelectProduct
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [localLiked, setLocalLiked] = useState(false);

  const isLiked = isFavorite !== undefined ? isFavorite : localLiked;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.thumbnail || 'https://via.placeholder.com/300'];

  const currentImage = images[0];
  const title = product.title || product.name || 'منتج شوبينج بلس';
  const brand = product.brand || product.category || 'شوبينج بلس';
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  
  // Calculate price in EGP (approx 50 EGP per $1)
  const egpPrice = Math.round(product.price * 50);
  const originalEgpPrice = discount > 0 
    ? Math.round(egpPrice / (1 - discount / 100)) 
    : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart({
      ...product,
      title: title,
      selectedImage: currentImage,
      calculatedPrice: egpPrice
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onQuickView) {
      onQuickView(product, currentImage);
    }
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product, currentImage);
    } else if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <article className="jumia-card" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* Top Floating Badge (Discount & Wishlist) */}
      <div className="card-top-tags">
        {discount > 0 ? (
          <span className="jumia-discount-badge">
            <i className="fa-solid fa-tag"></i> -{discount}%
          </span>
        ) : <span />}

        <button
          type="button"
          className={`jumia-wishlist-btn ${isLiked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) {
              onToggleWishlist(product);
            } else {
              setLocalLiked(!localLiked);
            }
          }}
          aria-label={isLiked ? "إزالة من قائمة الرغبات" : "أضف إلى قائمة الرغبات"}
          title={isLiked ? "إزالة من قائمة الرغبات" : "أضف إلى قائمة الرغبات"}
        >
          <i 
            className={`fa-heart ${isLiked ? 'fa-solid' : 'fa-regular'}`} 
            style={{ color: isLiked ? '#f68b1e' : '#9ca3af', fontSize: '16px' }}
          ></i>
        </button>
      </div>

      {/* Product Image Frame */}
      <div className="jumia-image-box">
        <img 
          src={currentImage} 
          alt={title} 
          className="jumia-prod-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = product.thumbnail || 'https://via.placeholder.com/300';
          }}
        />
        <div className="card-quick-view-hint" onClick={handleQuickViewClick}>
          <i className="fa-solid fa-eye"></i> معاينة سريعة
        </div>
      </div>

      {/* Product Details Body */}
      <div className="jumia-card-body">
        {/* Jumia Express Badge */}
        <div className="jumia-express-row">
          <span className="express-badge">
            <i className="fa-solid fa-bolt-lightning" style={{ color: '#f68b1e' }}></i> PLUS <span className="express-bold">EXPRESS</span>
          </span>
        </div>

        {/* Brand & Title */}
        <span className="jumia-brand-name">{brand}</span>
        <h3 className="jumia-product-title" title={title}>{title}</h3>

        {/* Price Block */}
        <div className="jumia-price-row">
          <div className="price-main-wrap">
            <span className="jumia-current-price">{egpPrice.toLocaleString()}</span>
            <span className="currency-unit">جنيه</span>
          </div>
          {originalEgpPrice && (
            <span className="jumia-old-price">{originalEgpPrice.toLocaleString()} جنيه</span>
          )}
        </div>

        {/* Free delivery & stock notice */}
        <div className="jumia-perks-line">
          <span className="free-shipping-tag">
            <i className="fa-solid fa-truck-fast"></i> مؤهل للشحن المجاني
          </span>
        </div>

        {/* Star Rating */}
        {product.rating && (
          <div className="jumia-rating-line">
            <div className="stars-icons" style={{ display: 'inline-flex', gap: '2px', color: '#f59e0b' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <i 
                  key={s} 
                  className={`fa-star ${s <= Math.round(product.rating) ? 'fa-solid' : 'fa-regular'}`} 
                  style={{ fontSize: '11px' }}
                ></i>
              ))}
            </div>
            <span className="rating-score">({product.rating.toFixed(1)})</span>
          </div>
        )}

        {/* Jumia Full-Width Orange Add to Cart Button */}
        <div className="card-button-area">
          <button
            type="button"
            className={`jumia-add-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAdd}
          >
            {isAdded ? (
              <span className="btn-inner">
                <i className="fa-solid fa-check"></i>
                تمت الإضافة للعربة
              </span>
            ) : (
              <span className="btn-inner">
                <i className="fa-solid fa-cart-shopping"></i>
                أضف إلى العربة
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
