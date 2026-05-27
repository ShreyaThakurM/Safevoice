import clayBg from "@/assets/clay-bg.jpg";
import safeShape from "@/assets/safe-shape.jpg";
import shieldShape from "@/assets/shield-shape.jpg";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import pic1 from "@/assets/pic1.png";
import pic2 from "@/assets/pic2.png";
import logo from "@/assets/logo.png";

// ── Severity config ──────────────────────────────────────
const SEV = {
  1: { label: "Low",      color: "hsl(var(--clay-sage))",      bg: "rgba(134,175,140,0.12)", border: "rgba(134,175,140,0.35)" },
  2: { label: "Medium",   color: "hsl(var(--clay-peach))",     bg: "rgba(232,180,140,0.12)", border: "rgba(232,180,140,0.35)" },
  3: { label: "High",     color: "hsl(var(--clay-terracotta))",bg: "rgba(185,90,70,0.10)",   border: "rgba(185,90,70,0.30)" },
  4: { label: "Critical", color: "#b83a60",                    bg: "rgba(184,58,96,0.08)",   border: "rgba(184,58,96,0.28)" },
};
const CRIME_LABELS = {
  domestic_violence:"Domestic Violence", sexual_assault:"Sexual Assault",
  workplace_harassment:"Workplace Harassment", stalking:"Stalking",
  cyber_stalking:"Cyber Stalking", cyber_crime:"Cyber Crime",
  dowry_harassment:"Dowry Harassment", acid_attack:"Acid Attack",
  trafficking:"Human Trafficking", honour_crime:"Honour Crime",
  molestation:"Molestation", property_rights:"Property Rights Violation",
  labour_exploitation:"Labour Exploitation",
};

