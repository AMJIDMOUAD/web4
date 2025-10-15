'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const panelRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  // Restore default: open on desktop, closed on mobile
  useEffect(() => {
    const mq = window.matchMedia('(min-width:900px)');
    setCollapsed(!mq.matches);
  }, []);

  // Load content from API
  useEffect(() => {
    (async () => {
      try{
        const r = await fetch('/api/homepage/info', { cache: 'no-store' });
        const j = await r.json();
        if (contentRef.current && j?.doc?.html) contentRef.current.innerHTML = j.doc.html;
        setStatus(`Loaded • ${j?.doc?.status || 'draft'}`);
      } catch {
        setStatus('Offline draft');
      } finally {
        setLoaded(true);
        setTimeout(updateHeight, 0);
      }
    })();
  }, []);

  const updateHeight = () => {
    const box = contentRef.current; const root = panelRef.current;
    if (!box || !root) return;
    if (collapsed) box.style.maxHeight = '0px';
    else box.style.maxHeight = box.scrollHeight + 'px';
  };

  useEffect(() => { updateHeight(); }, [collapsed]);

  async function save(publish=false){
    try{
      const payload = { html: contentRef.current?.innerHTML || '', publish };
      const r = await fetch('/api/homepage/info', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'save failed');
      setStatus(`${publish ? 'Published' : 'Saved'} • ${new Date(j.doc.ts).toLocaleString()}`);
      toast(publish ? 'Published' : 'Saved');
    }catch(e:any){
      setStatus('Save failed'); toast('Save failed');
    }
  }

  function toast(msg:string){
    const t=document.createElement('div');
    t.textContent=msg;
    Object.assign(t.style,{position:'fixed',left:'50%',bottom:'18px',transform:'translateX(-50%)',
      background:'rgba(0,0,0,.75)',color:'#fff',padding:'10px 14px',borderRadius:'10px',
      border:'1px solid rgba(255,255,255,.12)',font:'600 12px/1 system-ui',zIndex:'9999',
      transition:'opacity .2s',opacity:'0'});
    document.body.appendChild(t); requestAnimationFrame(()=>{t.style.opacity='1'});
    setTimeout(()=>{t.style.opacity='0'; setTimeout(()=>t.remove(),200)},1800);
  }

  return (
    <main className="hero" aria-label="Exoverse Home">
      <h1 className="sr-only">Exoverse — Web4 Portal</h1>

      <img
        src="/assets/exoverse-hero-night.jpg"
        alt="Neon city at night. WEB4 sphere centered; panels labeled Exoverse TV, News Hub, Spot Jobs, Opportunities."
        fetchPriority="high"
        decoding="async"
      />

      {/* Hotspots */}
      <div className="overlay" aria-hidden="false">
        <a href="/tv"   className="hotspot" style={{ top: '40%', left: '60%' }}>Exoverse TV</a>
        <a href="/jobs" className="hotspot" style={{ top: '55%', left: '30%' }}>Spot Jobs</a>
        <a href="/news" className="hotspot" style={{ top: '65%', left: '70%' }}>News Hub</a>
        <a href="/opps" className="hotspot" style={{ top: '75%', left: '45%' }}>Opportunities</a>
      </div>

      {/* Collapsible info panel */}
      <section ref={panelRef as any} className="info-panel" data-collapsed={collapsed} aria-label="Exoverse info panel">
        <div className="safe">
          <button
            id="info-toggle"
            className="info-toggle"
            type="button"
            aria-controls="info-content"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className="label-closed">Show info</span>
            <span className="label-open">Hide info</span>
            <span className="chev" aria-hidden="true">⌄</span>
          </button>

          <div className="info-toolbar" role="toolbar" aria-label="Info actions">
            <button className="btn" onClick={() => save(false)} disabled={!loaded}>Save</button>
            <button className="btn primary" onClick={() => save(true)} disabled={!loaded}>Publish</button>
            <span className="muted" aria-live="polite">{status}</span>
          </div>

          <div id="info-content" ref={contentRef} className="info-content" contentEditable spellCheck={false}>
            <h2>Welcome to Exoverse</h2>
            <p>Edit this section with launch notes, promos, or announcements.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
