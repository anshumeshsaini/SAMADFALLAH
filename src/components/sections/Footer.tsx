const Footer = () => {
  const items = ["SAMADFALLAH", "EST. 2014", "CAP NO. 287", "RIGHT HAND", "TOP ORDER", "SAMADFALLAH", "EST. 2014", "CAP NO. 287", "RIGHT HAND", "TOP ORDER"];
  return (
    <footer className="relative overflow-hidden border-t border-line bg-background pb-10 pt-20">
      <div className="overflow-hidden border-y border-line py-10">
        <div className="flex animate-ticker gap-12 whitespace-nowrap">
          {[...items, ...items].map((t, i) => (
            <span key={i} className="font-display text-7xl uppercase tracking-tight text-foreground/90 md:text-9xl">
              {t} <span className="text-accent">★</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container mt-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <div className="font-display text-2xl tracking-[0.25em] text-foreground">SAMADFALLAH</div>
          <p className="mt-2 max-w-sm font-sans text-sm text-muted-foreground">
            A cinematic record of an ongoing innings. Built with obsession by a fan, for the fans.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 font-condensed text-xs uppercase tracking-[0.3em] text-muted-foreground md:items-end">
          <span>© {new Date().getFullYear()} — All Rights Reserved</span>
          <span>Press <kbd className="mx-1 rounded border border-line bg-surface px-1.5 py-0.5 text-foreground">S</kbd> for an easter egg</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
