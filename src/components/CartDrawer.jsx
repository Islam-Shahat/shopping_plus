import React from 'react';
import { useModal } from '../context/ModalContext';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemove,
  onClearCart,
  onProceedToCheckout
}) {
  const { showConfirm } = useModal();
  if (!isOpen) return null;

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const freeShippingLimit = 350; // 350 EGP for free shipping in Jumia Egypt
  const remainingForFreeShipping = Math.max(0, freeShippingLimit - subtotal);
  const shippingPercent = Math.min(100, (subtotal / freeShippingLimit) * 100);

  return (
    <div className="cart-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="jumia-cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <i className="fa-solid fa-cart-shopping" style={{ color: '#f68b1e', fontSize: '20px' }}></i>
            <h3>عربة التسوق | شوبينج بلس</h3>
            <span className="cart-badge-total">({totalCount} منتج)</span>
          </div>

          <div className="cart-header-actions">
            {cart.length > 0 && (
              <button 
                type="button" 
                className="cart-delete-all-btn"
                onClick={() => {
                  showConfirm({
                    title: 'تفريغ عربة التسوق',
                    message: 'هل أنت متأكد من تفريغ وحذف جميع المنتجات من السلة؟',
                    type: 'confirm',
                    confirmText: 'نعم، تفريغ السلة',
                    cancelText: 'إلغاء',
                    onConfirm: () => onClearCart()
                  });
                }}
                title="حذف جميع المنتجات من السلة"
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>حذف الكل</span>
              </button>
            )}

            <button className="cart-close-btn" onClick={onClose} aria-label="إغلاق العربة">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="jumia-shipping-banner">
          <div className="shipping-text-line">
            {remainingForFreeShipping === 0 ? (
              <span><i className="fa-solid fa-check" style={{ color: '#2e7d32', marginLeft: '4px' }}></i> مبروك! طلبيتك مؤهلة لـ <strong>الشحن المجاني</strong> مع بلس إكسبريس</span>
            ) : (
              <span><i className="fa-solid fa-truck-fast" style={{ color: '#f68b1e', marginLeft: '4px' }}></i> أضف منتجات بقيمة <strong>{remainingForFreeShipping.toLocaleString()} جنيه</strong> أخرى للاستفادة من الشحن المجاني!</span>
            )}
          </div>
          <div className="shipping-track">
            <div className="shipping-fill" style={{ width: `${shippingPercent}%` }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-icon-box">
                <i className="fa-solid fa-cart-shopping" style={{ color: '#f68b1e', fontSize: '38px' }}></i>
              </div>
              <h4>عربة التسوق فارغة</h4>
              <p>تصفح عروض ومنتجات شوبينج بلس الحصرية وأضف المنتجات التي تعجبك الآن!</p>
              <button type="button" className="jumia-start-btn" onClick={onClose}>
                ابدأ التسوق الآن
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => {
                const title = item.title || item.name || 'منتج شوبينج بلس';
                return (
                  <div key={`${item.id}-${item.selectedImage}`} className="cart-single-item">
                    <img 
                      src={item.selectedImage || item.thumbnail} 
                      alt={title} 
                      className="cart-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <span className="cart-brand-tag">{item.brand || item.category}</span>
                        <button 
                          type="button" 
                          className="cart-delete-btn"
                          onClick={() => onRemove(item.id, item.selectedImage)}
                          title="حذف المنتج"
                        >
                          <i className="fa-solid fa-trash-can" style={{ fontSize: '13px' }}></i>
                        </button>
                      </div>

                      <h4 className="cart-item-title">{title}</h4>

                      <div className="cart-item-bottom">
                        <div className="cart-qty-controls">
                          <button 
                            type="button" 
                            onClick={() => onUpdateQuantity(item.id, item.selectedImage, item.quantity - 1)}
                            aria-label="إنقاص الكمية"
                          >
                            <i className="fa-solid fa-minus" style={{ fontSize: '10px' }}></i>
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => onUpdateQuantity(item.id, item.selectedImage, item.quantity + 1)}
                            aria-label="زيادة الكمية"
                          >
                            <i className="fa-solid fa-plus" style={{ fontSize: '10px' }}></i>
                          </button>
                        </div>
                        <span className="cart-item-price">{(item.calculatedPrice * item.quantity).toLocaleString()} جنيه</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">المجموع الفرعي:</span>
              <span className="subtotal-amount">{subtotal.toLocaleString()} جنيه</span>
            </div>
            <p className="shipping-hint-text">الرسوم والشحن يتم احتسابها عند إتمام الطلب</p>
            <button 
              type="button" 
              className="jumia-checkout-btn"
              onClick={() => {
                onClose();
                if (onProceedToCheckout) {
                  onProceedToCheckout();
                }
              }}
            >
              <i className="fa-solid fa-lock" style={{ marginLeft: '6px' }}></i>
              متابعة الشراء ({subtotal.toLocaleString()} جنيه)
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
