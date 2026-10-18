import { useEffect, useState } from "react";

/* ---------- Дані-заглушки: заміни на свої ---------- */
const NAV = [
  { label: "Home", href: "#" },
  { label: "SHOWS", href: "#shows" },
  { label: "About", href: "#about" },
  {
    label: "Shop",
    href: "#shop",
    children: ["New Arrivals", "Hoodies", "T-Shirts", "Hats", "Vinyl & Cassettes", "Accessories"],
  },
  { label: "Music", href: "#music" },
  { label: "Interviews", href: "#interviews" },
];

const mk = (n, t, p, kind, c, ink, print, tag) => ({ id: n, title: t, price: p, kind, c, ink, print, tag });

// Нова колекція: "Nightmares"
const COLLECTION = [
  mk(1, "Need You Back Hoodie", "$65.00", "hoodie", "#161616", "#e8e2d0", "need you|back", "New"),
  mk(2, "Nightmares Tee", "$30.00", "tee", "#ece9e2", "#111111", "nightmares", "New"),
  mk(3, "Feel Alive Dad Hat", "$32.00", "cap", "#2a2a2a", "#dddddd", "feel alive"),
  mk(4, "Drag Me Down Long Sleeve", "$45.00", "long", "#3a1414", "#eeeeee", "drag me|down"),
];

const FEATURED = [
  mk(11, "Logo Hoodie – Black", "$60.00", "hoodie", "#111111", "#ffffff", "sheeezer"),
  mk(12, "Logo Tee – White", "$28.00", "tee", "#f3f1ec", "#111111", "sheeezer"),
  mk(13, "Smoked Dope2good Tee", "$30.00", "tee", "#3a3a3a", "#eeeeee", "smoked|dope2good"),
  mk(14, "In My Veins Hoodie", "$62.00", "hoodie", "#1d2a44", "#eeeeee", "in my|veins"),
  mk(15, "Another Day Socks", "From $14.00", "socks", "#dddddd", "#111111", ""),
  mk(16, "My All Beanie", "$28.00", "beanie", "#1a1a1a", "#eeeeee", "my all"),
  mk(17, "Leave Me Tote Bag", "$18.00", "tote", "#d8d2c4", "#111111", "leave me"),
  mk(18, "Nightmares – Vinyl LP", "$34.00", "vinyl", "#151515", "#eeeeee", "nightmares"),
  mk(19, "About U – Cassette", "$12.00", "cassette", "#6b1d1d", "#eeeeee", "about u"),
  mk(20, "Sticker Pack", "$8.00", "sticker", "#111111", "#eeeeee", ""),
  mk(21, "Feel Alive Poster (A2)", "$15.00", "poster", "#101010", "#eeeeee", "feel|alive"),
  mk(22, "Need You Back – CD", "$11.00", "cd", "#cccccc", "#222222", "need you back"),
];

const ABOUT = [
  { id: 1, title: "Who is sheeezer", text: "Незалежний український артист, що поєднує емо-реп, ґрандж та альтернативний рок у сирий, емоційний звук. Демо-текст — заміни на свій." },
  { id: 2, title: "Behind “Nightmares”", text: "Історія створення треку: нічні сесії, співпраця з Kaynbirs і ідея візуалу. Демо-текст для блоку статті." },
  { id: 3, title: "Studio diaries", text: "Короткі нотатки зі студії, плани на нові релізи та майбутні виступи. Демо-текст для блоку статті." },
];

const MUSIC = [
  { id: 0, title: "Need You Back", text: "sheeezer & Kaynbirs — один із найпопулярніших треків. Демо-опис релізу." },
  { id: 1, title: "Nightmares", text: "sheeezer & Kaynbirs — темна атмосфера, дисторшн і щирі вокальні партії." },
  { id: 2, title: "Feel Alive", text: "sheeezer & Kaynbirs — про відчуття життя посеред нічних думок." },
  { id: 3, title: "Drag Me Down", text: "sheeezer — гітарні текстури та меланхолійні мелодії." },
  { id: 4, title: "In My Veins", text: "sheeezer — особисті переживання, перетворені на музику." },
  { id: 5, title: "Smoked Dope2good", text: "sheeezer & Kaynbirs — експериментальне звучання між жанрами." },
];

