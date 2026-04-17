/**
 * 喫茶まほろば LP - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation background effect on scroll
  const nav = document.querySelector('.glass-nav');

  // Guard: nav が DOM に存在しない場合は何もしない
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // 2. Intersection Observer for fade-in animations
  const fadeElements = document.querySelectorAll('.fade-in');

  // IntersectionObserver 非対応ブラウザでは即座に表示
  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(el => el.classList.add('visible'));
  } else {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(element => observer.observe(element));
  }
});
