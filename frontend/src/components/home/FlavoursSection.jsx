import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Loader2, ArrowRight } from "lucide-react";
import api from "../../api/axios";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";

const heroBadges = [
  { icon: "/images/icon-zero-sugar.svg", label: "Sweetened with monk fruit" },
  { icon: "/images/icon-drop.svg", label: "No fillers or emulsifiers" },
  { icon: "/images/icon-flavours.svg", label: "No synthetic flavours" },
];

const FlavoursSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifyStatus, setNotifyStatus] = useState({});
  const [errorMsg, setErrorMsg] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/product")
      .then((res) => setProducts(res.data.products || res.data))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleNotify = async (product) => {
    const productId = product._id;

    if (notifyStatus[productId] === "loading" || notifyStatus[productId] === "success") {
      return;
    }

    setNotifyStatus((prev) => ({ ...prev, [productId]: "loading" }));
    setErrorMsg((prev) => ({ ...prev, [productId]: null }));

    const token = localStorage.getItem("token");

    if (!token) {
      setNotifyStatus((prev) => ({ ...prev, [productId]: "error" }));
      setErrorMsg((prev) => ({ ...prev, [productId]: "Please log in first" }));
      return;
    }

    try {
      await api.post(
        "/notification/notify",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifyStatus((prev) => ({ ...prev, [productId]: "success" }));
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === "Already subscribed") {
        setNotifyStatus((prev) => ({ ...prev, [productId]: "success" }));
        return;
      }
      setNotifyStatus((prev) => ({ ...prev, [productId]: "error" }));
      setErrorMsg((prev) => ({
        ...prev,
        [productId]: err.response?.data?.message || "Something went wrong",
      }));
    }
  };

  const getFlavourImage = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("rasmalai")) return "/images/rasmalai-flip.webp";
    if (lower.includes("coffee")) return "/images/coffee-flip.webp";
    return "/images/rasmalai.webp"; 
  };

  const renderNotifyButtonContent = (product) => {
    const status = notifyStatus[product._id];

    if (status === "loading") {
      return (
        <>
          <Loader2 size={14} className="animate-spin" />
          SENDING...
        </>
      );
    }
    if (status === "success") {
      return (
        <>
          SUBSCRIBED
          <Check size={14} />
        </>
      );
    }
    return (
      <>
        NOTIFY ME
        <Bell size={15} strokeWidth={3} />
      </>
    );
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-center">Loading...</p>
        </div>
      </section>
    );
  }

  const heroProduct = products.find((p) =>
    p.name?.toLowerCase().includes("rasmalai")
  );

  const comingSoonProduct = products.find((p) =>
    p.name?.toLowerCase().includes("coffee")
  );

  if (!heroProduct && !comingSoonProduct) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero — Rasmalai, always shown as launched */}
        {heroProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start mb-6">
            <div
              onClick={() => navigate(`/product/${heroProduct._id}`)}
              className="flip-card rounded-3xl bg-black w-full h-[420px] md:h-[560px] cursor-pointer"
            >
              <div className="flip-card-inner">
                <div className="flip-card-front rounded-3xl overflow-hidden">
                  <video
                    src={heroProduct.videoUrl || "/images/video3.mp4"}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <div className="flip-card-back rounded-3xl overflow-hidden">
                  <img
                    src={getFlavourImage(heroProduct.name)}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

{/* Right - content */}
            <Reveal variant="subtle" delay={0.1} className="text-left relative">
              <span className="inline-block border border-flavour-rasmalai-accent text-flavour-rasmalai-accent rounded-full px-4 py-1 text-xs sm:text-sm font-body mb-4">
                Now Live
              </span>

              <div className="mb-4">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] leading-tight uppercase">
                  {heroProduct.name} HAS LANDED
                </h2>
                <img
                  src="/images/mark.svg"
                  alt=""
                  className="hidden md:block absolute right-10 top-30 -translate-y-2 text-flavour-rasmalai-accent w-14 h-14 pointer-events-none"
                />
              </div>

              <p className="font-body text-sm sm:text-base font-semibold text-gray-800 mb-4">
                {heroProduct.tagline || "30g protein · Real oats · Real flavour"}
              </p>

              <p className="font-body text-sm text-gray-600 mb-8 leading-relaxed">
                {heroProduct.description}
              </p>

