import clayBg from "@/assets/clay-bg.jpg";
import women1 from "@/assets/Women1.jpg";
import { Link } from "react-router-dom";

const stats = [
  { n: "445,256", l: "Crimes against women reported", s: "NCRB 2022 — across India" },
  { n: "51", l: "FIRs every hour", s: "On average, nationwide" },
  { n: "66.4%", l: "Cases pending in courts", s: "End of 2022, IPC crimes vs women" },
  { n: "26.5%", l: "Conviction rate", s: "Of cases decided by courts in 2022" },
];

const reportedFunnel = [
  { stage: "Estimated incidents (incl. unreported)", value: 100, note: "Studies (NFHS-5) suggest ~77% of survivors of domestic violence never tell anyone." },
  { stage: "Complaints made to police", value: 32, note: "A large share is turned away or recorded as 'non-cognizable' before FIR." },
  { stage: "FIRs formally registered", value: 23, note: "~4.45 lakh FIRs registered in 2022 under crimes against women." },
  { stage: "Charge-sheeted by police", value: 17, note: "Charge-sheeting rate ≈ 75% of investigated cases." },
  { stage: "Trials completed in court", value: 6, note: "Only a fraction reach trial completion the same year." },
  { stage: "Ending in conviction", value: 1.6, note: "Conviction rate ≈ 26.5% of decided cases." },
];

const categories = [
  { name: "Cruelty by husband or relatives", share: "31.4%", count: "~1.4 lakh cases" },
  { name: "Kidnapping & abduction of women", share: "19.2%", count: "~85,000 cases" },
  { name: "Assault with intent to outrage modesty", share: "18.7%", count: "~83,000 cases" },
  { name: "Rape", share: "7.1%", count: "~31,500 cases" },
  { name: "Dowry deaths", share: "1.6%", count: "~6,800 cases" },
  { name: "Cyber crimes against women", share: "rising", count: "~10,000+ cases" },
];

const states = [
  { s: "Delhi (UT)", r: "144.4", note: "Highest crime rate among UTs/metros" },
  { s: "Haryana", r: "118.7" },
  { s: "Telangana", r: "117.0" },
  { s: "Rajasthan", r: "115.1" },
  { s: "Odisha", r: "103.3" },
  { s: "All-India average", r: "66.4", note: "Per 1,00,000 female population" },
];

const sources = [
  { t: "NCRB — Crime in India 2022", u: "https://ncrb.gov.in" },
  { t: "National Family Health Survey (NFHS-5)", u: "https://rchiips.org/nfhs/" },
  { t: "Ministry of Women & Child Development", u: "https://wcd.gov.in" },
];

