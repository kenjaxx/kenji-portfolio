import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Skills", "Languages", "Certificates", "Projects", "Contact"];

const SKILLS = [
  { name: "React", level: 95, color: "#61dafb" },
  { name: "TypeScript", level: 90, color: "#3178c6" },
  { name: "Node.js", level: 85, color: "#68a063" },
  { name: "Python", level: 80, color: "#f7c948" },
  { name: "PostgreSQL", level: 75, color: "#336791" },
  { name: "Docker", level: 70, color: "#2496ed" },
];

const LANGUAGES = [
  { name: "Filipino", level: "Native", pct: 100 },
  { name: "English", level: "Fluent", pct: 95 },
  { name: "Japanese", level: "Intermediate", pct: 55 },
  { name: "Spanish", level: "Beginner", pct: 30 },
];

const CERTIFICATES = [
  { title: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2024", badge: "☁️" },
  { title: "Google UX Design", issuer: "Google", year: "2023", badge: "🎨" },
  { title: "Meta Front-End Developer", issuer: "Meta", year: "2023", badge: "⚛️" },
  { title: "Certified Scrum Master", issuer: "Scrum Alliance", year: "2022", badge: "🔄" },
];

const PROJECTS = [
  { title: "Lumina Dashboard", desc: "Real-time analytics platform with live data visualizations and team collaboration tools.", tags: ["React", "D3.js", "WebSocket"], year: "2024", accent: "#a78bfa" },
  { title: "Kaia AI", desc: "Conversational AI assistant with context memory, supporting 8 languages and voice input.", tags: ["Python", "OpenAI", "FastAPI"], year: "2024", accent: "#34d399" },
  { title: "Arkive CMS", desc: "Headless content management system with a block-based editor and CDN integration.", tags: ["Next.js", "TypeScript", "Prisma"], year: "2023", accent: "#f472b6" },
  { title: "Vaultly", desc: "Encrypted personal finance tracker with bank-grade security and cross-device sync.", tags: ["Node.js", "PostgreSQL", "Docker"], year: "2023", accent: "#60a5fa" },
];

const WORDS = ["Developer.", "Designer.", "Builder.", "Creator."];
const font = "'DM Serif Display', serif";
const mono = "'DM Mono', monospace";
const sans = "'DM Sans', sans-serif";

function useTypewriter(words) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) { setTimeout(() => setDeleting(true), 1800); return; }
    if (subIndex === 0 && deleting) { setDeleting(false); setIndex(i => (i + 1) % words.length); return; }
    const t = setTimeout(() => { setText(words[index].substring(0, subIndex)); setSubIndex(s => s + (deleting ? -1 : 1)); }, deleting ? 60 : 100);
    return () => clearTimeout(t);
  }, [subIndex, deleting, index, words]);
  return text;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function FloatingOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {[
        { w: 500, h: 500, top: "-10%", left: "-5%", color: "rgba(255,255,255,0.12)", dur: "18s", delay: "0s" },
        { w: 350, h: 350, top: "30%", right: "-8%", color: "rgba(255,255,255,0.08)", dur: "22s", delay: "-6s" },
        { w: 250, h: 250, bottom: "10%", left: "20%", color: "rgba(255,255,255,0.10)", dur: "16s", delay: "-3s" },
        { w: 200, h: 200, top: "60%", right: "25%", color: "rgba(255,255,255,0.07)", dur: "20s", delay: "-10s" },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute", width: orb.w, height: orb.h,
          top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
          background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          borderRadius: "50%",
          animation: `floatOrb ${orb.dur} ease-in-out infinite`,
          animationDelay: orb.delay,
          filter: "blur(2px)",
        }} />
      ))}
    </div>
  );
}

function TiltCard({ children, style = {}, disabled = false }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (disabled) return;
    const card = ref.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -5;
    const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 5;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)"; };
  return <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ transition: "transform 0.35s ease", transformStyle: "preserve-3d", ...style }}>{children}</div>;
}

function MagneticButton({ children, className, onClick, style = {} }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const handleMove = (e) => {
    if (isMobile) return;
    const btn = ref.current; if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.25}px, ${(e.clientY - rect.top - rect.height / 2) * 0.25}px)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return (
    <button ref={ref} className={className} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: "transform 0.45s cubic-bezier(.23,1,.32,1), box-shadow 0.3s, background 0.3s", ...style }}>
      {children}
    </button>
  );
}

