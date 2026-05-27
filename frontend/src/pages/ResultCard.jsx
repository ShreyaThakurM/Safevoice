// ╔══════════════════════════════════════════════════════════╗
// ║  SAFEVOICE — frontend/ResultCard.jsx                    ║
// ║  STEP 6: Copy to your React app's src/ folder           ║
// ║                                                          ║
// ║  In your index.jsx add:                                  ║
// ║    import CrimeForm from './ResultCard';                 ║
// ║    then use: <CrimeForm />                               ║
// ║                                                          ║
// ║  Also add to your .env file:                             ║
// ║    VITE_API_URL=http://localhost:8000                    ║
// ╚══════════════════════════════════════════════════════════╝

import { useState } from "react";

// ── Config ────────────────────────────────────────────────

const SEVERITY = {
  1: { label:"Low",      emoji:"🟢", color:"#16a34a", bg:"#f0fdf4", border:"#86efac" },
  2: { label:"Medium",   emoji:"🟡", color:"#d97706", bg:"#fffbeb", border:"#fcd34d" },
  3: { label:"High",     emoji:"🔴", color:"#dc2626", bg:"#fef2f2", border:"#fca5a5" },
  4: { label:"Critical", emoji:"🚨", color:"#7c3aed", bg:"#faf5ff", border:"#c084fc" },
};

const CRIME_DISPLAY = {
  domestic_violence:    "Domestic Violence",
  sexual_assault:       "Sexual Assault",
  workplace_harassment: "Workplace Harassment",
  stalking:             "Stalking",
  cyber_stalking:       "Cyber Stalking",
  cyber_crime:          "Cyber Crime",
  dowry_harassment:     "Dowry Harassment",
  acid_attack:          "Acid Attack",
  trafficking:          "Human Trafficking",
  honour_crime:         "Honour Crime",
  molestation:          "Molestation",
  property_rights:      "Property Rights Violation",
  labour_exploitation:  "Labour Exploitation",
};

// ── Styles ────────────────────────────────────────────────

const s = {
  card: {
    background:"white", borderRadius:14, padding:"20px 24px",
    marginBottom:14, border:"1px solid #e5e7eb",
    boxShadow:"0 1px 4px rgba(0,0,0,0.06)"
  },
  label: {
    fontSize:11, fontWeight:700, color:"#888",
    letterSpacing:2, textTransform:"uppercase", marginBottom:8
  },
  chip: (bg, color) => ({
    display:"inline-block", background:bg, color:color,
    borderRadius:8, padding:"5px 12px", fontSize:13,
    fontWeight:600, margin:"3px 4px 3px 0"
  }),
  btn: (active) => ({
    width:"100%", textAlign:"left", background:active?"#f8fafc":"white",
    border:"none", padding:"14px 20px", fontSize:14,
    fontWeight:700, cursor:"pointer", color:"#111",
    display:"flex", justifyContent:"space-between",
    borderBottom: active ? "none" : "1px solid #e5e7eb"
  }),
  input: {
    width:"100%", padding:"11px 14px", fontSize:14,
    border:"1px solid #d1d5db", borderRadius:9,
    outline:"none", boxSizing:"border-box", fontFamily:"inherit"
  }
};

// ╔══════════════════════════════════════════════════════════╗
// ║  ResultCard — renders the prediction result              ║
// ╚══════════════════════════════════════════════════════════╝

