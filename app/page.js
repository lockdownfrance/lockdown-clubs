'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  useEffect(() => {
    // Custom cursor
    const cursor = document.getElementById('lf-cursor')
    const ring = document.getElementById('lf-ring')
    if (!cursor || !ring) return
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = e => {
      mx = e.clientX; my = e.clientY
      cursor.style.left = mx + 'px'
      cursor.style.top = my + 'px'
    }
    document.addEventListener('mousemove', onMove)
    let raf
    const animRing = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      raf = requestAnimationFrame(animRing)
    }
    animRing()

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80)
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    reveals.forEach(el => io.observe(el))

    // Nav scroll
    const nav = document.querySelector('.lf-nav')
    const onScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <>
      <style>{`
        :root {
          --black:#080808;--off:#111111;--dark:#1A1A1A;--border:#222222;
          --mid:#333333;--muted:#666666;--light:#999999;--snow:#E8E8E8;
          --white:#F4F4F4;--pure:#FFFFFF;--purple:#7B2FFF;--purple2:#9B5FFF;
          --glow:rgba(123,47,255,0.5);--glow2:rgba(123,47,255,0.15);
        }
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:var(--black);color:var(--white);font-family:'DM Mono',monospace;overflow-x:hidden;-webkit-font-smoothing:antialiased;cursor:crosshair}

        /* CURSOR */
        .lf-cursor{width:8px;height:8px;background:var(--purple);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .2s,height .2s,background .2s;box-shadow:0 0 12px var(--glow)}
        .lf-ring{width:36px;height:36px;border:1px solid rgba(123,47,255,0.4);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .3s,height .3s}
        body:has(a:hover) .lf-cursor,body:has(button:hover) .lf-cursor{width:16px;height:16px;background:var(--pure)}

        /* NAV */
        .lf-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:stretch;justify-content:space-between;border-bottom:1px solid var(--border);background:rgba(8,8,8,0.92);backdrop-filter:blur(12px)}
        .lf-nav.scrolled{border-bottom-color:var(--mid)}
        .nav-logo{display:flex;align-items:center;gap:10px;padding:0 28px;border-right:1px solid var(--border);text-decoration:none;height:60px}
        .nav-logo-text{font-family:'Unbounded',sans-serif;font-size:13px;font-weight:900;color:var(--white);letter-spacing:-0.5px}
        .nav-logo-dot{width:6px;height:6px;border-radius:50%;background:var(--purple);box-shadow:0 0 12px var(--glow)}
        .nav-links{display:flex;list-style:none;align-items:center;gap:0;padding:0 20px}
        .nav-links a{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;padding:0 16px;height:60px;display:flex;align-items:center;color:var(--muted);text-decoration:none;transition:color .2s}
        .nav-links a:hover{color:var(--white)}
        .nav-cta{margin:12px 20px;padding:0 20px;background:var(--purple);color:var(--white);font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;display:flex;align-items:center;transition:background .2s}
        .nav-cta:hover{background:var(--purple2)}

        /* HERO */
        .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:100px 80px 60px;position:relative;overflow:hidden;border-bottom:1px solid var(--border)}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:80px 80px;opacity:.3;pointer-events:none}
        .hero-orb{position:absolute;top:-200px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(123,47,255,0.15) 0%,transparent 70%);pointer-events:none}
        .hero-content{position:relative;z-index:1}
        .hero-eyebrow{display:flex;align-items:center;gap:12px;font-size:10px;letter-spacing:3px;color:var(--muted);text-transform:uppercase;margin-bottom:40px}
        .hero-eyebrow span{width:32px;height:1px;background:var(--purple)}
        .hero-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(80px,14vw,180px);font-weight:900;line-height:.88;letter-spacing:-3px;text-transform:uppercase}
        .line-solid{display:block;color:var(--white)}
        .line-outline{display:block;-webkit-text-stroke:2px var(--white);color:transparent}
        .line-purple{display:block;color:var(--purple)}
        .hero-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;position:relative;z-index:1;flex-wrap:wrap}
        .hero-desc{max-width:480px;font-size:13px;line-height:1.8;color:var(--light)}
        .hero-desc strong{color:var(--snow)}
        .hero-actions{display:flex;gap:12px;flex-shrink:0;flex-wrap:wrap}
        .btn-primary{display:flex;align-items:center;gap:12px;padding:16px 28px;background:var(--purple);color:var(--white);text-decoration:none;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;transition:background .2s}
        .btn-primary:hover{background:var(--purple2)}
        .btn-primary .arrow{transition:transform .2s}
        .btn-primary:hover .arrow{transform:translateX(4px)}
        .btn-secondary{display:flex;align-items:center;padding:16px 28px;border:1px solid var(--border);color:var(--muted);text-decoration:none;font-size:11px;letter-spacing:2px;text-transform:uppercase;transition:all .2s}
        .btn-secondary:hover{border-color:var(--mid);color:var(--white)}
        .scroll-line{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);font-size:8px;letter-spacing:4px;text-transform:uppercase;color:var(--mid);writing-mode:vertical-rl}

        /* TICKER */
        .ticker{height:44px;background:var(--off);border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;display:flex;align-items:center}
        .ticker-track{display:flex;gap:0;white-space:nowrap;animation:ticker 40s linear infinite}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .ticker-item{display:flex;align-items:center;gap:8px;padding:0 32px;font-size:10px;letter-spacing:1.5px;color:var(--muted);border-right:1px solid var(--border)}
        .ticker-item .dot{width:5px;height:5px;border-radius:50%;background:var(--mid)}
        .ticker-item.live .dot{background:var(--purple);box-shadow:0 0 8px var(--glow);animation:pulse 1.5s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

        /* MODULES */
        .modules{padding:80px}
        .modules-header{margin-bottom:64px}
        .modules-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(40px,6vw,80px);font-weight:900;line-height:.9;letter-spacing:-2px;text-transform:uppercase;margin-bottom:16px}
        .t-white{display:block;color:var(--white)}
        .t-outline{display:block;-webkit-text-stroke:1.5px var(--border);color:transparent}
        .modules-desc{font-size:12px;color:var(--muted);max-width:480px;line-height:1.8;margin-top:16px}
        .modules-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px}
        .module-card{background:var(--off);border:1px solid var(--border);padding:48px;position:relative;overflow:hidden;transition:border-color .3s}
        .module-card:hover{border-color:var(--mid)}
        .module-card.wide{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:48px}
        .module-bg-num{position:absolute;top:-20px;right:20px;font-family:'Barlow Condensed',sans-serif;font-size:160px;font-weight:900;color:var(--dark);line-height:1;pointer-events:none;user-select:none}
        .module-index{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--purple);margin-bottom:20px}
        .module-icon{font-size:28px;display:block;margin-bottom:16px}
        .module-name{font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:900;line-height:.9;color:var(--white);text-transform:uppercase;letter-spacing:-1px;margin-bottom:20px}
        .module-line{width:40px;height:2px;background:var(--purple);margin-bottom:20px}
        .module-desc{font-size:11px;color:var(--muted);line-height:1.8;margin-bottom:24px}
        .module-tags{display:flex;flex-wrap:wrap;gap:6px}
        .tag{font-size:8px;letter-spacing:2px;text-transform:uppercase;padding:5px 10px;border:1px solid var(--border);color:var(--mid)}
        .module-visual{display:flex;flex-direction:column;justify-content:center}
        .score-preview{background:var(--dark);border:1px solid var(--border);padding:20px 24px;display:flex;align-items:center;justify-content:space-between}
        .score-live{font-size:8px;letter-spacing:2px;color:var(--purple);margin-bottom:6px}
        .score-teams{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:var(--snow)}
        .score-info{font-size:9px;color:var(--muted);letter-spacing:1px;margin-top:3px}
        .score-num{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:var(--white);letter-spacing:-1px}

        /* REVEAL */
        .reveal{opacity:0;transform:translateY(24px);transition:opacity .6s,transform .6s}
        .reveal.visible{opacity:1;transform:none}

        /* MANIFESTO */
        .manifesto{padding:120px 80px;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .manifesto-inner{max-width:900px}
        .manifesto-tag{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--purple);margin-bottom:32px}
        .manifesto-text{font-family:'Barlow Condensed',sans-serif;font-size:clamp(36px,5vw,64px);font-weight:900;line-height:1.1;text-transform:uppercase}
        .w{color:var(--white)}.o{-webkit-text-stroke:1.5px var(--border);color:transparent}.p{color:var(--purple)}
        .manifesto-sub{font-size:13px;color:var(--muted);line-height:1.9;max-width:600px;margin-top:32px}

        /* CTA */
        .cta-section{padding:120px 80px;position:relative;overflow:hidden;border-bottom:1px solid var(--border)}
        .cta-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(123,47,255,.2) 0%,transparent 60%);pointer-events:none}
        .cta-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:1}
        .cta-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;text-transform:uppercase;line-height:.85}
        .line-1{display:block;font-size:clamp(48px,8vw,100px);-webkit-text-stroke:2px var(--border);color:transparent}
        .line-2{display:block;font-size:clamp(48px,8vw,100px);color:var(--white)}
        .line-3{display:block;font-size:clamp(36px,6vw,80px);color:var(--purple)}
        .cta-desc{font-size:13px;color:var(--muted);line-height:1.9;margin-bottom:32px}
        .cta-btn{display:inline-flex;align-items:center;gap:16px;padding:18px 32px;background:var(--purple);color:var(--white);text-decoration:none;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;transition:background .2s}
        .cta-btn:hover{background:var(--purple2)}

        /* FOOTER */
        footer{padding:48px 80px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
        .footer-logo{font-family:'Unbounded',sans-serif;font-size:16px;font-weight:900;color:var(--white);letter-spacing:-0.5px}
        .footer-logo span{color:var(--purple)}
        .footer-tagline{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--mid)}
        .footer-copy{font-size:9px;color:var(--dark);letter-spacing:1px}

        @media(max-width:900px){
          .hero{padding:80px 24px 48px}
          .modules{padding:48px 24px}
          .modules-grid{grid-template-columns:1fr}
          .module-card.wide{grid-column:auto;display:block}
          .cta-section{padding:80px 24px}
          .cta-inner{grid-template-columns:1fr}
          footer{padding:32px 24px;flex-direction:column;gap:16px;text-align:center}
          .nav-links{display:none}
        }
      `}</style>

      <div className="lf-cursor" id="lf-cursor" />
      <div className="lf-ring" id="lf-ring" />

      {/* NAV */}
      <nav className="lf-nav">
        <a href="#" className="nav-logo">
          <span className="nav-logo-text">LOCKDOWN</span>
          <div className="nav-logo-dot" />
        </a>
        <ul className="nav-links">
          <li><a href="#modules">Modules</a></li>
          <li><a href="#shop">Shop</a></li>
          <li><Link href="/clubs">Clubs</Link></li>
          <li><a href="#scores">Scores</a></li>
        </ul>
        <a href="#early" className="nav-cta">Early Access</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-orb" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span />
            Football Américain · France · Hub
          </div>
          <h1 className="hero-title">
            <span className="line-solid">LOCK</span>
            <span className="line-outline">DOWN</span>
            <span className="line-purple">FRANCE</span>
          </h1>
        </div>
        <div className="hero-bottom">
          <p className="hero-desc">
            La première plateforme française dédiée au football américain. <strong>Équipement, scores en direct, profils joueurs, annuaire des clubs</strong> — tout ce qui manquait, enfin au même endroit.
          </p>
          <div className="hero-actions">
            <a href="#early" className="btn-primary">
              Rejoindre l'early access
              <span className="arrow">→</span>
            </a>
            <a href="#modules" className="btn-secondary">Découvrir la plateforme ↓</a>
          </div>
        </div>
        <div className="scroll-line">Défiler</div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          <div className="ticker-item live"><div className="dot" /> LIVE · Chiefs 31 — 24 Eagles · Q4 2:14</div>
          <div className="ticker-item"><div className="dot" /> FFFA D1 · Panthers Paris 35 — 14 Argonautes Lyon</div>
          <div className="ticker-item"><div className="dot" /> Shop · Riddell SpeedFlex 2026 disponible</div>
          <div className="ticker-item"><div className="dot" /> 142 clubs référencés en France</div>
          <div className="ticker-item"><div className="dot" /> NFL Draft 2026 · Top 5 prospects analysés</div>
          <div className="ticker-item"><div className="dot" /> Nouvelle saison FFFA · Résultats en direct bientôt</div>
          <div className="ticker-item live"><div className="dot" /> LIVE · Chiefs 31 — 24 Eagles · Q4 2:14</div>
          <div className="ticker-item"><div className="dot" /> FFFA D1 · Panthers Paris 35 — 14 Argonautes Lyon</div>
          <div className="ticker-item"><div className="dot" /> Shop · Riddell SpeedFlex 2026 disponible</div>
          <div className="ticker-item"><div className="dot" /> 142 clubs référencés en France</div>
          <div className="ticker-item"><div className="dot" /> NFL Draft 2026 · Top 5 prospects analysés</div>
          <div className="ticker-item"><div className="dot" /> Nouvelle saison FFFA · Résultats en direct bientôt</div>
        </div>
      </div>

      {/* MODULES */}
      <section className="modules" id="modules">
        <div className="modules-header reveal">
          <h2 className="modules-title">
            <span className="t-white">4 RAISONS</span>
            <span className="t-outline">DE REVENIR</span>
          </h2>
          <p className="modules-desc">Chaque module répond à un manque réel du marché français. Ensemble, ils forment quelque chose d'unique.</p>
        </div>
        <div className="modules-grid">

          <div className="module-card reveal" id="shop">
            <div className="module-bg-num">01</div>
            <div className="module-index">01 · Priorité</div>
            <span className="module-icon">🛒</span>
            <h3 className="module-name">Shop<br/>Équipement</h3>
            <div className="module-line" />
            <p className="module-desc">Casques, épaulières, ballons, maillots. Une sélection curatée pour le marché français — tailles européennes, livraison rapide, conseils adaptés aux règles FFFA. Fini les commandes depuis les États-Unis avec 3 semaines d'attente.</p>
            <div className="module-tags">
              <span className="tag">Casques</span>
              <span className="tag">Épaulières</span>
              <span className="tag">Ballons</span>
              <span className="tag">Maillots</span>
            </div>
          </div>

          <div className="module-card reveal" id="scores">
            <div className="module-bg-num">02</div>
            <div className="module-index">02 · Live</div>
            <span className="module-icon">📡</span>
            <h3 className="module-name">Scores<br/>& Résultats</h3>
            <div className="module-line" />
            <p className="module-desc">NFL en temps réel + résultats FFFA centralisés. Plus besoin de chercher sur 5 groupes WhatsApp pour trouver le score du match d'hier soir.</p>
            <div className="module-tags">
              <span className="tag">NFL Live</span>
              <span className="tag">FFFA D1</span>
              <span className="tag">Stats</span>
            </div>
          </div>

          <div className="module-card wide reveal" id="clubs">
            <div>
              <div className="module-bg-num">03</div>
              <div className="module-index">03 · Communauté</div>
              <span className="module-icon">🗺️</span>
              <h3 className="module-name">Annuaire<br/>des Clubs</h3>
              <div className="module-line" />
              <p className="module-desc">Carte interactive des 142 clubs FFFA en France. Trouve ton club le plus proche, consulte l'effectif, le calendrier, les contacts. Et si tu cherches un club, ils te trouvent aussi.</p>
              <div className="module-tags">
                <span className="tag">Carte France</span>
                <span className="tag">142 clubs</span>
                <span className="tag">Profils joueurs</span>
                <span className="tag">Recrutement</span>
              </div>
              <Link href="/clubs" style={{display:'inline-flex',alignItems:'center',gap:'12px',marginTop:'28px',padding:'14px 24px',background:'var(--purple)',color:'var(--white)',textDecoration:'none',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase'}}>
                Voir l'annuaire <span>→</span>
              </Link>
            </div>
            <div className="module-visual">
              <div className="score-preview">
                <div>
                  <div className="score-live">● Live NFL</div>
                  <div className="score-teams">Chiefs · Eagles</div>
                  <div className="score-info">Q4 · 2:14 restantes</div>
                </div>
                <div className="score-num">31 — 24</div>
              </div>
              <div className="score-preview" style={{marginTop:'2px'}}>
                <div>
                  <div style={{fontSize:'8px',letterSpacing:'2px',color:'var(--muted)',marginBottom:'6px'}}>FFFA D1 · TERMINÉ</div>
                  <div className="score-teams">Panthers Paris</div>
                  <div className="score-info">vs Argonautes Lyon</div>
                </div>
                <div className="score-num" style={{fontSize:'22px'}}>35 — 14</div>
              </div>
              <div className="score-preview" style={{marginTop:'2px',opacity:0.5}}>
                <div>
                  <div style={{fontSize:'8px',letterSpacing:'2px',color:'var(--purple)',marginBottom:'6px'}}>À VENIR · SAM 18H</div>
                  <div className="score-teams">Lions Nantes</div>
                  <div className="score-info">vs Cougars Rennes</div>
                </div>
                <div style={{fontSize:'11px',letterSpacing:'1px',color:'var(--muted)'}}>Diffusion →</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <div className="manifesto-inner reveal">
          <div className="manifesto-tag">Pourquoi LOCKDOWN</div>
          <p className="manifesto-text">
            <span className="w">Le corner est la position </span>
            <span className="o">la plus ingrate </span>
            <span className="p">du terrain.</span>
          </p>
          <p className="manifesto-text" style={{marginTop:'8px'}}>
            <span className="w">Ce hub aussi </span>
            <span className="o">était invisible. </span>
            <span className="p">Plus maintenant.</span>
          </p>
          <p className="manifesto-sub">
            Tout ce qui existait pour le foot américain en France était fragmenté, incomplet, invisible. LOCKDOWN centralise — pour les joueurs, les fans, les clubs, et ceux qui n'ont encore jamais osé se lancer.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="early">
        <div className="cta-bg" />
        <div className="cta-inner">
          <div className="cta-title reveal">
            <span className="line-1">SOIS</span>
            <span className="line-2">PARMI</span>
            <span className="line-3">LES PREMIERS.</span>
          </div>
          <div className="cta-right reveal">
            <p className="cta-desc">
              La plateforme est en construction. Les 100 premiers inscrits obtiennent le statut <strong style={{color:'var(--snow)'}}>Fondateur</strong> — profil mis en avant, accès prioritaire à chaque nouveau module, et un mot à dire sur ce qu'on construit.
            </p>
            <a href="mailto:contact@lockdownfrance.fr" className="cta-btn">
              Rejoindre l'early access <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">LOCK<span>DOWN</span> FRANCE</div>
        <div className="footer-tagline">Ingrat · Invisible · Indispensable</div>
        <div className="footer-copy">© 2026 Lockdown France</div>
      </footer>
    </>
  )
}