function AnimatedBar({ pct, delay = 0, visible, color = "#fff" }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.2)", height: "4px", width: "100%", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{
        height: "100%", background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.9))`,
        borderRadius: "4px", width: visible ? `${pct}%` : "0%",
        transition: `width 1.4s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        boxShadow: visible ? `0 0 12px ${color}99` : "none",
      }} />
    </div>
  );
}

function SkillCard({ name, level, color, delay, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
        borderRadius: "16px", padding: "20px",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{name}</span>
        <span style={{ fontFamily: mono, fontSize: "12px", color: hovered ? color : "rgba(255,255,255,0.6)", fontWeight: 600, transition: "color 0.3s" }}>{level}%</span>
      </div>
      <AnimatedBar pct={level} delay={delay} visible={visible} color={color} />
    </div>
  );
}

function LangCard({ name, level, pct, delay, visible, isMobile }) {
  const levelColors = { Native: "#34d399", Fluent: "#60a5fa", Intermediate: "#f472b6", Beginner: "#fbbf24" };
  const col = levelColors[level] || "#fff";
  return (
    <div style={{
      background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px",
      padding: isMobile ? "20px" : "24px 28px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "160px 1fr 60px",
      gap: isMobile ? "12px" : "20px",
      alignItems: "center",
      opacity: visible ? 1 : 0,
      transition: `opacity 0.6s ease ${delay}ms`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{name}</div>
          <span style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: col, background: `${col}22`, padding: "2px 8px", borderRadius: "20px", border: `1px solid ${col}44` }}>{level}</span>
        </div>
        {isMobile && <span style={{ fontFamily: mono, fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{pct}%</span>}
      </div>
      <AnimatedBar pct={pct} delay={delay} visible={visible} color={col} />
      {!isMobile && <span style={{ fontFamily: mono, fontSize: "13px", color: "rgba(255,255,255,0.5)", textAlign: "right", fontWeight: 500 }}>{pct}%</span>}
    </div>
  );
}

function CertCard({ title, issuer, year, badge, index, visible, isMobile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <TiltCard disabled={isMobile}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)"}`,
          padding: isMobile ? "20px" : "28px", borderRadius: "16px",
          background: hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
          opacity: visible ? 1 : 0,
          transitionDelay: `${index * 80}ms`,
        }}>
        <div style={{ fontSize: "32px", marginBottom: "14px" }}>{badge}</div>
        <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "#fff", lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>{issuer}</div>
        <div style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>{year}</div>
      </div>
    </TiltCard>
  );
}