export function ResultCard({ result }) {
  const [open, setOpen] = useState("steps");
  if (!result) return null;

  const sev   = SEVERITY[result.severity_level] || SEVERITY[2];
  const crime = CRIME_DISPLAY[result.crime_type] || result.crime_type;
  const legal = result.legal;
  const sim   = result.similar_case;

  const toggle = (id) => setOpen(p => p === id ? null : id);

  const AccordionItem = ({ id, title, children }) => (
    <div style={{ border:"1px solid #e5e7eb", borderRadius:10, marginBottom:10, overflow:"hidden" }}>
      <button onClick={() => toggle(id)} style={s.btn(open === id)}>
        {title} <span>{open === id ? "▲" : "▼"}</span>
      </button>
      {open === id && (
        <div style={{ padding:"16px 20px", background:"#fafafa", borderTop:"1px solid #f0f0f0" }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:700, margin:"0 auto" }}>

      {/* ── Severity banner ── */}
      <div style={{
        ...s.card,
        background:sev.bg, border:`2px solid ${sev.border}`, marginBottom:14
      }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <span style={{ fontSize:36, lineHeight:1 }}>{sev.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={s.label}>Severity Assessment</div>
            <div style={{ fontSize:26, fontWeight:800, color:sev.color, marginBottom:4 }}>
              {sev.label} — Level {result.severity_level}
            </div>
            <div style={{ fontSize:14, color:"#444", lineHeight:1.6 }}>
              {result.severity_message}
            </div>
            <div style={{
              marginTop:12, background:"white", borderRadius:8,
              padding:"7px 14px", display:"inline-block",
              fontSize:13, border:"1px solid #e5e7eb"
            }}>
              Identified as: <strong>{crime}</strong>
              <span style={{ color:"#aaa", marginLeft:8, fontSize:11 }}>
                ({Math.round(result.severity_confidence * 100)}% confidence)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Helplines ── */}
      <div style={{
        background:"#1e1b4b", borderRadius:12, padding:"16px 22px", marginBottom:14
      }}>
        <div style={{ ...s.label, color:"#a5b4fc", marginBottom:10 }}>
          📞 CALL NOW — FREE 24×7 HELPLINES
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {legal.helplines.map((h, i) => (
            <div key={i} style={{
              background:"#312e81", color:"#e0e7ff",
              borderRadius:8, padding:"6px 14px", fontSize:13, fontWeight:600
            }}>{h}</div>
          ))}
        </div>
      </div>

      {/* ── Steps ── */}
      <AccordionItem id="steps" title="✅  What You Should Do — Step by Step">
        <ol style={{ margin:0, paddingLeft:20, lineHeight:1 }}>
          {legal.steps.map((step, i) => (
            <li key={i} style={{ fontSize:14, color:"#1e293b", marginBottom:10, lineHeight:1.65 }}>
              {step}
            </li>
          ))}
        </ol>
      </AccordionItem>

      {/* ── Legal sections ── */}
      <AccordionItem id="legal" title="⚖️  Applicable Laws & IPC Sections">
        <div style={s.label}>IPC / BNS Sections</div>
        {legal.ipc_sections.map((x, i) => (
          <div key={i} style={{ background:"#f1f5f9", borderRadius:7, padding:"7px 13px", fontSize:13, marginBottom:5, color:"#1e293b" }}>
            {x}
          </div>
        ))}
        <div style={{ ...s.label, marginTop:14 }}>Acts</div>
        {legal.acts.map((x, i) => (
          <div key={i} style={{ background:"#fef9c3", borderRadius:7, padding:"7px 13px", fontSize:13, marginBottom:5, color:"#713f12" }}>
            {x}
          </div>
        ))}
      </AccordionItem>

      {/* ── Where to report ── */}
      <AccordionItem id="authority" title="🏛️  Where to Report">
        <ul style={{ margin:0, paddingLeft:20 }}>
          {legal.authority.map((x, i) => (
            <li key={i} style={{ fontSize:14, color:"#333", marginBottom:8, lineHeight:1.5 }}>{x}</li>
          ))}
        </ul>
      </AccordionItem>

      {/* ── NGOs ── */}
      <AccordionItem id="ngos" title="🤝  NGOs That Can Help You">
        <div style={{ display:"flex", flexWrap:"wrap" }}>
          {legal.ngos.map((x, i) => (
            <span key={i} style={s.chip("#ede9fe", "#4c1d95")}>{x}</span>
          ))}
        </div>
      </AccordionItem>

      {/* ── Similar real case ── */}
      {sim && (
        <div style={{
          ...s.card,
          background:"#fff7ed", border:"1px solid #fed7aa", marginTop:4
        }}>
          <div style={{ ...s.label, color:"#c2410c" }}>📖 Real Similar Case — How It Was Resolved</div>
          <div style={{
            fontSize:14, color:"#78350f", fontStyle:"italic",
            lineHeight:1.65, marginBottom:12, paddingLeft:12,
            borderLeft:"3px solid #fb923c"
          }}>
            "{sim.description}"
          </div>
          <div style={{
            background:"white", borderRadius:9, padding:"12px 16px",
            borderLeft:"4px solid #f97316"
          }}>
            <div style={s.label}>Resolution</div>
            <div style={{ fontSize:14, color:"#333", lineHeight:1.7 }}>
              {sim.resolution}
            </div>
          </div>
          <div style={{ fontSize:11, color:"#aaa", marginTop:10 }}>
            Source: {sim.source} · {Math.round(sim.similarity * 100)}% match to your case
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ textAlign:"center", padding:"16px 0", fontSize:12, color:"#aaa" }}>
        SafeVoice — Your story matters. You are not alone. 💜
        <br/>
        Immediate danger? Call <strong style={{ color:"#dc2626" }}>100</strong> (Police) or{" "}
        <strong style={{ color:"#7c3aed" }}>181</strong> (Women Helpline) right now.
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  CrimeForm — the input form (paste in your index.jsx)   ║
// ╚══════════════════════════════════════════════════════════╝

export function CrimeForm() {
  const [description, setDescription] = useState("");
  const [name,        setName]        = useState("");
  const [location,    setLocation]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState("");

  const API = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL)
    || "http://localhost:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      setError("Please describe the incident in at least 20 characters.");
      return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API}/predict`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ description, name, location })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || "Server error"); }
      setResult(await res.json());
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:700, margin:"0 auto", padding:24 }}>

      <form onSubmit={handleSubmit} style={{ marginBottom:32 }}>

        {/* Name */}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:6, fontSize:14 }}>
            Your Name <span style={{ color:"#aaa", fontWeight:400 }}>(optional — stays confidential)</span>
          </label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)}
            placeholder="You may stay anonymous" style={s.input} />
        </div>

        {/* Location */}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:6, fontSize:14 }}>
            Location <span style={{ color:"#aaa", fontWeight:400 }}>(optional — helps us suggest local NGOs)</span>
          </label>
          <input type="text" value={location} onChange={e=>setLocation(e.target.value)}
            placeholder="e.g. Chennai, Tamil Nadu" style={s.input} />
        </div>

        {/* Description */}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:6, fontSize:14 }}>
            Describe what happened <span style={{ color:"#dc2626" }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe the incident in your own words. The more detail you share, the better we can help. Your information is completely private and secure."
            style={{ ...s.input, resize:"vertical" }}
            required
          />
          <div style={{ fontSize:12, color:"#999", marginTop:4 }}>
            {description.length} / 2000 characters
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:"#fef2f2", color:"#dc2626",
            border:"1px solid #fca5a5", borderRadius:8,
            padding:"10px 16px", fontSize:13, marginBottom:14
          }}>{error}</div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} style={{
          width:"100%", background:loading?"#9ca3af":"#6d28d9",
          color:"white", border:"none", borderRadius:10,
          padding:"14px 0", fontSize:16, fontWeight:700,
          cursor:loading?"not-allowed":"pointer"
        }}>
          {loading ? "Analysing your case..." : "Get Legal Help & Severity Assessment →"}
        </button>

      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
}

export default CrimeForm;