const Stories = () => {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${clayBg})` }} />
      <div className="fixed inset-0 -z-10 bg-background/55" />

      {/* Nav */}
      <nav className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 flex items-center justify-between">
        <Link to="/" className="font-[Fraunces] text-xl tracking-tight text-foreground/90">
          
        </Link>
        <div className="hidden md:flex items-center gap-1 glass-card !p-1.5 !rounded-full">
          <Link to="/" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Report</Link>
          <Link to="/resources" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Resources</Link>
          <Link to="/helplines" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Helplines</Link>
          <span className="px-4 py-1.5 rounded-full text-xs clay-pill text-foreground font-medium">Stories</span>
        </div>
        <Link to="/helplines" className="px-5 py-2 rounded-full text-xs font-medium text-foreground clay-pill">
          Helplines →
        </Link>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">
        {/* HERO */}
        <section className="grid grid-cols-12 gap-5 md:gap-6 mt-6">
          <div className="col-span-12 lg:col-span-8 glass-card !p-8 md:!p-12 relative">
            <div className="absolute top-6 left-6 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">The numbers behind the silence</p>
            <h1 className="font-[Fraunces] text-4xl md:text-5xl leading-[1.05] mt-4 text-foreground/90">
              Every number is a <em className="text-clay-terracotta not-italic">woman</em>.<br/>
              Every silence is a <em className="text-clay-terracotta not-italic">story</em>.
            </h1>
            <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
              India recorded over <strong className="text-foreground/85">4.45 lakh</strong> crimes against women in 2022 — roughly <strong className="text-foreground/85">51 FIRs every hour</strong>. Yet the unreported truth is far larger. Below is what the data tells us, gently and honestly.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 glass-card !p-3 relative overflow-hidden min-h-[260px]">
            <img
              src={women1}
              alt="Women standing together in solidarity"
              className="w-full h-full object-cover rounded-[calc(var(--radius)-0.5rem)]"
            />
          </div>
        </section>

        {/* HEADLINE STATS */}
        <section className="mt-10 grid grid-cols-12 gap-5 md:gap-6">
          {stats.map((s, i) => (
            <article key={i} className="col-span-12 sm:col-span-6 lg:col-span-3 glass-card !p-6 relative">
              <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
              <p className="font-[Fraunces] text-3xl text-clay-terracotta pl-7">{s.n}</p>
              <p className="text-xs font-medium text-foreground/85 mt-2 pl-7">{s.l}</p>
              <p className="text-[11px] text-muted-foreground mt-1 pl-7 leading-relaxed">{s.s}</p>
            </article>
          ))}
        </section>

        {/* FUNNEL */}
        <section className="mt-16 grid grid-cols-12 gap-5 md:gap-6">
          <div className="col-span-12 lg:col-span-5 glass-card !p-8 relative">
            <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">From incident to justice</p>
            <h2 className="font-[Fraunces] text-3xl text-foreground/90 mt-3 pl-7 leading-tight">
              Where the <em className="text-clay-terracotta not-italic">stories disappear</em>.
            </h2>
            <p className="text-sm text-muted-foreground mt-4 pl-7 leading-relaxed">
              For every 100 women who experience a crime, only a small fraction see a courtroom — and fewer still see a conviction. The drop-off happens at every step: fear, stigma, refusal at police stations, slow courts.
            </p>
            <p className="text-[11px] text-muted-foreground mt-4 pl-7 italic">
              Indicative figures, drawn from NCRB 2022 and NFHS-5.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 glass-card !p-8 relative space-y-3">
            {reportedFunnel.map((f, i) => (
              <div key={i} className="clay-pill !rounded-2xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-medium text-foreground/85">{f.stage}</p>
                  <p className="font-[Fraunces] text-lg text-clay-terracotta shrink-0">{f.value}%</p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-foreground/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${f.value}%`,
                      background: "linear-gradient(90deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))",
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{f.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mt-16">
          <div className="mb-6 px-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta">By the kind of harm</p>
            <h2 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-1">What the FIRs say.</h2>
          </div>
          <div className="grid grid-cols-12 gap-5 md:gap-6">
            {categories.map((c, i) => (
              <article key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 glass-card !p-6 relative">
                <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
                <p className="text-xs font-medium text-foreground/85 pl-7">{c.name}</p>
                <p className="font-[Fraunces] text-3xl text-clay-terracotta mt-2 pl-7">{c.share}</p>
                <p className="text-[11px] text-muted-foreground mt-1 pl-7">{c.count}</p>
              </article>
            ))}
          </div>
        </section>

        {/* STATES */}
        <section className="mt-16 grid grid-cols-12 gap-5 md:gap-6">
          <div className="col-span-12 lg:col-span-5 glass-card !p-8 relative">
            <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">Crime rate map</p>
            <h2 className="font-[Fraunces] text-3xl text-foreground/90 mt-3 pl-7 leading-tight">
              Some places are <em className="text-clay-terracotta not-italic">harder</em> than others.
            </h2>
            <p className="text-sm text-muted-foreground mt-4 pl-7 leading-relaxed">
              Crime rate = number of cases per 1,00,000 women. A higher rate sometimes also means more women feel safe to come forward.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 glass-card !p-8 relative space-y-3">
            {states.map((st, i) => {
              const max = 150;
              const w = Math.min(100, (parseFloat(st.r) / max) * 100);
              return (
                <div key={i} className="clay-pill !rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-foreground/85">{st.s}</p>
                    <p className="font-[Fraunces] text-lg text-clay-terracotta">{st.r}</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-foreground/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${w}%`,
                        background: "linear-gradient(90deg, hsl(var(--clay-sage)), hsl(var(--clay-terracotta)))",
                      }}
                    />
                  </div>
                  {st.note && <p className="text-[11px] text-muted-foreground mt-2">{st.note}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* THE UNREPORTED */}
        <section className="mt-16 glass-card !p-10 md:!p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-60"
            style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))", filter: "blur(40px)" }} />
          <div className="relative grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.3em] text-clay-terracotta">The silent majority</p>
              <h2 className="font-[Fraunces] text-3xl md:text-4xl mt-3 text-foreground/90 leading-tight">
                Roughly <em className="text-clay-terracotta not-italic">77%</em> of women who face violence at home never tell anyone — not the police, not a friend.
              </h2>
              <p className="text-sm text-muted-foreground mt-4 max-w-xl leading-relaxed">
                Source: NFHS-5 (2019–21). Of women aged 18–49 who experienced spousal violence, only about 14% sought help — and just 7% approached the police.
              </p>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="glass-card !p-6">
                <p className="font-[Fraunces] text-6xl text-clay-terracotta">77%</p>
                <p className="text-xs text-foreground/85 mt-2">Stay silent</p>
                <div className="h-2 rounded-full bg-foreground/5 mt-4 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "77%", background: "linear-gradient(90deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))" }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">Only 7% reach out to the police.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOURCES + CTA */}
        <section className="mt-16 grid grid-cols-12 gap-5 md:gap-6">
          <div className="col-span-12 lg:col-span-7 glass-card !p-8 relative">
            <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">Where these numbers come from</p>
            <h3 className="font-[Fraunces] text-2xl text-foreground/90 mt-3 pl-7">Sources & further reading</h3>
            <div className="mt-5 space-y-2 pl-7">
              {sources.map((s) => (
                <a key={s.t} href={s.u} target="_blank" rel="noreferrer"
                  className="clay-pill !rounded-2xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-foreground/85">{s.t}</span>
                  <span className="text-[10px] uppercase tracking-widest text-clay-terracotta">Visit →</span>
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 glass-card !p-8 relative text-center flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay-terracotta">Your story counts</p>
            <h3 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-3 leading-tight">
              Each report shifts the curve.
            </h3>
            <p className="text-sm text-muted-foreground mt-3">
              When you speak, the silence shrinks — for you, and for the women who come after you.
            </p>
            <Link to="/" className="mt-6 mx-auto px-7 py-3 rounded-full text-xs font-medium text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))",
                boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.5), 0 10px 20px -8px hsl(var(--shadow-soft) / 0.4)",
              }}>
              File a report
            </Link>
          </div>
        </section>

        <footer className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
          <Link to="/" className="font-[Fraunces] text-foreground/70">saheli<span className="text-clay-terracotta">.</span></Link>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Data shown for awareness · Not a substitute for legal advice
          </p>
          <div className="flex gap-3">
            <Link to="/helplines" className="clay-pill px-4 h-9 rounded-full text-[10px] font-medium text-foreground flex items-center">Helplines</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Stories;