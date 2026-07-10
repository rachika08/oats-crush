import { motion } from "framer-motion";
import { Check, X, Zap, Beef, Smile, Timer, Leaf, Sprout, Flame } from "lucide-react";
import { Reveal } from "../Reveal";

const rows = [
  { icon: Zap, label: "30g Protein", regular: false, shake: true },
  { icon: Beef, label: "Keeps You Full", regular: true, shake: false },
  { icon: Smile, label: "Actually Tastes Good", regular: true, shake: false },
  { icon: Timer, label: "Ready in Seconds", regular: false, shake: true },
  { icon: Leaf, label: "Zero Refined Sugar", regular: false, shake: false },
  { icon: Sprout, label: "Vegan & Lactose-Free", regular: false, shake: false },
  { icon: Flame, label: "Unique Flavours", regular: false, shake: false },
];

const ROW_START = [
  "row-start-2",
  "row-start-3",
  "row-start-4",
  "row-start-5",
  "row-start-6",
  "row-start-7",
  "row-start-8",
];

const ComparisonSection = () => {
  const lastIndex = rows.length - 1;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal variant="noticeable" className="text-center mb-10 sm:mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] leading-tight">
            WHY OATS CRUSH
            <br />
            <span className="text-brand-orange">CRUSHES THE USUAL</span>
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-[1.3fr_0.9fr_0.9fr_1fr] sm:grid-cols-[1.4fr_1fr_1fr_1.1fr]">

          <div
  className="col-start-1 col-span-3 row-start-1 rounded-2xl sm:rounded-3xl border border-gray-200"
  style={{ gridRow: `1 / span ${rows.length + 1}` }}
/>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              scale: 1.06,
              transition: { type: "spring", stiffness: 300, damping: 15 },
            }}
            style={{
              transformOrigin: "center center",
              gridRow: `1 / span ${rows.length + 1}`,
            }}
            className="col-start-4 row-start-1 z-[1] -my-3 sm:-my-4 md:-my-5 rounded-2xl sm:rounded-3xl bg-black shadow-xl shadow-black/20 cursor-default"
          />

          {/* header row */}
          <div className="col-start-1 row-start-1 relative flex items-center px-3 sm:px-6 py-3 sm:py-4 font-body text-[10px] sm:text-sm font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-200">
            Category
          </div>
          <div className="col-start-2 row-start-1 relative flex items-center justify-center px-1 sm:px-2 py-3 sm:py-4 font-body text-[10px] sm:text-sm font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-200">
            Regular Breakfast
          </div>
          <div className="col-start-3 row-start-1 relative flex items-center justify-center px-1 sm:px-2 py-3 sm:py-4 font-body text-[10px] sm:text-sm font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-200">
            Oat Shakes
          </div>
          <div className="col-start-4 row-start-1 relative z-[2] flex items-center justify-center px-2 sm:px-4 py-3 sm:py-4 pointer-events-none">
            <img
              src="/images/oc.webp"
              alt="Oats Crush"
              className="h-10 sm:h-10 md:h-20 w-auto object-contain"
            />
          </div>

          {/* data rows — each cell animates independently via Reveal, no orchestrating parent to lose track of */}
          {rows.map((row, i) => {
            const Icon = row.icon;
            const isLast = i === lastIndex;
            const rowStart = ROW_START[i];
            const divider = isLast ? "" : "border-b border-gray-100";
            const delay = i * 0.05;

            return (
              <div key={row.label} className="contents">
                <Reveal
                  variant="subtle"
                  delay={delay}
                  className={`${rowStart} col-start-1 relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-body text-[11px] sm:text-base font-medium leading-tight ${divider}`}
                >
                  <Icon size={14} className="text-brand-orange flex-shrink-0 hidden sm:block" />
                  {row.label}
                </Reveal>

                <Reveal
                  variant="subtle"
                  delay={delay}
                  className={`${rowStart} col-start-2 relative flex items-center justify-center py-3 sm:py-4 ${divider}`}
                >
                  {row.regular ? (
                    <Check size={15} className="text-black" />
                  ) : (
                    <X size={15} className="text-gray-300" />
                  )}
                </Reveal>

                <Reveal
                  variant="subtle"
                  delay={delay}
                  className={`${rowStart} col-start-3 relative flex items-center justify-center py-3 sm:py-4 ${divider}`}
                >
                  {row.shake ? (
                    <Check size={15} className="text-black" />
                  ) : (
                    <X size={15} className="text-gray-300" />
                  )}
                </Reveal>

                <Reveal
  variant="subtle"
  delay={delay}
  className={`${rowStart} col-start-4 relative z-[2] flex items-center justify-center py-3 sm:py-4 pointer-events-none ${
  isLast ? "" : "border-b border-white/10"
}`}
>
  <Check size={15} className="text-brand-orange" />
</Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;