const ARCHIVE = [
  { id: 1, title: "Fan Art: Nightmares", date: "Oct 10, 2026" },
  { id: 2, title: "Tattoos from fans", date: "Sep 21, 2026" },
  { id: 3, title: "Monthly Fan Art", date: "Aug 30, 2026" },
];

/* ---------- Маленькі компоненти ---------- */
const Placeholder = ({ className = "", label }) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-3 text-center ${className}`}
    aria-hidden
  >
    {label && (
      <span className="font-serif text-lg font-semibold lowercase italic leading-tight text-neutral-200 sm:text-xl">
        {label}
      </span>
    )}
  </div>
);

/* ---------- SVG-мокапи товарів ---------- */
const SHADE = "rgba(0,0,0,.16)";
const BODY = {
  tee: "M60 30L80 24Q100 40 120 24L140 30L174 64L152 84L138 72V172H62V72L48 84L26 64Z",
  hoodie: "M62 40L80 28Q100 46 120 28L138 40L178 152L154 160L138 104V172H62V104L46 160L22 152Z",
};
BODY.long = BODY.hoodie;

const PrintText = ({ lines, x, y, size, fill }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={size} fill={fill} fontFamily="Georgia, serif"
    fontStyle="italic" fontWeight="700">
    {lines.map((l, i) => (
      <tspan key={i} x={x} dy={i ? size * 1.15 : 0}>{l}</tspan>
    ))}
  </text>
);

function ProductArt({ p }) {
  const { kind, c, ink } = p;
  const lines = (p.print || "").split("|").filter(Boolean);
  const T = (props) => <PrintText lines={lines} fill={ink} {...props} />;
  let art = null;

  if (kind === "tee" || kind === "hoodie" || kind === "long") {
    art = (
      <>
        <path d={BODY[kind]} fill={c} stroke={SHADE} strokeWidth="2" />
        {kind === "hoodie" ? (
          <>
            <path d="M74 34Q100 4 126 34Q100 62 74 34Z" fill={c} stroke={SHADE} strokeWidth="2" />
            <path d="M74 34Q100 4 126 34Q100 62 74 34Z" fill={SHADE} />
            <path d="M93 52V78M107 52V78" stroke={ink} strokeWidth="2" opacity=".6" />
            <path d="M70 142H130L124 166H76Z" fill="none" stroke={SHADE} strokeWidth="2" />
          </>
        ) : (
          <path d="M80 24Q100 44 120 24Q100 34 80 24Z" fill={SHADE} />
        )}
        <T x={100} y={kind === "hoodie" ? 108 : 100} size={lines.length > 1 ? 14 : 16} />
      </>
    );
  } else if (kind === "cap") {
    art = (
      <>
        <path d="M42 122Q42 62 100 62Q158 62 158 122Z" fill={c} />
        <path d="M38 122Q100 108 176 130Q160 146 100 136Q60 132 38 122Z" fill={c} stroke={SHADE} strokeWidth="2" />
        <path d="M38 122Q100 108 176 130Q160 146 100 136Q60 132 38 122Z" fill={SHADE} />
        <circle cx="100" cy="62" r="4" fill={SHADE} />
        <T x={100} y={98} size={11} />
      </>
    );
  } else if (kind === "beanie") {
    art = (
      <>
        <path d="M46 130Q46 52 100 52Q154 52 154 130Z" fill={c} />
        <rect x="42" y="116" width="116" height="34" rx="8" fill={c} stroke={SHADE} strokeWidth="2" />
        <rect x="42" y="116" width="116" height="34" rx="8" fill={SHADE} />
        <T x={100} y={138} size={13} />
      </>
    );
  } else if (kind === "socks") {
    art = (
      <>
        <path d="M66 28H116V108L158 128Q174 150 146 164L84 156Q60 150 68 122Z" fill={c} stroke={SHADE} strokeWidth="2" />
        <rect x="66" y="28" width="50" height="10" fill={ink} />
        <rect x="66" y="44" width="50" height="5" fill={ink} />
      </>
    );
  } else if (kind === "tote") {
    art = (
      <>
        <path d="M74 82Q74 30 100 30Q126 30 126 82" fill="none" stroke={c} strokeWidth="6" />
        <path d="M44 78H156L150 180H50Z" fill={c} stroke={SHADE} strokeWidth="2" />
        <T x={100} y={134} size={16} />
      </>
    );
  } else if (kind === "vinyl") {
    art = (
      <>
        <circle cx="118" cy="100" r="58" fill="#0b0b0b" />
        <circle cx="118" cy="100" r="46" fill="none" stroke="#333" />
        <circle cx="118" cy="100" r="34" fill="none" stroke="#333" />
        <circle cx="118" cy="100" r="16" fill="#8a1c1c" />
        <rect x="26" y="40" width="120" height="120" fill={c} stroke={SHADE} />
        <T x={86} y={104} size={14} />
      </>
    );
  } else if (kind === "cassette") {
    art = (
      <>
        <rect x="24" y="56" width="152" height="94" rx="8" fill={c} stroke={SHADE} strokeWidth="2" />
        <rect x="38" y="66" width="124" height="44" rx="4" fill="#e8e2d0" />
        <T x={100} y={94} size={14} fill="#222" />
        <circle cx="72" cy="130" r="11" fill="#111" /><circle cx="72" cy="130" r="4" fill="#ddd" />
        <circle cx="128" cy="130" r="11" fill="#111" /><circle cx="128" cy="130" r="4" fill="#ddd" />
      </>
    );
  } else if (kind === "cd") {
    art = (
      <>
        <defs>
          <radialGradient id="cdg">
            <stop offset="0" stopColor="#f5f5f5" />
            <stop offset=".6" stopColor="#bcc4d4" />
            <stop offset="1" stopColor="#8b93a8" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="64" fill="url(#cdg)" />
        <circle cx="100" cy="100" r="22" fill="none" stroke="rgba(0,0,0,.15)" />
        <circle cx="100" cy="100" r="9" fill="#e7e5e4" />
        <T x={100} y={66} size={9} fill="#222" />
      </>
    );
  } else if (kind === "poster") {
    art = (
      <>
        <rect x="46" y="22" width="108" height="150" fill={c} stroke={SHADE} />
        <T x={100} y={96} size={20} />
      </>
    );
  } else if (kind === "sticker") {
    art = (
      <>
        <g transform="rotate(-8 70 66)">
          <rect x="34" y="44" width="72" height="44" rx="10" fill="#111" />
          <PrintText lines={["sheeezer"]} x={70} y={72} size={14} fill="#eee" />
        </g>
        <g transform="rotate(7 130 110)">
          <rect x="92" y="88" width="76" height="44" rx="10" fill="#f5d90a" />
          <PrintText lines={["nightmares"]} x={130} y={116} size={12} fill="#111" />
        </g>
        <g transform="rotate(-4 70 140)">
          <circle cx="70" cy="140" r="26" fill="#a11" />
          <PrintText lines={["feel", "alive"]} x={70} y={136} size={11} fill="#eee" />
        </g>
      </>
    );
  }

  return (
    <svg viewBox="0 0 200 200" className="block h-full w-full" role="img" aria-label={p.title}>
      <rect width="200" height="200" fill="#e7e5e4" />
      <ellipse cx="100" cy="184" rx="60" ry="5" fill="rgba(0,0,0,.12)" />
      {art}
    </svg>
  );
}

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SectionTitle = ({ children, id }) => (
  <h2 id={id} className="mb-6 text-center text-2xl font-bold uppercase tracking-widest">
    {children}
  </h2>
);

const ProductCard = ({ p, onAdd }) => (
  <div className="group text-center">
    <div className="relative overflow-hidden bg-neutral-200">
      <div className="aspect-square transition duration-300 group-hover:-rotate-1 group-hover:scale-105"><ProductArt p={p} /></div>
      {p.tag && (
        <span className="absolute left-2 top-2 bg-yellow-300 px-2 py-0.5 text-[10px] font-bold uppercase text-black">{p.tag}</span>
      )}
    </div>
    <h3 className="mt-3 text-sm font-medium">{p.title}</h3>
    <p className="text-sm text-neutral-500">{p.price}</p>
    <button
      onClick={onAdd}
      className="mt-2 border border-black px-4 py-1 text-xs uppercase tracking-wider opacity-0 transition hover:bg-black hover:text-white group-hover:opacity-100"
    >
      Add to cart
    </button>
  </div>
);

const ProductGrid = ({ items, onAdd }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
    {items.map((p) => (
      <ProductCard key={p.id} p={p} onAdd={onAdd} />
    ))}
  </div>
);

/* ---------- Хедер + повноекранне меню ---------- */
// Встав шлях до свого фото для фону меню, наприклад "/menu-bg.jpg"
const MENU_BG = "";

const Arrow = () => (
  <svg viewBox="0 0 30 8" className="h-2 w-7" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M0 4h28M25 1.5L28 4l-3 2.5" />
  </svg>
);

const Flags = () => (
  <div className="flex items-center gap-2">
    <a href="#" title="UK Store" className="h-6 w-6 overflow-hidden rounded-full">
      <svg viewBox="0 0 60 60">
        <rect width="60" height="60" fill="#1d3f91" />
        <path d="M0 0l60 60M60 0L0 60" stroke="#fff" strokeWidth="10" />
        <path d="M0 0l60 60M60 0L0 60" stroke="#d01f3c" strokeWidth="4" />
        <path d="M30 0v60M0 30h60" stroke="#fff" strokeWidth="16" />
        <path d="M30 0v60M0 30h60" stroke="#d01f3c" strokeWidth="9" />
      </svg>
    </a>
    <a href="#" title="EU Store" className="h-6 w-6 overflow-hidden rounded-full">
      <svg viewBox="0 0 60 60">
        <rect width="60" height="60" fill="#1e50a2" />
        <circle cx="30" cy="30" r="18" fill="none" stroke="#fc0" strokeWidth="5"
          strokeDasharray="0.1 9.32" strokeLinecap="round" />
      </svg>
    </a>
  </div>
);

const SOCIAL = [
  ["Twitter", "M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013.4 4.6a4.1 4.1 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8.2 8.2 0 012 18.3 11.6 11.6 0 008.3 20c7.5 0 11.700-6.300 11.700-11.700v-.5c.8-.6 1.500-1.300 2-2z"],
  ["Facebook", "M14 8V6.5c0-.7.3-1 1-1h2V2h-3c-3 0-4 1.8-4 4v2H8v3.5h2V22h4V11.5h2.7L17 8z"],
  ["YouTube", "M21.6 7.2a2.500 2.500 0 00-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 002.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 001.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 001.800-1.800C22 15.200 22 12 22 12s0-3.200-.4-4.800zM10 15V9l5 3z"],
  ["Instagram", "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm0 2a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2zm5 2.500a4.500 4.500 0 110 9 4.500 4.500 0 010-9zm0 2a2.500 2.500 0 100 5 2.500 2.500 0 000-5zM17.200 6a1 1 0 110 2 1 1 0 010-2z"],
];

const TopBar = ({ cart, open, onToggle, light }) => (
  <div className={`relative mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-6 ${light ? "text-neutral-500" : "text-white"}`}>
    <button onClick={onToggle} aria-label={open ? "Close menu" : "Open menu"}>
      <Icon d={open ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"} />
    </button>

    <a href="#" className="absolute left-1/2 -translate-x-1/2" aria-label="sheeezer">
      <img src="/logos/sheeezer_4_glitch.png" alt="sheeezer" className="glitch-img h-10 w-auto" />
    </a>

    <div className="flex items-center gap-3">
      <Flags />
      <button className="relative" aria-label="Cart">
        <Icon d="M6 6h15l-1.500 9h-12zM6 6L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z" />
        {cart > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] text-white">
            {cart}
          </span>
        )}
      </button>
    </div>
  </div>
);

function Header({ cart }) {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => { setOpen(false); setSub(false); };
  const shop = NAV.find((n) => n.children);
  const items = sub
    ? [{ label: "Back", back: true }, ...shop.children.map((c) => ({ label: c, href: "#shop" }))]
    : NAV;

  const linkCls =
    "flex items-center justify-center gap-4 py-2 text-4xl font-semibold leading-none text-[#6b665c] transition hover:text-black/70 md:text-5xl";

  return (
    <>
      <header className="sticky top-0 z-40 bg-black shadow-sm shadow-white/10">
        <TopBar cart={cart} open={false} onToggle={() => setOpen(true)} />
      </header>

      <div
        className={`fixed inset-0 z-50 flex flex-col bg-[#e6bcbc] bg-cover bg-center transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={MENU_BG ? { backgroundImage: `url(${MENU_BG})` } : undefined}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-[#f3d4d0]/70" />

        <div className="relative flex min-h-full flex-1 flex-col">
          <TopBar cart={cart} open light onToggle={close} />

          <nav className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            {items.map((item) =>
              item.back ? (
                <button key="back" onClick={() => setSub(false)} className={linkCls}>
                  <span className="rotate-180"><Arrow /></span> Back
                </button>
              ) : item.children ? (
                <button key={item.label} onClick={() => setSub(true)} className={linkCls}>
                  {item.label} <Arrow />
                </button>
              ) : (
                <a key={item.label} href={item.href} onClick={close} className={linkCls}>
                  {item.label}
                </a>
              )
            )}

            {!sub && (
              <a href="#" className="mt-6 flex items-center justify-center gap-4 text-base text-[#6b665c] hover:text-black/70">
                Search <Arrow />
              </a>
            )}
          </nav>

          <div className="pb-10 text-center text-[#6b665c]">
            <div className="mb-5 flex justify-center gap-6">
              {SOCIAL.map(([name, d]) => (
                <a key={name} href="#" aria-label={name} className="hover:text-black/70">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" fillRule="evenodd">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-base">
              <a href="#" className="hover:underline">Log in</a>
              <span className="mx-3">|</span>
              <a href="#" className="hover:underline">Register</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Глобальні стилі: шум, глітч, стрічка, еквалайзер ---------- */
const GlobalStyles = () => (
  <style>{`
    .noise::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.12;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.5 -0.55'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes eq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
    @keyframes glitch{0%,90%,100%{transform:translate(0)}92%{transform:translate(-5px,2px)}94%{transform:translate(5px,-2px)}96%{transform:translate(-3px,1px)}}
    @keyframes flicker{0%,18%,22%,62%,64%,100%{opacity:1}20%,63%{opacity:.3}}
    .glitch-img{animation:glitch 3s infinite}
    .marquee{animation:marquee 28s linear infinite}
    .eqbar{transform-origin:bottom;animation:eq .9s ease-in-out infinite}
    .flicker{animation:flicker 4s infinite}
    @media (prefers-reduced-motion:reduce){.marquee,.eqbar,.flicker,.glitch-img{animation:none}}
  `}</style>
);

/* ---------- Герой ---------- */
const Hero = () => (
  <section className="noise relative overflow-hidden bg-black text-white">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(190,24,93,.35),transparent_60%)]" />
    <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-24">
      <div>
        <p className="flicker mb-3 text-xs uppercase tracking-[0.4em] text-pink-400">● new drop — 2026</p>
        <h1><img src="/logos/sheeezer_4_glitch.png" alt="sheeezer" className="glitch-img w-full max-w-lg" /></h1>
        <p className="mt-3 font-serif text-2xl italic text-neutral-400">nightmares — limited vinyl</p>
        <p className="mt-5 max-w-md text-neutral-300">
          Лімітований вініл, худі й принти для нічних думок. Демо-опис — заміни на свій.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#shop" className="bg-yellow-300 px-8 py-3 text-sm font-black uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-white">
            Shop the drop
          </a>
          <a href="#music" className="border border-white/40 px-8 py-3 text-sm font-bold uppercase tracking-wider transition hover:bg-white hover:text-black">
            Listen
          </a>
        </div>
      </div>
      <div className="relative justify-self-center">
        <div className="absolute -inset-4 rotate-3 border border-white/20" />
        <div className="relative aspect-square w-full max-w-md -rotate-2 overflow-hidden shadow-[0_0_60px_rgba(236,72,153,.25)] transition duration-500 hover:rotate-0">
          <ProductArt p={{ title: "Nightmares vinyl", kind: "vinyl", c: "#151515", ink: "#eeeeee", print: "nightmares" }} />
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Жовта біжуча стрічка ---------- */
const Marquee = () => {
  const text = "NEW DROP: NIGHTMARES ✦ FREE SHIPPING OVER $75 ✦ LIVE THIS FALL ✦ ".repeat(4);
  return (
    <div className="overflow-hidden bg-yellow-300 py-2 text-black">
      <div className="marquee flex w-max whitespace-nowrap text-sm font-black uppercase tracking-[0.3em]">
        {[0, 1].map((i) => <span key={i} className="px-4">{text}</span>)}
      </div>
    </div>
  );
};

/* ---------- Live Shows ---------- */
const SHOWS = [
  { d: "Nov 07", city: "Kyiv", venue: "Demo Club" },
  { d: "Nov 14", city: "Lviv", venue: "Demo Hall" },
  { d: "Nov 21", city: "Warsaw", venue: "Demo Stage" },
  { d: "Nov 28", city: "Berlin", venue: "Demo Venue", sold: true },
  { d: "Dec 05", city: "Prague", venue: "Demo Arena" },
];

const Shows = () => (
  <section id="shows" className="noise relative bg-black py-14 text-white">
    <div className="relative mx-auto max-w-4xl px-4">
      <h2 className="mb-8 text-center font-serif text-4xl font-black lowercase italic">live shows</h2>
      <ul className="divide-y divide-white/15 border-y border-white/15">
        {SHOWS.map((s) => (
          <li key={s.d} className="flex items-center gap-4 py-4 transition hover:bg-white/5 md:gap-8 md:px-4">
            <span className="w-16 font-mono text-sm text-pink-400">{s.d}</span>
            <span className="flex-1">
              <b className="block text-lg">{s.city}</b>
              <span className="text-sm text-neutral-400">{s.venue}</span>
            </span>
            {s.sold ? (
              <span className="text-xs uppercase tracking-widest text-neutral-500">Sold out</span>
            ) : (
              <a href="#" className="border border-white/50 px-5 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-yellow-300 hover:text-black">
                Tickets
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ---------- Music: плеєр з еквалайзером ---------- */
const DUR = ["2:41", "2:18", "2:56", "3:02", "2:33", "2:47"];

const Eq = () => (
  <span className="flex h-4 items-end justify-center gap-[2px]">
    {[0, 1, 2].map((n) => (
      <i key={n} className="eqbar block h-full w-[3px] bg-pink-500" style={{ animationDelay: `${n * 0.2}s` }} />
    ))}
  </span>
);

function MusicCarousel() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const item = MUSIC[i];
  const go = (d) => setI((i + d + MUSIC.length) % MUSIC.length);
  const btn = "border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-white hover:text-black";

  return (
    <section id="music" className="noise relative bg-neutral-950 py-14 text-white">
      <div className="relative mx-auto max-w-5xl px-4">
        <h2 className="mb-8 text-center font-serif text-4xl font-black lowercase italic">music</h2>
        <div className="grid gap-8 md:grid-cols-[320px_1fr]">
          <div>
            <Placeholder label={item.title} className="aspect-square w-full" />
            <p className="mt-4 text-sm text-neutral-400">{item.text}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => go(-1)} className={btn}>Prev</button>
              <button onClick={() => setPlaying(!playing)} className={`${btn} bg-yellow-300 text-black hover:bg-white`}>
                {playing ? "Pause" : "Play"}
              </button>
              <button onClick={() => go(1)} className={btn}>Next</button>
            </div>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {MUSIC.map((m, idx) => (
              <li key={m.id}>
                <button
                  onClick={() => { setI(idx); setPlaying(true); }}
                  className={`flex w-full items-center gap-4 px-3 py-3 text-left transition hover:bg-white/5 ${idx === i ? "bg-white/10" : ""}`}
                >
                  <span className="w-6 text-center font-mono text-sm text-neutral-500">
                    {idx === i && playing ? <Eq /> : idx + 1}
                  </span>
                  <span className="flex-1">
                    <b className={`block ${idx === i ? "text-pink-400" : ""}`}>{m.title}</b>
                    <span className="text-xs text-neutral-400">{m.text.split(" — ")[0]}</span>
                  </span>
                  <span className="font-mono text-xs text-neutral-500">{DUR[idx]}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Сторінка ---------- */
export default function App() {
  const [cart, setCart] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [toast, setToast] = useState(false);
  const add = () => {
    setCart((c) => c + 1);
    setToast(true);
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => setToast(false), 1800);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <GlobalStyles />
      <Header cart={cart} />
      <Hero />
      <Marquee />

      <main>
        <section id="shop" className="mx-auto max-w-7xl px-4 py-12">
          <SectionTitle>Collection</SectionTitle>
          <ProductGrid items={COLLECTION} onAdd={add} />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12">
          <SectionTitle>Featured Products</SectionTitle>
          <ProductGrid items={FEATURED} onAdd={add} />
          <div className="mt-10 text-center">
            <a href="#" className="inline-block border border-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white">
              View all
            </a>
          </div>
        </section>

        <Shows />

        <section id="about" className="mx-auto max-w-7xl px-4 py-12">
          <SectionTitle>About</SectionTitle>
          <div className="grid gap-8 md:grid-cols-3">
            {ABOUT.map((a) => (
              <article key={a.id}>
                <Placeholder className="mb-4 aspect-[4/3] w-full" />
                <h3 className="text-lg font-bold">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{a.text}</p>
                <a href="#" className="mt-3 inline-block text-sm font-semibold underline">Read more</a>
              </article>
            ))}
          </div>
        </section>

        <MusicCarousel />

        <section className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-3xl font-bold">Welcome.</h2>
          <p className="mt-4 text-neutral-700">
            Це демо-магазин мерчу незалежного українського артиста sheeezer: худі, футболки, кепки, вініл і не тільки. Усі товари та ціни вигадані для прикладу.
          </p>
          <p className="mt-4 italic text-neutral-500">— sheeezer</p>
        </section>

        <section id="interviews" className="mx-auto max-w-7xl px-4 pb-12">
          <SectionTitle>Fan Art</SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            {ARCHIVE.map((a) => (
              <article key={a.id} className="border p-4 transition hover:shadow-lg">
                <Placeholder className="mb-3 aspect-video w-full" />
                <h3 className="font-bold">{a.title}</h3>
                <p className="text-xs text-neutral-500">{a.date}</p>
                <a href="#" className="mt-2 inline-block text-sm font-semibold underline">Read more</a>
              </article>
            ))}
          </div>
        </section>

        <section className="noise relative bg-neutral-900 py-12 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-2">
            <div className="aspect-video w-full bg-black">
              {/* <iframe className="h-full w-full" src="https://www.youtube.com/embed/VIDEO_ID" allowFullScreen /> */}
              <div className="flex h-full items-center justify-center text-neutral-500">Video embed</div>
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase">Sign up for updates</h2>
              <p className="mt-2 text-neutral-400">Отримуй новини про нові надходження.</p>
              {subscribed ? (
                <p className="mt-4 text-pink-400">Дякуємо! Ви підписані.</p>
              ) : (
                <div className="mt-4 flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-white px-4 py-3 text-black outline-none"
                  />
                  <button
                    onClick={() => email.includes("@") && setSubscribed(true)}
                    className="bg-pink-600 px-6 text-sm font-bold uppercase hover:bg-pink-500"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black px-4 py-10 text-sm text-neutral-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:justify-between">
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Order Support</a></li>
            <li><a href="#" className="hover:text-white">Refund &amp; Return Policy</a></li>
            <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
          </ul>
          <p className="max-w-md">
            30-day return policy: товар має бути в оригінальному стані, з бирками та
            упаковкою.
          </p>
          <div className="flex gap-4">
            {["Twitter", "Facebook", "YouTube", "Instagram"].map((s) => (
              <a key={s} href="#" className="hover:text-white">{s}</a>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-xs">© 2026 sheeezer. Demo store</p>
      </footer>

      <div className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 bg-yellow-300 px-6 py-3 text-sm font-black uppercase tracking-wider text-black shadow-lg transition duration-300 ${toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
        Added to cart ✦
      </div>
    </div>
  );
}
