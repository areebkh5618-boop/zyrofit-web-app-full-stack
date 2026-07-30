const ITEMS = [
  "Free Shipping Over $75",
  "30-Day Returns",
  "Engineered Performance Fabric",
  "Trusted By 50K+ Athletes",
  "New Drops Every Month",
];

export default function TrustMarquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden bg-zyro-black py-3.5">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3.5 font-mono-ui text-xs uppercase tracking-wider text-[#aeb4bd]">
            <b className="text-zyro-green">★</b>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
