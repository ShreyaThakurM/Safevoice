import clayBg from "@/assets/clay-bg.jpg";
import shieldShape from "@/assets/shield-shape.jpg";
import { Link } from "react-router-dom";
import pic6 from "@/assets/pic6.jpeg";

const legalResources = [
  {
    t: "Protection of Women from Domestic Violence Act, 2005",
    d: "Provides civil remedies including protection orders, residence orders, and monetary relief. You can approach a Protection Officer or Magistrate directly.",
    tag: "Legal right",
  },
  {
    t: "Section 498A, Indian Penal Code",
    d: "Criminalises cruelty by husband or relatives. Cognisable and non-bailable — police must act without a warrant.",
    tag: "Criminal law",
  },
  {
    t: "POCSO Act, 2012",
    d: "Protection of Children from Sexual Offences. Covers anyone under 18. Special courts and child-friendly procedures apply.",
    tag: "Child safety",
  },
  {
    t: "Sexual Harassment at Workplace Act (POSH), 2013",
    d: "Every organisation with 10+ employees must have an Internal Complaints Committee. Complaints must be resolved within 90 days.",
    tag: "Workplace",
  },
  {
    t: "Free Legal Aid (NALSA)",
    d: "All women are entitled to free legal services regardless of income. Call 15100 or visit your nearest District Legal Services Authority.",
    tag: "Free support",
  },
  {
    t: "Fast Track Special Courts",
    d: "Dedicated courts for rape and POCSO cases. India has over 700 FTSCs operational as of 2023, aimed at speedy justice.",
    tag: "Courts",
  },
];

const supportOrgs = [
  {
    name: "iCall — TISS",
    desc: "Free, confidential psychological counselling by trained professionals. Available Mon–Sat, 8am–10pm.",
    contact: "9152987821",
    type: "Mental health",
  },
  {
    name: "Snehi",
    desc: "Emotional support and suicide prevention helpline. Multilingual, non-judgmental listeners.",
    contact: "044-24640050",
    type: "Emotional support",
  },
  {
    name: "Majlis Legal Centre",
    desc: "Mumbai-based legal aid centre specialising in cases of domestic violence, sexual assault, and child rights.",
    contact: "majlislaw.com",
    type: "Legal aid",
  },
  {
    name: "Shakti Shalini",
    desc: "Delhi-based NGO offering shelter, counselling, and legal support to survivors of domestic violence.",
    contact: "011-24373737",
    type: "Shelter & support",
  },
  {
    name: "Praja Foundation",
    desc: "Helps citizens file RTIs, track case status, and hold public institutions accountable.",
    contact: "praja.in",
    type: "Civic rights",
  },
  {
    name: "One Stop Centres (Sakhi)",
    desc: "Government-run centres in every district offering medical, legal, police, and psychosocial help under one roof.",
    contact: "181",
    type: "Government",
  },
];

const safetyTips = [
  {
    title: "Document everything",
    body: "Keep a private record of dates, incidents, messages, and photos. Store copies with a trusted person or in a cloud account your abuser can't access.",
  },
  {
    title: "Create a safety plan",
    body: "Identify a safe place to go, keep emergency cash, important documents, and a charged phone accessible. Share your plan with one trusted person.",
  },
  {
    title: "Digital safety",
    body: "Use private browsing when researching. Change passwords on a device your abuser hasn't touched. Be cautious of location sharing on your phone.",
  },
  {
    title: "Know your rights at the police station",
    body: "A woman cannot be summoned to a police station after sunset. You have the right to record your statement at home. FIR registration cannot be refused for cognisable offences.",
  },
];

