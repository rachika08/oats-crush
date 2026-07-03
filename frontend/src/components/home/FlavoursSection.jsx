import { useState, useEffect } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import api from "../../api/axios";

const heroBadges = [
  { icon: "/images/icon-zero-sugar.svg", label: "Sweetened with monk fruit" },
  { icon: "/images/icon-drop.svg", label: "No fillers or emulsifiers" },
  { icon: "/images/icon-flavours.svg", label: "No synthetic flavours" },
];

const FlavoursSection = () => {
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifyStatus, setNotifyStatus] = useState({});
  const [errorMsg, setErrorMsg] = useState({});

  useEffect(() => {
    api
      .get("/product/upcoming")
      .then((res) => setUpcomingProducts(res.data))
      .catch((err) => console.error("Failed to load upcoming products:", err))
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

  const renderButtonContent = (product) => {
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
        <Bell size={15}  strokeWidth={3} />
      </>
    );
  };

  if (!loading && upcomingProducts.length === 0) {
    return null;
  }

const heroProduct = upcomingProducts.find((p) =>
    p.name?.toLowerCase().includes("rasmalai")
  ) || upcomingProducts[0];

  const restProducts = upcomingProducts.filter(
    (p) => p._id !== heroProduct?._id
  );

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <>
          {/* Hero — lead upcoming flavour — full section width */}
          {heroProduct && (
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start mb-6">
    {/* Left - video */}
    <div className="rounded-3xl overflow-hidden bg-black w-full h-[420px] md:h-[560px]">
      <video
        src={heroProduct.videoUrl || "/images/video3.mp4"}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>

    {/* Right - content */}
    <div className="text-left">
                <span className="inline-block border border-flavour-rasmalai-accent text-flavour-rasmalai-accent rounded-full px-4 py-1 text-xs sm:text-sm font-body mb-4">
                  Dropping Soon
                </span>

                <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] leading-tight mb-4 uppercase">
                  {heroProduct.name} IS COMING
                </h2>

                <p className="font-body text-sm sm:text-base font-semibold text-gray-800 mb-4">
                  {heroProduct.tagline || "30g protein · Real oats · Real flavour"}
                </p>

                <p className="font-body text-sm text-gray-600 mb-8 leading-relaxed">
                  {heroProduct.description}
                </p>

<div className="grid grid-cols-3 gap-6 mb-8 max-w-sm">
                    {heroBadges.map(({ icon, label }) => (
                      <div key={label} className="flex flex-col items-center text-center">
                        <span
                          className="icon-mask w-9 h-9 sm:w-10 sm:h-10 mb-3 bg-flavour-rasmalai-accent"
                          style={{ WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})` }}
                        />
                        <p className="font-body text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                <button
                  onClick={() => handleNotify(heroProduct)}
                  disabled={
                    notifyStatus[heroProduct._id] === "loading" ||
                    notifyStatus[heroProduct._id] === "success"
                  }
                  className="inline-flex items-center gap-2 border-2 border-flavour-rasmalai-accent text-black rounded-full px-6 py-2.5 font-heading text-lg font-medium transition-all duration-200 hover:-translate-y-1 hover:bg-flavour-rasmalai-accent hover:text-white cursor-pointer disabled:cursor-default disabled:hover:translate-y-0"
                >
                  {renderButtonContent(heroProduct)}
                </button>

                {notifyStatus[heroProduct._id] === "error" && errorMsg[heroProduct._id] && (
                  <p className="text-xs text-red-600 mt-2 font-body">
                    {errorMsg[heroProduct._id]}
                  </p>
                )}
              </div>
            </div>
          )}
{/* Soft-launch strip(s) */}
          {restProducts.map((product) => {
            const status = notifyStatus[product._id];
            return (
              <div
                key={product._id}
                className="flex items-center justify-between gap-4 border border-brand-orange shadow-md rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mt-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block bg-brand-orange/10 text-brand-orange-dark rounded-full px-3 py-0.5 text-[10px] sm:text-xs font-body mb-1">
                      Brewing in the back
                    </span>
                    <h3 className="font-heading text-base sm:text-lg uppercase truncate">
                      {product.name}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-gray-500 truncate">
                      {product.tagline || product.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleNotify(product)}
                  disabled={status === "loading" || status === "success"}
                  className="flex-shrink-0 bg-brand-orange text-white rounded-full px-5 py-2 flex items-center gap-2 font-heading text-xs sm:text-sm font-medium transition hover:-translate-y-1 shadow-md cursor-pointer disabled:cursor-default disabled:hover:translate-y-0"
                >
                  {renderButtonContent(product)}
                </button>
              </div>
            );
          })}
          </>
        )}
      </div>
    </section>
  );
};

export default FlavoursSection;