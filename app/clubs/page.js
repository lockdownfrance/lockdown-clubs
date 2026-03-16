'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import clubs from '../../data/clubs.json'

const REGIONS = ['Toutes les régions', ...Array.from(new Set(clubs.map(c => c.region))).sort()]
const DIVISIONS = ['Toutes divisions', 'Elite', 'D1', 'D2', 'D3']

const DEPT_COORDS = {
  '01':[46.20,5.23],'02':[49.56,3.62],'03':[46.34,3.43],'04':[44.09,6.24],'05':[44.56,6.07],
  '06':[43.92,7.18],'07':[44.92,4.39],'08':[49.77,4.72],'09':[43.00,1.62],'10':[48.30,4.08],
  '11':[43.21,2.35],'12':[44.35,2.57],'13':[43.53,5.45],'14':[49.18,-0.36],'15':[45.05,2.63],
  '16':[45.65,0.16],'17':[45.75,-0.63],'18':[47.08,2.40],'19':[45.27,1.77],'21':[47.32,5.04],
  '22':[48.51,-2.76],'23':[46.00,2.00],'24':[45.18,0.72],'25':[47.24,6.02],'26':[44.93,4.89],
  '27':[49.12,1.15],'28':[48.45,1.49],'29':[48.39,-4.49],'30':[43.84,4.36],'31':[43.60,1.44],
  '32':[43.65,0.59],'33':[44.84,-0.58],'34':[43.61,3.87],'35':[48.11,-1.68],'36':[46.81,1.69],
  '37':[47.39,0.69],'38':[45.19,5.72],'39':[46.67,5.55],'40':[43.89,-0.50],'41':[47.59,1.34],
  '42':[45.43,4.39],'43':[45.04,3.88],'44':[47.22,-1.55],'45':[47.90,1.91],'46':[44.45,1.44],
  '47':[44.35,0.63],'48':[44.52,3.50],'49':[47.47,-0.55],'50':[49.12,-1.08],'51':[49.25,4.03],
  '52':[48.11,5.14],'53':[48.07,-0.77],'54':[48.69,6.18],'55':[48.78,5.16],'56':[47.66,-2.76],
  '57':[49.12,6.18],'58':[47.06,3.66],'59':[50.63,3.06],'60':[49.41,2.83],'61':[48.43,0.09],
  '62':[50.29,2.78],'63':[45.78,3.08],'64':[43.29,-0.37],'65':[43.23,0.07],'66':[42.69,2.89],
  '67':[48.57,7.75],'68':[47.75,7.34],'69':[45.75,4.85],'70':[47.62,6.15],'71':[46.79,4.86],
  '72':[47.99,0.19],'73':[45.57,6.39],'74':[45.90,6.12],'75':[48.86,2.35],'76':[49.44,1.10],
  '77':[48.84,2.95],'78':[48.83,1.86],'79':[46.32,-0.46],'80':[49.88,2.30],'81':[43.93,2.14],
  '82':[44.02,1.35],'83':[43.47,6.22],'84':[43.95,5.07],'85':[46.67,-1.43],'86':[46.58,0.34],
  '87':[45.83,1.26],'88':[48.19,6.45],'89':[47.80,3.57],'90':[47.64,6.86],'91':[48.63,2.44],
  '92':[48.90,2.22],'93':[48.92,2.49],'94':[48.79,2.47],'95':[49.05,2.08],
}

function getCoords(club) {
  if (club.lat && club.lng) return [club.lat, club.lng]
  return DEPT_COORDS[club.dept] || [46.5, 2.5]
}

