export function ColorPaletteExample() {
  return (
    <div className="p-8 space-y-8 font-sans">
      <h2 className="text-2xl font-semibold text-[var(--color-text-dark)]">
        Color Palette Example
      </h2>

      {/* Button */}
      <section className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-text-gray)]">
          Primary Button
        </p>
        <button
          className="
            px-5 py-2.5 rounded-lg text-white font-medium text-sm
            bg-[var(--color-teal)]
            hover:bg-[var(--color-teal-dark)]
            transition-colors duration-200
            shadow-[0_4px_14px_var(--color-shadow-btn)]
          "
        >
          Get Started
        </button>
      </section>

      {/* Card */}
      <section className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-text-gray)]">
          Card
        </p>
        <div
          className="
            max-w-sm rounded-xl p-6
            bg-[var(--color-bg-section)]
            shadow-[0_4px_24px_var(--color-shadow-card)]
            border border-gray-100
          "
        >
          <h3 className="text-base font-semibold text-[var(--color-text-dark)] mb-1">
            Card Title
          </h3>
          <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">
            This card uses the section background color and a subtle teal-tinted
            shadow to keep the palette cohesive.
          </p>
        </div>
      </section>

      {/* Text examples */}
      <section className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-text-gray)]">
          Typography
        </p>
        <p className="text-base font-medium text-[var(--color-text-dark)]">
          Dark body text — <code className="font-mono text-xs">--color-text-dark</code>
        </p>
        <p className="text-base text-[var(--color-text-gray)]">
          Muted / secondary text — <code className="font-mono text-xs">--color-text-gray</code>
        </p>
        <p className="text-base text-[var(--color-gray-light)]">
          Placeholder / hint text — <code className="font-mono text-xs">--color-gray-light</code>
        </p>
      </section>

      {/* Badge */}
      <section className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-text-gray)]">
          Soft Teal Badge
        </p>
        <span
          className="
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
            bg-[var(--color-teal-soft)]
            text-[var(--color-teal-dark)]
          "
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
          In Stock
        </span>
      </section>
    </div>
  );
}
