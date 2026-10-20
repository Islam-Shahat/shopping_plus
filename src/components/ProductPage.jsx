import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductPage({
  product,
  allProducts = [],
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isFavorite = false,
  onBackToHome,
  onSelectProduct
}) {
  const images = (product?.images && product.images.length > 0)
    ? product.images
    : [product?.thumbnail || 'https://via.placeholder.com/400'];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews' | 'shipping'
  const [isAdded, setIsAdded] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    setSelectedImage(images[0]);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (!product) {
    return (
      <div className="product-page-empty">
        <h2>لم يتم العثور على المنتج</h2>
        <button type="button" className="jumia-checkout-btn" onClick={onBackToHome}>
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  const title = product.title || product.name || 'منتج شوبينج بلس';
  const brand = product.brand || product.category || 'شوبينج بلس';
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  const egpPrice = Math.round(product.price * 50);
  const originalEgpPrice = discount > 0 ? Math.round(egpPrice / (1 - discount / 100)) : null;
  const savings = originalEgpPrice ? originalEgpPrice - egpPrice : 0;
  const totalCartPrice = egpPrice * quantity;

  // Related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart({
        ...product,
        title,
        selectedImage,
        calculatedPrice: egpPrice
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleInstantBuy = () => {
    handleAdd();
    if (onBuyNow) {
      onBuyNow({
        ...product,
        title,
        selectedImage,
        calculatedPrice: egpPrice,
        quantity
      });
    }
  };

  return (
    <div className="product-details-page-wrapper">
      {/* 1. Breadcrumbs */}
      <nav className="product-breadcrumb-nav" aria-label="مسار التصفح">
        <button type="button" onClick={onBackToHome} className="crumb-btn">
          <i className="fa-solid fa-house"></i> الرئيسية
        </button>
        <span className="crumb-sep">/</span>
        <button type="button" onClick={onBackToHome} className="crumb-btn category-crumb">
          {product.category || 'المنتجات'}
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">{title}</span>
      </nav>

      {/* 2. Main Product Showcase Layout */}
      <div className="product-showcase-grid">
        
        {/* Left/Right 1: Gallery */}
        <div className="product-gallery-column">
          <div className="gallery-main-view">
            <img 
              src={selectedImage} 
              alt={title} 
              className="gallery-hero-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = product.thumbnail || 'https://via.placeholder.com/400';
              }}
            />
            {discount > 0 && (
              <span className="gallery-discount-ribbon">
                <i className="fa-solid fa-tag"></i> خصم {discount}%
              </span>
            )}
            <button
              type="button"
              className={`gallery-wishlist-btn ${isFavorite ? 'liked' : ''}`}
              onClick={() => onToggleWishlist(product)}
              title={isFavorite ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
            >
              <i className={`fa-heart ${isFavorite ? 'fa-solid' : 'fa-regular'}`}></i>
            </button>
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs-list">
              {images.map((imgUrl, idx) => (
                <button
                  key={`${product.id}-thumb-${idx}`}
                  type="button"
                  className={`gallery-thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`صورة ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center 2: Essential Info & Purchase Block */}
        <div className="product-info-column">
          <div className="product-brand-row">
            <span className="brand-badge">الماركة: <strong>{brand}</strong></span>
            <span className="express-badge">
              <i className="fa-solid fa-bolt-lightning"></i> PLUS <strong>EXPRESS</strong>
            </span>
          </div>

          <h1 className="product-page-title">{title}</h1>

          {/* Rating and SKU row */}
          <div className="product-meta-stats-row">
            {product.rating && (
              <div className="rating-pill">
                <div className="stars-icons" style={{ color: '#f59e0b', display: 'inline-flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <i 
                      key={s} 
                      className={`fa-star ${s <= Math.round(product.rating) ? 'fa-solid' : 'fa-regular'}`} 
                      style={{ fontSize: '13px' }}
                    ></i>
                  ))}
                </div>
                <strong className="score-num">{product.rating.toFixed(1)}</strong>
                <span className="reviews-count">({product.reviews?.length || 12} تقييم)</span>
              </div>
            )}
            {product.sku && <span className="sku-tag">كود المنتج: {product.sku}</span>}
          </div>

          <div className="product-divider"></div>

          {/* Price Box */}
          <div className="product-pricing-card">
            <div className="pricing-headline">
              <span className="price-num">{egpPrice.toLocaleString()}</span>
              <span className="price-currency">جنيه مصري</span>
              {originalEgpPrice && (
                <span className="strike-num">{originalEgpPrice.toLocaleString()} جنيه</span>
              )}
            </div>

            {savings > 0 && (
              <div className="savings-line">
                <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
                <span>وفرت في هذه العملية <strong>{savings.toLocaleString()} جنيه مصري</strong> ({discount}% خصم)</span>
              </div>
            )}

            <div className="vat-instalment-hint">
              <span>الأسعار شاملة ضريبة القيمة المضافة</span>
              <span className="instalment-tag">
                <i className="fa-solid fa-credit-card"></i> تقسيط يبدأ من {Math.round(egpPrice / 12)} جنيه/شهر
              </span>
            </div>
          </div>

          {/* Stock availability */}
          <div className="product-availability-box">
            <span className="in-stock-badge">
              <i className="fa-solid fa-circle-check"></i> {product.availabilityStatus || 'متوفر في المخازن جاهز للشحن الفوري'}
            </span>
            {product.stock && (
              <span className="stock-qty-hint">متبقي <strong>{product.stock}</strong> قطع فقط</span>
            )}
          </div>

          {/* Quantity & CTA Actions */}
          <div className="product-order-action-bar">
            <div className="stepper-wrapper">
              <span className="stepper-label">الكمية:</span>
              <div className="jumia-stepper-lg">
                <button 
                  type="button" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="إنقاص الكمية"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="qty-number">{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="زيادة الكمية"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="cta-buttons-group">
              <button 
                type="button" 
                className={`product-add-cart-btn ${isAdded ? 'added' : ''}`}
                onClick={handleAdd}
              >
                {isAdded ? (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>تمت الإضافة بنجاح!</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>أضف إلى عربة التسوق ({totalCartPrice.toLocaleString()} جنيه)</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="product-buy-now-btn"
                onClick={handleInstantBuy}
              >
                <i className="fa-solid fa-bolt"></i>
                <span>اشتري الآن مباشرة</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees Bar */}
          <div className="product-trust-chips-row">
            <div className="trust-chip">
              <i className="fa-solid fa-truck-fast"></i>
              <span>شحن سريع مع بلس إكسبريس</span>
            </div>
            <div className="trust-chip">
              <i className="fa-solid fa-rotate-left"></i>
              <span>إرجاع مجاني خلال 14 يوماً</span>
            </div>
            <div className="trust-chip">
              <i className="fa-solid fa-shield-halved"></i>
              <span>ضمان أصلي 100%</span>
            </div>
          </div>
        </div>

        {/* Right 3: Shipping & Seller Sidebar */}
        <aside className="product-delivery-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">
              <i className="fa-solid fa-truck"></i> معلومات التوصيل والشحن
            </h3>
            
            <div className="delivery-perk-item">
              <div className="perk-icon-circle"><i className="fa-solid fa-location-dot"></i></div>
              <div className="perk-text">
                <strong>التوصيل لجميع المحافظات</strong>
                <p>متاح الشحن إلى القاهرة، الإسكندرية، الدلتا والصعيد</p>
              </div>
            </div>

            <div className="delivery-perk-item">
              <div className="perk-icon-circle"><i className="fa-solid fa-clock"></i></div>
              <div className="perk-text">
                <strong>وقت التوصيل المتوقع</strong>
                <p>{product.shippingInformation || 'التوصيل خلال 24 - 48 ساعة لباب منزلك'}</p>
              </div>
            </div>

            <div className="delivery-perk-item">
              <div className="perk-icon-circle"><i className="fa-solid fa-box-open"></i></div>
              <div className="perk-text">
                <strong>فحص واستلام</strong>
                <p>يحق لك معاينة وفحص الطلب قبل الاستلام والدفع</p>
              </div>
            </div>
          </div>

          <div className="sidebar-card seller-info-card">
            <h3 className="sidebar-card-title">
              <i className="fa-solid fa-store"></i> معلومات المتجر والضمان
            </h3>
            <div className="seller-name-row">
              <strong>شوبينج بلس مصر (Shopping Plus)</strong>
              <span className="seller-verified-badge">
                <i className="fa-solid fa-circle-check"></i> موثق
              </span>
            </div>
            <p className="seller-score">تقييم المتجر: <strong>98%</strong> رضا العملاء</p>
            <div className="warranty-line">
              <i className="fa-solid fa-shield"></i>
              <span>{product.warrantyInformation || 'ضمان معتمد لمدة عام ضد عيوب الصناعة'}</span>
            </div>
          </div>
        </aside>

      </div>

      {/* 3. Tabs Section: Description / Specs / Reviews */}
      <section className="product-tabs-section">
        <div className="tabs-header-bar">
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            <i className="fa-solid fa-circle-info"></i> الوصف والمواصفات الكاملة
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="fa-solid fa-star"></i> آراء وتقييمات المشترين ({product.reviews?.length || 3})
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            <i className="fa-solid fa-rotate-left"></i> سياسة الإرجاع والضمان
          </button>
        </div>

        <div className="tab-content-container">
          {activeTab === 'specs' && (
            <div className="tab-pane-specs">
              <h3>وصف المنتج</h3>
              <p className="main-desc-paragraph">{product.description}</p>

              <h3>المواصفات التقنية</h3>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <th>الماركة</th>
                    <td>{brand}</td>
                  </tr>
                  <tr>
                    <th>التصنيف</th>
                    <td>{product.category}</td>
                  </tr>
                  {product.weight && (
                    <tr>
                      <th>الوزن</th>
                      <td>{product.weight} كجم</td>
                    </tr>
                  )}
                  {product.dimensions && (
                    <tr>
                      <th>الأبعاد</th>
                      <td>{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} سم</td>
                    </tr>
                  )}
                  {product.minimumOrderQuantity && (
                    <tr>
                      <th>الحد الأدنى للطلب</th>
                      <td>{product.minimumOrderQuantity} قطعة</td>
                    </tr>
                  )}
                  <tr>
                    <th>حالة التوفر</th>
                    <td>{product.availabilityStatus || 'متوفر بالمخزن'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-pane-reviews">
              <h3>آراء وتقييمات العملاء الموثقة</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="reviews-cards-list">
                  {product.reviews.map((rev, idx) => (
                    <div key={idx} className="customer-review-card">
                      <div className="review-top-meta">
                        <div className="reviewer-avatar">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div>
                          <strong>{rev.reviewerName || 'متسوق موثق'}</strong>
                          <span className="review-date">{new Date(rev.date).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div className="review-stars">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="review-comment-text">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reviews-box">
                  <p>كن أول من يكتب تقييماً لهذا المنتج الرائع!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="tab-pane-shipping">
              <h3>الضمان وسياسة الاستبدال والإرجاع</h3>
              <div className="policy-block">
                <h4><i className="fa-solid fa-rotate-left"></i> إرجاع مجاني خلال 14 يوماً:</h4>
                <p>{product.returnPolicy || 'يمكنك إرجاع أو استبدال المنتج خلال 14 يوماً من تاريخ الاستلام في حالته الأصلية بدون أي رسوم إضافية.'}</p>
              </div>
              <div className="policy-block">
                <h4><i className="fa-solid fa-shield-halved"></i> الضمان الرسمي:</h4>
                <p>{product.warrantyInformation || 'يتمتع هذا المنتج بضمان رسمي من الوكيل المعتمد في مصر ضد أي عيوب تصنيع.'}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-section-header">
            <h2>منتجات مشابهة قد تنال إعجابك</h2>
            <p>اخترنا لك هذه المنتجات المميزة من نفس تصنيف {product.category}</p>
          </div>

          <div className="jumia-grid">
            {relatedProducts.map((relProd) => (
              <ProductCard
                key={relProd.id}
                product={relProd}
                onAddToCart={onAddToCart}
                onQuickView={() => onSelectProduct(relProd)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Back to Home Bar */}
      <div className="product-page-footer-nav">
        <button type="button" onClick={onBackToHome} className="continue-link-btn">
          <i className="fa-solid fa-arrow-right"></i>
          العودة للصفحة الرئيسية ومواصلة التسوق
        </button>
      </div>

    </div>
  );
}
