import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Menu, X, Sun, Moon, ChevronRight, ExternalLink, Shield, Lock, Mail, Phone, MapPin, Instagram, Github, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// --------------------
// Helper placeholder images (unsplash) — replace with your own
// --------------------
// Direct Google Drive photo URLs
const DRIVE_IMAGES = [
  "https://drive.google.com/uc?export=view&id=1O_HVbDwXI8rJNLP6UN2h06Ciiu144xdq", // portrait
  "https://drive.google.com/uc?export=view&id=1C-mFTH6qGc4GJZoLTUId_U9ldcOdht0G", // portrait
  "https://drive.google.com/uc?export=view&id=15iUxN1r4MIGz2161eQ8mmIDembVmPk53", // portrait
  "https://drive.google.com/uc?export=view&id=1ZWc4DFT2AT64ENHm5MO90JYaHgV6Trs8", // portrait
  // add as many as you want
];

// --------------------
// Demo Data
// --------------------
const TAGS = ["All", "Portraits", "Events", "Street", "Landscape", "Studio", "Concerts"] as const;

type Tag = typeof TAGS[number];

type Photo = {
  id: string;
  src: string;
  w: number; // intrinsic width
  h: number; // intrinsic height
  title?: string;
  tags: Tag[];
  year: number;
  location?: string;
};

const demoPhotos: Photo[] = Array.from({ length: 30 }).map((_, i) => {
  const year = 2019 + (i % 7);
  const tagPools: Tag[][] = [
    ["Portraits", "Studio"],
    ["Events", "Concerts"],
    ["Street"],
    ["Landscape"],
  ];
  const pool = tagPools[i % tagPools.length];
  const tags: Tag[] = (Math.random() > 0.5 ? [pool[0]] : pool).slice(0, Math.random() > 0.7 ? 2 : 1) as Tag[];
  const id = PLACEHOLDERS[i % PLACEHOLDERS.length];
  const landscape = i % 3 !== 0;
  return {
    id: `${i}`,
    src: img(id),
    w: landscape ? 1600 : 1200,
    h: landscape ? 1067 : 1600,
    title: `Photo #${i + 1}`,
    tags,
    year,
    location: ["Charlottesville, VA", "NYC", "Seoul", "Tokyo"][i % 4],
  };
});

// Collections (like Adobe Portfolio pages)
const collections = [
  {
    slug: "editorial",
    title: "Editorial",
    blurb: "Story-driven portraiture with a refined, magazine-ready aesthetic.",
    cover: demoPhotos[1].src,
    filter: (p: Photo) => p.tags.includes("Portraits") || p.tags.includes("Studio"),
  },
  {
    slug: "events",
    title: "Events & Concerts",
    blurb: "High-energy coverage that preserves atmosphere without sacrificing detail.",
    cover: demoPhotos[5].src,
    filter: (p: Photo) => p.tags.includes("Events") || p.tags.includes("Concerts"),
  },
  {
    slug: "street",
    title: "Street",
    blurb: "Candid life moments and graphic compositions from cities worldwide.",
    cover: demoPhotos[2].src,
    filter: (p: Photo) => p.tags.includes("Street"),
  },
  {
    slug: "landscape",
    title: "Landscape",
    blurb: "Quiet, expansive scenes with natural color and minimal retouching.",
    cover: demoPhotos[3].src,
    filter: (p: Photo) => p.tags.includes("Landscape"),
  },
];

// --------------------
// Utilities
// --------------------
const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"));
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  }, [theme]);
  return { theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) };
};

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

