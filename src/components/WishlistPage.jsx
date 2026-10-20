import React from 'react';
import { useModal } from '../context/ModalContext';

export default function WishlistPage({ 
  wishlist, 
  onRemoveFromWishlist, 
  onClearWishlist, 
  onAddToCart, 
  onMoveAllToCart,
  onContinueShopping,
  onQuickView
}) {
  const { showConfirm } = useModal();
  const totalItems = wishlist.length;

  if (totalItems === 0) {
    return (
      <div className="wishlist-page-wrapper">
        <div className="cart-page-breadcrumb">
          <button type="button" onClick={onContinueShopping} className="crumb-link">الرئيسية</button>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">قائمة المفضلة</span>
        </div>

        <div className="cart-empty-state-card wishlist-empty-card">
          <div className="empty-cart-icon-circle wishlist-heart-icon">
            <i className="fa-solid fa-heart" style={{ color: '#f68b1e', fontSize: '38px' }}></i>
          </div>
          <h2>قائمة المفضلة فارغة حالياً</h2>
          <p>
            لم تقم بإضافة أي منتجات إلى قائمة رغباتك بعد. اضغط على أيقونة القلب (<i className="fa-regular fa-heart" style={{ color: '#f68b1e' }}></i>) على أي منتج لحفظه والرجوع إليه وشرائه لاحقاً!
          </p>
          <button 
            type="button" 
            className="jumia-checkout-btn start-shopping-btn"
            onClick={onContinueShopping}
          >
            <i className="fa-solid fa-bag-shopping" style={{ marginLeft: '6px' }}></i>
            تصفح أحدث المنتجات والعروض الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page-wrapper">
      {/* Breadcrumb */}
      <div className="cart-page-breadcrumb">
        <button type="button" onClick={onContinueShopping} className="crumb-link">
          <i className="fa-solid fa-house" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
          الرئيسية
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">قائمة المفضلة ({totalItems} منتج)</span>
      </div>

      {/* Header Bar */}
      <div className="wishlist-header-bar">
        <div className="wishlist-title-box">
          <span className="heart-title-icon" style={{ color: '#f68b1e', fontSize: '22px' }}>
            <i className="fa-solid fa-heart"></i>
          </span>
          <h1>قائمة المنتجات المفضلة</h1>
          <span className="items-count-badge">({totalItems} منتج)</span>
        </div>

        <div className="wishlist-bulk-actions">
          <button 
            type="button" 
            className="move-all-btn"
            onClick={onMoveAllToCart}
            title="إضافة كل المنتجات المفضلة إلى عربة التسوق دفعة واحدة"
          >
            <i className="fa-solid fa-cart-plus" style={{ marginLeft: '6px' }}></i>
            <span>نقل الكل إلى عربة التسوق</span>
          </button>

          <button 
            type="button" 
            className="cart-delete-all-btn"
            onClick={() => {
              showConfirm({
                title: 'إفراغ قائمة المفضلة',
                message: 'هل أنت متأكد من رغبتك في حذف وإفراغ جميع المنتجات من قائمة المفضلة؟',
                type: 'confirm',
                confirmText: 'نعم، إفراغ المفضلة',
                cancelText: 'إلغاء',
                onConfirm: () => onClearWishlist()
              });
            }}
            title="حذف جميع المنتجات من المفضلة"
          >
            <i className="fa-solid fa-trash-can" style={{ marginLeft: '4px' }}></i>
            <span>إفراغ المفضلة</span>
          </button>
        </div>
      </div>

      {/* Wishlist Products Grid */}
      <div className="wishlist-products-grid">
        {wishlist.map((item) => {
          const title = item.title || item.name || 'منتج مفضل';
          const discount = item.discountPercentage ? Math.round(item.discountPercentage) : 0;
          const egpPrice = item.calculatedPrice || Math.round((item.price || 0) * 50);
          const originalPrice = discount > 0 ? Math.round(egpPrice / (1 - discount / 100)) : null;
          const image = item.selectedImage || item.thumbnail || (item.images && item.images[0]) || 'https://via.placeholder.com/200';

          return (
            <div key={item.id} className="wishlist-card">
              
              {/* Image & Discount */}
              <div 
                className="wishlist-card-img-box"
                onClick={() => onQuickView && onQuickView(item, image)}
                title="عرض تفاصيل المنتج"
              >
                <img 
                  src={image} 
                  alt={title} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200';
                  }}
                />
                {discount > 0 && (
                  <span className="wishlist-discount-badge">-{discount}%</span>
                )}
                
                {/* Remove Icon Button */}
                <button 
                  type="button" 
                  className="wishlist-remove-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWishlist(item.id);
                  }}
                  title="إزالة من المفضلة"
                  aria-label="إزالة من المفضلة"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Card Body */}
              <div className="wishlist-card-body">
                <div className="wishlist-brand-row">
                  <span className="brand-name">{item.brand || item.category || 'شوبينج بلس'}</span>
                  <span className="express-tag">
                    <i className="fa-solid fa-star" style={{ color: '#f68b1e', fontSize: '9px', marginLeft: '3px' }}></i> PLUS EXPRESS
                  </span>
                </div>

                <h3 
                  className="wishlist-item-title"
                  onClick={() => onQuickView && onQuickView(item, image)}
                >
                  {title}
                </h3>

                {/* Price block */}
                <div className="wishlist-price-block">
                  <span className="current-price">{egpPrice.toLocaleString()} جنيه</span>
                  {originalPrice && (
                    <span className="old-price">{originalPrice.toLocaleString()} جنيه</span>
                  )}
                </div>

                <div className="wishlist-stock-status">
                  <span className="stock-dot"></span> متوفر في المخازن
                </div>

                {/* Add to Cart CTA */}
                <button 
                  type="button" 
                  className="jumia-add-btn wishlist-cart-btn"
                  onClick={() => onAddToCart({
                    ...item,
                    title,
                    selectedImage: image,
                    calculatedPrice: egpPrice
                  })}
                >
                  <i className="fa-solid fa-cart-shopping" style={{ marginLeft: '6px' }}></i>
                  <span>أضف إلى عربة التسوق</span>
                </button>

              </div>

            </div>
          );
        })}
      </div>

      {/* Return to Shop Banner */}
      <div className="wishlist-return-bar">
        <button type="button" onClick={onContinueShopping} className="continue-link-btn">
          <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
          مواصلة التسوق وتصفح المزيد من المنتجات
        </button>
      </div>

    </div>
  );
}
