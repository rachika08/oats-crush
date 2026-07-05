import { motion } from "framer-motion";

// Three animation "feels" to compare — swap the `variant` prop anywhere
// this is used to instantly change the feel, no other code changes needed.
const VARIANTS = {
  subtle: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  noticeable: {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },
  playful: {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 18 },
    },
  },
};

// Single element that fades/slides in once when scrolled into view.
export function Reveal({
  children,
  variant = "subtle",
  delay = 0,
  className = "",
  once = true,
}) {
  const chosen = VARIANTS[variant] || VARIANTS.subtle;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: chosen.hidden,
        visible: {
          ...chosen.visible,
          transition: { ...chosen.visible.transition, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Wrap a group of items in <RevealGroup>, and each item in <RevealItem>,
// to make them animate in one-at-a-time (staggered) instead of all at once.
export function RevealGroup({
  children,
  staggerDelay = 0.12,
  className = "",
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, variant = "subtle", className = "" }) {
  const chosen = VARIANTS[variant] || VARIANTS.subtle;

  return (
    <motion.div className={className} variants={chosen}>
      {children}
    </motion.div>
  );
}