<RevealGroup staggerDelay={0.1} className="grid grid-cols-3 gap-6 mb-8 max-w-sm">
                {heroBadges.map(({ icon, label }) => (
                  <RevealItem key={label} variant="subtle" className="flex flex-col items-center text-center">
                    <span
                      className="icon-mask w-9 h-9 sm:w-10 sm:h-10 mb-3 bg-flavour-rasmalai-accent"
                      style={{ WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})` }}
                    />
                    <p className="font-body text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      {label}
</p>
                  </RevealItem>
                ))}
              </RevealGroup>

              <button
                onClick={() => navigate(`/product/${heroProduct._id}`)}
                className="inline-flex items-center gap-2 border-2 border-flavour-rasmalai-accent text-black rounded-full px-6 py-2.5 font-heading text-lg font-medium transition-all duration-200 hover:-translate-y-1 hover:bg-flavour-rasmalai-accent hover:text-white cursor-pointer"
              >
                ORDER NOW
                <ArrowRight size={16} strokeWidth={3} />
</button>
            </Reveal>
          </div>
        )}
{/* Coming-soon strip — soft launch card */}
{comingSoonProduct && (
<Reveal
    variant="noticeable"
    key={comingSoonProduct._id}
    className="block"
  >
    <div
      className="relative border-2 border-dashed border-brand-orange rounded-2xl px-6 pt-8 pb-6 mt-4 cursor-pointer hover:-translate-y-1 transition bg-[#FFFBF5]"
      onClick={() => navigate(`/product/${comingSoonProduct._id}`)}
    >
    <span className="absolute -top-2.5 left-6 bg-black text-white text-[11px] font-body font-medium px-3.5 py-1 rounded-md -rotate-3">
      Coming Soon
    </span>

    <div className="flex gap-4 items-start">
     <div className="flip-card w-16 h-16 rounded-xl flex-shrink-0 bg-gray-100 animate-gentle-float">
        <div className="flip-card-inner">
          <div className="flip-card-front rounded-xl overflow-hidden">
            <img
              src={comingSoonProduct.image}
              loading="lazy"
              alt={comingSoonProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flip-card-back rounded-xl overflow-hidden">
            <img
              src={getFlavourImage(comingSoonProduct.name)}
              loading="lazy"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="font-heading text-2xl leading-tight lowercase text-black">
          {comingSoonProduct.name.split(" ")[0].toLowerCase()}.
          <br />
          <span className="relative inline-block">
            brewing.
<svg
              className="absolute left-0 -bottom-0.5 w-full h-2.5"
              viewBox="0 0 120 10"
              preserveAspectRatio="none"
            >
              <path
                d="M2,7 Q 20,3 40,5 T 80,4 T 118,6"
                stroke="var(--color-brand-orange)"
                strokeOpacity="0.55"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                style={{ mixBlendMode: "multiply" }}
                className="marker-highlight-path"
              />
            </svg>
          </span>
        </h3>
        <p className="font-body text-xs text-gray-400 mt-1 line-clamp-1">
          {comingSoonProduct.tagline || comingSoonProduct.description}
        </p>
      </div>
    </div>

    <div className="marquee-wrapper my-4 -mx-6 border-y border-[#eee2d2] py-1.5 overflow-hidden">
<div className="marquee-track" style={{ "--marquee-duration": "44s" }}>
        {Array.from({ length: 8 }).flatMap((_, i) => [
          <span key={`a-${i}`} className="px-2.5 font-body text-[11px] font-medium tracking-wide text-brand-orange-dark whitespace-nowrap">COMING SOON</span>,
          <span key={`b-${i}`} className="px-2.5 font-body text-[11px] text-brand-orange-dark whitespace-nowrap">•</span>,
          <span key={`c-${i}`} className="px-2.5 font-body text-[11px] font-medium tracking-wide text-brand-orange-dark whitespace-nowrap">BE THE FIRST TO KNOW</span>,
          <span key={`d-${i}`} className="px-2.5 font-body text-[11px] text-brand-orange-dark whitespace-nowrap">•</span>,
                    <span key={`c-${i}`} className="px-2.5 font-body text-[11px] font-medium tracking-wide text-brand-orange-dark whitespace-nowrap">NEW BREW</span>,
          <span key={`d-${i}`} className="px-2.5 font-body text-[11px] text-brand-orange-dark whitespace-nowrap">•</span>,
        ])}
      </div>
    </div>

    <p className="font-body text-sm font-medium text-black mb-2.5">
      Be the first to be notified when it drops
    </p>

    <button
      onClick={(e) => {
        e.stopPropagation();
        handleNotify(comingSoonProduct);
      }}
      disabled={
        notifyStatus[comingSoonProduct._id] === "loading" ||
        notifyStatus[comingSoonProduct._id] === "success"
      }
      className="bg-brand-orange text-white rounded-full px-6 py-2.5 inline-flex items-center justify-center gap-2 font-heading text-sm font-medium transition hover:-translate-y-1 shadow-md cursor-pointer disabled:cursor-default disabled:hover:translate-y-0"
    >
      {renderNotifyButtonContent(comingSoonProduct)}
    </button>

    {notifyStatus[comingSoonProduct._id] === "error" &&
      errorMsg[comingSoonProduct._id] && (
        <p className="text-xs text-red-600 mt-2 font-body">
          {errorMsg[comingSoonProduct._id]}
        </p>
)}
    </div>
  </Reveal>
)}
      </div>
    </section>
  );
};

export default FlavoursSection;