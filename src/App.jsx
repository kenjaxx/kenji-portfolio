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

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FloatingOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {[
        { w: 600, h: 600, top: "-10%", left: "-5%", color: "rgba(255,255,255,0.12)", dur: "18s", delay: "0s" },
        { w: 400, h: 400, top: "30%", right: "-8%", color: "rgba(255,255,255,0.08)", dur: "22s", delay: "-6s" },
        { w: 300, h: 300, bottom: "10%", left: "20%", color: "rgba(255,255,255,0.10)", dur: "16s", delay: "-3s" },
        { w: 250, h: 250, top: "60%", right: "25%", color: "rgba(255,255,255,0.07)", dur: "20s", delay: "-10s" },
        { w: 180, h: 180, top: "15%", left: "40%", color: "rgba(255,255,255,0.09)", dur: "14s", delay: "-8s" },
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

function TiltCard({ children, style = {} }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const card = ref.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -6;
    const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)"; };
  return <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ transition: "transform 0.35s ease", transformStyle: "preserve-3d", ...style }}>{children}</div>;
}

function MagneticButton({ children, className, onClick, style = {} }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const btn = ref.current; if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.28}px, ${(e.clientY - rect.top - rect.height / 2) * 0.28}px)`;
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
        height: "100%",
        background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.9))`,
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
        borderRadius: "16px", padding: "24px",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)` : "none",
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>{name}</span>
        <span style={{ fontFamily: mono, fontSize: "13px", color: hovered ? color : "rgba(255,255,255,0.6)", fontWeight: 600, transition: "color 0.3s" }}>{level}%</span>
      </div>
      <AnimatedBar pct={level} delay={delay} visible={visible} color={color} />
    </div>
  );
}

function LangCard({ name, level, pct, delay, visible }) {
  const [hovered, setHovered] = useState(false);
  const levelColors = { Native: "#34d399", Fluent: "#60a5fa", Intermediate: "#f472b6", Beginner: "#fbbf24" };
  const col = levelColors[level] || "#fff";
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)"}`,
        borderRadius: "16px", padding: "28px 32px",
        display: "grid", gridTemplateColumns: "180px 1fr 60px",
        gap: "24px", alignItems: "center",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>{name}</div>
        <span style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: col, background: `${col}22`, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${col}44` }}>{level}</span>
      </div>
      <AnimatedBar pct={pct} delay={delay} visible={visible} color={col} />
      <span style={{ fontFamily: mono, fontSize: "13px", color: "rgba(255,255,255,0.5)", textAlign: "right", fontWeight: 500 }}>{pct}%</span>
    </div>
  );
}

function CertCard({ title, issuer, year, badge, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <TiltCard>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)"}`,
          padding: "32px", borderRadius: "20px",
          background: hovered ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
          boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.2)" : "none",
          cursor: "default",
          opacity: visible ? 1 : 0,
          transitionDelay: `${index * 80}ms`,
          height: "100%",
        }}>
        <div style={{ fontSize: "36px", marginBottom: "20px" }}>{badge}</div>
        <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "#fff", lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontFamily: mono, fontSize: "12px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>{issuer}</div>
        <div style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{year}</div>
      </div>
    </TiltCard>
  );
}

