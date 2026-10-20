import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useHome } from '../hooks/useHome';
import { useModal } from '../context/ModalContext';

export default function HomePage({
  products = [],
  paginatedProducts = [],
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  searchQuery = '',
  onClearSearch,
  sortBy = 'default',
  onSortChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 8,
  totalFilteredCount = 0,
  loading = false,
  error = null,
  wishlist = [],
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  onQuickView,
  gridSectionRef
}) {
  const { showAlert } = useModal();

  // Custom hook for hero slides, countdown timer, and deal cards
  const {
    slides,
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsPaused,
    formattedCountdown
  } = useHome({ products, activeCategory, onSelectCategory });

  const activeSlideData = slides[currentSlide];

  const getCategoryArabicName = (cat) => {
    switch (cat.toLowerCase()) {
      case 'all': return 'جميع الأقسام';
      case 'beauty': return 'الجمال والعناية';
      case 'fragrances': return 'العطور والبرفانات';
      case 'furniture': return 'الأثاث والديكور';
      case 'groceries': return 'السوبرماركت والبقالة';
      default: return cat;
    }
  };

  const scrollToCatalog = () => {
    if (gridSectionRef?.current) {
      gridSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 1. Beauty 4-item grid for Bento Hub Card 1
  const beautyProducts = useMemo(() => {
    return products.filter((p) => p.category === 'beauty').slice(0, 4);
  }, [products]);

  // 2. Furniture 4-item grid for Bento Hub Card 2
  const furnitureProducts = useMemo(() => {
    return products.filter((p) => p.category === 'furniture').slice(0, 4);
  }, [products]);

  // 3. Groceries 4-item grid for Bento Hub Card 3
  const groceriesProducts = useMemo(() => {
    return products.filter((p) => p.category === 'groceries').slice(0, 4);
  }, [products]);

  // 4. Deal of the Day Product (Product with highest discount percentage)
  const dealOfTheDay = useMemo(() => {
    if (!products.length) return null;
    return products.reduce((prev, curr) => 
      (curr.discountPercentage || 0) > (prev.discountPercentage || 0) ? curr : prev
    , products[0]);
  }, [products]);

  // 5. Flash Deals (top 8 discounted products for horizontal deals carousel)
  const flashDeals = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
      .slice(0, 8);
  }, [products]);

  // Deal of the Day pricing
  const dodDiscount = dealOfTheDay ? Math.round(dealOfTheDay.discountPercentage || 25) : 25;
  const dodPrice = dealOfTheDay ? Math.round(dealOfTheDay.price * 50) : 0;
  const dodOldPrice = dealOfTheDay 
    ? Math.round(dodPrice / (1 - (dodDiscount / 100))) 
    : 0;

  return (
    <div className="home-spa-view amz-theme-view">
      {/* =========================================================================
          1. AMAZON & ALIBABA FULL-WIDTH HERO CAROUSEL
          ========================================================================= */}
      <section 
        className="amz-hero-carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="بانر العروض الترويجية الرئيسية"
      >
        <div className="amz-hero-slider-track">
          <div 
            className="amz-hero-slide-bg"
            style={{ backgroundImage: `url(${activeSlideData.image})` }}
          >
            {/* Dark & Gradient Overlay for readability */}
            <div className="amz-hero-gradient-overlay" />

            {/* Top Festival Live Countdown Ribbon on the Banner */}
            <div className="amz-hero-live-ribbon">
              <span className="live-ribbon-flame"><i className="fa-solid fa-fire"></i> مهرجان التخفيضات الكبرى مستمر الآن!</span>
              <span className="live-ribbon-sep">•</span>
              <span className="live-ribbon-timer">
                <i className="fa-regular fa-clock"></i> ينتهي العرض خلال: <strong>{formattedCountdown}</strong>
              </span>
              <span className="live-ribbon-sep">•</span>
              <span className="live-ribbon-code">
                كود خصم فوري 50 ج.م: <strong>PLUS50</strong>
              </span>
            </div>

            {/* Hero Text Box (RTL Alignment) */}
            <div className="amz-hero-text-container">
              <div className="amz-hero-content-box">
                <div className="amz-hero-kicker-pill">
                  <i className="fa-solid fa-crown amz-crown-icon"></i>
                  <span>{activeSlideData.brandBadge || 'مهرجان التخفيضات الكبرى ★'}</span>
                  <span className="amz-hero-kicker-tag">{activeSlideData.discountBadge}</span>
                </div>

                <h1 className="amz-hero-title">
                  {activeSlideData.title}
                </h1>

                <p className="amz-hero-description">
                  {activeSlideData.subtitle}
                </p>

                {/* Festival Perks Chips */}
                <div className="amz-hero-chips-row">
                  <span className="amz-chip-pill"><i className="fa-solid fa-gift"></i> هدايا وعينات مجانية</span>
                  <span className="amz-chip-pill"><i className="fa-solid fa-truck-fast"></i> توصيل فوري مجاني</span>
                  <span className="amz-chip-pill"><i className="fa-solid fa-shield-halved"></i> ضمان أصلي 100%</span>
                </div>

                <div className="amz-hero-actions">
                  <button
                    type="button"
                    className="amz-hero-btn-primary"
                    onClick={() => {
                      if (activeSlideData.categoryTarget) {
                        onSelectCategory(activeSlideData.categoryTarget);
                      }
                      scrollToCatalog();
                    }}
                  >
                    <span>{activeSlideData.ctaText || 'تسوق العرض الآن'}</span>
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>

                  <button
                    type="button"
                    className="amz-hero-btn-secondary"
                    onClick={scrollToCatalog}
                  >
                    <span>استكشف الكتالوج الكامل</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slider Navigation Chevrons */}
            <button 
              type="button" 
              className="amz-slider-chevron amz-chevron-prev"
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              aria-label="الشريحة السابقة"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            <button 
              type="button" 
              className="amz-slider-chevron amz-chevron-next"
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              aria-label="الشريحة التالية"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {/* Indicators */}
            <div className="amz-hero-indicators">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`amz-hero-indicator-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                  aria-label={`شريحة رقم ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE ICONIC AMAZON & ALIBABA 4-CARD OVERLAPPING BENTO HUB
          ========================================================================= */}
      <section className="amz-bento-hub-section" aria-label="أبرز بطاقات العروض والمنتجات">
        <div className="amz-bento-container">
          <div className="amz-bento-grid">
            
            {/* Card 1: Beauty & Personal Care (4-Item Grid) */}
            <article className="amz-bento-card">
              <div className="amz-card-header">
                <h2 className="amz-card-title">الجمال والعناية الشخصية</h2>
                <span className="amz-card-badge">خصم حتى 50%</span>
              </div>
              <p className="amz-card-sub">ماركات أصلية معتمدة مع ضمان الاسترجاع</p>

              <div className="amz-card-4grid">
                {beautyProducts.map((prod) => {
                  const pPrice = Math.round(prod.price * 50);
                  const pImg = prod.thumbnail || (prod.images && prod.images[0]);
                  return (
                    <div 
                      key={prod.id} 
                      className="amz-4grid-item"
                      onClick={() => onSelectProduct ? onSelectProduct(prod) : onQuickView(prod, pImg)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="amz-4grid-thumb-box">
                        <img src={pImg} alt={prod.title} loading="lazy" />
                      </div>
                      <span className="amz-4grid-title" title={prod.title}>{prod.title}</span>
                      <span className="amz-4grid-price">{pPrice.toLocaleString()} ج.م</span>
                    </div>
                  );
                })}
              </div>

              <div className="amz-card-footer">
                <button
                  type="button"
                  className="amz-card-link-btn"
                  onClick={() => { onSelectCategory('beauty'); scrollToCatalog(); }}
                >
                  <span>تسوق تشكيلة الجمال والعناية</span>
                  <i className="fa-solid fa-angle-left"></i>
                </button>
              </div>
            </article>

            {/* Card 2: Modern Home & Furniture (4-Item Grid) */}
            <article className="amz-bento-card">
              <div className="amz-card-header">
                <h2 className="amz-card-title">أثاث وديكور البيت العصري</h2>
                <span className="amz-card-badge">تقسيط 0% فوائد</span>
              </div>
              <p className="amz-card-sub">تشكيلات فاخرة تلبي أرقى معايير الديكور</p>

              <div className="amz-card-4grid">
                {furnitureProducts.map((prod) => {
                  const pPrice = Math.round(prod.price * 50);
                  const pImg = prod.thumbnail || (prod.images && prod.images[0]);
                  return (
                    <div 
                      key={prod.id} 
                      className="amz-4grid-item"
                      onClick={() => onSelectProduct ? onSelectProduct(prod) : onQuickView(prod, pImg)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="amz-4grid-thumb-box">
                        <img src={pImg} alt={prod.title} loading="lazy" />
                      </div>
                      <span className="amz-4grid-title" title={prod.title}>{prod.title}</span>
                      <span className="amz-4grid-price">{pPrice.toLocaleString()} ج.م</span>
                    </div>
                  );
                })}
              </div>

              <div className="amz-card-footer">
                <button
                  type="button"
                  className="amz-card-link-btn"
                  onClick={() => { onSelectCategory('furniture'); scrollToCatalog(); }}
                >
                  <span>تصفح أحدث قطع الأثاث والديكور</span>
                  <i className="fa-solid fa-angle-left"></i>
                </button>
              </div>
            </article>

            {/* Card 3: Supermarket & Essentials (4-Item Grid) */}
            <article className="amz-bento-card">
              <div className="amz-card-header">
                <h2 className="amz-card-title">السوبرماركت والبقالة</h2>
                <span className="amz-card-badge">توصيل 24 ساعة</span>
              </div>
              <p className="amz-card-sub">أسعار الجملة لجميع احتياجات المنزل اليومية</p>

              <div className="amz-card-4grid">
                {groceriesProducts.map((prod) => {
                  const pPrice = Math.round(prod.price * 50);
                  const pImg = prod.thumbnail || (prod.images && prod.images[0]);
                  return (
                    <div 
                      key={prod.id} 
                      className="amz-4grid-item"
                      onClick={() => onSelectProduct ? onSelectProduct(prod) : onQuickView(prod, pImg)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="amz-4grid-thumb-box">
                        <img src={pImg} alt={prod.title} loading="lazy" />
                      </div>
                      <span className="amz-4grid-title" title={prod.title}>{prod.title}</span>
                      <span className="amz-4grid-price">{pPrice.toLocaleString()} ج.م</span>
                    </div>
                  );
                })}
              </div>

              <div className="amz-card-footer">
                <button
                  type="button"
                  className="amz-card-link-btn"
                  onClick={() => { onSelectCategory('groceries'); scrollToCatalog(); }}
                >
                  <span>شاهد جميع عروض السوبرماركت</span>
                  <i className="fa-solid fa-angle-left"></i>
                </button>
              </div>
            </article>

            {/* Card 4: Deal of the Day (Live Flash Deal Widget) */}
            <article className="amz-bento-card amz-deal-of-day-card">
              <div className="amz-card-header">
                <h2 className="amz-card-title">
                  <i className="fa-solid fa-bolt amz-deal-bolt"></i> صفقة اليوم الحصرية
                </h2>
                <span className="amz-deal-countdown-tag">
                  <i className="fa-regular fa-clock"></i> {formattedCountdown}
                </span>
              </div>
              <p className="amz-card-sub">خصم فوري حصري ينتهي بانتهاء الوقت أو الكمية!</p>

              {dealOfTheDay && (
                <div 
                  className="amz-dod-body"
                  onClick={() => onSelectProduct ? onSelectProduct(dealOfTheDay) : onQuickView(dealOfTheDay, dealOfTheDay.thumbnail)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="amz-dod-image-wrap">
                    <img 
                      src={dealOfTheDay.thumbnail || (dealOfTheDay.images && dealOfTheDay.images[0])} 
                      alt={dealOfTheDay.title} 
                      loading="lazy"
                    />
                    <div className="amz-dod-discount-pill">
                      وفر {dodDiscount}%
                    </div>
                  </div>

                  <div className="amz-dod-details">
                    <span className="amz-dod-category">{getCategoryArabicName(dealOfTheDay.category)}</span>
                    <h3 className="amz-dod-title" title={dealOfTheDay.title}>{dealOfTheDay.title}</h3>

                    <div className="amz-dod-price-row">
                      <div className="amz-dod-price-current">
                        <span className="dod-num">{dodPrice.toLocaleString()}</span>
                        <span className="dod-currency">جنيه</span>
                      </div>
                      {dodOldPrice > 0 && (
                        <span className="amz-dod-price-old">{dodOldPrice.toLocaleString()} ج.م</span>
                      )}
                    </div>

                    {/* Stock Claimed Progress Bar */}
                    <div className="amz-dod-progress-box">
                      <div className="amz-dod-progress-bar">
                        <div className="amz-dod-progress-fill" style={{ width: '76%' }} />
                      </div>
                      <span className="amz-dod-progress-text">تم حجز 76% من الكمية المخصصة للعرض</span>
                    </div>

                    <button
                      type="button"
                      className="amz-dod-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart({
                          ...dealOfTheDay,
                          title: dealOfTheDay.title,
                          selectedImage: dealOfTheDay.thumbnail || dealOfTheDay.images?.[0],
                          calculatedPrice: dodPrice
                        });
                        showAlert({
                          title: 'تمت الإضافة بنجاح!',
                          message: `تم إضافة "${dealOfTheDay.title}" إلى عربة التسوق بسعر العرض الحصري!`,
                          type: 'success',
                          confirmText: 'متابعة التسوق'
                        });
                      }}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                      <span>أضف إلى العربة الآن</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="amz-card-footer">
                <button
                  type="button"
                  className="amz-card-link-btn"
                  onClick={() => { onSelectCategory('All'); scrollToCatalog(); }}
                >
                  <span>شاهد جميع صفقات اليوم</span>
                  <i className="fa-solid fa-angle-left"></i>
                </button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ALIBABA-STYLE CIRCULAR CATEGORY ROUNDELS RAIL
          ========================================================================= */}
      <section className="amz-circular-cats-section" aria-label="أقسام التسوق السريعة المصورة">
        <div className="amz-cats-container">
          <div className="amz-cats-header">
            <div>
              <span className="amz-cats-kicker">تصفح حسب القسم</span>
              <h2 className="amz-cats-title">أقسام التسوق السريعة</h2>
            </div>
            <button 
              type="button" 
              className="amz-cats-viewall-btn"
              onClick={() => { onSelectCategory('All'); scrollToCatalog(); }}
            >
              <span>عرض جميع المنتجات (30)</span>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>

          <div className="amz-cats-carousel-row">
            {[
              { id: 'All', name: 'جميع الأقسام', icon: 'fa-solid fa-layer-group', count: '30 منتج', color: '#ff9900' },
              { id: 'beauty', name: 'الجمال والعناية', icon: 'fa-solid fa-wand-magic-sparkles', count: 'خصم 50%', color: '#ec4899' },
              { id: 'fragrances', name: 'العطور الفاخرة', icon: 'fa-solid fa-pump-soap', count: 'ماركات أصلية', color: '#8b5cf6' },
              { id: 'furniture', name: 'الأثاث والديكور', icon: 'fa-solid fa-couch', count: 'تقسيط 0%', color: '#3b82f6' },
              { id: 'groceries', name: 'السوبرماركت', icon: 'fa-solid fa-basket-shopping', count: 'توصيل 24 س', color: '#10b981' },
              { id: 'flash', name: 'عروض الفلاش', icon: 'fa-solid fa-bolt-lightning', count: 'وفر حتى 60%', color: '#f59e0b', action: 'flash' },
              { id: 'best', name: 'الأكثر مبيعاً', icon: 'fa-solid fa-award', count: 'الأعلى تقييماً', color: '#ef4444', action: 'sort-rating' }
            ].map((roundel) => (
              <button
                key={roundel.id}
                type="button"
                className={`amz-cat-roundel-card ${activeCategory === roundel.id ? 'active' : ''}`}
                onClick={() => {
                  if (roundel.action === 'sort-rating') {
                    onSortChange('rating');
                  } else if (roundel.action === 'flash') {
                    onSortChange('price-low');
                  } else {
                    onSelectCategory(roundel.id);
                  }
                  scrollToCatalog();
                }}
              >
                <div className="roundel-icon-circle" style={{ '--accent-color': roundel.color }}>
                  <i className={roundel.icon}></i>
                </div>
                <span className="roundel-name">{roundel.name}</span>
                <span className="roundel-count-pill">{roundel.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. AMAZON-STYLE TODAY'S DEALS HORIZONTAL CAROUSEL
          ========================================================================= */}
      <section className="amz-todays-deals-section" aria-label="صفقات وتخفيضات اليوم">
        <div className="amz-deals-container">
          <div className="amz-deals-header-row">
            <div className="amz-deals-title-group">
              <span className="amz-deals-badge">صفقات حصرية</span>
              <h2 className="amz-deals-title">صفقات اليوم والتخفيضات الكبرى</h2>
              <div className="amz-deals-clock-box">
                <i className="fa-regular fa-clock"></i>
                <span>تنتهي الصفقات خلال: <strong>{formattedCountdown}</strong></span>
              </div>
            </div>

            <button
              type="button"
              className="amz-deals-all-link"
              onClick={() => { onSelectCategory('All'); scrollToCatalog(); }}
            >
              <span>مشاهدة كافة صفقات اليوم</span>
              <i className="fa-solid fa-angle-left"></i>
            </button>
          </div>

          <div className="amz-deals-scroll-row">
            {flashDeals.map((prod) => {
              const dDiscount = Math.round(prod.discountPercentage || 20);
              const dPrice = Math.round(prod.price * 50);
              const dOldPrice = Math.round(dPrice / (1 - (dDiscount / 100)));
              const dImg = prod.thumbnail || (prod.images && prod.images[0]);

              return (
                <div 
                  key={prod.id} 
                  className="amz-deal-scroll-card"
                  onClick={() => onSelectProduct ? onSelectProduct(prod) : onQuickView(prod, dImg)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="deal-card-thumb-wrap">
                    <img src={dImg} alt={prod.title} loading="lazy" />
                    <span className="deal-card-discount-tag">خصم {dDiscount}%</span>
                  </div>

                  <div className="deal-card-body">
                    <div className="deal-card-tag-row">
                      <span className="deal-limited-tag">صفقة محدودة</span>
                    </div>

                    <div className="deal-card-price-row">
                      <span className="deal-current-price">{dPrice.toLocaleString()} ج.م</span>
                      <span className="deal-old-price">{dOldPrice.toLocaleString()} ج.م</span>
                    </div>

                    <h3 className="deal-card-title" title={prod.title}>{prod.title}</h3>

                    {/* Mini stock claim bar */}
                    <div className="deal-stock-mini-bar">
                      <div className="deal-stock-mini-fill" style={{ width: `${Math.min(92, 50 + (prod.id * 3) % 40)}%` }} />
                    </div>
                    <span className="deal-stock-mini-text">تم بيع {Math.min(92, 50 + (prod.id * 3) % 40)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ALIBABA & AMAZON BUYER PROTECTION TRUST BAR
          ========================================================================= */}
      <section className="amz-trust-bar-section" aria-label="مزايا التسوق والضمان">
        <div className="amz-trust-container">
          <div className="amz-trust-grid">
            <div className="amz-trust-card">
              <div className="trust-icon-box">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="trust-texts">
                <h4>حماية المشتري بلس (Trade Assurance)</h4>
                <p>ضمان كامل لأموالك واسترداد فوري في حال عدم مطابقة المنتج للمواصفات</p>
              </div>
            </div>

            <div className="amz-trust-card">
              <div className="trust-icon-box">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div className="trust-texts">
                <h4>شحن إكسبريس مجاني 24 ساعة</h4>
                <p>توصيل فوري لجميع محافظات مصر مع شحن مجاني للطلبات أكثر من 500 ج.م</p>
              </div>
            </div>

            <div className="amz-trust-card">
              <div className="trust-icon-box">
                <i className="fa-solid fa-rotate-left"></i>
              </div>
              <div className="trust-texts">
                <h4>استرجاع واستبدال مجاني 14 يوماً</h4>
                <p>سياسة استبدال مرنة وبسيطة بدون أي تعقيدات أو مصاريف إضافية</p>
              </div>
            </div>

            <div className="amz-trust-card">
              <div className="trust-icon-box">
                <i className="fa-solid fa-credit-card"></i>
              </div>
              <div className="trust-texts">
                <h4>دفع آمن بالتقسيط أو عند الاستلام</h4>
                <p>كاش، بطاقات بنكية، ميزة، أو تقسيط 0% فوائد مع البنوك المصرية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CORE CATALOG SECTION (2 Rows x 4 Columns = 8 Products + Numbered Pagination)
          ========================================================================= */}
      <main className="jumia-main-container amz-catalog-container" id="catalog-section" ref={gridSectionRef}>
        {/* Category Pills & Sorting Bar */}
        <section className="jumia-category-bar amz-catalog-bar">
          <div className="category-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`jumia-cat-pill amz-cat-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                {getCategoryArabicName(cat)}
              </button>
            ))}
          </div>

          <div className="sort-controls-box">
            <span className="sort-title">الترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="jumia-sort-select amz-sort-select"
            >
              <option value="default">الأكثر تميزاً وشعبية</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">تقييم العملاء (الأعلى تقييماً)</option>
            </select>
          </div>
        </section>

        {/* Catalog Section Header */}
        <div className="jumia-section-header amz-section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 className="section-title">
              {getCategoryArabicName(activeCategory)}
              <span className="count-label">({totalFilteredCount} منتج متاح)</span>
            </h2>
            {searchQuery && (
              <span className="search-active-pill">
                البحث: "{searchQuery}"
                <button type="button" onClick={onClearSearch} title="مسح">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
          </div>
          <span className="express-promo-note">
            <i className="fa-solid fa-circle-check" style={{ color: '#ff9900' }}></i> جميع المنتجات أصلية 100% مع ضمان الوكيل
          </span>
        </div>

        {/* Product Grid: 2 Rows Only (8 items per page) */}
        <section className="jumia-products-grid-section">
          {loading ? (
            <div className="jumia-loading-box">
              <div className="jumia-spinner"></div>
              <p>جاري تحميل أحدث المنتجات من شوبينج بلس مصر...</p>
            </div>
          ) : error ? (
            <div className="jumia-empty-box">
              <p>حدث خطأ في تحميل المنتجات: {error}</p>
              <button className="retry-btn" onClick={() => window.location.reload()}>إعادة المحاولة</button>
            </div>
          ) : totalFilteredCount === 0 ? (
            <div className="jumia-empty-box">
              <p>لم نتمكن من العثور على أي منتج يطابق بحثك "{searchQuery}"</p>
              <button className="retry-btn" onClick={onClearSearch}>
                عرض جميع المنتجات
              </button>
            </div>
          ) : (
            <>
              {/* Product Cards: 2 Rows (8 items) */}
              <div className="jumia-grid amz-products-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    isFavorite={wishlist.some((it) => it.id === product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>

              {/* Professional Numbered Pagination */}
              {totalPages > 1 && (
                <div className="jumia-pagination-container amz-pagination-wrap">
                  <div className="pagination-info-pill">
                    <i className="fa-solid fa-layer-group" style={{ color: '#ff9900', marginLeft: '6px' }}></i>
                    <span>
                      عرض <strong>{(currentPage - 1) * itemsPerPage + 1} - {Math.min(totalFilteredCount, currentPage * itemsPerPage)}</strong> من أصل <strong>{totalFilteredCount}</strong> منتج
                    </span>
                    <span className="pagination-page-tag">صفحة {currentPage} من {totalPages}</span>
                  </div>

                  <nav className="jumia-pagination-nav" aria-label="التنقل بين الصفحات">
                    <button
                      type="button"
                      className="jumia-nav-btn prev-btn"
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      title="الصفحة السابقة"
                      aria-label="الصفحة السابقة"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                      <span>السابق</span>
                    </button>

                    <div className="jumia-page-numbers-group">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`jumia-page-number-btn ${currentPage === num ? 'active' : ''}`}
                          onClick={() => onPageChange(num)}
                          aria-current={currentPage === num ? 'page' : undefined}
                          title={`الانتقال إلى صفحة ${num}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="jumia-nav-btn next-btn"
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      title="الصفحة التالية"
                      aria-label="الصفحة التالية"
                    >
                      <span>التالي</span>
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
