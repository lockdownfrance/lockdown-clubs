'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ClubPage({ club }) {
  const [tab, setTab] = useState('roster')
  const [pos, setPos] = useState('ALL')

  const c1 = club.color1
  const c2 = club.color2
  const r = parseInt(c1.slice(1,3),16)
  const g = parseInt(c1.slice(3,5),16)
  const b = parseInt(c1.slice(5,7),16)
  const rgb = `${r},${g},${b}`

  const posGroups = [
    { pos:'QB', side:'OFF', label:'Quarterback', stats:['Comp%','Yards','TD','INT'],
      players:[
        { name:'T. Martin', num:'#7', ovr:82, tier:'gold', role:'Titulaire · Saison 4', icon:'🏈', stats:['68%','1240','12','4'] },
        { name:'K. Bernard', num:'#12', ovr:71, tier:'silver', role:'Remplaçant · Saison 2', icon:'🏈', stats:['61%','320','3','2'] },
      ]},
    { pos:'WR', side:'OFF', label:'Wide Receiver', stats:['Rec','Yards','TD','Moy'],
      players:[
        { name:'J. Diallo', num:'#1', ovr:90, tier:'elite', role:'All-Star FFFA · Saison 5', icon:'⚡', stats:['52','820','8','15.8'] },
        { name:'A. Lefebvre', num:'#81', ovr:79, tier:'gold', role:'Saison 3', icon:'⚡', stats:['31','410','4','13.2'] },
      ]},
    { pos:'CB', side:'DEF', label:'Cornerback', lockdown:true, stats:['INT','PD','Tckl','TD alloués'],
      players:[
        { name:'R. Mbaye', num:'#21', ovr:93, tier:'elite', role:'Capitaine Défense · Saison 6', icon:'🔒', stats:['4','18','24','0'] },
        { name:'S. Fontaine', num:'#23', ovr:81, tier:'gold', role:'Saison 3', icon:'🔒', stats:['2','11','19','3'] },
      ]},
    { pos:'S', side:'DEF', label:'Safety', stats:['INT','PD','Tckl','FF'],
      players:[
        { name:'N. Dubois', num:'#31', ovr:85, tier:'gold', role:'FS · Saison 4', icon:'👁️', stats:['3','6','42','2'] },
      ]},
    { pos:'LB', side:'DEF', label:'Linebacker', stats:['Tckl','Sack','TFL','FF'],
      players:[
        { name:'F. Laurent', num:'#55', ovr:83, tier:'gold', role:'MLB · Saison 5', icon:'💥', stats:['68','6','11','2'] },
      ]},
  ]

  const tierColor = t => t==='elite' ? c1 : t==='gold' ? '#F5C842' : t==='silver' ? '#8899BB' : '#A0784A'

  const visible = posGroups.filter(g => {
    if (pos==='ALL') return true
    if (pos==='OFF') return g.side==='OFF'
    if (pos==='DEF') return g.side==='DEF'
    return g.pos===pos
  })

  const positions = [
    {id:'ALL',label:'Tous'},{id:'OFF',label:'Attaque'},{id:'DEF',label:'Défense'},
    null,
    {id:'QB',label:'QB'},{id:'RB',label:'RB'},{id:'WR',label:'WR'},{id:'TE',label:'TE'},{id:'OL',label:'OL'},
    null,
    {id:'DL',label:'DL'},{id:'LB',label:'LB'},{id:'CB',label:'CB'},{id:'S',label:'S'},
    null,
    {id:'K',label:'K'},
  ]

  const matches = [
    {week:'Journée 4',date:'08 Mar 2026',home:club.nom,score:'35 – 14',away:'Argonautes Lyon',result:'win',label:'Victoire'},
    {week:'Journée 3',date:'01 Mar 2026',home:'Centurions',score:'21 – 28',away:club.nom,result:'win',label:'Victoire'},
    {week:'Journée 2',date:'22 Fév 2026',home:club.nom,score:'14 – 21',away:'Templiers Paris',result:'loss',label:'Défaite'},
    {week:'Journée 1',date:'15 Fév 2026',home:club.nom,score:'42 – 07',away:'Scorpions Muret',result:'win',label:'Victoire'},
  ]

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--c1:${c1};--c2:${c2};--glow:rgba(${rgb},0.25);--glow2:rgba(${rgb},0.08)}
        .gnav{position:sticky;top:0;z-index:200;display:flex;align-items:stretch;height:52px;background:rgba(6,8,10,0.95);backdrop-filter:blur(16px);border-bottom:1px solid #1F2330}
        .gnav-logo{display:flex;align-items:center;gap:10px;padding:0 28px;border-right:1px solid #1F2330;text-decoration:none}
        .logo-text{font-family:'Unbounded',sans-serif;font-size:12px;font-weight:900;color:#F5F8FF;letter-spacing:-0.5px}
        .logo-dot{width:5px;height:5px;border-radius:50%;background:#7B2FFF;animation:pulse 2.5s ease-in-out infinite}
        @keyframes pulse{0%,100%{box-shadow:0 0 6px rgba(123,47,255,0.4)}50%{box-shadow:0 0 18px rgba(123,47,255,0.7)}}
        .gnav-links{display:flex;align-items:center;flex:1;padding:0 20px;gap:2px}
        .gnav-lnk{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;color:#55607A;text-decoration:none;transition:color 0.2s}
        .gnav-lnk:hover{color:#F5F8FF}
        .gnav-right{display:flex;align-items:center;padding:0 20px;gap:10px;border-left:1px solid #1F2330}
        .btn{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:8px 16px;background:transparent;border:1px solid #1F2330;color:#7A8499;cursor:pointer;transition:all 0.2s}
        .btn:hover{border-color:var(--c1);color:#F5F8FF}
        .btn-p{background:var(--c1);border-color:var(--c1);color:#06080A;font-weight:500}
        .btn-p:hover{filter:brightness(1.15);color:#06080A}

        .hero{position:relative;min-height:380px;overflow:hidden}
        .hero-bg{position:absolute;inset:0;background:#06080A}
        .hero-diag{position:absolute;top:0;right:0;width:55%;height:100%;background:linear-gradient(135deg,${c1} 0%,rgba(6,8,10,0.8) 40%,${c2} 100%);clip-path:polygon(12% 0%,100% 0%,100% 100%,0% 100%)}
        .hero-diag::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,8,10,0.98) 0%,rgba(6,8,10,0.5) 50%,transparent 100%)}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(${rgb},0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(${rgb},0.04) 1px,transparent 1px);background-size:60px 60px}
        .hero-inner{position:relative;z-index:2;display:grid;grid-template-columns:1fr auto;align-items:center;gap:60px;padding:64px 80px}
        .breadcrumb{display:flex;align-items:center;gap:10px;margin-bottom:24px}
        .breadcrumb span,.breadcrumb a{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#55607A;text-decoration:none;transition:color 0.2s}
        .breadcrumb a:hover{color:#C8D0E0}
        .breadcrumb .reg{color:var(--c1);opacity:0.8}
        .cname{font-family:'Barlow Condensed',sans-serif;font-size:clamp(56px,8vw,110px);font-weight:900;line-height:0.88;letter-spacing:-1px;color:#F5F8FF;text-transform:uppercase;margin-bottom:8px}
        .ccity{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,2.5vw,30px);font-weight:300;color:#7A8499;letter-spacing:4px;text-transform:uppercase;margin-bottom:28px}
        .badges{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:32px}
        .badge{padding:7px 16px;border:1px solid;font-size:9px;letter-spacing:2px;text-transform:uppercase}
        .b1{border-color:var(--c1);color:var(--c1);background:var(--glow2)}
        .b2{border-color:#1F2330;color:#C8D0E0;background:#0E1014}
        .b3{border-color:rgba(123,47,255,0.4);color:#7B2FFF;background:rgba(123,47,255,0.06)}
        .social-row{display:flex;align-items:center;gap:1px;flex-wrap:wrap}
        .soc{display:flex;align-items:center;gap:8px;padding:11px 18px;border:1px solid #1F2330;border-right:none;font-size:10px;color:#55607A;text-decoration:none;transition:all 0.2s;white-space:nowrap}
        .soc:last-child{border-right:1px solid #1F2330}
        .soc:hover{background:#151820;color:#C8D0E0}
        .logo-wrap{flex-shrink:0;width:200px;height:200px;position:relative}
        .logo-ring{position:absolute;inset:-12px;border:1px solid rgba(${rgb},0.2);border-radius:50%;animation:spin 25s linear infinite}
        .logo-ring::before{content:'';position:absolute;top:-2px;left:50%;width:4px;height:4px;border-radius:50%;background:var(--c1);transform:translateX(-50%);box-shadow:0 0 12px var(--c1)}
        @keyframes spin{to{transform:rotate(360deg)}}
        .logo-box{width:100%;height:100%;background:#1A1D24;border:1px solid #2A2E3A;display:flex;align-items:center;justify-content:center;font-size:80px}

        .stats-bar{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid #1F2330;border-bottom:1px solid #1F2330;background:#0E1014}
        .sb-cell{padding:22px 28px;border-right:1px solid #1F2330;transition:background 0.2s}
        .sb-cell:last-child{border-right:none}
        .sb-cell:hover{background:#151820}
        .sb-n{font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;line-height:1;color:var(--c1);letter-spacing:-1px}
        .sb-l{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#55607A;margin-top:3px}

        .tabs-bar{background:#0E1014;border-bottom:1px solid #1F2330;position:sticky;top:52px;z-index:100}
        .tabs-inner{display:flex;padding:0 80px}
        .tab-btn{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:18px 28px;color:#55607A;background:transparent;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;transition:color 0.2s}
        .tab-btn:hover{color:#C8D0E0}
        .tab-btn.on{color:#F5F8FF;border-bottom-color:var(--c1)}

        .content{padding:0 80px}
        .wrap{padding:48px 0}

        .pos-sel{display:flex;flex-wrap:wrap;gap:2px;margin-bottom:40px;align-items:stretch}
        .pp{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px 20px;background:#0E1014;border:1px solid #1F2330;color:#55607A;cursor:pointer;transition:all 0.15s}
        .pp:hover{color:#C8D0E0;border-color:#2A2E3A}
        .pp.on{background:var(--c1);border-color:var(--c1);color:#06080A}
        .psep{width:1px;background:#1F2330;margin:0 8px;align-self:stretch}

        .pgroup{margin-bottom:4px}
        .phdr{display:grid;grid-template-columns:60px 1fr 90px 90px 90px 90px;padding:0 20px;height:36px;align-items:center;background:#1A1D24;border:1px solid #1F2330;border-bottom:none}
        .phdr-name{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;color:var(--c1);text-transform:uppercase}
        .phdr-s{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#55607A;text-align:center}
        .prow{display:grid;grid-template-columns:60px 1fr 90px 90px 90px 90px;padding:0 20px;height:60px;align-items:center;background:#0E1014;border:1px solid #1F2330;border-bottom:none;cursor:pointer;transition:all 0.15s;position:relative}
        .prow::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--c1);opacity:0;transition:opacity 0.15s}
        .prow:last-child{border-bottom:1px solid #1F2330}
        .prow:hover{background:#151820;border-color:#2A2E3A}
        .prow:hover::before{opacity:1}
        .ovr{font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;text-align:center;line-height:1}
        .pid{display:flex;align-items:center;gap:14px;padding-left:8px}
        .pav{width:40px;height:40px;background:#1A1D24;border:1px solid #1F2330;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .pname{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:700;color:#C8D0E0;line-height:1.1}
        .prow:hover .pname{color:#F5F8FF}
        .pnum{font-size:11px;color:#55607A;letter-spacing:1px}
        .prole{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#55607A;margin-top:2px}
        .sv{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:600;color:#C8D0E0;text-align:center}
        .sv.hi{color:var(--c1)}

        .sec-t{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:#55607A;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1F2330}
        .mrow{display:grid;grid-template-columns:130px 1fr auto 1fr 110px 100px;align-items:center;gap:20px;padding:20px 28px;background:#0E1014;border:1px solid #1F2330;border-bottom:none;cursor:pointer;transition:background 0.15s}
        .mrow+.mrow{margin-top:2px;border-top:1px solid #1F2330}
        .mrow:last-child{border-bottom:1px solid #1F2330}
        .mrow:hover{background:#151820}
        .mdate{font-size:10px;color:#55607A;line-height:1.5}
        .mweek{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--c1);opacity:0.8;display:block}
        .mteam{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;color:#C8D0E0;text-align:right}
        .mteam.home{text-align:left}
        .mscore{font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;letter-spacing:-1px;color:#F5F8FF;text-align:center;white-space:nowrap}
        .mcomp{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#7A8499}
        .rb{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;text-align:center}
        .rb.win{background:rgba(0,200,100,0.1);color:#4ade80;border:1px solid rgba(0,200,100,0.2)}
        .rb.loss{background:rgba(255,50,50,0.08);color:#f87171;border:1px solid rgba(255,50,50,0.15)}
        .rb.next{background:var(--glow2);color:var(--c1);border:1px solid rgba(${rgb},0.2)}

        .igrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
        .icard{background:#0E1014;border:1px solid #1F2330;padding:28px 32px;transition:background 0.2s}
        .icard:hover{background:#151820}
        .icard.w3{grid-column:span 3}
        .ilbl{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--c1);opacity:0.7;margin-bottom:10px}
        .ival{font-size:14px;color:#C8D0E0;line-height:1.6}
        .ival a{color:var(--c1);text-decoration:none}
        .ival a:hover{filter:brightness(1.3)}
        .dtags{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
        .dtag{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:7px 18px;border:1px solid}
        .dtag.fa{border-color:var(--c1);color:var(--c1);background:var(--glow2)}
        .dtag.off{border-color:#1F2330;color:#55607A}
        .claim{grid-column:span 3;background:#0E1014;border:1px solid rgba(${rgb},0.2);padding:40px 48px;display:flex;align-items:center;gap:40px;position:relative;overflow:hidden;margin-top:2px}
        .claim::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--c1)}
        .claim-glow{position:absolute;inset:0;background:radial-gradient(ellipse 50% 100% at 0 50%,var(--glow2),transparent);pointer-events:none}
        .claim-t{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:#F5F8FF;margin-bottom:8px}
        .claim-d{font-size:11px;color:#55607A;line-height:1.8;max-width:500px}
        .btn-claim{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;background:var(--c1);border:none;color:#06080A;font-weight:500;cursor:pointer;white-space:nowrap;flex-shrink:0;margin-left:auto;transition:filter 0.2s}
        .btn-claim:hover{filter:brightness(1.2)}

        @media(max-width:900px){
          .hero-inner{grid-template-columns:1fr;padding:40px 24px}
          .logo-wrap{display:none}
          .stats-bar{grid-template-columns:repeat(3,1fr)}
          .content{padding:0 24px}
          .tabs-inner{padding:0 24px}
          .phdr,.prow{grid-template-columns:50px 1fr 80px 80px}
          .phdr .h4,.prow .s4,.phdr .h5,.prow .s5{display:none}
          .mrow{grid-template-columns:80px 1fr auto 1fr 80px}
          .mcomp{display:none}
          .igrid{grid-template-columns:1fr 1fr}
          .icard.w3,.claim{grid-column:span 2}
        }
      `}</style>

      {/* NAV */}
      <nav className="gnav">
        <Link href="/" className="gnav-logo">
          <span className="logo-text">LOCKDOWN</span>
          <div className="logo-dot" />
        </Link>
        <div className="gnav-links">
          <Link href="/clubs" className="gnav-lnk">Clubs</Link>
          <span className="gnav-lnk">Scores</span>
          <span className="gnav-lnk">Joueurs</span>
          <span className="gnav-lnk">Actus</span>
        </div>
        <div className="gnav-right">
          <button className="btn">Connexion</button>
          <button className="btn btn-p">Créer un profil</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-diag" />
          <div className="hero-grid" />
        </div>
        <div className="hero-inner">
          <div>
            <div className="breadcrumb">
              <Link href="/clubs">Clubs</Link>
              <span>/</span>
              <span className="reg">{club.region}</span>
              <span>/</span>
              <span style={{color:'#C8D0E0'}}>{club.nom}</span>
            </div>
            <div className="cname">{club.nom}</div>
            <div className="ccity">{club.ville} · {club.dept}</div>
            <div className="badges">
              <div className="badge b1">Football Américain</div>
              <div className="badge b2">FFFA Affilié</div>
              <div className="badge b3">✓ Vérifié</div>
            </div>
            <div className="social-row">
              <a href={`mailto:${club.email}`} className="soc">📧 {club.email}</a>
              <a href="#" className="soc">🌐 Site officiel</a>
              <a href="#" className="soc">📘 Facebook</a>
              <a href="#" className="soc">📸 Instagram</a>
            </div>
          </div>
          <div className="logo-wrap">
            <div className="logo-ring" />
            <div className="logo-box">🏈</div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        {[['—','Bilan saison'],['—','Joueurs inscrits'],['—','Pts / match'],['—','Division'],['—','Saisons FFFA']].map(([n,l],i) => (
          <div key={i} className="sb-cell">
            <div className="sb-n">{n}</div>
            <div className="sb-l">{l}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="tabs-bar">
        <div className="tabs-inner">
          {[['roster','Roster'],['scores','Scores & Résultats'],['infos','Informations']].map(([id,label]) => (
            <button key={id} className={`tab-btn${tab===id?' on':''}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* ROSTER */}
        {tab==='roster' && (
          <div className="wrap">
            <div className="pos-sel">
              {positions.map((p, i) => p === null
                ? <div key={i} className="psep" />
                : <button key={p.id} className={`pp${pos===p.id?' on':''}`} onClick={() => setPos(p.id)}>{p.label}</button>
              )}
            </div>

            {visible.map(group => (
              <div key={group.pos} className="pgroup">
                <div className="phdr">
                  <div/>
                  <div className="phdr-name">
                    {group.label}
                    {group.lockdown && <span style={{fontSize:'11px',color:'#7B2FFF',marginLeft:'12px',fontWeight:400}}>🔒 LOCKDOWN</span>}
                  </div>
                  {group.stats.map((s,i) => <div key={i} className={`phdr-s h${i+2}`}>{s}</div>)}
                </div>
                {group.players.map((p, pi) => (
                  <div key={pi} className="prow">
                    <div className="ovr" style={{color: tierColor(p.tier)}}>{p.ovr}</div>
                    <div className="pid">
                      <div className="pav">{p.icon}</div>
                      <div>
                        <div className="pname">{p.name} <span className="pnum">{p.num}</span></div>
                        <div className="prole">{p.role}</div>
                      </div>
                    </div>
                    {p.stats.map((s,si) => <div key={si} className={`sv s${si+2}${si===0?' hi':''}`}>{s}</div>)}
                  </div>
                ))}
              </div>
            ))}

            <div style={{marginTop:'16px',padding:'36px',textAlign:'center',border:'1px dashed #1F2330',color:'#55607A',fontSize:'11px',letterSpacing:'2px'}}>
              Roster incomplet — <span style={{color:'var(--c1)',cursor:'pointer'}}>Ce club peut compléter son effectif →</span>
            </div>
          </div>
        )}

        {/* SCORES */}
        {tab==='scores' && (
          <div className="wrap">
            <div className="sec-t">Résultats · Saison 2026</div>
            {matches.map((m,i) => (
              <div key={i} className="mrow">
                <div className="mdate"><span className="mweek">{m.week}</span>{m.date}</div>
                <div className="mteam">{m.home}</div>
                <div className="mscore">{m.score.replace(' – ',' – ')}</div>
                <div className="mteam home">{m.away}</div>
                <div className="mcomp">D1 FFFA</div>
                <div className={`rb ${m.result}`}>{m.label}</div>
              </div>
            ))}
            <div className="sec-t" style={{marginTop:'48px'}}>Prochain match</div>
            <div className="mrow">
              <div className="mdate"><span className="mweek">Journée 5</span>15 Mar 2026</div>
              <div className="mteam">Dockers Nantes</div>
              <div className="mscore" style={{fontSize:'22px',color:'#55607A'}}>vs</div>
              <div className="mteam home">{club.nom}</div>
              <div className="mcomp">D1 FFFA</div>
              <div className="rb next">À venir</div>
            </div>
            <div style={{marginTop:'16px',padding:'28px',border:'1px dashed #1F2330',textAlign:'center',color:'#55607A',fontSize:'11px',letterSpacing:'2px'}}>
              Scores en direct disponibles dès que le club active son portail admin
            </div>
          </div>
        )}

        {/* INFOS */}
        {tab==='infos' && (
          <div className="wrap">
            <div className="igrid">
              {[
                ['Nom officiel', `${club.nom} de ${club.ville}`],
                ['Ville & Département', `${club.ville} (${club.dept})`],
                ['Région', club.region],
                ['Email contact', club.email, `mailto:${club.email}`],
                ['Site officiel', 'Non renseigné'],
                ['Entraînements', 'Non renseigné'],
              ].map(([lbl, val, href], i) => (
                <div key={i} className="icard">
                  <div className="ilbl">{lbl}</div>
                  <div className="ival" style={!href && val==='Non renseigné' ? {color:'#55607A'} : {}}>
                    {href ? <a href={href}>{val}</a> : val}
                  </div>
                </div>
              ))}
              <div className="icard w3">
                <div className="ilbl">Disciplines</div>
                <div className="dtags">
                  <span className="dtag fa">Football Américain</span>
                  <span className="dtag off">Flag Football</span>
                  <span className="dtag off">Cheerleading</span>
                </div>
              </div>
              <div className="claim">
                <div className="claim-glow" />
                <div>
                  <div className="claim-t">Vous représentez ce club ?</div>
                  <div className="claim-d">Prenez le contrôle de cette page — logo officiel, roster complet, scores en direct. Gratuit pour tous les clubs FFFA affiliés.</div>
                </div>
                <button className="btn-claim">Réclamer cette page →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