function ProjectCard({ title, desc, tags, year, accent, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <TiltCard>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.15)"}`,
          background: hovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)", padding: "32px", borderRadius: "20px",
          cursor: "default",
          transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
          boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px ${accent}44` : "none",
          opacity: visible ? 1 : 0,
          transitionDelay: `${index * 100}ms`,
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <span style={{ fontSize: "20px", fontWeight: 700, color: hovered ? accent : "#fff", transition: "color 0.3s", fontFamily: font }}>{title}</span>
          <span style={{ fontFamily: mono, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginLeft: "16px", flexShrink: 0 }}>{year}</span>
        </div>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "20px", fontWeight: 300 }}>{desc}</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {tags.map(t => (
            <span key={t} style={{
              fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: mono,
              color: hovered ? accent : "rgba(255,255,255,0.7)",
              background: hovered ? `${accent}18` : "rgba(255,255,255,0.12)",
              padding: "4px 12px", borderRadius: "20px",
              border: `1px solid ${hovered ? `${accent}44` : "rgba(255,255,255,0.2)"}`,
              transition: "all 0.3s",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

// Full-page snap section
function Page({ id, children, index }) {
  const [ref, visible] = useInView(0.3);
  return (
    <div id={id} ref={ref} style={{
      height: "100vh", width: "100%",
      scrollSnapAlign: "start", scrollSnapStop: "always",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", zIndex: 2,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)",
    }}>
      <div style={{ width: "100%", maxWidth: "960px", padding: "80px 40px 40px", overflowY: "auto", maxHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("Hero");
  const [heroVisible, setHeroVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 });
  const [scrolled, setScrolled] = useState(false);
  const typedWord = useTypewriter(WORDS);
  const containerRef = useRef(null);

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
  };

  // Skills/Lang visibility
  const [skillsRef, skillsVisible] = useInView(0.2);
  const [langsRef, langsVisible] = useInView(0.2);
  const [certsRef, certsVisible] = useInView(0.2);
  const [projsRef, projsVisible] = useInView(0.2);

  return (
    <div style={{ fontFamily: sans, color: "#fff", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
        ::selection { background: rgba(255,255,255,0.3); }
        @keyframes floatOrb { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-40px) scale(1.05); } 66% { transform: translate(-20px,20px) scale(0.97); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .snap-container { height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory; scroll-behavior: smooth; }
        .snap-container::-webkit-scrollbar { width: 4px; }
        .snap-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
        .nav-link { cursor: pointer; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; color: rgba(255,255,255,0.6); transition: color 0.2s; position: relative; padding-bottom: 3px; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#fff; transition:width 0.3s ease; }
        .nav-link:hover::after, .nav-link.active::after { width:100%; }
        .nav-link:hover, .nav-link.active { color:#fff; }
        .glow-btn { background: rgba(255,255,255,0.2); color:#fff; border: 1px solid rgba(255,255,255,0.45); padding:14px 36px; font-family:${sans}; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; font-weight:500; cursor:pointer; border-radius:8px; backdrop-filter:blur(8px); transition:all 0.3s; }
        .glow-btn:hover { background:rgba(255,255,255,0.35); box-shadow:0 8px 32px rgba(0,0,0,0.2); }
        .outline-btn { background:transparent; color:rgba(255,255,255,0.8); border:1px solid rgba(255,255,255,0.3); padding:14px 28px; font-family:${sans}; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; font-weight:500; cursor:pointer; border-radius:8px; transition:all 0.3s; }
        .outline-btn:hover { border-color:rgba(255,255,255,0.8); color:#fff; }
        .submit-btn { background:rgba(255,255,255,0.2); color:#fff; border:1px solid rgba(255,255,255,0.45); padding:14px 36px; font-family:${sans}; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; font-weight:500; cursor:pointer; border-radius:8px; backdrop-filter:blur(8px); transition:all 0.3s; }
        .submit-btn:hover { background:rgba(255,255,255,0.35); }
        input, textarea { font-family:${sans}; border:1px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.12); backdrop-filter:blur(8px); padding:14px 16px; border-radius:8px; font-size:14px; color:#fff; outline:none; transition:border-color 0.2s,box-shadow 0.2s; width:100%; }
        input:focus, textarea:focus { border-color:rgba(255,255,255,0.7); box-shadow:0 0 0 3px rgba(255,255,255,0.08); }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.4); }
        .stat-card { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:14px; padding:24px 28px; transition:all 0.3s; backdrop-filter:blur(12px); }
        .stat-card:hover { background:rgba(255,255,255,0.22); transform:translateY(-3px); }
        .section-label { font-family:${mono}; font-size:11px; color:rgba(255,255,255,0.65); letter-spacing:0.14em; text-transform:uppercase; margin-bottom:16px; display:flex; align-items:center; gap:10px; }
        .section-label::before { content:''; width:20px; height:1px; background:rgba(255,255,255,0.65); display:inline-block; }
      `}</style>

      {/* CURSOR GLOW */}
      <div style={{ position: "fixed", pointerEvents: "none", zIndex: 9999, left: cursorPos.x - 250, top: cursorPos.y - 250, width: 500, height: 500, background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)", borderRadius: "50%", transition: "left 0.08s linear, top 0.08s linear" }} />

      <FloatingOrbs />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(0,0,0,0.3)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent", transition: "all 0.4s", padding: "0 48px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: font, fontSize: "20px", color: "#fff", letterSpacing: "-0.01em" }}>Ehrica Jynne Espada</span>
        <div style={{ display: "flex", gap: "32px" }}>
          {NAV_LINKS.map(n => <span key={n} className={`nav-link${active === n ? " active" : ""}`} onClick={() => scrollTo(n)}>{n}</span>)}
        </div>
      </nav>

      {/* SNAP SCROLL CONTAINER */}
      <div ref={containerRef} className="snap-container">

        {/* HERO PAGE */}
        <div id="Hero" style={{ height: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 40px", width: "100%" }}>
            <div style={{ animation: heroVisible ? "fadeSlideUp 0.8s ease 0.1s both" : "none" }}>
              <div className="section-label" style={{ marginBottom: "24px" }}>Available for work · Based in Cebu, PH</div>
            </div>
            <div style={{ animation: heroVisible ? "fadeSlideUp 0.8s ease 0.2s both" : "none" }}>
              <h1 style={{ fontFamily: font, fontSize: "clamp(48px,7vw,84px)", lineHeight: 1.04, letterSpacing: "-0.03em", marginBottom: "8px", fontWeight: 400 }}>Hi, I'm a</h1>
              <h1 style={{ fontFamily: font, fontSize: "clamp(48px,7vw,84px)", lineHeight: 1.04, letterSpacing: "-0.03em", marginBottom: "24px", fontWeight: 400, minHeight: "1.1em", display: "flex", alignItems: "center" }}>
                <span style={{ background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.7))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{typedWord}</span>
                <span style={{ animation: "blink 1s step-end infinite", marginLeft: "4px", color: "#fff" }}>|</span>
              </h1>
            </div>
            <div style={{ animation: heroVisible ? "fadeSlideUp 0.8s ease 0.3s both" : "none" }}>
              <p style={{ fontSize: "17px", lineHeight: 1.8, color: "rgba(255,255,255,0.8)", maxWidth: "480px", marginBottom: "40px", fontWeight: 300 }}>
                Full-stack developer passionate about clean code, thoughtful UX, and products that make a genuine difference.
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", animation: heroVisible ? "fadeSlideUp 0.8s ease 0.4s both" : "none" }}>
              <MagneticButton className="glow-btn" onClick={() => scrollTo("Projects")}>View Work</MagneticButton>
              <MagneticButton className="outline-btn" onClick={() => scrollTo("Contact")}>Get in touch</MagneticButton>
            </div>
            <div style={{ marginTop: "56px", display: "flex", gap: "16px", animation: heroVisible ? "fadeSlideUp 0.8s ease 0.5s both" : "none" }}>
              {[["5+", "Years exp."], ["24", "Projects"], ["12", "Certificates"]].map(([n, l]) => (
                <div key={l} className="stat-card">
                  <div style={{ fontFamily: font, fontSize: "36px", letterSpacing: "-0.03em", color: "#fff" }}>{n}</div>
                  <div style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animation: heroVisible ? "fadeSlideUp 0.8s ease 0.8s both" : "none", cursor: "pointer" }} onClick={() => scrollTo("About")}>
              <span style={{ fontFamily: mono, fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
              <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)", animation: "fadeSlideUp 1.5s ease infinite" }} />
            </div>
          </div>
        </div>

        {/* ABOUT PAGE */}
        <Page id="About" index={0}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "56px", alignItems: "center" }}>
            <div>
              <div className="section-label">01 — About Me</div>
              <h2 style={{ fontFamily: font, fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "24px", fontWeight: 400 }}>
                Crafting digital<br />experiences with intent.
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.9, color: "rgba(255,255,255,0.8)", fontWeight: 300, marginBottom: "16px" }}>
                I'm a full-stack developer based in Cebu with a strong eye for design and a love for performance-optimized code. I bridge the gap between engineering and UX.
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.9, color: "rgba(255,255,255,0.8)", fontWeight: 300 }}>
                When I'm not coding, I'm exploring UI patterns, contributing to open source, or learning a new language.
              </p>
            </div>
            {/* BLENDED PHOTO */}
            <div style={{ position: "relative", aspectRatio: "4/5", maxHeight: "520px" }}>
              <img src="/cute.jpg" alt="Ehrica Jynne"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", borderRadius: "16px", display: "block" }}
              />
              {/* Soft edge blend */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.08) 80%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.18) 100%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 20%, transparent 65%, rgba(0,0,0,0.35) 100%)", pointerEvents: "none" }} />
            </div>
          </div>
        </Page>

        {/* SKILLS PAGE */}
        <div id="Skills" ref={skillsRef} style={{ minHeight: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 40px", width: "100%" }}>
            <div className="section-label">02 — Skills</div>
            <h2 style={{ fontFamily: font, fontSize: "clamp(36px,4.5vw,54px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "40px", fontWeight: 400 }}>What I work with.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {SKILLS.map(({ name, level, color }, i) => (
                <SkillCard key={name} name={name} level={level} color={color} delay={i * 80} visible={skillsVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* LANGUAGES PAGE */}
        <div id="Languages" ref={langsRef} style={{ minHeight: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 40px", width: "100%" }}>
            <div className="section-label">03 — Languages</div>
            <h2 style={{ fontFamily: font, fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "40px", fontWeight: 400 }}>How I communicate.</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {LANGUAGES.map(({ name, level, pct }, i) => (
                <LangCard key={name} name={name} level={level} pct={pct} delay={i * 100} visible={langsVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* CERTIFICATES PAGE */}
        <div id="Certificates" ref={certsRef} style={{ minHeight: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 40px", width: "100%" }}>
            <div className="section-label">04 — Certificates</div>
            <h2 style={{ fontFamily: font, fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "40px", fontWeight: 400 }}>Credentials & learning.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              {CERTIFICATES.map(({ title, issuer, year, badge }, i) => (
                <CertCard key={title} title={title} issuer={issuer} year={year} badge={badge} index={i} visible={certsVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* PROJECTS PAGE */}
        <div id="Projects" ref={projsRef} style={{ minHeight: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 40px", width: "100%" }}>
            <div className="section-label">05 — Projects</div>
            <h2 style={{ fontFamily: font, fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "40px", fontWeight: 400 }}>Selected work.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              {PROJECTS.map(({ title, desc, tags, year, accent }, i) => (
                <ProjectCard key={title} title={title} desc={desc} tags={tags} year={year} accent={accent} index={i} visible={projsVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* CONTACT PAGE */}
        <div id="Contact" style={{ minHeight: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 40px", width: "100%" }}>
            <div className="section-label">06 — Contact</div>
            <h2 style={{ fontFamily: font, fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px", fontWeight: 400 }}>Let's work together.</h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", fontWeight: 300, marginBottom: "40px", lineHeight: 1.7 }}>Open to freelance projects, full-time roles, and interesting collaborations.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input type="text" placeholder="Your name" />
                <input type="email" placeholder="your@email.com" />
                <textarea placeholder="Tell me about your project..." rows={4} style={{ resize: "vertical" }} />
                <MagneticButton className="submit-btn" style={{ alignSelf: "flex-start" }}>Send Message</MagneticButton>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px", paddingTop: "4px" }}>
                {[["Email", "ica.acads@email.com"], ["LinkedIn", "linkedin.com/in/ehricajynne"], ["GitHub", "github.com/kenjaxx"]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ height: "60px", scrollSnapAlign: "end", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: "rgba(0,0,0,0.2)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 2 }}>
          <span style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>© 2025 Ehrica Jynne Espada</span>
          <span style={{ fontFamily: mono, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>Built with React · Hosted on Netlify</span>
        </div>

      </div>
    </div>
  );
}