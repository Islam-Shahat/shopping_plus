import React, { useState, useEffect, useMemo, useRef } from 'react';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import LoginPage from './components/LoginPage';
import HelpPage from './components/HelpPage';
import CheckoutPage from './components/CheckoutPage';
import ProductPage from './components/ProductPage';
import HomePage from './components/HomePage';
import './App.css';

// 2 rows of 4 columns on desktop = 8 items per page
const ITEMS_PER_PAGE = 8;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Cart & View state ('home' | 'product' | 'cart' | 'wishlist' | 'checkout' | 'login' | 'help')
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewImage, setQuickViewImage] = useState(null);

  const gridSectionRef = useRef(null);

  // SPA Hash Routing Listener for Back/Forward Navigation
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash.startsWith('product-')) {
        const prodId = parseInt(hash.replace('product-', ''), 10);
        if (products.length > 0) {
          const found = products.find((p) => p.id === prodId);
          if (found) {
            setSelectedProduct(found);
            setCurrentView('product');
            return;
          }
        }
        setCurrentView('product');
      } else if (['home', 'cart', 'wishlist', 'login', 'help', 'checkout'].includes(hash)) {
        setCurrentView(hash);
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashRouting);
    // Initial sync
    handleHashRouting();

    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, [products]);

  // Fetch products from DummyJSON API
  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => {
        if (!res.ok) throw new Error('فشل الاتصال بمنتجات شوبينج بلس');
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  // Extract unique categories dynamically from API data
  const categories = useMemo(() => {
    if (!products.length) return ['All'];
    const uniqueCats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ['All', ...uniqueCats];
  }, [products]);

  const handleAddToCart = (productWithVariant) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.id === productWithVariant.id && item.selectedImage === productWithVariant.selectedImage
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { ...productWithVariant, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, selectedImage, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId, selectedImage);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedImage === selectedImage
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId, selectedImage) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedImage === selectedImage))
    );
  };

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let list = products.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const title = item.title || item.name || '';
      const brand = item.brand || '';
      const desc = item.description || '';
      const q = searchQuery.toLowerCase();
      const matchSearch =
        title.toLowerCase().includes(q) ||
        brand.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + (item.calculatedPrice || Math.round((item.price || 0) * 50)) * item.quantity,
      0
    );
  }, [cart]);

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

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  const handleMoveAllWishlistToCart = () => {
    wishlist.forEach((item) => {
      handleAddToCart({
        ...item,
        title: item.title || item.name,
        selectedImage: item.selectedImage || item.thumbnail || (item.images && item.images[0]),
        calculatedPrice: item.calculatedPrice || Math.round((item.price || 0) * 50)
      });
    });
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If currently in Checkout View, render CheckoutPage
  if (currentView === 'checkout') {
    return (
      <div className="jumia-app">
        <CheckoutPage 
          cart={cart}
          onBack={() => navigateTo('cart')}
          onOrderSuccess={(order) => {
            console.log('Order created successfully:', order);
          }}
          onClearCart={handleClearCart}
        />
      </div>
    );
  }

  return (
    <div className="jumia-app">
      {/* Amazon & Alibaba Signature Master Dual-Bar Header */}
      <header className="amz-master-header">
        {/* 1. Primary Top Bar (Dark Navy #131921) */}
        <div className="amz-primary-bar">
          <div className="amz-header-container">
            {/* Brand Logo */}
            <div 
              className="amz-brand-logo-wrap" 
              onClick={() => { navigateTo('home'); setActiveCategory('All'); setSearchQuery(''); }}
              role="button"
              tabIndex={0}
              title="الصفحة الرئيسية - شوبينج بلس مصر"
            >
              <div className="amz-logo-symbol">
                <span>+</span>
              </div>
              <div className="amz-logo-titles">
                <span className="amz-logo-brand">SHOPPING<span className="amz-brand-plus">PLUS</span></span>
                <span className="amz-logo-domain">.eg مصر</span>
              </div>
            </div>

            {/* Delivery Location Widget (Amazon Iconic Widget) */}
            <div 
              className="amz-nav-location" 
              title="موقع التوصيل المحدد: جمهورية مصر العربية"
            >
              <i className="fa-solid fa-location-dot amz-loc-icon"></i>
              <div className="amz-loc-text">
                <span className="amz-loc-sub">التوصيل إلى</span>
                <span className="amz-loc-title">مصر 🇪🇬 • القاهرة</span>
              </div>
            </div>

            {/* 3-Part Global Search Engine (Category Picker + Search Input + Orange Action Button) */}
            <div className="amz-search-bar-wrap">
              <div className="amz-search-inner">
                {/* 1. Category Dropdown Selector */}
                <select
                  value={activeCategory}
                  onChange={(e) => {
                    setActiveCategory(e.target.value);
                    if (currentView !== 'home') navigateTo('home');
                  }}
                  className="amz-cat-dropdown"
                  aria-label="اختر قسم البحث"
                >
                  <option value="All">جميع الأقسام</option>
                  <option value="beauty">الجمال والعناية</option>
                  <option value="fragrances">العطور والبرفانات</option>
                  <option value="furniture">الأثاث والديكور</option>
                  <option value="groceries">السوبرماركت والبقالة</option>
                </select>

                {/* 2. Text Search Input */}
                <input
                  type="text"
                  placeholder="ابحث في ملايين المنتجات بماركات أصلية وأفضل أسعار في مصر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="amz-search-field"
                  aria-label="بحث المنتجات"
                />

                {/* Clear search if text exists */}
                {searchQuery && (
                  <button 
                    type="button" 
                    className="amz-search-clear-btn" 
                    onClick={() => setSearchQuery('')} 
                    aria-label="مسح البحث"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}

                {/* 3. Iconic Amazon Warm Orange Action Button */}
                <button 
                  type="button" 
                  className="amz-search-action-btn" 
                  onClick={() => { if (currentView !== 'home') navigateTo('home'); }}
                  aria-label="تنفيذ البحث"
                  title="بحث"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>

            {/* User Controls & Quick Links */}
            <div className="amz-nav-actions-group">
              {/* Language / Region Pill */}
              <div className="amz-lang-widget" title="اللغة والعملة: العربية (جنيه مصري)">
                <span className="amz-flag-icon">🇪🇬</span>
                <span className="amz-lang-label">العربية</span>
                <i className="fa-solid fa-caret-down"></i>
              </div>

              {/* Account & Lists */}
              <button
                type="button"
                className={`amz-nav-action-item ${currentView === 'login' ? 'active' : ''}`}
                onClick={() => navigateTo('login')}
                title="الحساب وتسجيل الدخول"
              >
                <span className="amz-action-sub">
                  {currentUser ? `مرحباً، ${currentUser.name.split(' ')[0]}` : 'مرحباً، تسجيل الدخول'}
                </span>
                <span className="amz-action-main">
                  الحساب والقوائم <i className="fa-solid fa-caret-down"></i>
                </span>
              </button>

              {/* Orders & Returns */}
              <button
                type="button"
                className={`amz-nav-action-item ${currentView === 'help' ? 'active' : ''}`}
                onClick={() => navigateTo('help')}
                title="متابعة الطلبات والمرتجعات"
              >
                <span className="amz-action-sub">المساعده</span>
                <span className="amz-action-main">والطلبات</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                className={`amz-nav-action-item amz-wishlist-btn ${currentView === 'wishlist' ? 'active' : ''}`}
                onClick={() => navigateTo('wishlist')}
                title="قائمة الرغبات والمفضلة"
              >
                <div className="amz-icon-holder">
                  <i className={`fa-heart ${wishlist.length > 0 ? 'fa-solid amz-heart-filled' : 'fa-regular'}`}></i>
                  {wishlist.length > 0 && <span className="amz-counter-badge">{wishlist.length}</span>}
                </div>
                <span className="amz-action-main">المفضلة</span>
              </button>

              {/* Shopping Cart (Amazon Iconic Cart Badge) */}
              <button
                type="button"
                className={`amz-nav-action-item amz-cart-btn ${currentView === 'cart' ? 'active' : ''}`}
                onClick={() => navigateTo('cart')}
                title="عربة التسوق"
              >
                <div className="amz-cart-holder">
                  <i className="fa-solid fa-cart-shopping amz-cart-icon"></i>
                  <span className="amz-cart-count-badge">{totalCartCount}</span>
                </div>
                <div className="amz-cart-meta">
                  <span className="amz-action-sub">
                    {totalCartPrice > 0 ? `${totalCartPrice.toLocaleString()} ج.م` : 'عربة التسوق'}
                  </span>
                  <span className="amz-action-main amz-cart-word">العربة</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Secondary Sub-Navbar (Dark Slate #232f3e) */}
        <nav className="amz-subnav-strip" aria-label="شريط الأقسام السريع">
          <div className="amz-subnav-container">
            {/* All Categories Toggle */}
            <button
              type="button"
              className="amz-subnav-all-btn"
              onClick={() => {
                setActiveCategory('All');
                if (currentView !== 'home') navigateTo('home');
              }}
              title="تصفح جميع الأقسام"
            >
              <i className="fa-solid fa-bars"></i>
              <span>كل الأقسام</span>
            </button>

            {/* Quick Links */}
            <div className="amz-subnav-links-row">
              <button
                type="button"
                className={`amz-subnav-link ${activeCategory === 'All' && currentView === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('All');
                  if (currentView !== 'home') navigateTo('home');
                }}
              >
                <i className="fa-solid fa-fire amz-fire-icon"></i>
                <span>عروض اليوم</span>
              </button>

              <button
                type="button"
                className={`amz-subnav-link ${activeCategory === 'beauty' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('beauty');
                  if (currentView !== 'home') navigateTo('home');
                }}
              >
                <span>الجمال والعناية</span>
              </button>

              <button
                type="button"
                className={`amz-subnav-link ${activeCategory === 'fragrances' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('fragrances');
                  if (currentView !== 'home') navigateTo('home');
                }}
              >
                <span>العطور الفاخرة</span>
              </button>

              <button
                type="button"
                className={`amz-subnav-link ${activeCategory === 'furniture' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('furniture');
                  if (currentView !== 'home') navigateTo('home');
                }}
              >
                <span>الأثاث والديكور</span>
              </button>

              <button
                type="button"
                className={`amz-subnav-link ${activeCategory === 'groceries' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('groceries');
                  if (currentView !== 'home') navigateTo('home');
                }}
              >
                <span>السوبرماركت</span>
              </button>

              <button
                type="button"
                className="amz-subnav-link"
                onClick={() => {
                  setSortBy('rating');
                  if (currentView !== 'home') navigateTo('home');
                }}
              >
                <span>الأكثر مبيعاً 🏆</span>
              </button>

              <button
                type="button"
                className="amz-subnav-link"
                onClick={() => navigateTo('help')}
              >
                <span>خدمة العملاء</span>
              </button>
            </div>

            {/* Left Promotion Note */}
            <div className="amz-subnav-promo">
              <span className="amz-promo-text">
                <i className="fa-solid fa-bolt amz-bolt-icon"></i> بلس إكسبريس: توصيل فوري مجاني لكافة المحافظات +500 ج.م
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* View Router */}
      {currentView === 'cart' ? (
        <CartPage 
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onProceedToCheckout={() => navigateTo('checkout')}
          onContinueShopping={() => navigateTo('home')}
          onQuickView={(prod) => handleOpenProduct(prod)}
        />
      ) : currentView === 'wishlist' ? (
        <WishlistPage 
          wishlist={wishlist}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onClearWishlist={handleClearWishlist}
          onAddToCart={handleAddToCart}
          onMoveAllToCart={handleMoveAllWishlistToCart}
          onContinueShopping={() => navigateTo('home')}
          onQuickView={(prod) => handleOpenProduct(prod)}
        />
      ) : currentView === 'login' ? (
        <LoginPage 
          currentUser={currentUser}
          onLoginSuccess={(user) => setCurrentUser(user)}
          onLogout={() => setCurrentUser(null)}
          onContinueShopping={() => navigateTo('home')}
        />
      ) : currentView === 'help' ? (
        <HelpPage 
          onContinueShopping={() => navigateTo('home')}
        />
      ) : currentView === 'product' ? (
        <ProductPage 
          product={selectedProduct}
          allProducts={products}
          onAddToCart={handleAddToCart}
          onBuyNow={(prod) => {
            handleAddToCart(prod);
            navigateTo('checkout');
          }}
          onToggleWishlist={handleToggleWishlist}
          isFavorite={selectedProduct && wishlist.some((it) => it.id === selectedProduct.id)}
          onBackToHome={() => navigateTo('home')}
          onSelectProduct={handleOpenProduct}
        />
      ) : (
        <HomePage 
          products={products}
          paginatedProducts={paginatedProducts}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onClearSearch={() => { setSearchQuery(''); setActiveCategory('All'); }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalFilteredCount={filteredProducts.length}
          loading={loading}
          error={error}
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={handleOpenProduct}
          onQuickView={(prod, img) => {
            setQuickViewProduct(prod);
            setQuickViewImage(img);
          }}
          gridSectionRef={gridSectionRef}
        />
      )}

      {/* Amazon & Alibaba Signature Enterprise Footer */}
      <footer className="sp-luxury-footer">
        {/* Amazon Signature Back To Top Bar */}
        <button 
          type="button" 
          className="amz-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="العودة إلى أعلى الصفحة"
        >
          <i className="fa-solid fa-angle-up"></i>
          <span>العودة إلى الأعلى</span>
        </button>

        <div className="sp-footer-main-container">
          <div className="sp-footer-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-col brand-col">
              <div className="footer-brand">
                <span className="footer-brand-logo">SHOPPING<span>PLUS</span></span>
                <span className="footer-brand-badge">مصر</span>
              </div>
              <p className="footer-brand-desc">
                وجهتك الأولى للتسوق الإلكتروني الراقي في مصر. نوفر لك تشكيلة منتقاة من الماركات الأصلية 100% مع أسرع خدمة شحن وأفضل ضمان استرجاع.
              </p>
              <div className="footer-payment-methods">
                <span className="pay-chip"><i className="fa-brands fa-cc-visa"></i> Visa</span>
                <span className="pay-chip"><i className="fa-brands fa-cc-mastercard"></i> Mastercard</span>
                <span className="pay-chip"><i className="fa-solid fa-money-bill-wave"></i> فوري / ميزة</span>
                <span className="pay-chip"><i className="fa-solid fa-hand-holding-dollar"></i> كاش</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h3 className="footer-col-title">أقسام التسوق</h3>
              <ul className="footer-links-list">
                <li><button type="button" onClick={() => { setActiveCategory('All'); navigateTo('home'); }}>جميع المنتجات</button></li>
                <li><button type="button" onClick={() => { setActiveCategory('beauty'); navigateTo('home'); }}>الجمال والعناية</button></li>
                <li><button type="button" onClick={() => { setActiveCategory('fragrances'); navigateTo('home'); }}>العطور والبرفانات</button></li>
                <li><button type="button" onClick={() => { setActiveCategory('furniture'); navigateTo('home'); }}>الأثاث والديكور</button></li>
                <li><button type="button" onClick={() => { setActiveCategory('groceries'); navigateTo('home'); }}>البقالة والمستلزمات</button></li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="footer-col">
              <h3 className="footer-col-title">خدمة العملاء</h3>
              <ul className="footer-links-list">
                <li><button type="button" onClick={() => navigateTo('help')}>مركز المساعدة والأسئلة الشائعة</button></li>
                <li><button type="button" onClick={() => navigateTo('help')}>سياسة الشحن والتوصيل</button></li>
                <li><button type="button" onClick={() => navigateTo('help')}>سياسة الاستبدال والاسترجاع</button></li>
                <li><button type="button" onClick={() => navigateTo('cart')}>تتبع ومتابعة الطلب</button></li>
                <li><button type="button" onClick={() => navigateTo('wishlist')}>قائمة المفضلة الخاصة بك</button></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="footer-col newsletter-col">
              <h3 className="footer-col-title">النشرة البريدية والعروض</h3>
              <p className="footer-newsletter-text">
                اشترك الآن لتصلك أقوى العروض الحصرية وكوبونات الخصم الأسبوعية مباشرة.
              </p>
              <div className="footer-newsletter-form">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني..." 
                  className="footer-email-input" 
                />
                <button type="button" className="footer-subscribe-btn">
                  اشترك الآن
                </button>
              </div>
              <div className="footer-support-phone">
                <i className="fa-solid fa-phone-volume"></i>
                <div>
                  <span className="support-label">خدمة العملاء على مدار الساعة:</span>
                  <span className="support-number">19850 (مصر)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sp-footer-bottom-bar">
            <p className="sp-copyright">
              © {new Date().getFullYear()} شوبينج بلس مصر (Shopping Plus Egypt) — تجربة تسوق إلكتروني متكاملة ومحمية بالكامل.
            </p>
            <div className="sp-footer-socials">
              <span className="social-icon"><i className="fa-brands fa-facebook-f"></i></span>
              <span className="social-icon"><i className="fa-brands fa-instagram"></i></span>
              <span className="social-icon"><i className="fa-brands fa-tiktok"></i></span>
              <span className="social-icon"><i className="fa-brands fa-whatsapp"></i></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          initialImage={quickViewImage}
          onClose={() => {
            setQuickViewProduct(null);
            setQuickViewImage(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
