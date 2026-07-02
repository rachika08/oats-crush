import { useState, useEffect } from "react";
import { Bell, Check, Coffee, Milk, Wheat, Loader2 } from "lucide-react";
import api from "../../api/axios";



const defaultIcon = Coffee;

const FlavoursSection = () => {
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedId, setFlippedId] = useState(null);
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
        <Bell size={14} />
      </>
    );
  };

 
  if (!loading && upcomingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block border border-brand-orange text-brand-orange rounded-full px-4 py-1 text-xs sm:text-sm font-body mb-4">
          Coming Soon
        </span>

        <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-3">
          NEW FLAVOURS
        </h2>

        <p className="font-body text-gray-600 text-sm sm:text-base mb-10">
          New flavours dropping soon. Get notified the second they land.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {upcomingProducts.map((product) => {
              const status = notifyStatus[product._id];

              return (
                <div
                  key={product._id}
                  className={`flip-card h-[420px] sm:h-[440px] ${
                    flippedId === product._id ? "is-flipped" : ""
                  }`}
                  onClick={() =>
                    setFlippedId(flippedId === product._id ? null : product._id)
                  }
                >
                  <div className="flip-card-inner">
                    {/* FRONT FACE */}
                    <div className="flip-card-front bg-gray-50 rounded-2xl p-5 text-left flex flex-col shadow-md">
                      <div className="relative rounded-xl overflow-hidden mb-4 aspect-square bg-black/5">
                        <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-body px-3 py-1 rounded-full">
                          Dropping soon
                        </span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h3 className="font-heading text-xl sm:text-2xl mb-1">
                        {product.name}
                      </h3>

                      <p className="font-body text-sm mb-5 text-gray-600">
                        {product.description}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotify(product);
                        }}
                        disabled={status === "loading" || status === "success"}
                        className="mt-auto bg-white border rounded-full py-2.5 flex items-center justify-center gap-2 font-heading text-base font-medium transition-all duration-200 hover:-translate-y-1 shadow-md cursor-pointer disabled:cursor-default disabled:hover:translate-y-0"
                      >
                        {renderButtonContent(product)}
                      </button>
                      {status === "error" && errorMsg[product._id] && (
                        <p className="text-xs text-red-600 mt-2 font-body">
                          {errorMsg[product._id]}
                        </p>
                      )}
                    </div>

                    {/* BACK FACE — simplified, since benefits/info fields differ per product */}
                    <div className="flip-card-back bg-gray-50 rounded-2xl overflow-hidden text-left flex flex-col shadow-md p-5 sm:p-6">
                      <h3 className="font-heading text-xl sm:text-2xl mb-1">
                        {product.name}
                      </h3>
                      <div className="h-px w-10 mb-4 bg-gray-300" />
                      <p className="font-body text-sm text-gray-600 flex-1">
                        {product.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotify(product);
                        }}
                        disabled={status === "loading" || status === "success"}
                        className="bg-white border rounded-full py-2.5 flex items-center justify-center gap-2 font-heading text-base font-medium transition-all duration-200 hover:-translate-y-1 shadow-md cursor-pointer disabled:cursor-default disabled:hover:translate-y-0"
                      >
                        {renderButtonContent(product)}
                      </button>
                      {status === "error" && errorMsg[product._id] && (
                        <p className="text-xs text-red-600 mt-2 font-body">
                          {errorMsg[product._id]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlavoursSection;

