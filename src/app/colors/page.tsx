export default function ColorsPage() {
  const colors = [
    { key: "noir", hex: "#04061D", cssVar: "--color-noir" },
    { key: "violet_fonce_1", hex: "#663BD6", cssVar: "--color-violet_fonce_1" },
    { key: "violet", hex: "#7D5AE0", cssVar: "--color-violet" },
    { key: "bleu_fonce_1", hex: "#22254C", cssVar: "--color-bleu_fonce_1" },
    { key: "bleu_fonce_2", hex: "#1D1E3B", cssVar: "--color-bleu_fonce_2" },
  ];

  return (
    <div className="font-sans min-h-screen p-8 sm:p-12">
      <main className="max-w-5xl mx-auto">
        <h1 className="text-center text-lg font-semibold mb-10">
          Palette de couleurs
        </h1>
        <ul className="flex flex-wrap gap-10 justify-center">
          {colors.map((c) => (
            <li
              key={c.key}
              className="flex flex-col items-center gap-3 text-xs text-center"
            >
              <div
                className="h-12 w-12 rounded-md shadow-sm border border-black/5 dark:border-white/10"
                style={{ backgroundColor: `var(${c.cssVar})` }}
                aria-label={`${c.key} (${c.hex})`}
              />
              <div className="leading-tight">
                <div className="font-medium">{c.key}</div>
                <div className="text-foreground/70">{c.hex}</div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