const Resources = () => {
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
          <span className="px-4 py-1.5 rounded-full text-xs clay-pill text-foreground font-medium">Resources</span>
          <Link to="/helplines" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Helplines</Link>
          <Link to="/stories" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Stories</Link>
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
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">Knowledge is power</p>
            <h1 className="font-[Fraunces] text-4xl md:text-5xl leading-[1.05] mt-4 text-foreground/90 max-w-3xl">
              Your rights, your options, <em className="text-clay-terracotta not-italic">your next step</em>.
            </h1>
            <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Whether you need to understand the law, find a counsellor, or simply know what to do next — everything here is free, verified, and written plainly.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {["Legal rights", "Support organisations", "Safety planning"].map((tag) => (
                <span key={tag} className="clay-pill px-4 py-1.5 rounded-full text-xs text-foreground/75">{tag}</span>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 glass-card !p-3 relative overflow-hidden min-h-[260px]">
            <img
              src={pic6}
              alt="A soft clay shield symbolising protection and safety"
              className="w-full h-full object-cover rounded-[calc(var(--radius)-0.5rem)]"
            />
          </div>
        </section>

        {/* LEGAL RIGHTS */}
        <section className="mt-16">
          <div className="flex items-end justify-between mb-6 px-1">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta">Know the law</p>
              <h2 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-1">
                Your legal rights in India.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5 md:gap-6">
            {legalResources.map((r) => (
              <article key={r.t} className="col-span-12 md:col-span-6 glass-card !p-6 relative">
                <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
                <span className="ml-7 text-[10px] uppercase tracking-widest text-clay-terracotta">{r.tag}</span>
                <h3 className="font-[Fraunces] text-lg text-foreground/90 mt-2 pl-7 leading-snug">{r.t}</h3>
                <p className="text-sm text-muted-foreground mt-2 pl-7 leading-relaxed">{r.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* SUPPORT ORGANISATIONS */}
        <section className="mt-16">
          <div className="mb-6 px-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta">You don't have to do this alone</p>
            <h2 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-1">
              Organisations that can help.
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-5 md:gap-6">
            {supportOrgs.map((o) => (
              <article key={o.name} className="col-span-12 sm:col-span-6 lg:col-span-4 glass-card !p-6 relative flex flex-col gap-3">
                <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
                <span className="ml-7 text-[10px] uppercase tracking-widest text-clay-terracotta">{o.type}</span>
                <h3 className="font-[Fraunces] text-lg text-foreground/90 pl-7">{o.name}</h3>
                <p className="text-sm text-muted-foreground pl-7 leading-relaxed flex-1">{o.desc}</p>
                <div className="clay-pill rounded-full px-4 py-2 ml-7 w-fit">
                  <p className="text-xs font-medium text-foreground/85">{o.contact}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SAFETY PLANNING */}
        <section className="mt-16">
          <div className="mb-6 px-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta">Practical guidance</p>
            <h2 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-1">
              Safety planning, step by step.
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-5 md:gap-6">
            {safetyTips.map((tip, i) => (
              <article key={tip.title} className="col-span-12 md:col-span-6 glass-card !p-7 relative">
                <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
                <p
                  className="font-[Fraunces] text-5xl pl-7"
                  style={{ color: i % 2 === 0 ? "hsl(var(--clay-peach))" : "hsl(var(--clay-terracotta))" }}
                >
                  0{i + 1}
                </p>
                <h3 className="font-[Fraunces] text-xl text-foreground/90 mt-3 pl-7">{tip.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 pl-7 leading-relaxed">{tip.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="mt-16 glass-card !p-10 md:!p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-60"
            style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))", filter: "blur(40px)" }} />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-50"
            style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--clay-mint)), hsl(var(--clay-teal)))", filter: "blur(40px)" }} />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay-terracotta">Ready when you are</p>
            <h2 className="font-[Fraunces] text-3xl md:text-4xl mt-4 text-foreground/90 max-w-2xl mx-auto leading-tight">
              Information is the first step. <em className="text-clay-terracotta not-italic">Action is yours to take.</em>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-8">
              <Link
                to="/"
                className="px-7 py-3 rounded-full text-xs font-medium text-primary-foreground"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))",
                  boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.5), 0 10px 20px -8px hsl(var(--shadow-soft) / 0.4)",
                }}
              >
                File a report
              </Link>
              <Link to="/helplines" className="clay-pill px-7 py-3 rounded-full text-xs font-medium text-foreground">
                Call a helpline
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
          <Link to="/" className="font-[Fraunces] text-foreground/70">saheli<span className="text-clay-terracotta">.</span></Link>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Resources are for guidance only · Not a substitute for legal advice
          </p>
          <div className="flex gap-3">
            <Link to="/helplines" className="clay-pill px-4 h-9 rounded-full text-[10px] font-medium text-foreground flex items-center">Helplines</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Resources;