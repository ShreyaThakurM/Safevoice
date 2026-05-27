import clayBg from "@/assets/clay-bg.jpg";
import pic3 from "@/assets/pic3.png";
import { Link } from "react-router-dom";

const helplines = [
  {
    category: "Emergency",
    accent: "hsl(var(--clay-terracotta))",
    items: [
      { name: "All-India Women's Helpline", number: "1091", desc: "24/7 emergency response for women in distress." },
      { name: "Police Emergency", number: "112", desc: "Pan-India single emergency number." },
      { name: "Domestic Abuse Helpline", number: "181", desc: "Women in Distress · run by Ministry of WCD." },
    ],
  },
  {
    category: "Counselling & Mental Health",
    accent: "hsl(var(--clay-peach))",
    items: [
      { name: "iCall (TISS)", number: "9152987821", desc: "Free psychosocial counselling, Mon–Sat, 8am–10pm." },
      { name: "Vandrevala Foundation", number: "1860-2662-345", desc: "24/7 mental health support and crisis intervention." },
      { name: "Sneha India", number: "044-24640050", desc: "Emotional support for those in distress and suicidal." },
    ],
  },
  {
    category: "Legal & Rights",
    accent: "hsl(var(--clay-sage))",
    items: [
      { name: "National Commission for Women", number: "7827-170-170", desc: "WhatsApp helpline for complaints & legal advice." },
      { name: "Lawyers Collective", number: "022-22841201", desc: "Legal aid for women facing violence." },
      { name: "NALSA Legal Aid", number: "15100", desc: "Free legal services across India." },
    ],
  },
  {
    category: "Child & Trafficking",
    accent: "hsl(var(--clay-teal))",
    items: [
      { name: "Childline India", number: "1098", desc: "24/7 emergency phone service for children in need." },
      { name: "Anti Human Trafficking", number: "1098", desc: "Report trafficking — operated alongside Childline." },
      { name: "Missing Child & Women", number: "1094", desc: "Police helpline to report missing persons." },
    ],
  },
  {
    category: "Health & Cyber Safety",
    accent: "hsl(var(--clay-mint))",
    items: [
      { name: "Cyber Crime (Women & Children)", number: "1930", desc: "Report online harassment, stalking, financial fraud." },
      { name: "Sakhi One Stop Centre", number: "181", desc: "Medical, legal, psychological help under one roof." },
      { name: "AIDS / STI Helpline", number: "1097", desc: "Confidential health support, NACO." },
    ],
  },
];

const Helplines = () => {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${clayBg})` }} />
      <div className="fixed inset-0 -z-10 bg-background/50" />

      {/* Nav */}
      <nav className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 flex items-center justify-between">
        <Link to="/" className="font-[Fraunces] text-xl tracking-tight text-foreground/90">
          
        </Link>
        <div className="hidden md:flex items-center gap-1 glass-card !p-1.5 !rounded-full">
          <Link to="/" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Report</Link>
          <Link to="/resources" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Resources</Link>
          <span className="px-4 py-1.5 rounded-full text-xs clay-pill text-foreground font-medium">Helplines</span>
          <Link to="/stories" className="px-4 py-1.5 rounded-full text-xs text-foreground/70 hover:text-foreground">Stories</Link>
        </div>
        <Link
          to="/"
          className="px-5 py-2 rounded-full text-xs font-medium text-foreground clay-pill"
        >
          ← Back home
        </Link>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">
        {/* HERO */}
        <section className="grid grid-cols-12 gap-5 md:gap-6 mt-6">
          <div className="col-span-12 lg:col-span-8 glass-card !p-8 md:!p-12 relative">
            <div className="absolute top-6 left-6 w-3.5 h-3.5 rounded-full clay-dot" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay-terracotta pl-7">Help is one call away</p>
            <h1 className="font-[Fraunces] text-4xl md:text-6xl leading-[1.05] mt-4 text-foreground/90">
              Helplines for <em className="text-clay-terracotta not-italic">every woman</em>, every situation.
            </h1>
            <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-xl">
              Verified, free and confidential numbers across India — emergency response,
              counselling, legal aid, cyber safety and more. Tap any card to call directly.
            </p>
            <div className="flex items-center gap-6 mt-10 pl-7">
              {[
                { n: "15+", l: "Helplines" },
                { n: "24/7", l: "Available" },
                { n: "Free", l: "To call" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-[Fraunces] text-2xl text-foreground/85">{s.n}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 glass-card !p-3 relative overflow-hidden min-h-[320px]">
            <img
              src={pic3}
              alt="Soft clay shield representing protection and care"
              className="w-full h-full object-cover rounded-[calc(var(--radius)-0.5rem)]"
              width={1024}
              height={1024}
            />
          </div>
        </section>

        {/* CATEGORIES */}
        {helplines.map((cat) => (
          <section key={cat.category} className="mt-14">
            <div className="flex items-end justify-between mb-5 px-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: cat.accent }}>
                  Category
                </p>
                <h2 className="font-[Fraunces] text-2xl md:text-3xl text-foreground/90 mt-1">
                  {cat.category}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-5 md:gap-6">
              {cat.items.map((h) => (
                <a
                  key={h.name}
                  href={`tel:${h.number.replace(/[^\d+]/g, "")}`}
                  className="col-span-12 md:col-span-4 glass-card !p-7 relative group hover:-translate-y-1 transition-transform"
                >
                  <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full" style={{ background: cat.accent }} />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground pl-7">Tap to call</p>
                  <p className="font-[Fraunces] text-3xl mt-2 pl-7" style={{ color: cat.accent }}>
                    {h.number}
                  </p>
                  <h3 className="font-[Fraunces] text-lg text-foreground/90 mt-3 pl-7">{h.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 pl-7 leading-relaxed">{h.desc}</p>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="mt-16 glass-card !p-10 md:!p-14 text-center relative overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-60"
            style={{
              background: "radial-gradient(circle at 30% 30%, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))",
              filter: "blur(40px)",
            }}
          />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay-terracotta">Need more than a call?</p>
            <h2 className="font-[Fraunces] text-3xl md:text-5xl mt-4 text-foreground/90 max-w-2xl mx-auto leading-tight">
              File a confidential report with Saheli.
            </h2>
            <Link
              to="/"
              className="mt-8 inline-block px-8 py-3.5 rounded-full text-xs font-medium text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, hsl(var(--clay-peach)), hsl(var(--clay-terracotta)))",
                boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.5), 0 12px 24px -8px hsl(var(--shadow-soft) / 0.4)",
              }}
            >
              Start your report
            </Link>
          </div>
        </section>

        <footer className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
          <Link to="/" className="font-[Fraunces] text-foreground/70">
            saheli<span className="text-clay-terracotta">.</span>
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            © Saheli · Confidential, free, and for you
          </p>
          <div className="flex gap-3">
            <Link to="/resources" className="clay-pill px-4 h-9 rounded-full text-[10px] font-medium text-foreground flex items-center">Resources</Link>
            <Link to="/stories" className="clay-pill px-4 h-9 rounded-full text-[10px] font-medium text-foreground flex items-center">Stories</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Helplines;