import React, { useState } from 'react';
import { useModal } from '../context/ModalContext';

const FAQ_LIST = [
  {
    id: 1,
    category: 'shipping',
    q: 'كم يستغرق توصيل طلبي مع خدمة بلس إكسبريس (Plus Express)؟',
    a: 'يتم توصيل جميع طلبات بلس إكسبريس خلال 24 إلى 48 ساعة كحد أقصى داخل محافظات القاهرة الكبرى، الإسكندرية، والدلتا، وخلال 72 ساعة لباقي محافظات الجمهورية.'
  },
  {
    id: 2,
    category: 'shipping',
    q: 'كيف أستفيد من الشحن المجاني؟',
    a: 'الشحن مجاني لجميع الطلبات المؤهلة التي تزيد قيمتها الإجمالية عن 350 جنيه مصري والتي تشمل شارة بلس إكسبريس.'
  },
  {
    id: 3,
    category: 'returns',
    q: 'ما هي سياسة الإرجاع واسترداد الأموال في شوبينج بلس؟',
    a: 'يمكنك إرجاع أي منتج تم شراؤه خلال 14 يوماً من تاريخ الاستلام مجاناً، بشرط أن يكون المنتج بحالته الأصلية وبتغليفه الأصلي. يمكنك طلب الإرجاع بسهولة وسيصلك المندوب لاستلام الشحنة وإعادة أموالك.'
  },
  {
    id: 4,
    category: 'payment',
    q: 'هل يمكنني فحص المنتج قبل الدفع والاستلام؟',
    a: 'نعم بكل تأكيد! يحق لك دائماً معاينة وفحص الشحنة بحضور مندوب التوصيل قبل دفع المبلغ نقداً عند الاستلام.'
  },
  {
    id: 5,
    category: 'payment',
    q: 'ما هي وسائل الدفع الإلكترونية المتاحة؟',
    a: 'ندعم الدفع نقداً عند الاستلام (COD)، بطاقات فيزا وماستركارد وميزة، محافظ الهاتف الذكي (فودافون كاش، أورنج، إتصالات كاش)، وشبكة إنستاباي (InstaPay)، بالإضافة إلى ماكينات فوري.'
  },
  {
    id: 6,
    category: 'warranty',
    q: 'هل جميع المنتجات أصلية وتتمتع بالضمان؟',
    a: 'جميع المنتجات المعروضة على شوبينج بلس مضمونة وأصلية 100% وتخضع لضمان الوكلاء المعتمدين في مصر لمدة تتراوح بين عام إلى عامين حسب نوع المنتج.'
  }
];

