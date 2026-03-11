import Link from 'next/link'
import clubs from '../../data/clubs.json'

export const metadata = { title: 'Clubs — LOCKDOWN FRANCE' }

export default function ClubsPage() {
  const regions = Array.from(new Set(clubs.map(c => c.region))).sort()

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        .gnav{position:sticky;top:0;z-index:100;display:flex;align-items:stretch;height:52px;background:rgba(6,8,10,0.95);backdrop-filter:blur(16px);border-bottom:1px solid #1F2330}
        .gnav-logo{display:flex;align-items:center;gap:10px;padding:0 28px;border-right:1px solid #1F2330;text-decoration:none}
        .gnav-logo-text{font-family:'Unbounded',sans-serif;font-size:12px;font-weight:900;color:#F5F8FF;letter-spacing:-0.5px}
        .gnav-dot{width:5px;height:5px;border-radius:50%;background:#7B2FFF;box-shadow:0 0 10px rgba(123,47,255,0.6)}
        .gnav-links{display:flex;align-items:center;flex:1;padding:0 20px;gap:2px}
        .gnav-link{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;color:#55607A;text-decoration:none;transition:color 0.2s}
        .gnav-link:hover,.gnav-link.active{color:#F5F8FF}
        .gnav-link.active{border-bottom:2px solid #7B2FFF;margin-bottom:-1px}
        .hero{padding:80px;border-bottom:1px solid #1F2330}
        .hero h1{font-family:'Barlow Condensed',sans-serif;font-size:80px;font-weight:900;line-height:0.9;letter-spacing:-2px;color:#F5F8FF;text-transform:uppercase;margin-bottom:16px}
        .hero p{font-size:12px;color:#55607A;letter-spacing:1px;margin-bottom:32px}
        .hero-stats{display:flex;gap:2px}
        .hstat{padding:16px 28px;border:1px solid #1F2330;background:#0E1014}
        .hstat-n{font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;color:#7B2FFF}
        .hstat-l{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#55607A;margin-top:2px}
        .region-section{padding:48px 80px}
        .region-title{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;color:#F5F8FF;text-transform:uppercase;padding-bottom:12px;border-bottom:1px solid #1F2330;margin-bottom:2px}
        .region-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:2px;margin-top:2px}
        .club-card{display:flex;align-items:center;gap:16px;padding:18px 22px;background:#0E1014;border:1px solid #1F2330;text-decoration:none;transition:all 0.15s;position:relative;overflow:hidden}
        .club-card:hover{background:#151820;border-color:#2A2E3A}
        .club-accent{position:absolute;left:0;top:0;bottom:0;width:3px;opacity:0;transition:opacity 0.15s}
        .club-card:hover .club-accent{opacity:1}
        .club-emoji{width:44px;height:44px;background:#151820;border:1px solid #1F2330;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .club-name{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:#C8D0E0;line-height:1.1}
        .club-card:hover .club-name{color:#F5F8FF}
        .club-loc{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#55607A;margin-top:3px}
        .club-arrow{margin-left:auto;color:#1F2330;font-size:14px;flex-shrink:0;transition:color 0.15s}
        .club-card:hover .club-arrow{color:#7B2FFF}
        @media(max-width:768px){.hero,.region-section{padding:32px 24px}.hero h1{font-size:52px}}
      `}</style>

      <nav className="gnav">
        <Link href="/" className="gnav-logo">
          <span className="gnav-logo-text">LOCKDOWN</span>
          <div className="gnav-dot" />
        </Link>
        <div className="gnav-links">
          <Link href="/clubs" className="gnav-link active">Clubs</Link>
          <span className="gnav-link">Scores</span>
          <span className="gnav-link">Joueurs</span>
          <span className="gnav-link">Actus</span>
          <span className="gnav-link">NFL</span>
        </div>
      </nav>

      <section className="hero">
        <h1>Clubs<br/>France</h1>
        <p>Toutes les équipes de football américain licenciées FFFA</p>
        <div className="hero-stats">
          <div className="hstat"><div className="hstat-n">{clubs.length}</div><div className="hstat-l">Clubs recensés</div></div>
          <div className="hstat"><div className="hstat-n">{regions.length}</div><div className="hstat-l">Régions</div></div>
          <div className="hstat"><div className="hstat-n">220+</div><div className="hstat-l">Objectif total</div></div>
        </div>
      </section>

      {regions.map(region => {
        const regionClubs = clubs.filter(c => c.region === region)
        return (
          <section key={region} className="region-section">
            <div className="region-title">
              {region} <span style={{fontSize:'13px',color:'#55607A',fontWeight:400,letterSpacing:'2px'}}>· {regionClubs.length} clubs</span>
            </div>
            <div className="region-grid">
              {regionClubs.map(club => (
                <Link key={club.slug} href={`/clubs/${club.slug}`} className="club-card">
                  <div className="club-accent" style={{background: club.color1}} />
                  <div className="club-emoji">🏈</div>
                  <div>
                    <div className="club-name">{club.nom}</div>
                    <div className="club-loc">{club.ville} · {club.dept}</div>
                  </div>
                  <div className="club-arrow">→</div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