function ProjectCard({ title, desc, tags, year, accent, index, visible, isMobile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <TiltCard disabled={isMobile}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.15)"}`,
          background: hovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)", padding: isMobile ? "20px" : "28px", borderRadius: "16px",
          transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
          boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.2)` : "none",
          opacity: visible ? 1 : 0,
          transitionDelay: `${index * 80}ms`,
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <span style={{ fontSize: "17px", fontWeight: 700, color: hovered ? accent : "#fff", transition: "color 0.3s", fontFamily: font }}>{title}</span>
          <span style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginLeft: "12px", flexShrink: 0 }}>{year}</span>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "16px", fontWeight: 300 }}>{desc}</p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {tags.map(t => (
            <span key={t} style={{ fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: mono, color: hovered ? accent : "rgba(255,255,255,0.7)", background: hovered ? `${accent}18` : "rgba(255,255,255,0.12)", padding: "3px 10px", borderRadius: "20px", border: `1px solid ${hovered ? `${accent}44` : "rgba(255,255,255,0.2)"}`, transition: "all 0.3s" }}>{t}</span>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("Hero");
  const [heroVisible, setHeroVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const typedWord = useTypewriter(WORDS);
  const containerRef = useRef(null);

  const [skillsRef, skillsVisible] = useInView(0.15);
  const [langsRef, langsVisible] = useInView(0.15);
  const [certsRef, certsVisible] = useInView(0.15);
  const [projsRef, projsVisible] = useInView(0.15);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 150);
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      setScrolled(container.scrollTop > 60);
      const sections = ["Hero", ...NAV_LINKS];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top >= -100 && rect.top < window.innerHeight / 2) { setActive(id); break; }
      }
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const px = isMobile ? "20px" : "40px";
  const sectionPad = isMobile ? "72px 20px 32px" : "80px 40px";

  return (
    <div style={{ fontFamily: sans, color: "#fff", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
        ::selection { background: rgba(255,255,255,0.3); }
        @keyframes floatOrb { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-40px) scale(1.05); } 66% { transform: translate(-20px,20px) scale(0.97); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes menuSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .snap-container { height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory; scroll-behavior: smooth; }
        .snap-container::-webkit-scrollbar { width: 3px; }
        .snap-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
        .snap-page { scroll-snap-align: start; scroll-snap-stop: always; min-height: 100vh; display: flex; align-items: center; position: relative; z-index: 2; }
        .nav-link { cursor: pointer; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; color: rgba(255,255,255,0.6); transition: color 0.2s; position: relative; padding-bottom: 3px; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#fff; transition:width 0.3s ease; }
        .nav-link:hover::after, .nav-link.active::after { width:100%; }
        .nav-link:hover, .nav-link.active { color:#fff; }
        .mobile-nav-link { cursor: pointer; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; color: rgba(255,255,255,0.8); padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.1); transition: color 0.2s; }
        .mobile-nav-link:hover { color: #fff; }
        .glow-btn { background: rgba(255,255,255,0.2); color:#fff; border: 1px solid rgba(255,255,255,0.45); padding:12px 28px; font-family:${sans}; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; font-weight:500; cursor:pointer; border-radius:8px; backdrop-filter:blur(8px); transition:all 0.3s; }
        .glow-btn:hover { background:rgba(255,255,255,0.35); }
        .outline-btn { background:transparent; color:rgba(255,255,255,0.8); border:1px solid rgba(255,255,255,0.3); padding:12px 22px; font-family:${sans}; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; font-weight:500; cursor:pointer; border-radius:8px; transition:all 0.3s; }
        .outline-btn:hover { border-color:rgba(255,255,255,0.8); color:#fff; }
        .submit-btn { background:rgba(255,255,255,0.2); color:#fff; border:1px solid rgba(255,255,255,0.45); padding:12px 28px; font-family:${sans}; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; font-weight:500; cursor:pointer; border-radius:8px; backdrop-filter:blur(8px); transition:all 0.3s; }
        .submit-btn:hover { background:rgba(255,255,255,0.35); }
        input, textarea { font-family:${sans}; border:1px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.12); backdrop-filter:blur(8px); padding:12px 14px; border-radius:8px; font-size:14px; color:#fff; outline:none; transition:border-color 0.2s; width:100%; }
        input:focus, textarea:focus { border-color:rgba(255,255,255,0.7); }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.4); }
        .stat-card { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:16px 20px; transition:all 0.3s; backdrop-filter:blur(12px); }
        .stat-card:hover { background:rgba(255,255,255,0.22); transform:translateY(-2px); }
        .section-label { font-family:${mono}; font-size:11px; color:rgba(255,255,255,0.65); letter-spacing:0.14em; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
        .section-label::before { content:''; width:16px; height:1px; background:rgba(255,255,255,0.65); display:inline-block; }
      `}</style>

      {/* CURSOR GLOW — desktop only */}
      {!isMobile && <div style={{ position: "fixed", pointerEvents: "none", zIndex: 9999, left: cursorPos.x - 200, top: cursorPos.y - 200, width: 400, height: 400, background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)", borderRadius: "50%", transition: "left 0.08s linear, top 0.08s linear" }} />}

      <FloatingOrbs />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(0,0,0,0.3)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent", transition: "all 0.4s", padding: isMobile ? "0 20px" : "0 48px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: font, fontSize: isMobile ? "16px" : "20px", color: "#fff", letterSpacing: "-0.01em" }}>Ehrica Jynne Espada</span>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "32px" }}>
            {NAV_LINKS.map(n => <span key={n} className={`nav-link${active === n ? " active" : ""}`} onClick={() => scrollTo(n)}>{n}</span>)}
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ width: "22px", height: "2px", background: "#fff", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <div style={{ width: "22px", height: "2px", background: "#fff", borderRadius: "2px", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: "22px", height: "2px", background: "#fff", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        )}
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: "64px", left: 0, right: 0, zIndex: 999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", padding: "8px 24px 24px", animation: "menuSlide 0.25s ease both", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {NAV_LINKS.map(n => (
            <div key={n} className="mobile-nav-link" onClick={() => scrollTo(n)}>{n}</div>
          ))}
        </div>
      )}

      {/* SNAP SCROLL CONTAINER */}
      <div ref={containerRef} className="snap-container">

        {/* HERO */}
        <div id="Hero" className="snap-page">
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", width: "100%" }}>
            <div style={{ animation: heroVisible ? "fadeSlideUp 0.8s ease 0.1s both" : "none" }}>
              <div className="section-label" style={{ marginBottom: "20px" }}>Available for work · Based in Cebu, PH</div>
            </div>
            <div style={{ animation: heroVisible ? "fadeSlideUp 0.8s ease 0.2s both" : "none" }}>
              <h1 style={{ fontFamily: font, fontSize: isMobile ? "clamp(36px,10vw,52px)" : "clamp(48px,7vw,84px)", lineHeight: 1.04, letterSpacing: "-0.03em", marginBottom: "6px", fontWeight: 400 }}>Hi, I'm a</h1>
              <h1 style={{ fontFamily: font, fontSize: isMobile ? "clamp(36px,10vw,52px)" : "clamp(48px,7vw,84px)", lineHeight: 1.04, letterSpacing: "-0.03em", marginBottom: "20px", fontWeight: 400, minHeight: "1.1em", display: "flex", alignItems: "center" }}>
                <span style={{ background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.7))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{typedWord}</span>
                <span style={{ animation: "blink 1s step-end infinite", marginLeft: "4px", color: "#fff" }}>|</span>
              </h1>
            </div>
            <div style={{ animation: heroVisible ? "fadeSlideUp 0.8s ease 0.3s both" : "none" }}>
              <p style={{ fontSize: isMobile ? "15px" : "17px", lineHeight: 1.8, color: "rgba(255,255,255,0.8)", maxWidth: "480px", marginBottom: "32px", fontWeight: 300 }}>
                Full-stack developer passionate about clean code, thoughtful UX, and products that make a genuine difference.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", animation: heroVisible ? "fadeSlideUp 0.8s ease 0.4s both" : "none" }}>
              <MagneticButton className="glow-btn" onClick={() => scrollTo("Projects")}>View Work</MagneticButton>
              <MagneticButton className="outline-btn" onClick={() => scrollTo("Contact")}>Get in touch</MagneticButton>
            </div>
            <div style={{ marginTop: "40px", display: "flex", gap: "12px", flexWrap: "wrap", animation: heroVisible ? "fadeSlideUp 0.8s ease 0.5s both" : "none" }}>
              {[["5+", "Years exp."], ["24", "Projects"], ["12", "Certs"]].map(([n, l]) => (
                <div key={l} className="stat-card">
                  <div style={{ fontFamily: font, fontSize: isMobile ? "28px" : "34px", letterSpacing: "-0.03em", color: "#fff" }}>{n}</div>
                  <div style={{ fontFamily: mono, fontSize: "10px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "3px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div id="About" className="snap-page">
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: sectionPad, width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: isMobile ? "32px" : "64px", alignItems: "center" }}>
              {/* Photo first on mobile */}
              {isMobile && (
                <div style={{ position: "relative", width: "180px", height: "220px", margin: "0 auto" }}>
                  <img src="/cute.jpg" alt="Ehrica Jynne" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", borderRadius: "50%", display: "block", border: "3px solid rgba(255,255,255,0.3)" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.15) 100%)", pointerEvents: "none" }} />
                </div>
              )}
              <div>
                <div className="section-label">01 — About Me</div>
                <h2 style={{ fontFamily: font, fontSize: isMobile ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,46px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "20px", fontWeight: 400 }}>
                  Crafting digital experiences with intent.
                </h2>
                <p style={{ fontSize: isMobile ? "14px" : "15px", lineHeight: 1.85, color: "rgba(255,255,255,0.8)", fontWeight: 300, marginBottom: "14px" }}>
                  I'm a full-stack developer based in Cebu with a strong eye for design and a love for performance-optimized code.
                </p>
                <p style={{ fontSize: isMobile ? "14px" : "15px", lineHeight: 1.85, color: "rgba(255,255,255,0.8)", fontWeight: 300 }}>
                  When I'm not coding, I'm exploring UI patterns, contributing to open source, or learning a new language.
                </p>
              </div>
              {/* Photo on right for desktop */}
              {!isMobile && (
                <div style={{ position: "relative", aspectRatio: "4/5", maxHeight: "520px" }}>
                  <img src="/cute.jpg" alt="Ehrica Jynne" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", borderRadius: "16px", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.08) 80%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.18) 100%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div id="Skills" ref={skillsRef} className="snap-page">
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: sectionPad, width: "100%" }}>
            <div className="section-label">02 — Skills</div>
            <h2 style={{ fontFamily: font, fontSize: isMobile ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "28px", fontWeight: 400 }}>What I work with.</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: "12px" }}>
              {SKILLS.map(({ name, level, color }, i) => (
                <SkillCard key={name} name={name} level={level} color={color} delay={i * 80} visible={skillsVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* LANGUAGES */}
        <div id="Languages" ref={langsRef} className="snap-page">
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: sectionPad, width: "100%" }}>
            <div className="section-label">03 — Languages</div>
            <h2 style={{ fontFamily: font, fontSize: isMobile ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "28px", fontWeight: 400 }}>How I communicate.</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {LANGUAGES.map(({ name, level, pct }, i) => (
                <LangCard key={name} name={name} level={level} pct={pct} delay={i * 100} visible={langsVisible} isMobile={isMobile} />
              ))}
            </div>
          </div>
        </div>

        {/* CERTIFICATES */}
        <div id="Certificates" ref={certsRef} className="snap-page">
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: sectionPad, width: "100%" }}>
            <div className="section-label">04 — Certificates</div>
            <h2 style={{ fontFamily: font, fontSize: isMobile ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "28px", fontWeight: 400 }}>Credentials & learning.</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "12px" }}>
              {CERTIFICATES.map(({ title, issuer, year, badge }, i) => (
                <CertCard key={title} title={title} issuer={issuer} year={year} badge={badge} index={i} visible={certsVisible} isMobile={isMobile} />
              ))}
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div id="Projects" ref={projsRef} className="snap-page">
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: sectionPad, width: "100%" }}>
            <div className="section-label">05 — Projects</div>
            <h2 style={{ fontFamily: font, fontSize: isMobile ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "28px", fontWeight: 400 }}>Selected work.</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "12px" }}>
              {PROJECTS.map(({ title, desc, tags, year, accent }, i) => (
                <ProjectCard key={title} title={title} desc={desc} tags={tags} year={year} accent={accent} index={i} visible={projsVisible} isMobile={isMobile} />
              ))}
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div id="Contact" className="snap-page">
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: sectionPad, width: "100%" }}>
            <div className="section-label">06 — Contact</div>
            <h2 style={{ fontFamily: font, fontSize: isMobile ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "10px", fontWeight: 400 }}>Let's work together.</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: 300, marginBottom: "28px", lineHeight: 1.7 }}>Open to freelance projects, full-time roles, and interesting collaborations.</p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "28px" : "48px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" placeholder="Your name" />
                <input type="email" placeholder="your@email.com" />
                <textarea placeholder="Tell me about your project..." rows={isMobile ? 3 : 4} style={{ resize: "vertical" }} />
                <MagneticButton className="submit-btn" style={{ alignSelf: "flex-start" }}>Send Message</MagneticButton>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[["Email", "ehrica@email.com"], ["LinkedIn", "linkedin.com/in/ehricajynne"], ["GitHub", "github.com/kenjaxx"]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontFamily: mono, fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ height: "56px", scrollSnapAlign: "end", display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 20px" : "0 48px", background: "rgba(0,0,0,0.2)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 2 }}>
          <span style={{ fontFamily: mono, fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>© 2025 Ehrica Jynne Espada</span>
          <span style={{ fontFamily: mono, fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>Built with React</span>
        </div>

      </div>
    </div>
  );
}