// ── Result panel ─────────────────────────────────────────
function ResultPanel({ result, onClose }) {
  const [tab, setTab] = useState("steps");
  if (!result) return null;
  const sev   = SEV[result.severity_level] || SEV[2];
  const legal = result.legal || {};
  const sim   = result.similar_case;
  const crime = CRIME_LABELS[result.crime_type] || result.crime_type;
  const conf  = Math.round((result.severity_confidence || 0) * 100);

  const tabs = [
    { id:"steps",     label:"Steps" },
    { id:"laws",      label:"Laws" },
    { id:"authority", label:"Where to Report" },
    { id:"ngos",      label:"NGOs" },
    { id:"similar",   label:"Similar Case" },
  ];

  return (
    <div className="glass-card !p-0 overflow-hidden mt-6" style={{ border: `1px solid ${sev.border}` }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-6" style={{ background: sev.bg }}>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: sev.color }}>
            Severity Assessment
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-[Fraunces] text-2xl text-foreground/90">
              {sev.label} — Level {result.severity_level}
            </span>
            <span className="clay-pill !rounded-full px-3 py-1 text-[10px] font-medium" style={{ color: sev.color }}>
              {crime}
            </span>
            <span className="text-[10px] text-muted-foreground">{conf}% confidence</span>
          </div>
          <p className="text-xs text-foreground/70 mt-2 leading-relaxed max-w-lg">
            {result.severity_message}
          </p>
        </div>
        <button onClick={onClose} className="clay-pill w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground text-sm flex-shrink-0">
          ✕
        </button>
      </div>

      {/* Helplines strip */}
      {legal.helplines && legal.helplines.length > 0 && (
        <div className="px-6 py-3 flex flex-wrap gap-2 border-b border-border/40" style={{ background: "rgba(185,90,70,0.06)" }}>
          <span className="text-[10px] uppercase tracking-widest text-clay-terracotta self-center mr-1">📞 Call now:</span>
          {legal.helplines.map((h, i) => (
            <span key={i} className="clay-pill !rounded-full px-3 py-1 text-[10px] font-medium text-foreground/80">{h}</span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border/40 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${
              tab === t.id
                ? "text-clay-terracotta border-b-2 border-clay-terracotta font-medium"
                : "text-foreground/50 hover:text-foreground/80"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">

        {tab === "steps" && (
          <ol className="space-y-4">
            {(legal.steps || []).map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="clay-pill w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-foreground/70 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground/80 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        )}

        {tab === "laws" && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">IPC / BNS Sections</p>
              <div className="flex flex-wrap gap-2">
                {(legal.ipc_sections || []).map((s, i) => (
                  <span key={i} className="clay-pill !rounded-xl px-3 py-2 text-xs text-foreground/80">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 mt-4">Acts</p>
              <div className="flex flex-wrap gap-2">
                {(legal.acts || []).map((a, i) => (
                  <span key={i} className="clay-pill !rounded-xl px-3 py-2 text-xs text-foreground/80">{a}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "authority" && (
          <div className="space-y-2">
            {(legal.authority || []).map((a, i) => (
              <div key={i} className="clay-pill rounded-2xl px-4 py-3 text-sm text-foreground/80">{a}</div>
            ))}
          </div>
        )}

        {tab === "ngos" && (
          <div className="flex flex-wrap gap-2">
            {(legal.ngos || []).map((n, i) => (
              <span key={i} className="clay-pill !rounded-full px-4 py-2 text-xs font-medium text-foreground/80">{n}</span>
            ))}
          </div>
        )}

        {tab === "similar" && sim && (
          <div className="space-y-4">
            <div className="clay-pill rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">A similar case</p>
              <p className="text-sm text-foreground/70 italic leading-relaxed">"{sim.description}"</p>
            </div>
            <div className="clay-pill rounded-2xl p-4" style={{ borderLeft: `3px solid ${sev.color}` }}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">How it was resolved</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{sim.resolution}</p>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Source: {sim.source} · {Math.round((sim.similarity || 0) * 100)}% match to your case
            </p>
          </div>
        )}

        {tab === "similar" && !sim && (
          <p className="text-sm text-muted-foreground">No similar case found in the index.</p>
        )}

      </div>

      {/* Footer */}
      <div className="px-6 pb-5 text-center">
        <p className="text-[10px] text-muted-foreground">
          SafeVoice · Your story matters. You are not alone. 💜 &nbsp;|&nbsp;
          Immediate danger? Call <strong className="text-clay-terracotta">100</strong> or <strong className="text-clay-terracotta">181</strong>
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
const Index = () => {
  const [incident, setIncident] = useState("");
  const [region,   setRegion]   = useState("");
  const [time,     setTime]     = useState("");
  const [files,    setFiles]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleFiles = (e) => {
    const list  = e.target.files ? Array.from(e.target.files) : [];
    const valid = list.filter((f) => f.size <= 20 * 1024 * 1024 && /^(image|video)\//.test(f.type));
    setFiles(valid.slice(0, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const i = incident.trim();
    const r = region.trim();
    if (!i || i.length > 1000) { toast({ title: "Please describe the incident (max 1000 characters)." }); return; }
    if (!r || r.length > 120)  { toast({ title: "Please enter a valid region." }); return; }
    if (!time)                  { toast({ title: "Please select when it happened." }); return; }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ description: i, location: r }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Server error");
      const data = await res.json();
      setResult(data);
      toast({ title: "Report received — you're not alone.", description: "See your assessment below." });
      setTimeout(() => document.getElementById("result-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      toast({
        title: "Could not reach the assessment service.",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${clayBg})` }} />
      <div className="fixed inset-0 -z-10 bg-background/50" />

      {/* Nav */}
      <nav className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img src={logo} alt="Saheli" className="h-20 w-48 object-contain" />
        </a>
        <div className="hidden md:flex items-center gap-1 glass-card !p-1.5 !rounded-full">
          {[
            { l: "Report", to: "#report", active: true },
            { l: "Resources", to: "/resources" },
            { l: "Helplines", to: "/helplines" },
            { l: "Stories", to: "/stories" },
          ].map(({ l, to, active }) =>
            to.startsWith("/") ? (
              <Link key={l} to={to} className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">{l}</Link>
            ) : (
              <a key={l} href={to} className={`px-4 py-1.5 rounded-full text-xs ${active ? "clay-pill text-foreground font-medium" : "text-foreground/70 hover:text-foreground"}`}>{l}</a>
            )
          )}
        </div>
        <Link to="/helplines" className="px-5 py-2 rounded-full text-xs font-medium text-foreground clay-pill">Helplines →</Link>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">

        {/* HERO */}
        <section className="grid grid-cols-12 gap-5 md:gap-6 mt-6">
          <div className="col-span-12 lg:col-span-7 glass-card !p-8 md:!p-12 relative">
            <div className="absolute top-6 left-6 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">A safe place to be heard</p>
            <h1 className="font-[Fraunces] text-4xl md:text-6xl leading-[1.05] mt-4 text-foreground/90">
              Your story matters. <em className="text-clay-terracotta not-italic">You are not alone.</em>
            </h1>
            <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-md">
              Saheli is a confidential space for women to report a crime, find support, and connect with verified counsellors and legal help — at your pace.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <button className="px-6 py-3 rounded-full text-xs font-medium text-primary-foreground"
                style={{ background: "linear-gradient(135deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))", boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.5), 0 10px 20px -8px hsl(var(--shadow-soft) / 0.4)" }}>
                File a report
              </button>
              <button className="clay-pill px-6 py-3 rounded-full text-xs font-medium text-foreground">Talk to someone</button>
            </div>
            <div className="flex items-center gap-6 mt-10 pl-7">
              {[{ n:"100%", l:"Confidential" }, { n:"24/7", l:"Support" }, { n:"Free", l:"Always" }].map((s) => (
                <div key={s.l}>
                  <p className="font-[Fraunces] text-2xl text-foreground/85">{s.n}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 glass-card !p-3 relative overflow-hidden min-h-[420px]">
            <img src={pic1} alt="Safe" className="w-full h-full object-cover rounded-[calc(var(--radius)-0.5rem)]" width={1024} height={1024} />
            <button className="clay-pill w-9 h-9 rounded-full flex items-center justify-center text-foreground">→</button>
          </div>
        </section>

        {/* REPORT FORM */}
        <section id="report" className="mt-16 grid grid-cols-12 gap-5 md:gap-6">
          <div className="col-span-12 lg:col-span-5 glass-card !p-8 relative">
            <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">File a report</p>
            <h2 className="font-[Fraunces] text-3xl md:text-4xl text-foreground/90 mt-3 pl-7 leading-tight">
              Tell us, in your <em className="text-clay-terracotta not-italic">own words</em>.
            </h2>
            <p className="text-sm text-muted-foreground mt-4 pl-7 leading-relaxed">
              Every detail you share is encrypted and stays with you. You can attach photos or short videos as evidence — only if you wish to.
            </p>
            <div className="mt-6 pl-7 space-y-2">
              {["Anonymous by default", "Save & return anytime", "No data shared without consent"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-foreground/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-clay-terracotta" />{t}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-5">
            <form onSubmit={handleSubmit} className="glass-card !p-8 relative space-y-5">

              {/* Incident */}
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/70 ml-1">Incident</label>
                <textarea
                  value={incident}
                  onChange={(e) => setIncident(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder="Share what happened. Take your time."
                  className="mt-2 w-full clay-pill !rounded-2xl px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none focus:ring-2 focus:ring-clay-terracotta/40 resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">{incident.length}/1000</p>
              </div>

              {/* Region + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/70 ml-1">Region</label>
                  <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} maxLength={120}
                    placeholder="City, state or area"
                    className="mt-2 w-full clay-pill !rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none focus:ring-2 focus:ring-clay-terracotta/40" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/70 ml-1">Time</label>
                  <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)}
                    className="mt-2 w-full clay-pill !rounded-full px-5 py-3 text-sm text-foreground bg-transparent outline-none focus:ring-2 focus:ring-clay-terracotta/40" />
                </div>
              </div>

              {/* File upload */}
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-foreground/70 ml-1">
                  Attach photos or videos <span className="text-muted-foreground/70 normal-case tracking-normal">(optional · up to 5, 20MB each)</span>
                </label>
                <label className="mt-2 flex items-center justify-between gap-3 clay-pill !rounded-2xl px-5 py-4 cursor-pointer hover:opacity-90 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full clay-dot flex items-center justify-center text-foreground/80">+</span>
                    <div>
                      <p className="text-xs font-medium text-foreground/85">
                        {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} attached` : "Add photos or videos"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Encrypted upload · only your counsellor can view</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-clay-terracotta">Browse</span>
                  <input type="file" accept="image/*,video/*" multiple onChange={handleFiles} className="hidden" />
                </label>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {files.map((f, idx) => (
                      <span key={idx} className="clay-pill !rounded-full px-3 py-1.5 text-[10px] text-foreground/80 max-w-[200px] truncate">{f.name}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <p className="text-[10px] text-muted-foreground max-w-[260px] leading-relaxed">
                  By submitting, you agree to our confidential handling. You can withdraw anytime.
                </p>
                <button type="submit" disabled={loading}
                  className="px-7 py-3 rounded-full text-xs font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))", boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.5), 0 10px 20px -8px hsl(var(--shadow-soft) / 0.4)" }}>
                  {loading ? "Assessing…" : "Submit report"}
                </button>
              </div>
            </form>

            {/* Result panel */}
            <div id="result-panel">
              <ResultPanel result={result} onClose={() => setResult(null)} />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16">
          <div className="flex items-end justify-between mb-6 px-1">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta">How it works</p>
              <h2 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-1">Three gentle steps. At your pace.</h2>
            </div>
            <a href="#" className="text-xs text-foreground/70 hidden md:inline">Learn more →</a>
          </div>
          <div className="grid grid-cols-12 gap-5 md:gap-6">
            {[
              { step:"01", title:"Share what happened", body:"Type, voice-note or upload. You can stay anonymous, save a draft, and return whenever you feel ready.", color:"hsl(var(--clay-peach))" },
              { step:"02", title:"We listen & guide", body:"A trained counsellor reviews your report and explains your options — medical, legal, emotional — clearly and without pressure.", color:"hsl(var(--clay-sage))" },
              { step:"03", title:"Take the next step", body:"When you're ready, we help you file with the police, connect to a lawyer, or simply stay close as a quiet companion.", color:"hsl(var(--clay-terracotta))" },
            ].map((s) => (
              <article key={s.step} className="col-span-12 md:col-span-4 glass-card !p-7 relative">
                <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
                <p className="font-[Fraunces] text-5xl pl-7" style={{ color: s.color }}>{s.step}</p>
                <h3 className="font-[Fraunces] text-xl text-foreground/90 mt-3 pl-7">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 pl-7 leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* SUPPORT + REASSURANCE */}
        <section className="mt-16 grid grid-cols-12 gap-5 md:gap-6">
          <div className="col-span-12 lg:col-span-7 glass-card !p-8 md:!p-10 relative">
            <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">Your safety, our promise</p>
            <h3 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-3 pl-7 max-w-md leading-tight">Encrypted. Anonymous. Always in your control.</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {[
                { t:"End-to-end encrypted", d:"Only you and your counsellor can read it." },
                { t:"Quick exit button",    d:"One tap takes you to a neutral page." },
                { t:"Anonymous mode",       d:"Share without revealing your identity." },
                { t:"Delete anytime",       d:"Your report belongs to you, fully." },
              ].map((f) => (
                <div key={f.t} className="clay-pill rounded-2xl p-4">
                  <p className="text-xs font-medium text-foreground/85">{f.t}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 md:gap-6">
            <div className="glass-card !p-3 relative overflow-hidden flex-1 min-h-[180px]">
              <img src={pic2} alt="Shield" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover rounded-[calc(var(--radius)-0.5rem)]" />
            </div>
            <div className="glass-card !p-6 relative">
              <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">24/7 Helplines</p>
              <div className="space-y-2 mt-3">
                {[{ n:"Women's Helpline", num:"1091" }, { n:"Domestic Abuse", num:"181" }, { n:"Police Emergency", num:"112" }].map((h) => (
                  <a key={h.n} href={`tel:${h.num}`} className="clay-pill rounded-2xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs text-foreground/85">{h.n}</span>
                    <span className="font-[Fraunces] text-lg text-clay-terracotta">{h.num}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 glass-card !p-10 md:!p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-60"
            style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))", filter: "blur(40px)" }} />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-50"
            style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--clay-mint)), hsl(var(--clay-teal)))", filter: "blur(40px)" }} />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay-terracotta">When you're ready</p>
            <h2 className="font-[Fraunces] text-3xl md:text-5xl mt-4 text-foreground/90 max-w-2xl mx-auto leading-tight">Speaking up takes courage. We'll walk with you.</h2>
            <button className="mt-8 px-8 py-3.5 rounded-full text-xs font-medium text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))", boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.5), 0 12px 24px -8px hsl(var(--shadow-soft) / 0.4)" }}>
              Start your report
            </button>
          </div>
        </section>

        <footer className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
          <img src={logo} alt="Saheli" className="h-14 w-36 object-contain opacity-70" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">© Saheli · Confidential, free, and for you</p>
          <div className="flex gap-3">
            {["Privacy","Terms","Help"].map((s) => (
              <button key={s} className="clay-pill w-9 h-9 rounded-full text-[10px] font-medium text-foreground">{s}</button>
            ))}
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Index;