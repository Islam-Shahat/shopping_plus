import React, { useState } from 'react';
import { useModal } from '../context/ModalContext';

const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الشرقية',
  'الدقهلية',
  'البحيرة',
  'الغربية',
  'المنوفية',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'كفر الشيخ',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء'
];

export default function CheckoutPage({ 
  cart, 
  onBack, 
  onOrderSuccess, 
  onClearCart 
}) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    altPhone: '',
    governorate: 'القاهرة',
    city: '',
    street: '',
    building: '',
    notes: ''
  });

  // Checkout Options
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card' | 'instapay' | 'fawry'
  const [deliveryType, setDeliveryType] = useState('express'); // 'express' | 'standard'
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Financials
  const subtotal = cart.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const freeShippingThreshold = 350;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 35;
  const totalAmount = Math.max(0, subtotal + shippingCost - promoDiscount);

  const { showAlert } = useModal();

  // Apply Coupon Logic
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'PLUS10' || code === 'SAVE10') {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoMessage({ text: `تم تطبيق خصم 10% بنجاح (-${discount.toLocaleString()} جنيه)`, type: 'success' });
    } else if (code === 'FREE' || code === 'FREESHIP') {
      setPromoDiscount(shippingCost);
      setPromoApplied(true);
      setPromoMessage({ text: 'تم تطبيق كوبون الشحن المجاني بنجاح!', type: 'success' });
    } else {
      setPromoMessage({ text: 'كود الخصم غير صالح أو منتهي الصلاحية (جرب: PLUS10)', type: 'error' });
    }
  };

  // Form Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Place Order Handler
  const handleSubmitOrder = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.street.trim()) {
      showAlert({
        title: 'يرجى استكمال البيانات',
        message: 'يرجى ملء جميع الحقول الإلزامية المطلوبة لإتمام الشحن:\n(الاسم بالكامل، رقم الهاتف، المدينة، واسم الشارع)',
        type: 'warning',
        confirmText: 'حسناً، سأكمل البيانات'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderNumber = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
      const completedOrder = {
        orderId: orderNumber,
        date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        subtotal,
        shippingCost,
        discount: promoDiscount,
        total: totalAmount,
        customer: { ...formData },
        paymentMethod
      };

      setOrderConfirmed(completedOrder);
      setIsSubmitting(false);
      if (onOrderSuccess) {
        onOrderSuccess(completedOrder);
      }
    }, 1200);
  };

  // If order was confirmed, show Success Screen
  if (orderConfirmed) {
    return (
      <div className="checkout-success-view">
        <div className="success-card">
          <div className="success-badge-icon">
            <i className="fa-solid fa-check"></i>
          </div>
          <h1 className="success-title">تهانينا! تم تأكيد طلبك بنجاح</h1>
          <p className="success-subtitle">
            شكراً لتسوقك من <strong>شوبينج بلس مصر</strong>. طلبك الآن قيد التجهيز وسيصلك في أقرب وقت.
          </p>

          <div className="order-receipt-box">
            <div className="receipt-header">
              <div>
                <span className="label">رقم الطلب:</span>
                <strong className="order-id">{orderConfirmed.orderId}</strong>
              </div>
              <div>
                <span className="label">تاريخ الطلب:</span>
                <span>{orderConfirmed.date}</span>
              </div>
            </div>

            <div className="receipt-details-grid">
              <div className="receipt-col">
                <h4>بيانات التوصيل:</h4>
                <p><strong>{orderConfirmed.customer.fullName}</strong></p>
                <p>هاتف: {orderConfirmed.customer.phone}</p>
                <p>{orderConfirmed.customer.governorate} - {orderConfirmed.customer.city}</p>
                <p>{orderConfirmed.customer.street} {orderConfirmed.customer.building && `، عمارة ${orderConfirmed.customer.building}`}</p>
              </div>

              <div className="receipt-col">
                <h4>طريقة الدفع المختارة:</h4>
                <p className="payment-method-badge">
                  {orderConfirmed.paymentMethod === 'cod' && (
                    <span><i className="fa-solid fa-money-bill-wave" style={{ marginLeft: '4px', color: '#f68b1e' }}></i> الدفع نقداً عند الاستلام</span>
                  )}
                  {orderConfirmed.paymentMethod === 'card' && (
                    <span><i className="fa-solid fa-credit-card" style={{ marginLeft: '4px', color: '#f68b1e' }}></i> بطاقة بنكية (فيزا / ماستركارد)</span>
                  )}
                  {orderConfirmed.paymentMethod === 'instapay' && (
                    <span><i className="fa-solid fa-mobile-screen-button" style={{ marginLeft: '4px', color: '#f68b1e' }}></i> إنستاباي / محفظة إلكترونية</span>
                  )}
                  {orderConfirmed.paymentMethod === 'fawry' && (
                    <span><i className="fa-solid fa-bolt" style={{ marginLeft: '4px', color: '#f68b1e' }}></i> فوري (Fawry)</span>
                  )}
                </p>
                <div className="receipt-pricing">
                  <div><span>عدد المنتجات:</span> <span>{orderConfirmed.items.reduce((s, i) => s + i.quantity, 0)}</span></div>
                  <div><span>المجموع الفرعي:</span> <span>{orderConfirmed.subtotal.toLocaleString()} جنيه</span></div>
                  <div><span>الشحن:</span> <span>{orderConfirmed.shippingCost === 0 ? 'مجاني' : `${orderConfirmed.shippingCost} جنيه`}</span></div>
                  {orderConfirmed.discount > 0 && (
                    <div className="discount-row"><span>الخصم:</span> <span>-{orderConfirmed.discount.toLocaleString()} جنيه</span></div>
                  )}
                  <div className="grand-total-row"><span>الإجمالي المدفوع:</span> <strong>{orderConfirmed.total.toLocaleString()} جنيه</strong></div>
                </div>
              </div>
            </div>

            <div className="receipt-items-list">
              <h4>المنتجات في هذا الطلب:</h4>
              <div className="ordered-items-scroll">
                {orderConfirmed.items.map((it) => (
                  <div key={it.id} className="ordered-item-row">
                    <img src={it.selectedImage || it.thumbnail} alt={it.title} />
                    <div className="item-text">
                      <span className="item-title">{it.title}</span>
                      <span className="item-meta">الكمية: {it.quantity} × {it.calculatedPrice.toLocaleString()} جنيه</span>
                    </div>
                    <span className="item-sum">{(it.calculatedPrice * it.quantity).toLocaleString()} جنيه</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button
              type="button"
              className="continue-shopping-btn"
              onClick={() => {
                onClearCart();
                onBack();
              }}
            >
              <i className="fa-solid fa-bag-shopping" style={{ marginLeft: '6px' }}></i>
              العودة للصفحة الرئيسية ومواصلة التسوق
            </button>
            <button
              type="button"
              className="print-receipt-btn"
              onClick={() => window.print()}
            >
              <i className="fa-solid fa-print" style={{ marginLeft: '6px' }}></i>
              طباعة الفاتورة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and not confirmed
  if (cart.length === 0) {
    return (
      <div className="checkout-empty-view">
        <div className="empty-box-card">
          <div className="empty-icon" style={{ color: '#f68b1e', fontSize: '48px', marginBottom: '14px' }}>
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <h2>عربة التسوق فارغة حالياً</h2>
          <p>ليس لديك أي منتجات لإتمام شرائها. تصفح عروض شوبينج بلس وأضف منتجاتك المفضلة!</p>
          <button type="button" className="jumia-checkout-btn back-btn" onClick={onBack}>
            تصفح المنتجات الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      {/* Checkout Mini Nav Header */}
      <header className="checkout-nav-bar">
        <div className="checkout-nav-inner">
          <button type="button" className="checkout-back-link" onClick={onBack}>
            <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
            العودة للمتجر
          </button>

          <div className="checkout-brand">
            <span className="brand-text">SHOPPING<span className="accent">PLUS</span></span>
            <span className="secure-badge">
              <i className="fa-solid fa-shield-halved" style={{ marginLeft: '4px', color: '#15803d' }}></i>
              إتمام الشراء الآمن (256-Bit SSL)
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Form & Summary Grid */}
      <main className="checkout-main-wrap">
        <div className="checkout-grid-layout">
          
          {/* Right Column: Address, Delivery & Payment Forms */}
          <div className="checkout-forms-column">
            
            <form onSubmit={handleSubmitOrder}>
              
              {/* Step 1: Delivery Address */}
              <section className="checkout-card-section">
                <div className="section-head">
                  <span className="step-circle">1</span>
                  <h3>عنوان الشحن والتوصيل</h3>
                </div>

                <div className="form-fields-grid">
                  <div className="form-group full-width">
                    <label>الاسم بالكامل <span className="req">*</span></label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleInputChange} 
                      placeholder="مثال: أحمد محمد علي" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>رقم الهاتف المحمول <span className="req">*</span></label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="01xxxxxxxxx" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>رقم هاتف بديل (اختياري)</label>
                    <input 
                      type="tel" 
                      name="altPhone" 
                      value={formData.altPhone} 
                      onChange={handleInputChange} 
                      placeholder="01xxxxxxxxx" 
                    />
                  </div>

                  <div className="form-group">
                    <label>المحافظة <span className="req">*</span></label>
                    <select 
                      name="governorate" 
                      value={formData.governorate} 
                      onChange={handleInputChange}
                    >
                      {EGYPT_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>المدينة / المركز / الحي <span className="req">*</span></label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      placeholder="مثال: مدينة نصر / التجمع الخامس" 
                      required 
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>اسم الشارع ورقم العمارة والشقة <span className="req">*</span></label>
                    <input 
                      type="text" 
                      name="street" 
                      value={formData.street} 
                      onChange={handleInputChange} 
                      placeholder="شارع عباس العقاد - عمارة 15 - الدور الثالث - شقة 6" 
                      required 
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>ملاحظات إضافية للتوصيل (علامة مميزة)</label>
                    <input 
                      type="text" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      placeholder="مثال: بجوار مسجد النور / الاتصال قبل الوصول" 
                    />
                  </div>
                </div>
              </section>

              {/* Step 2: Delivery Speed */}
              <section className="checkout-card-section">
                <div className="section-head">
                  <span className="step-circle">2</span>
                  <h3>طريقة التوصيل والشحن</h3>
                </div>

                <div className="delivery-options-list">
                  <label className={`option-card ${deliveryType === 'express' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      checked={deliveryType === 'express'} 
                      onChange={() => setDeliveryType('express')} 
                    />
                    <div className="option-info">
                      <div className="option-title-row">
                        <span className="option-name">
                          <i className="fa-solid fa-bolt-lightning" style={{ color: '#f68b1e', marginLeft: '6px' }}></i>
                          توصيل بلس إكسبريس السريع (Plus Express)
                        </span>
                        <span className="option-price">{shippingCost === 0 ? 'شحن مجاني' : '35 جنيه'}</span>
                      </div>
                      <p className="option-desc">يصلك خلال 24 إلى 48 ساعة لباب منزلك مع ضمان الجودة.</p>
                    </div>
                  </label>

                  <label className={`option-card ${deliveryType === 'standard' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      checked={deliveryType === 'standard'} 
                      onChange={() => setDeliveryType('standard')} 
                    />
                    <div className="option-info">
                      <div className="option-title-row">
                        <span className="option-name">
                          <i className="fa-solid fa-box" style={{ color: '#f68b1e', marginLeft: '6px' }}></i>
                          الاستلام من محطة طرود شوبينج بلس
                        </span>
                        <span className="option-price">مجاناً</span>
                      </div>
                      <p className="option-desc">استلم شحنتك بنفسك من أقرب نقطة استلام في محافظتك في أي وقت يناسبك.</p>
                    </div>
                  </label>
                </div>
              </section>

              {/* Step 3: Payment Method */}
              <section className="checkout-card-section">
                <div className="section-head">
                  <span className="step-circle">3</span>
                  <h3>طريقة الدفع</h3>
                </div>

                <div className="payment-options-grid">
                  <label className={`pay-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')} 
                    />
                    <div className="pay-card-content">
                      <span className="pay-icon" style={{ color: '#f68b1e' }}>
                        <i className="fa-solid fa-money-bill-wave"></i>
                      </span>
                      <div className="pay-texts">
                        <strong>الدفع نقداً عند الاستلام (COD)</strong>
                        <span>ادفع كاش لمندوب الشحن فور استلام وفحص طلبيتك</span>
                      </div>
                    </div>
                  </label>

                  <label className={`pay-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')} 
                    />
                    <div className="pay-card-content">
                      <span className="pay-icon" style={{ color: '#f68b1e' }}>
                        <i className="fa-solid fa-credit-card"></i>
                      </span>
                      <div className="pay-texts">
                        <strong>بطاقة ائتمان / خصم مباشر</strong>
                        <span>فيزا، ماستركارد، ميزة — معاملات مشفرة وآمنة</span>
                      </div>
                    </div>
                  </label>

                  <label className={`pay-method-card ${paymentMethod === 'instapay' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="instapay" 
                      checked={paymentMethod === 'instapay'} 
                      onChange={() => setPaymentMethod('instapay')} 
                    />
                    <div className="pay-card-content">
                      <span className="pay-icon" style={{ color: '#f68b1e' }}>
                        <i className="fa-solid fa-mobile-screen-button"></i>
                      </span>
                      <div className="pay-texts">
                        <strong>إنستاباي / المحافظ الذكية (InstaPay)</strong>
                        <span>فودافون كاش، أورنج، إتصالات كاش وإنستاباي</span>
                      </div>
                    </div>
                  </label>

                  <label className={`pay-method-card ${paymentMethod === 'fawry' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="fawry" 
                      checked={paymentMethod === 'fawry'} 
                      onChange={() => setPaymentMethod('fawry')} 
                    />
                    <div className="pay-card-content">
                      <span className="pay-icon" style={{ color: '#f68b1e' }}>
                        <i className="fa-solid fa-bolt"></i>
                      </span>
                      <div className="pay-texts">
                        <strong>فوري (Fawry)</strong>
                        <span>ادفع عبر كود فوري في أي سوبرماركت أو ماكينة فوري</span>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              {/* Submit CTA (Mobile / Secondary) */}
              <div className="submit-action-box">
                <button 
                  type="submit" 
                  className="jumia-checkout-btn large-cta" 
                  disabled={isSubmitting}
                >
                  <i className="fa-solid fa-lock" style={{ marginLeft: '6px' }}></i>
                  {isSubmitting ? 'جاري تأكيد وتسجيل الطلب...' : `تأكيد وإتمام الطلب (${totalAmount.toLocaleString()} جنيه)`}
                </button>
              </div>

            </form>
          </div>

          {/* Left Column: Order Summary & Promo Code */}
          <div className="checkout-summary-column">
            
            {/* Promo Code Box */}
            <div className="checkout-summary-card promo-box">
              <h4>كود الخصم / قسيمة الشراء</h4>
              <form onSubmit={handleApplyPromo} className="promo-input-row">
                <input 
                  type="text" 
                  placeholder="أدخل الكود (مثل: PLUS10)" 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)} 
                  disabled={promoApplied}
                />
                <button type="submit" disabled={promoApplied || !promoCode.trim()}>
                  {promoApplied ? 'مطبق ✓' : 'تطبيق'}
                </button>
              </form>
              {promoMessage.text && (
                <p className={`promo-msg ${promoMessage.type}`}>{promoMessage.text}</p>
              )}
            </div>

            {/* Order Items Breakdown */}
            <div className="checkout-summary-card">
              <div className="summary-title-line">
                <h4>ملخص المنتجات</h4>
                <span>({cart.reduce((s, i) => s + i.quantity, 0)} قطعة)</span>
              </div>

              <div className="summary-items-scroll">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedImage}`} className="summary-single-item">
                    <img src={item.selectedImage || item.thumbnail} alt={item.title} />
                    <div className="item-info">
                      <span className="item-name">{item.title}</span>
                      <span className="item-qty-price">
                        {item.quantity} × {item.calculatedPrice.toLocaleString()} جنيه
                      </span>
                    </div>
                    <span className="item-total-price">
                      {(item.calculatedPrice * item.quantity).toLocaleString()} جنيه
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="price-lines-box">
                <div className="price-line">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotal.toLocaleString()} جنيه</span>
                </div>

                <div className="price-line">
                  <span>رسوم التوصيل:</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong className="free-text">مجاني (بلس إكسبريس)</strong>
                    ) : (
                      `${shippingCost} جنيه`
                    )}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="price-line discount">
                    <span>الخصم المطبق:</span>
                    <span>-{promoDiscount.toLocaleString()} جنيه</span>
                  </div>
                )}

                <div className="price-line grand-total">
                  <span>الإجمالي الكلي:</span>
                  <strong>{totalAmount.toLocaleString()} جنيه</strong>
                </div>
              </div>

              <button 
                type="button" 
                className="jumia-checkout-btn place-order-btn"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                <i className="fa-solid fa-lock" style={{ marginLeft: '6px' }}></i>
                {isSubmitting ? 'جاري تجهيز الطلب...' : `تأكيد الطلب الآن (${totalAmount.toLocaleString()} جنيه)`}
              </button>

              {/* Guarantees */}
              <div className="trust-features-list">
                <div className="trust-item">
                  <span style={{ color: '#f68b1e', width: '20px', textAlign: 'center' }}>
                    <i className="fa-solid fa-shield-halved"></i>
                  </span>
                  <span>ضمان أصلي 100% وإمكانية الفحص قبل الاستلام</span>
                </div>
                <div className="trust-item">
                  <span style={{ color: '#f68b1e', width: '20px', textAlign: 'center' }}>
                    <i className="fa-solid fa-rotate-left"></i>
                  </span>
                  <span>إرجاع مجاني خلال 14 يوماً</span>
                </div>
                <div className="trust-item">
                  <span style={{ color: '#15803d', width: '20px', textAlign: 'center' }}>
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <span>دفع آمن ومشفر بأعلى معايير الحماية</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