export default function ClubsPage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('Toutes les régions')
  const [division, setDivision] = useState('Toutes divisions')
  const [view, setView] = useState('liste')
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  const filtered = clubs.filter(c => {
    const matchSearch = search === '' ||
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.ville.toLowerCase().includes(search.toLowerCase())
    const matchRegion = region === 'Toutes les régions' || c.region === region
    const matchDiv = division === 'Toutes divisions' || c.division === division
    return matchSearch && matchRegion && matchDiv
  })

  const addMarkers = (L, map, list) => {
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []
    list.forEach(club => {
      const coords = getCoords(club)
      const marker = L.circleMarker(coords, {
        radius: 7, fillColor: club.color1 || '#7B2FFF',
        color: '#080808', weight: 2, opacity: 1, fillOpacity: 0.9
      })
      marker.bindPopup(`
        <div style="font-family:'DM Mono',monospace;min-width:180px">
          <div style="font-size:13px;font-weight:700;color:#F4F4F4;margin-bottom:4px">${club.nom}</div>
          <div style="font-size:10px;color:#888;letter-spacing:1px;text-transform:uppercase">${club.ville} · ${club.region}</div>
          ${club.division ? `<div style="margin-top:6px;font-size:9px;background:${club.color1};color:#fff;padding:2px 6px;display:inline-block">${club.division}</div>` : ''}
          <div style="margin-top:10px"><a href="/clubs/${club.slug}" style="font-size:10px;color:#7B2FFF;text-decoration:none;letter-spacing:1px">VOIR LA FICHE →</a></div>
        </div>
      `, { className: 'lf-popup' })
      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }

  useEffect(() => {
    if (view !== 'carte' || typeof window === 'undefined') return
    const init = () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }
      const L = window.L
      if (!L || !mapRef.current) return
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true })
      mapInstanceRef.current = map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap ©CartoDB', maxZoom: 19
      }).addTo(map)
      map.setView([46.5, 2.5], 6)
      addMarkers(L, map, filtered)
    }
    if (!window.L) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => setTimeout(init, 100)
      document.head.appendChild(script)
    } else { setTimeout(init, 100) }
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [view])

  useEffect(() => {
    if (view !== 'carte' || !mapInstanceRef.current || !window.L) return
    addMarkers(window.L, mapInstanceRef.current, filtered)
  }, [search, region, division, view])

  const regionCounts = {}
  clubs.forEach(c => { regionCounts[c.region] = (regionCounts[c.region] || 0) + 1 })

  const byRegion = {}
  filtered.forEach(c => { if (!byRegion[c.region]) byRegion[c.region] = []; byRegion[c.region].push(c) })

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        .gnav{position:sticky;top:0;z-index:1000;display:flex;align-items:stretch;height:52px;background:rgba(6,8,10,0.97);backdrop-filter:blur(16px);border-bottom:1px solid #151820}
        .gnav-logo{display:flex;align-items:center;gap:10px;padding:0 28px;border-right:1px solid #151820;text-decoration:none}
        .gnav-logo-text{font-family:'Unbounded',sans-serif;font-size:12px;font-weight:900;color:#F5F8FF;letter-spacing:-0.5px}
        .gnav-dot{width:5px;height:5px;border-radius:50%;background:#7B2FFF;box-shadow:0 0 10px rgba(123,47,255,0.5)}
        .gnav-links{display:flex;align-items:center;flex:1;padding:0 20px;gap:2px}
        .gnav-link{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;color:#3A4255;text-decoration:none;transition:color 0.2s;cursor:pointer}
        .gnav-link:hover,.gnav-link.active{color:#F5F8FF}
        .gnav-link.active{border-bottom:2px solid #7B2FFF;margin-bottom:-1px}
        .hero{padding:56px 80px 40px;border-bottom:1px solid #151820}
        .hero-top{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
        .hero h1{font-family:'Barlow Condensed',sans-serif;font-size:68px;font-weight:900;line-height:0.9;letter-spacing:-2px;color:#F5F8FF;text-transform:uppercase}
        .hero-sub{font-size:10px;color:#3A4255;letter-spacing:1.5px;margin-top:8px}
        .hero-stats{display:flex;gap:2px}
        .hstat{padding:12px 22px;border:1px solid #151820;background:#0A0C10}
        .hstat-n{font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;color:#7B2FFF;line-height:1}
        .hstat-l{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#3A4255;margin-top:2px}
        .toolbar{display:flex;align-items:center;gap:2px;padding:0 80px;height:52px;border-bottom:1px solid #151820;background:#080808;position:sticky;top:52px;z-index:99}
        .search-wrap{flex:1;max-width:300px;position:relative}
        .search-wrap input{width:100%;background:#0A0C10;border:1px solid #1A1E2A;color:#E8EDF5;font-family:'DM Mono',monospace;font-size:11px;padding:9px 12px 9px 32px;outline:none;letter-spacing:0.5px}
        .search-wrap input:focus{border-color:#7B2FFF}
        .search-wrap input::placeholder{color:#2A2E3A}
        .search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#3A4255;font-size:13px;pointer-events:none}
        .filter-select{background:#0A0C10;border:1px solid #1A1E2A;color:#9AA0B8;font-family:'DM Mono',monospace;font-size:10px;padding:9px 12px;outline:none;letter-spacing:0.5px;cursor:pointer}
        .filter-select:focus{border-color:#7B2FFF}
        .results-count{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#2A2E3A;white-space:nowrap;padding:0 8px}
        .view-toggle{display:flex;margin-left:auto;gap:2px}
        .view-btn{background:#0A0C10;border:1px solid #1A1E2A;color:#3A4255;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;padding:7px 14px;cursor:pointer;text-transform:uppercase;transition:all 0.15s}
        .view-btn.active{background:#7B2FFF;border-color:#7B2FFF;color:#fff}
        .map-wrap{height:calc(100vh - 104px)}
        #lf-map{width:100%;height:100%}
        .leaflet-popup-content-wrapper{background:#0E1014 !important;border:1px solid #1F2330 !important;border-radius:0 !important;box-shadow:0 8px 32px rgba(0,0,0,0.7) !important}
        .leaflet-popup-tip{background:#0E1014 !important}
        .leaflet-popup-content{margin:14px 16px !important}
        .list-wrap{padding:0 80px 80px}
        .region-block{padding-top:40px}
        .region-header{display:flex;align-items:baseline;gap:14px;padding-bottom:10px;border-bottom:1px solid #0F1218;margin-bottom:2px}
        .region-name{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#F5F8FF;text-transform:uppercase;letter-spacing:1px}
        .region-count{font-size:8px;letter-spacing:2px;color:#2A2E3A}
        .clubs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:2px;margin-top:2px}
        .club-card{display:flex;align-items:center;gap:12px;padding:14px 18px;background:#0A0C10;border:1px solid #111520;text-decoration:none;transition:all 0.15s;position:relative;overflow:hidden}
        .club-card:hover{background:#0D0F16;border-color:#1E2232}
        .club-bar{position:absolute;left:0;top:0;bottom:0;width:2px;opacity:0;transition:opacity 0.15s}
        .club-card:hover .club-bar{opacity:1}
        .club-avatar{width:38px;height:38px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-family:'DM Mono',monospace;font-weight:500;letter-spacing:0.5px;border:1px solid transparent}
        .club-info{flex:1;min-width:0}
        .club-name{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#8A90A8;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .club-card:hover .club-name{color:#F5F8FF}
        .club-meta{display:flex;align-items:center;gap:6px;margin-top:3px}
        .club-ville{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#3A4255}
        .club-div{font-size:8px;letter-spacing:1px;padding:1px 5px;border:1px solid;opacity:0.7}
        .club-arrow{color:#1A1E2A;font-size:11px;flex-shrink:0;transition:color 0.15s}
        .club-card:hover .club-arrow{color:#7B2FFF}
        .empty{padding:80px;text-align:center}
        .empty-t{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:700;color:#1F2330;text-transform:uppercase;margin-bottom:6px}
        .empty-s{font-size:9px;color:#2A2E3A;letter-spacing:1px}
        @media(max-width:900px){
          .hero,.list-wrap{padding-left:20px;padding-right:20px}
          .hero h1{font-size:44px}
          .toolbar{padding:8px 16px;height:auto;flex-wrap:wrap}
          .hero-top{flex-direction:column;align-items:flex-start}
        }
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
        <div className="hero-top">
          <div>
            <h1>Annuaire<br/>des clubs</h1>
            <div className="hero-sub">Toutes les équipes de football américain licenciées FFFA</div>
          </div>
          <div className="hero-stats">
            <div className="hstat"><div className="hstat-n">{clubs.length}</div><div className="hstat-l">Clubs recensés</div></div>
            <div className="hstat"><div className="hstat-n">{Object.keys(regionCounts).length}</div><div className="hstat-l">Régions</div></div>
            <div className="hstat"><div className="hstat-n">{clubs.filter(c=>c.email).length}</div><div className="hstat-l">Contacts email</div></div>
          </div>
        </div>
      </section>

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input type="text" placeholder="Club ou ville..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={region} onChange={e=>setRegion(e.target.value)}>
          {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
        </select>
        <select className="filter-select" value={division} onChange={e=>setDivision(e.target.value)}>
          {DIVISIONS.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        <span className="results-count">{filtered.length} club{filtered.length>1?'s':''}</span>
        <div className="view-toggle">
          <button className={`view-btn${view==='liste'?' active':''}`} onClick={()=>setView('liste')}>Liste</button>
          <button className={`view-btn${view==='carte'?' active':''}`} onClick={()=>setView('carte')}>Carte</button>
        </div>
      </div>

      {view==='carte' && <div className="map-wrap"><div id="lf-map" ref={mapRef} /></div>}

      {view==='liste' && (
        <div className="list-wrap">
          {filtered.length===0 ? (
            <div className="empty"><div className="empty-t">Aucun résultat</div><div className="empty-s">Modifie ta recherche ou les filtres</div></div>
          ) : (
            Object.entries(byRegion).sort(([a],[b])=>a.localeCompare(b)).map(([reg, list]) => (
              <div key={reg} className="region-block">
                <div className="region-header">
                  <span className="region-name">{reg}</span>
                  <span className="region-count">{list.length} club{list.length>1?'s':''}</span>
                </div>
                <div className="clubs-grid">
                  {list.map(club => {
                    const initials = club.nom.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase()
                    return (
                      <Link key={club.slug} href={`/clubs/${club.slug}`} className="club-card">
                        <div className="club-bar" style={{background:club.color1}} />
                        <div className="club-avatar" style={{background:club.color1+'15',borderColor:club.color1+'30',color:club.color1}}>
                          {initials}
                        </div>
                        <div className="club-info">
                          <div className="club-name">{club.nom}</div>
                          <div className="club-meta">
                            <span className="club-ville">{club.ville}</span>
                            {club.division && <span className="club-div" style={{color:club.color1,borderColor:club.color1}}>{club.division}</span>}
                          </div>
                        </div>
                        <span className="club-arrow">→</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  )
}
