import React from 'react';
import { useModal } from '../context/ModalContext';

export default function CartPage({ 
  cart, 
  onUpdateQuantity, 
  onRemove, 
  onClearCart, 
  onProceedToCheckout,
  onContinueShopping,
  onQuickView
}) {
  const { showConfirm } = useModal();
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const freeShippingLimit = 350;
  const remainingForFreeShipping = Math.max(0, freeShippingLimit - subtotal);
  const shippingPercent = Math.min(100, (subtotal / freeShippingLimit) * 100);
  const shippingCost = subtotal >= freeShippingLimit ? 0 : 35;
  const totalAmount = subtotal + (cart.length > 0 ? shippingCost : 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="cart-page-breadcrumb">
          <button type="button" onClick={onContinueShopping} className="crumb-link">الرئيسية</button>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">عربة التسوق</span>
        </div>

        <div className="cart-empty-state-card">
          <div className="empty-cart-icon-circle">
            <i className="fa-solid fa-cart-shopping" style={{ color: '#f68b1e', fontSize: '38px' }}></i>
          </div>
          <h2>عربة التسوق الخاصة بك فارغة!</h2>
          <p>تصفح أحدث عروض شوبينج بلس مصر الحصرية واختر ما يناسبك بأسعار لا تقاوم.</p>
          <button 
            type="button" 
            className="jumia-checkout-btn start-shopping-btn"
            onClick={onContinueShopping}
          >
            <i className="fa-solid fa-bag-shopping" style={{ marginLeft: '6px' }}></i>
            ابدأ التسوق وتصفح العروض الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      {/* Breadcrumb */}
      <div className="cart-page-breadcrumb">
        <button type="button" onClick={onContinueShopping} className="crumb-link">
          <i className="fa-solid fa-house" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
          الرئيسية
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">عربة التسوق ({totalCount} منتج)</span>
      </div>

      <div className="cart-page-grid">
        
        {/* Right Main Column: Cart Items List */}
        <div className="cart-items-main-col">
          
          {/* Header Card */}
          <div className="cart-col-header-card">
            <div className="cart-title-meta">
              <h1>عربة التسوق</h1>
              <span className="items-count-badge">({totalCount} منتج)</span>
            </div>

            <div className="cart-top-actions">
              <button 
                type="button" 
                className="cart-delete-all-btn full-page-del-btn"
                onClick={() => {
                  showConfirm({
                    title: 'تفريغ عربة التسوق',
                    message: 'هل أنت متأكد من رغبتك في حذف وتفريغ جميع المنتجات الموجودة في عربة التسوق؟',
                    type: 'confirm',
                    confirmText: 'نعم، تفريغ السلة',
                    cancelText: 'تراجع',
                    onConfirm: () => onClearCart()
                  });
                }}
                title="تفريغ عربة التسوق بالكامل"
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>حذف الكل</span>
              </button>
            </div>
          </div>

          {/* Free Shipping Tracker Banner */}
          <div className="cart-page-shipping-banner">
            <div className="shipping-banner-content">
              <span className="truck-icon" style={{ color: '#f68b1e', fontSize: '20px' }}>
                <i className="fa-solid fa-truck-fast"></i>
              </span>
              <div className="shipping-text">
                {remainingForFreeShipping === 0 ? (
                  <span>مبروك! طلبيتك مؤهلة لـ <strong>الشحن المجاني</strong> عبر بلس إكسبريس</span>
                ) : (
                  <span>
                    أضف منتجات بقيمة <strong>{remainingForFreeShipping.toLocaleString()} جنيه</strong> إضافية للحصول على <strong>شحن مجاني</strong>!
                  </span>
                )}
              </div>
            </div>
            <div className="cart-page-shipping-bar">
              <div 
                className="shipping-fill-bar" 
                style={{ width: `${shippingPercent}%` }} 
              />
            </div>
          </div>

          {/* Items List Table / Cards */}
          <div className="cart-items-container">
            {cart.map((item) => {
              const title = item.title || item.name || 'منتج شوبينج بلس';
              const itemTotal = item.calculatedPrice * item.quantity;
              const discount = item.discountPercentage ? Math.round(item.discountPercentage) : 0;

              return (
                <div key={`${item.id}-${item.selectedImage}`} className="cart-page-item-card">
                  
                  {/* Product Thumbnail */}
                  <div 
                    className="cart-page-item-thumb"
                    onClick={() => onQuickView && onQuickView(item, item.selectedImage || item.thumbnail)}
                    title="معاينة تفاصيل المنتج"
                  >
                    <img 
                      src={item.selectedImage || item.thumbnail} 
                      alt={title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/120';
                      }}
                    />
                    {discount > 0 && (
                      <span className="item-discount-tag">-{discount}%</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="cart-page-item-info">
                    <div className="item-meta-row">
                      <span className="cart-page-item-brand">{item.brand || item.category || 'شوبينج بلس'}</span>
                      <span className="express-badge-mini">
                        <i className="fa-solid fa-star" style={{ color: '#f68b1e', fontSize: '9px', marginLeft: '3px' }}></i> PLUS EXPRESS
                      </span>
                    </div>

                    <h3 
                      className="cart-page-item-title"
                      onClick={() => onQuickView && onQuickView(item, item.selectedImage || item.thumbnail)}
                    >
                      {title}
                    </h3>

                    <div className="item-stock-notice">
                      <span className="in-stock-dot"></span> متوفر في المخزون
                    </div>

                    {/* Price and Qty Row */}
                    <div className="cart-page-item-pricing-row">
                      <div className="unit-price-box">
                        <span className="price-label">سعر القطعة:</span>
                        <strong className="unit-price">{item.calculatedPrice.toLocaleString()} جنيه</strong>
                      </div>

                      {/* Stepper */}
                      <div className="cart-page-stepper">
                        <button 
                          type="button" 
                          className="stepper-btn"
                          onClick={() => onUpdateQuantity(item.id, item.selectedImage, item.quantity - 1)}
                          aria-label="إنقاص الكمية"
                        >
                          <i className="fa-solid fa-minus" style={{ fontSize: '11px' }}></i>
                        </button>
                        <span className="stepper-count">{item.quantity}</span>
                        <button 
                          type="button" 
                          className="stepper-btn"
                          onClick={() => onUpdateQuantity(item.id, item.selectedImage, item.quantity + 1)}
                          aria-label="زيادة الكمية"
                        >
                          <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="item-subtotal-box">
                        <span className="price-label">المجموع:</span>
                        <strong className="item-total-price">{itemTotal.toLocaleString()} جنيه</strong>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="cart-page-item-actions">
                      <button 
                        type="button" 
                        className="item-action-remove"
                        onClick={() => onRemove(item.id, item.selectedImage)}
                      >
                        <i className="fa-solid fa-trash-can" style={{ fontSize: '13px' }}></i>
                        <span>حذف المنتج</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Continue Shopping Footer Bar */}
          <div className="cart-continue-shopping-bar">
            <button type="button" onClick={onContinueShopping} className="continue-link-btn">
              <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
              العودة لتصفح المزيد من المنتجات
            </button>
          </div>

        </div>

        {/* Left Sidebar Column: Summary & Checkout CTA */}
        <aside className="cart-summary-col">
          
          <div className="cart-summary-sticky-card">
            <h2 className="summary-heading">ملخص الطلبية</h2>

            <div className="summary-details-lines">
              <div className="detail-line">
                <span>المجموع الفرعي ({totalCount} منتج):</span>
                <span>{subtotal.toLocaleString()} جنيه</span>
              </div>

              <div className="detail-line">
                <span>رسوم التوصيل المقدرة:</span>
                <span>
                  {shippingCost === 0 ? (
                    <strong className="free-shipping-text">مجاني (بلس إكسبريس)</strong>
                  ) : (
                    `${shippingCost} جنيه`
                  )}
                </span>
              </div>

              <div className="detail-line total-highlight">
                <span>الإجمالي الكلي:</span>
                <strong className="grand-price">{totalAmount.toLocaleString()} جنيه</strong>
              </div>
            </div>

            <p className="vat-hint-text">الأسعار تشمل ضريبة القيمة المضافة والشحن المقدر</p>

            <button 
              type="button" 
              className="jumia-checkout-btn full-checkout-cta"
              onClick={onProceedToCheckout}
            >
              <i className="fa-solid fa-lock" style={{ marginLeft: '6px' }}></i>
              متابعة الشراء ({totalAmount.toLocaleString()} جنيه)
            </button>

            {/* Payment & Trust Badges */}
            <div className="cart-trust-badges">
              <div className="trust-row">
                <span className="trust-icon" style={{ color: '#15803d' }}>
                  <i className="fa-solid fa-lock"></i>
                </span>
                <span>عملية دفع آمنة ومشفرة 100%</span>
              </div>
              <div className="trust-row">
                <span className="trust-icon" style={{ color: '#f68b1e' }}>
                  <i className="fa-solid fa-money-bill-wave"></i>
                </span>
                <span>متاح الدفع نقداً عند الاستلام</span>
              </div>
              <div className="trust-row">
                <span className="trust-icon" style={{ color: '#276076' }}>
                  <i className="fa-solid fa-rotate-left"></i>
                </span>
                <span>إرجاع سهل ومجاني خلال 14 يوماً</span>
              </div>
            </div>

            <div className="accepted-methods-preview">
              <span className="methods-label">وسائل الدفع المقبولة:</span>
              <div className="methods-icons">
                <span className="method-tag">كاش عند الاستلام</span>
                <span className="method-tag">Visa</span>
                <span className="method-tag">MasterCard</span>
                <span className="method-tag">ميزة</span>
                <span className="method-tag">فوري</span>
                <span className="method-tag">إنستاباي</span>
              </div>
            </div>

          </div>

        </aside>

      </div>
    </div>
  );
}
