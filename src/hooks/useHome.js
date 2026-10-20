import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Custom Hook: useHome
 * Handles all dynamic Home Page logic:
 * 1. Shopping Plus Bespoke Hero Slider (100% custom branded for Shopping Plus Egypt)
 * 2. Real-time Flash Deals Countdown Timer
 * 3. The 6 Custom Deal Shortcut Cards (Bespoke vector & CSS stylized without any third-party logos)
 */
export function useHome({ products = [], activeCategory, onSelectCategory }) {
  // 1. Bespoke Hero Slides (Branded purely for Shopping Plus Egypt)
  const slides = useMemo(() => [
    {
      id: 1,
      brandBadge: 'مهرجان التخفيضات الكبرى ★',
      title: 'مهرجان التسوق الأكبر • Mega Shopping Festival',
      discountBadge: 'خصومات حتى 70%',
      subtitle: 'أضخم موسم عروض وتخفيضات في مصر على العطور، مستحضرات التجميل، والأجهزة مع هدايا وعينات مجانية',
      ctaText: 'تسوق عروض المهرجان الآن',
      categoryTarget: 'beauty',
      bgTheme: 'festival-glow',
      image: '/hero/mega-festival-banner.jpg',
      badgeTag: 'أقوى عروض العام',
      badgeIcon: 'fa-solid fa-fire',
      productsShowcase: [
        { name: 'عطور ومستحضرات', icon: 'fa-solid fa-spray-can-sparkles' },
        { name: 'إلكترونيات وموبايل', icon: 'fa-solid fa-mobile-screen' },
        { name: 'هدايا وجوائز', icon: 'fa-solid fa-gift' }
      ]
    },
    {
      id: 2,
      brandBadge: 'عروض الجمعة البيضاء الكبرى ★',
      title: 'مهرجان صفقات الجمعة البيضاء • White Friday Sale',
      discountBadge: 'وفر حتى 80%',
      subtitle: 'أقوى صفقات السنة على الأجهزة، الشاشات، مستلزمات البيت، والأثاث بأسعار الجملة مع تقسيط 0% فوائد',
      ctaText: 'اكتشف صفقات الجمعة البيضاء',
      categoryTarget: 'furniture',
      bgTheme: 'white-friday',
      image: '/hero/white-friday-banner.jpg',
      badgeTag: 'خصومات حصرية 80%',
      badgeIcon: 'fa-solid fa-bolt-lightning',
      productsShowcase: [
        { name: 'شاشات وأجهزة', icon: 'fa-solid fa-tv' },
        { name: 'أثاث وديكور', icon: 'fa-solid fa-couch' },
        { name: 'شحن مجاني', icon: 'fa-solid fa-truck-fast' }
      ]
    },
    {
      id: 3,
      brandBadge: 'بلس سوبر إكسبريس ★',
      title: 'عروض التوفير ومستلزمات البيت اليومية',
      discountBadge: 'خصم حتى 50%',
      subtitle: 'كل ما يحتاجه بيتك بأسعار الجملة مع توصيل فوري فائق السرعة خلال 24 ساعة لجميع المحافظات',
      ctaText: 'تسوق عروض السوبرماركت',
      categoryTarget: 'groceries',
      bgTheme: 'groceries-warm',
      image: '/hero/groceries-hero.jpg',
      badgeTag: 'توصيل فوري 24 ساعة',
      badgeIcon: 'fa-solid fa-truck-fast',
      productsShowcase: [
        { name: 'سوبرماركت', icon: 'fa-solid fa-basket-shopping' },
        { name: 'مستلزمات يومية', icon: 'fa-solid fa-box-open' },
        { name: 'شحن سريع', icon: 'fa-solid fa-truck-fast' }
      ]
    }
  ], []);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto-advance slider every 5s with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // 2. Real-Time Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 11, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedCountdown = useMemo(() => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(timeLeft.hours)} : ${pad(timeLeft.minutes)} : ${pad(timeLeft.seconds)}`;
  }, [timeLeft]);

  // 3. Custom Deal Cards (Bespoke Shopping Plus design, no external branding)
  const dealCards = useMemo(() => [
    {
      id: 'black-friday',
      title: 'بلس فرايداي',
      subtitle: '30 يوم عروض كبرى',
      type: 'black-friday',
      centerBadge: 'استنونا',
      theme: 'dark-vip',
      pillText: 'المهرجان الأكبر ←'
    },
    {
      id: 'flash-sale',
      title: 'فلاش سيل',
      subtitle: 'عروض محدودة',
      icon: 'fa-solid fa-bolt-lightning',
      type: 'flash-sale',
      theme: 'warm-peach',
      pillText: 'لفترة محدودة ←'
    },
    {
      id: 'first-order',
      title: 'أول أوردر؟',
      subtitle: 'كود خصم 50 جنيه',
      icon: 'fa-solid fa-gift',
      type: 'coupon',
      couponCode: 'PLUS50',
      theme: 'warm-peach',
      pillText: 'كود خصم ←'
    },
    {
      id: 'brands-60',
      title: 'براندات عالمية',
      subtitle: 'أصلية 100%',
      icon: 'fa-solid fa-gem',
      type: 'brands',
      theme: 'warm-peach',
      pillText: 'خصم حتى 60% ←'
    },
    {
      id: 'points',
      title: 'استبدل نقاطك',
      subtitle: 'بلس ريواردز',
      icon: 'fa-solid fa-coins',
      type: 'points',
      theme: 'warm-peach',
      pillText: 'استبدل نقاطك ←'
    },
    {
      id: 'best-prices',
      title: 'أفضل الأسعار',
      subtitle: 'ضمان التوفير',
      icon: 'fa-solid fa-tags',
      type: 'best-prices',
      theme: 'warm-peach',
      pillText: 'برة المنافسة ←'
    }
  ], []);

  return {
    slides,
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    isPaused,
    setIsPaused,
    timeLeft,
    formattedCountdown,
    dealCards
  };
}
