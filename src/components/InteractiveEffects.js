'use client';
import { useEffect } from 'react';

export default function InteractiveEffects() {
  useEffect(() => {
    /* ── CUSTOM CURSOR ─────────────────────────────────────── */
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    let dot, ring;

    if (!isTouch) {
      dot = document.createElement('div');
      dot.className = 'cursor-dot';
      ring = document.createElement('div');
      ring.className = 'cursor-ring';
      document.body.appendChild(dot);
      document.body.appendChild(ring);

      let mx = -100, my = -100, rx = -100, ry = -100;
      const onMove = (e) => { mx = e.clientX; my = e.clientY; };
      document.addEventListener('mousemove', onMove);

      let raf;
      const lerp = (a, b, t) => a + (b - a) * t;
      const tick = () => {
        rx = lerp(rx, mx, 0.12);
        ry = lerp(ry, my, 0.12);
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Enlarge ring on interactive elements
      const onEnter = () => {
        ring.style.width = '56px';
        ring.style.height = '56px';
        ring.style.borderColor = 'rgba(59,130,246,0.8)';
        dot.style.opacity = '0';
      };
      const onLeave = () => {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(59,130,246,0.5)';
        dot.style.opacity = '1';
      };

      const attachCursor = () => {
        document.querySelectorAll('a, button, .program-card, .news-card, .person-card, .about-card, .tab-btn').forEach(el => {
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
      };
      attachCursor();

      return () => {
        document.removeEventListener('mousemove', onMove);
        cancelAnimationFrame(raf);
        dot?.remove();
        ring?.remove();
      };
    }
  }, []);

  useEffect(() => {
    /* ── SCROLL REVEAL ─────────────────────────────────────── */
    const revealEls = document.querySelectorAll(
      '.program-card, .news-card, .person-card, .about-card, .mission-item, .contact-item, .section-header, .stat-card'
    );

    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    /* ── PARALLAX HERO ─────────────────────────────────────── */
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const bgs = document.querySelectorAll('.slide-bg');
      bgs.forEach(bg => {
        bg.style.transform = `translateY(${scrollY * 0.25}px) scale(1.06)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    /* ── MAGNETIC BUTTONS ──────────────────────────────────── */
    const magneticEls = document.querySelectorAll('.slide-btn, .btn-submit, .add-btn, .save-btn, .login-btn');
    const handlers = [];

    magneticEls.forEach(el => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        el.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
      };
      const onLeave = () => { el.style.transform = ''; };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      handlers.push({ el, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  useEffect(() => {
    /* ── GLOW FOLLOW (cards) ───────────────────────────────── */
    const cards = document.querySelectorAll('.program-card, .news-card, .person-card, .about-card');

    const handlers = [];
    cards.forEach(card => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.background = `radial-gradient(200px circle at ${x}px ${y}px, rgba(37,99,235,0.08), transparent 70%), var(--bg-card)`;
      };
      const onLeave = () => { card.style.background = ''; };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push({ card, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  useEffect(() => {
    /* ── TILT EFFECT (cards) ───────────────────────────────── */
    const cards = document.querySelectorAll('.program-card, .person-card');
    const handlers = [];

    cards.forEach(card => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-5px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        card.style.transition = 'transform 0.1s';
      };
      const onLeave = () => {
        card.style.transform = '';
        card.style.transition = '';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push({ card, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  useEffect(() => {
    /* ── RIPPLE ON CLICK ───────────────────────────────────── */
    const onClick = (e) => {
      const btn = e.target.closest('.slide-btn, .btn-submit, .tab-btn, .add-btn, .save-btn, .login-btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.2);
        transform:scale(0);animation:rippleAnim 0.5s ease-out forwards;
      `;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    };
    document.addEventListener('click', onClick);

    // Add ripple keyframe
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}`;
      document.head.appendChild(style);
    }

    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    /* ── FLOATING PARTICLES (hero section) ─────────────────── */
    const hero = document.querySelector('.hero-slider');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.4';
    hero.style.position = 'relative';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w, h, particles, raf;

    const resize = () => {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.4 - 0.1;
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -5) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${this.alpha})`;
        ctx.fill();
      }
    }

    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.remove();
    };
  }, []);

  return null;
}
