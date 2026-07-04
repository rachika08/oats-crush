import confetti from "canvas-confetti";

export function fireConfetti() {
  const DRAWER_WIDTH = 420;   // matches sm:w-[420px] in CartDrawer.jsx
  const DRAWER_OFFSET = 16;   // matches sm:right-4

  const isDesktop = window.innerWidth >= 640; // Tailwind's `sm:` breakpoint

  const centerX = isDesktop
    ? (window.innerWidth - DRAWER_OFFSET - DRAWER_WIDTH / 2) / window.innerWidth
    : 0.5; // drawer is full-width on mobile, so center of screen = center of drawer

  confetti({
    particleCount: 90,
    spread: 65,
    origin: { x: centerX, y: 0.4 },
    colors: ["#F66F1E", "#000000", "#FFFFFF"],
  });
}