export default function HelpPage({ onContinueShopping }) {
  const [activeFaq, setActiveFaq] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useModal();

  const filteredFaqs = FAQ_LIST.filter((faq) => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      showAlert({
        title: 'تم إرسال رسالتك بنجاح',
        message: 'شكراً لتواصلك مع شوبينج بلس مصر! تم استلام رسالتك وسيقوم أحد ممثلي خدمة العملاء بالرد عليك خلال ساعتين.',
        type: 'success',
        confirmText: 'حسناً، شكراً لكم'
      });
    }, 600);
  };

  return (
    <div className="help-page-wrapper">
      {/* Breadcrumb */}
      <div className="cart-page-breadcrumb">
        <button type="button" onClick={onContinueShopping} className="crumb-link">
          <i className="fa-solid fa-house" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
          الرئيسية
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">مركز المساعدة والدعم الفني</span>
      </div>

      {/* Hero Banner */}
      <section className="help-hero-banner">
        <div className="hero-content">
          <h1>مركز مساعدة شوبينج بلس مصر</h1>
          <p>نحن هنا لمساعدتك! كيف يمكننا خدمتك اليوم؟</p>

          <div className="help-search-box">
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#75757a', fontSize: '17px', marginRight: '6px' }}></i>
            <input 
              type="text" 
              placeholder="ابحث عن سؤال أو استفسار (مثال: شحن، إرجاع، دفع)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Category Topics */}
      <section className="help-categories-grid">
        <div className="help-topic-card" onClick={() => setSearchTerm('شحن')}>
          <div className="topic-icon" style={{ color: '#f68b1e' }}>
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <h3>الشحن والتوصيل</h3>
          <p>أوقات الشحن، التوصيل السريع مع بلس إكسبريس، وحد الشحن المجاني.</p>
        </div>

        <div className="help-topic-card" onClick={() => setSearchTerm('إرجاع')}>
          <div className="topic-icon" style={{ color: '#276076' }}>
            <i className="fa-solid fa-rotate-left"></i>
          </div>
          <h3>الإرجاع والاستبدال</h3>
          <p>سياسة الإرجاع خلال 14 يوماً واسترداد المبالغ المالية.</p>
        </div>

        <div className="help-topic-card" onClick={() => setSearchTerm('دفع')}>
          <div className="topic-icon" style={{ color: '#f68b1e' }}>
            <i className="fa-solid fa-credit-card"></i>
          </div>
          <h3>طرق الدفع والفواتير</h3>
          <p>الدفع عند الاستلام، البطاقات البنكية، فوري وإنستاباي.</p>
        </div>

        <div className="help-topic-card" onClick={() => setSearchTerm('ضمان')}>
          <div className="topic-icon" style={{ color: '#15803d' }}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h3>الضمان والأصالة</h3>
          <p>منتجات أصلية 100% ومراكز الصيانة المعتمدة في مصر.</p>
        </div>

        <div className="help-topic-card" onClick={() => setSearchTerm('طلب')}>
          <div className="topic-icon" style={{ color: '#f68b1e' }}>
            <i className="fa-solid fa-box"></i>
          </div>
          <h3>تتبع الطلبيات</h3>
          <p>معرفة حالة شحنتك، تعديل موعد الاستلام أو إلغاء الطلب.</p>
        </div>

        <div className="help-topic-card" onClick={() => setSearchTerm('')}>
          <div className="topic-icon" style={{ color: '#75757a' }}>
            <i className="fa-solid fa-user-gear"></i>
          </div>
          <h3>الحساب والخصوصية</h3>
          <p>تعديل بيانات الحساب، كلمات المرور، والعناوين المسجلة.</p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="help-faq-section">
        <div className="faq-section-header">
          <h2>الأسئلة الأكثر تكراراً (FAQ)</h2>
          <p>إليك إجابات سريعة لأهم الاستفسارات التي تهم المتسوقين</p>
        </div>

        <div className="faq-accordion-list">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-search">
              <p>لم نجد نتائج مطابقة لبحثك عن "{searchTerm}". تصفح الأسئلة أدناه أو تواصل مع فريقنا مباشرة.</p>
              <button type="button" className="retry-btn" onClick={() => setSearchTerm('')}>عرض كل الأسئلة</button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div key={faq.id} className={`faq-item-card ${isOpen ? 'open' : ''}`}>
                  <button 
                    type="button" 
                    className="faq-question-btn"
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  >
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-toggle-icon">
                      <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`} style={{ fontSize: '14px' }}></i>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Channels & Support Contact */}
      <section className="help-contact-wrap">
        <div className="contact-info-col">
          <h2>تواصل مباشرة مع فريق الدعم</h2>
          <p>فريق خدمة عملاء شوبينج بلس مصر متاح دائماً للإجابة على جميع استفساراتكم بكل سرور.</p>

          <div className="channels-list">
            <div className="channel-box">
              <span className="ch-icon" style={{ color: '#f68b1e' }}>
                <i className="fa-solid fa-headset"></i>
              </span>
              <div>
                <strong>الخط الساخن الموحد</strong>
                <p>19555 (من 9 صباحاً حتى 9 مساءً طوال أيام الأسبوع)</p>
              </div>
            </div>

            <div className="channel-box">
              <span className="ch-icon" style={{ color: '#25d366' }}>
                <i className="fa-brands fa-whatsapp"></i>
              </span>
              <div>
                <strong>واتساب الدعم الفني</strong>
                <p>0100 123 4567 (محادثة فورية على مدار الساعة)</p>
              </div>
            </div>

            <div className="channel-box">
              <span className="ch-icon" style={{ color: '#ea4335' }}>
                <i className="fa-regular fa-envelope"></i>
              </span>
              <div>
                <strong>البريد الإلكتروني</strong>
                <p>support@shoppingplus.eg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Box */}
        <div className="contact-form-col">
          <div className="contact-card">
            <h3>أرسل لنا استفسارك أو اقتراحك</h3>
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label>الاسم الكامل</label>
                <input 
                  type="text" 
                  placeholder="أدخل اسمك"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني أو الهاتف</label>
                <input 
                  type="text" 
                  placeholder="example@mail.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>موضوع الرسالة</label>
                <input 
                  type="text" 
                  placeholder="استفسار عن شحنة، شكوى، أو اقتراح"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>تفاصيل الرسالة</label>
                <textarea 
                  rows="4" 
                  placeholder="اكتب استفسارك بالتفصيل وسيقوم ممثل خدمة العملاء بالرد عليك فوراً..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="jumia-checkout-btn"
                disabled={submitted}
              >
                {submitted ? 'جاري إرسال الرسالة...' : 'إرسال الرسالة إلى الدعم'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Return to Shop CTA */}
      <div className="help-back-bar">
        <button type="button" onClick={onContinueShopping} className="continue-link-btn">
          <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
          العودة للصفحة الرئيسية ومواصلة التسوق
        </button>
      </div>

    </div>
  );
}
