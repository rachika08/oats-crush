import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Placeholder paths — swap these with your real banner images.
const heroBanners = [
  "/images/banner1.webp",
  "/images/banner2.webp",
  "/images/banner3.webp",
  "/images/banner4.webp",
  "/images/banner5.webp",
];

const HERO_ROTATE_MS = 2000;

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroBanners.length);
    }, HERO_ROTATE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[520px] sm:h-[600px] md:h-[680px] w-full overflow-hidden">
      {/* Banner images, cross-fading */}
      {heroBanners.map((src, index) => (
        <img
          key={src}
          src={src}
          loading={index === 0 ? "eager" : "lazy"}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* 50% black overlay so white text reads clearly */}
      <div className="absolute inset-0 bg-black/20" />

    </section>
  );
};

export default HeroSection;