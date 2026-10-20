import React, { useState } from 'react';
import { useModal } from '../context/ModalContext';

export default function LoginPage({ 
  onLoginSuccess, 
  onContinueShopping,
  currentUser,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const { showAlert } = useModal();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, show user profile view
  if (currentUser) {
    return (
      <div className="auth-page-wrapper">
        <div className="cart-page-breadcrumb">
          <button type="button" onClick={onContinueShopping} className="crumb-link">الرئيسية</button>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">حسابي الشخصي</span>
        </div>

        <div className="auth-large-container single-box">
          <div className="profile-card-content">
            <div className="profile-avatar-circle">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <h2>أهلاً بك، {currentUser.name || 'عميلنا العزيز'}!</h2>
            <p className="profile-email-text">{currentUser.email || 'customer@shoppingplus.eg'}</p>

            <div className="profile-quick-stats">
              <div className="stat-box">
                <span className="stat-num">0</span>
                <span className="stat-label">طلبات نشطة</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">100%</span>
                <span className="stat-label">أمان الحساب</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">★</span>
                <span className="stat-label">عضو بلاتيني</span>
              </div>
            </div>

            <div className="profile-actions-list">
              <button type="button" className="jumia-checkout-btn large-btn" onClick={onContinueShopping}>
                تصفح ومواصلة التسوق الآن
              </button>
              <button type="button" className="logout-btn" onClick={onLogout}>
                تسجيل الخروج من الحساب
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setMessage({ type: 'error', text: 'يرجى إدخال البريد الإلكتروني أو الهاتف وكلمة المرور' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = {
        name: loginEmail.split('@')[0] || 'أحمد محمد',
        email: loginEmail,
        isLoggedIn: true
      };
      setMessage({ type: 'success', text: 'تم تسجيل الدخول بنجاح! مرحباً بك في شوبينج بلس.' });
      setTimeout(() => {
        onLoginSuccess(user);
        onContinueShopping();
      }, 700);
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword.trim()) {
      setMessage({ type: 'error', text: 'يرجى استيفاء جميع الحقول المطلوبة' });
      return;
    }
    if (!agreeTerms) {
      setMessage({ type: 'error', text: 'يرجى الموافقة على الشروط والأحكام للاستمرار' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        name: regName,
        phone: regPhone,
        email: regEmail,
        isLoggedIn: true
      };
      setMessage({ type: 'success', text: 'تهانينا! تم إنشاء حسابك بنجاح وجاري توجيهك للمتجر.' });
      setTimeout(() => {
        onLoginSuccess(newUser);
        onContinueShopping();
      }, 800);
    }, 700);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Breadcrumb */}
      <div className="cart-page-breadcrumb">
        <button type="button" onClick={onContinueShopping} className="crumb-link">الرئيسية</button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">
          {activeTab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </span>
      </div>

      {/* Modern 2-Column Responsive Container for Laptop & Desktop */}
      <div className="auth-split-wrapper">
        
        {/* Right Column: Form Box */}
        <div className="auth-form-column">
          
          {/* Header */}
          <div className="auth-header">
            <div className="auth-brand-logo">
              <span className="auth-brand-txt">SHOPPING<span className="auth-accent">PLUS</span></span>
              <span className="auth-star">★</span>
            </div>
            <p className="auth-sub">بوابتك للتسوق الذكي والعروض الحصرية في مصر</p>
          </div>

          {/* Tab switch */}
          <div className="auth-tabs-row">
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setMessage(null); }}
            >
              تسجيل الدخول
            </button>
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setMessage(null); }}
            >
              إنشاء حساب جديد
            </button>
          </div>

          {/* Feedback message */}
          {message && (
            <div className={`auth-alert-msg ${message.type}`}>
              {message.type === 'success' ? '✓ ' : '✕ '}
              {message.text}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="auth-form-body">
              <div className="form-group">
                <label>البريد الإلكتروني أو رقم الهاتف المحمول <span className="req">*</span></label>
                <input 
                  type="text" 
                  placeholder="مثال: 01xxxxxxxxx أو name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="auth-input-lg"
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-with-link">
                  <label>كلمة المرور <span className="req">*</span></label>
                  <button 
                    type="button" 
                    className="forgot-link-btn"
                    onClick={() => {
                      showAlert({
                        title: 'استعادة كلمة المرور',
                        message: 'تم إرسال رابط آمن لإعادة ضبط كلمة المرور إلى بريدك الإلكتروني المسجل لدينا.',
                        type: 'info',
                        confirmText: 'حسناً، فهمت'
                      });
                    }}
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="password-input-wrap">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور الخاصة بك"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="auth-input-lg"
                    required
                  />
                  <button 
                    type="button" 
                    className="show-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    <span>{showPassword ? 'إخفاء' : 'عرض'}</span>
                  </button>
                </div>
              </div>

              <div className="auth-options-row">
                <label className="remember-me-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>تذكر بياناتي على هذا الجهاز لسهولة الدخول لاحقاً</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="jumia-checkout-btn auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="auth-form-body">
              <div className="auth-form-grid-2">
                <div className="form-group">
                  <label>الاسم الكامل <span className="req">*</span></label>
                  <input 
                    type="text" 
                    placeholder="مثال: أحمد محمد علي"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="auth-input-lg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>رقم الهاتف المحمول <span className="req">*</span></label>
                  <input 
                    type="tel" 
                    placeholder="01xxxxxxxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="auth-input-lg"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني <span className="req">*</span></label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="auth-input-lg"
                  required
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور الجديدة <span className="req">*</span></label>
                <div className="password-input-wrap">
                  <input 
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="اختر كلمة مرور قوية (8 خانات على الأقل)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="auth-input-lg"
                    required
                  />
                  <button 
                    type="button" 
                    className="show-pwd-btn"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    <i className={`fa-regular ${showRegPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    <span>{showRegPassword ? 'إخفاء' : 'عرض'}</span>
                  </button>
                </div>
              </div>

              <div className="auth-options-row">
                <label className="remember-me-label">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بشوبينج بلس مصر</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="jumia-checkout-btn auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
              </button>
            </form>
          )}

          {/* Social Fast Login */}
          <div className="social-divider">
            <span>أو قم بالدخول السريع باستخدام</span>
          </div>

          <div className="social-buttons-grid">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={() => {
                onLoginSuccess({ name: 'مستخدم جوجل', email: 'user@gmail.com', isLoggedIn: true });
                onContinueShopping();
              }}
            >
              <i className="fa-brands fa-google google-icon"></i>
              <span>Google</span>
            </button>
            <button 
              type="button" 
              className="social-btn facebook-btn"
              onClick={() => {
                onLoginSuccess({ name: 'مستخدم فيسبوك', email: 'user@facebook.com', isLoggedIn: true });
                onContinueShopping();
              }}
            >
              <i className="fa-brands fa-facebook-f facebook-icon"></i>
              <span>Facebook</span>
            </button>
          </div>

        </div>

        {/* Left Column: Brand Benefits Panel (Laptop & Tablet View) */}
        <div className="auth-perks-column">
          <div className="perks-inner">
            <div className="perks-badge">
              <i className="fa-solid fa-star"></i>
              <span>عضوية شوبينج بلس</span>
            </div>
            <h2>تسوق بذكاء واكتشف أفضل العروض في مصر</h2>
            <p className="perks-lead">
              انضم إلى مجتمع شوبينج بلس واستمتع بتجربة تسوق مريحة، آمنة وسريعة مع أقوى المزايا الحصرية.
            </p>

            <div className="perks-features-list">
              <div className="perk-feature-item">
                <span className="perk-icon">
                  <i className="fa-solid fa-bolt-lightning"></i>
                </span>
                <div>
                  <h4>توصيل فائق السرعة مع بلس إكسبريس</h4>
                  <p>توصيل خلال 24 إلى 48 ساعة حتى باب بيتك مع إمكانية المعاينة قبل الدفع.</p>
                </div>
              </div>

              <div className="perk-feature-item">
                <span className="perk-icon">
                  <i className="fa-solid fa-truck-fast"></i>
                </span>
                <div>
                  <h4>شحن مجاني للطلبات المؤهلة</h4>
                  <p>احصل على توصيل مجاني عند وصول مشترياتك إلى 350 جنيه أو أكثر.</p>
                </div>
              </div>

              <div className="perk-feature-item">
                <span className="perk-icon">
                  <i className="fa-solid fa-rotate-left"></i>
                </span>
                <div>
                  <h4>إرجاع واستبدال مجاني خلال 14 يوماً</h4>
                  <p>إذا لم يعجبك المنتج، استرجعه بسهولة وبدون أي رسوم إضافية.</p>
                </div>
              </div>

              <div className="perk-feature-item">
                <span className="perk-icon">
                  <i className="fa-solid fa-credit-card"></i>
                </span>
                <div>
                  <h4>دفع نقداً أو بالتقسيط والمحافظ الذكية</h4>
                  <p>كاش عند الاستلام، بطاقات بنكية، إنستاباي، فودافون كاش، وفوري.</p>
                </div>
              </div>
            </div>

            <div className="perks-trust-footer">
              <span className="lock-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </span>
              <span>جميع معاملاتك وبياناتك مشفرة ومحمية بأعلى معايير الأمان 256-bit SSL</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
