import { useState } from "react";
import { motion } from "framer-motion";

// Replace src with real UGC/lifestyle shots. Caption is optional — pass "" to skip it.
const moments = [
  { src: "/images/img (1).webp", caption: "Oat milk, not just milk." },
  { src: "/images/img (2).webp", caption: "Sip. Slay. Repeat." },
  { src: "/images/img (3).webp", caption: "Okay, maybe three." },
  { src: "/images/img (4).webp", caption: "This shake? 10/10." },
  { src: "/images/img (5).webp", caption: "The best part of the day." },
];

const CrushMoments = () => {
  const [activeKey, setActiveKey] = useState(null);
const track = Array.from({ length: 4 })
    .flatMap((_, i) => moments.map((m, j) => ({ ...m, key: `${i}-${j}` })))
    .map((m, idx) => ({ ...m, tilt: idx % 2 === 0 ? -3 : 3 }));

  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <div className="marquee-wrapper overflow-hidden">
        <div
          className="marquee-track gap-4 sm:gap-5 py-6 sm:py-8"
          style={{ "--marquee-duration": "50s" }}
        >
 {track.map((moment) => {
            const isActive = activeKey === moment.key;
            return (
            <motion.div
              key={moment.key}
              initial={{ rotate: moment.tilt }}
              animate={{
                rotate: isActive ? 0 : moment.tilt,
                scale: isActive ? 1.05 : 1,
                y: isActive ? -8 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              onMouseEnter={() => setActiveKey(moment.key)}
              onMouseLeave={() => setActiveKey(null)}
              onClick={() =>
                setActiveKey((prev) => (prev === moment.key ? null : moment.key))
              }
              className={`relative flex-shrink-0 w-[320px] sm:w-[360px] md:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-md transition-shadow cursor-pointer ${
                isActive ? "shadow-xl" : ""
              }`}
            >
<img
                src={moment.src}
                alt={moment.caption || "Oats Crush"}
                loading="lazy"
                className="w-full h-full object-cover"
              />

            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CrushMoments;