import { useState } from "react";
import { Bell, Check, Coffee, Milk, Wheat } from "lucide-react";

const flavours = [
  {
    id: "coffee",
    name: "COFFEE",
    description: "No refined sugar • Rich coffee flavor",
    image: "/images/coffee.png",
    bg: "bg-flavour-coffee-bg",
    text: "text-flavour-coffee-text",
    hoverBg: "hover:bg-flavour-coffee-text",
    icon: Coffee,
    info: [
      "Real brewed coffee extract",
      "30g protein per serving",
      "Zero refined sugar",
      "Lactose-free & vegan-friendly",
    ],
  },
  {
    id: "rasmalai",
    name: "RASMALAI",
    description: "30g protein • Real oats",
    image: "/images/rasmalai.png",
    bg: "bg-flavour-rasmalai-bg",
    text: "text-flavour-rasmalai-text",
    hoverBg: "hover:bg-flavour-rasmalai-text",
    icon: Milk,
    info: [
      "Authentic rasmalai flavour",
      "30g protein per serving",
      "Made from real oats",
      "No artificial sweeteners",
    ],
  },
  {
    id: "savoury",
    name: "SAVOURY",
    description: "Protein, the savoury way",
    image: "/images/oat-milk.png",
    bg: "bg-flavour-savoury-bg",
    text: "text-flavour-savoury-text",
    hoverBg: "hover:bg-flavour-savoury-text",
    icon: Wheat,
    info: [
      "Umami-forward savoury blend",
      "High protein, low sugar",
      "Vegan-friendly",
      "Built for everyday fuel",
    ],
  },
];

const FlavoursSection = () => {
  const [flippedId, setFlippedId] = useState(null);

  const handleNotify = (flavourId) => {
    // TODO: wire to a real notify-me endpoint once available.
    console.log("Notify me requested for:", flavourId);
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block border border-brand-orange text-brand-orange rounded-full px-4 py-1 text-xs sm:text-sm font-body mb-4">
          Coming Soon
        </span>

        <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-3">
          3 NEW FLAVOURS
        </h2>

        <p className="font-body text-gray-600 text-sm sm:text-base mb-10">
          Three new flavours dropping soon. Get notified the second they
          land.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {flavours.map((flavour) => {
            const Icon = flavour.icon;
            return (
              <div
                key={flavour.id}
                className={`flip-card h-[420px] sm:h-[440px] ${
                  flippedId === flavour.id ? "is-flipped" : ""
                }`}
                onClick={() =>
                  setFlippedId(flippedId === flavour.id ? null : flavour.id)
                }
              >
                <div className="flip-card-inner">
                  {/* FRONT FACE */}
                  <div
                    className={`flip-card-front ${flavour.bg} rounded-2xl p-5 text-left flex flex-col shadow-md`}
                  >
                    <div className="relative rounded-xl overflow-hidden mb-4 aspect-square bg-black/5">
                      <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-body px-3 py-1 rounded-full">
                        Dropping soon
                      </span>
                      <img
                        src={flavour.image}
                        alt={flavour.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3
                      className={`font-heading text-xl sm:text-2xl mb-1 ${flavour.text}`}
                    >
                      {flavour.name}
                    </h3>

                    <p className={`font-body text-sm mb-5 ${flavour.text}`}>
                      {flavour.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotify(flavour.id);
                      }}
                      className={`mt-auto bg-white rounded-full py-2.5 flex items-center justify-center gap-2 font-heading text-base font-medium transition-all duration-200 hover:!text-white hover:-translate-y-1 shadow-md cursor-pointer ${flavour.text} ${flavour.hoverBg}`}
                    >
                      NOTIFY ME
                      <Bell size={14} />
                    </button>
                  </div>

                  {/* BACK FACE — split layout: icon panel + spec list */}
                  <div
                    className={`flip-card-back ${flavour.bg} rounded-2xl overflow-hidden text-left flex flex-col shadow-md`}
                  >
                    {/* Icon panel */}
                    <div
                      className="relative h-[34%] flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: "rgba(0,0,0,0.07)" }}
                    >
                      {/* decorative backdrop circle */}
                      <div className="absolute w-24 h-24 rounded-full bg-white/30" />
                      <Icon
                        size={52}
                        strokeWidth={1.5}
                        className={`relative z-10 ${flavour.text}`}
                      />
                    </div>

                    {/* Spec list panel */}
                    <div className="flex-1 flex flex-col p-5 sm:p-6">
                      <h3
                        className={`font-heading text-xl sm:text-2xl mb-1 ${flavour.text}`}
                      >
                        {flavour.name}
                      </h3>

                      <div
                        className={`h-px w-10 mb-4 ${flavour.text} opacity-30`}
                        style={{ backgroundColor: "currentColor" }}
                      />

                      <ul className="flex-1 space-y-3 mb-5">
                        {flavour.info.map((point, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2 font-body text-sm ${flavour.text}`}
                          >
                            <Check size={16} className="flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotify(flavour.id);
                        }}
                        className={`bg-white rounded-full py-2.5 flex items-center justify-center gap-2 font-heading text-base font-medium transition-all duration-200 hover:!text-white hover:-translate-y-1 shadow-md cursor-pointer ${flavour.text} ${flavour.hoverBg}`}
                      >
                        NOTIFY ME
                        <Bell size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FlavoursSection;