// --------------------
// Lightbox
// --------------------
function Lightbox({ open, onClose, photo }: { open: boolean; onClose: () => void; photo?: Photo | null }) {
  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.img
            key={photo.id}
            src={photo.src}
            alt={photo.title || "photo"}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={e => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --------------------
// Masonry Grid (CSS columns for simplicity)
// --------------------
function Masonry({ photos, onSelect }: { photos: Photo[]; onSelect: (p: Photo) => void }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6 [column-fill:_balance]"><div className="hidden"></div>
      {photos.map((p) => (
        <motion.div
          key={p.id}
          layout
          whileHover={{ y: -2 }}
          className="mb-6 break-inside-avoid"
        >
          <Card className="overflow-hidden rounded-2xl shadow hover:shadow-lg transition-shadow">
            <button className="block" onClick={() => onSelect(p)}>
              <img
                src={p.src}
                alt={p.title || "photo"}
                loading="lazy"
                className="w-full h-auto"
              />
            </button>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.location} • {p.year}</div>
              </div>
              <div className="flex gap-2">
                {p.tags.slice(0, 2).map(t => (
                  <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// --------------------
// Password-gated Client Gallery (simulated)
// --------------------
function ClientPortal() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === "demo") { setUnlocked(true); setError(null);} else { setError("Invalid access code. Try 'demo'."); }
  };

  return (
    <section id="clients" className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5"/><h2 className="text-2xl font-semibold">Client Galleries</h2>
        </div>
        {!unlocked ? (
          <Card className="p-6 rounded-2xl">
            <form onSubmit={submit} className="grid sm:grid-cols-[1fr_auto] gap-3 items-center">
              <div>
                <label className="text-sm text-muted-foreground">Enter your access code</label>
                <Input value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g., DEMO" className="mt-1"/>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
              <Button type="submit" className="h-10"><Lock className="mr-2 h-4 w-4"/>Unlock</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">Use <span className="font-mono">demo</span> to preview.
            Replace this with real auth later (Supabase, Firebase Auth, or a serverless function).
            </p>
          </Card>
        ) : (
          <div>
            <p className="text-muted-foreground mb-6">Welcome! Here are your deliverables (sample).
            You can swap these for downloadable ZIPs or Pixieset/Cloud links.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoPhotos.slice(0,6).map(p => (
                <Card key={p.id} className="overflow-hidden rounded-2xl">
                  <img src={p.src} alt={p.title} className="w-full h-48 object-cover"/>
                  <CardContent className="p-4">
                    <div className="font-medium">{p.title}</div>
                    <Button variant="secondary" className="mt-3 w-full">Download <ExternalLink className="ml-2 h-4 w-4"/></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --------------------
// Contact block
// --------------------
function Contact() {
  return (
    <section id="contact" className="py-16 bg-muted/40">
      <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Get in touch</h2>
          <p className="text-muted-foreground mb-6">Tell me about your shoot—date, location, vibe, and budget. I usually reply within one business day.</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4"/><a href="mailto:hello@example.com" className="underline-offset-4 hover:underline">hello@example.com</a></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4"/><span>(757) 555-0123</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4"/><span>Charlottesville, VA</span></div>
            <div className="flex items-center gap-2"><Instagram className="h-4 w-4"/><a href="#" className="underline-offset-4 hover:underline">@yourhandle</a></div>
            <div className="flex items-center gap-2"><Github className="h-4 w-4"/><a href="#" className="underline-offset-4 hover:underline">github.com/yourname</a></div>
          </div>
        </div>
        <Card className="p-6 rounded-2xl">
          <form className="grid gap-3">
            <div>
              <label className="text-sm">Name</label>
              <Input placeholder="Jane Doe" className="mt-1"/>
            </div>
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" placeholder="jane@example.com" className="mt-1"/>
            </div>
            <div>
              <label className="text-sm">Message</label>
              <textarea placeholder="Tell me about your project..." className="mt-1 min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"></textarea>
            </div>
            <Button className="h-10">Send inquiry</Button>
            <p className="text-xs text-muted-foreground">Form is demo-only. Hook to Formspree, Basin, or Netlify Forms for production.</p>
          </form>
        </Card>
      </div>
    </section>
  );
}

// --------------------
// Home Page
// --------------------
export default function PortfolioSite() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<Tag>("All");
  const [q, setQ] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selected, setSelected] = useState<Photo | null>(null);

  const filtered = useMemo(() => {
    let xs = demoPhotos;
    if (activeTag !== "All") xs = xs.filter(p => p.tags.includes(activeTag));
    if (q.trim()) xs = xs.filter(p => (p.title || "").toLowerCase().includes(q.toLowerCase()) || (p.location||"").toLowerCase().includes(q.toLowerCase()));
    return xs;
  }, [activeTag, q]);

  const openPhoto = (p: Photo) => { setSelected(p); setLightboxOpen(true); };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5"/>
            <span className="font-semibold tracking-tight">Your Name Photography</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#work" className="hover:opacity-80">Work</a>
            <a href="#collections" className="hover:opacity-80">Collections</a>
            <a href="#clients" className="hover:opacity-80">Clients</a>
            <a href="#about" className="hover:opacity-80">About</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}</Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={()=>setMobileOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5"/></Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Menu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {[
              ["Work", "#work"],
              ["Collections", "#collections"],
              ["Clients", "#clients"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href as string} onClick={()=>setMobileOpen(false)} className="py-2">{label}</a>
            ))}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={toggle}>{theme === "dark" ? <Sun className="h-4 w-4 mr-2"/> : <Moon className="h-4 w-4 mr-2"/>} Toggle theme</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <img src={demoPhotos[4].src} alt="hero" className="w-full h-[60vh] object-cover"/>
        </div>
        <div className="max-w-6xl mx-auto px-4 h-[60vh] flex items-end pb-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-background/70 backdrop-blur rounded-2xl p-6 shadow">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Clean, client-ready photography sites—without the headache.</h1>
            <p className="text-muted-foreground mt-2">An Adobe Portfolio–inspired layout with galleries, collections, and a client portal.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["Portraits","Events","Street","Landscape","Studio","Concerts"]).map(t => (
                <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work (filterable gallery) */}
      <section id="work" className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Selected Work</h2>
              <p className="text-sm text-muted-foreground">Filter by tag or search by title/location.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search…" className="pl-9"/>
                <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              </div>
              <Tabs value={activeTag} onValueChange={(v)=>setActiveTag(v as Tag)} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-3 sm:flex">
                  {TAGS.map(tag => (
                    <TabsTrigger key={tag} value={tag} className="text-xs sm:text-sm">{tag}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
          <Masonry photos={filtered} onSelect={openPhoto} />
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="py-14 bg-muted/40">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Collections</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {collections.map(c => (
              <Card key={c.slug} className="overflow-hidden rounded-2xl group">
                <div className="relative">
                  <img src={c.cover} alt={c.title} className="w-full h-64 object-cover transition-transform group-hover:scale-[1.02]"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-lg font-semibold">{c.title}</div>
                    <div className="text-sm opacity-90">{c.blurb}</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{demoPhotos.filter(c.filter).length} photos</div>
                    <a href={`#collection-${c.slug}`} className="inline-flex items-center text-sm hover:underline">View <ChevronRight className="h-4 w-4 ml-1"/></a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sub-sections for each collection */}
          <div className="mt-10 space-y-12">
            {collections.map(c => (
              <div id={`collection-${c.slug}`} key={c.slug}>
                <h3 className="text-xl font-semibold mb-4">{c.title}</h3>
                <Masonry photos={demoPhotos.filter(c.filter)} onSelect={openPhoto} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Portal */}
      <ClientPortal />

      {/* About */}
      <section id="about" className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-3">About</h2>
            <p className="text-muted-foreground leading-7">I’m a photographer focused on honest color and natural light. I’ve worked with student orgs, startups, and local venues. This site is built to feel like Adobe Portfolio: simple navigation, curated collections, and a clean client handoff workflow.</p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              {[
                "Fast, responsive layout",
                "Masonry galleries with lightbox",
                "Tag filtering & search",
                "Client portal (access code demo)",
                "Dark/light themes",
                "No backend required to start",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary"/> {f}</li>
              ))}
            </ul>
          </div>
          <Card className="overflow-hidden rounded-2xl">
            <img src={demoPhotos[0].src} alt="headshot" className="w-full h-64 object-cover"/>
            <CardContent className="p-4">
              <div className="font-medium">Your Name</div>
              <div className="text-sm text-muted-foreground">Photographer • Charlottesville, VA</div>
              <Button asChild variant="secondary" className="mt-3 w-full"><a href="#contact">Book a session</a></Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <footer className="py-8 border-t text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-muted-foreground">© {new Date().getFullYear()} Your Name Photography</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Licensing</a>
            <a href="#" className="hover:underline">Credits</a>
          </div>
        </div>
      </footer>

      <Lightbox open={lightboxOpen} onClose={()=>setLightboxOpen(false)} photo={selected} />
    </div>
  );
}

/*
USAGE NOTES
1) This is a single React component (default export). In a Next.js or Vite app with Tailwind + shadcn installed, drop it in /app/page.tsx (Next) or import into App.tsx (Vite).
2) Replace PLACEHOLDERS with your own images. For perfect layout, include real intrinsic sizes (w,h) if you later switch to an <Image> component.
3) Client portal uses a demo code 'demo'. Swap for real auth later (Supabase, Clerk, Auth.js) or protect routes at the server layer.
4) Contact form is static; connect to Formspree/Basin/Netlify Functions to send email.
5) Styling relies on Tailwind and shadcn/ui. If you don't use shadcn, replace Card/Button/Input/Badge/Dialog/Tabs with plain HTML equivalents.
*/
