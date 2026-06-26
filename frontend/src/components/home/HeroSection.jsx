import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Placeholder paths — swap these with your real banner images.
const heroBanners = [
  "/images/banner1.png",
  "/images/banner2.png",
  "/images/banner3.png",
  "/images/banner4.jpg",
  "/images/banner5.png",
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
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* 50% black overlay so white text reads clearly */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-heading text-white text-4xl sm:text-5xl md:text-[74px] leading-tight tracking-wide">
          YOUR FIRST CRUSH.
        </h1>

        <p className="font-body text-white/90 text-sm sm:text-base md:text-lg mt-3 mb-8">
          Richest coffee. Real oats. Right here.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="bg-white text-black font-heading font-medium px-8 py-3 rounded-full hover:bg-brand-orange hover:text-white transition shadow-md hover:-translate-y-1 cursor-pointer"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
};

export default HeroSection;