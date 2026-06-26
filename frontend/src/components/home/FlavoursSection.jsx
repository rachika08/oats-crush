import { Bell } from "lucide-react";

const flavours = [
  {
    id: "coffee",
    name: "COFFEE",
    description: "No refined sugar • Rich coffee flavor",
    image: "/src/assets/images/coffee.png",
    bg: "bg-flavour-coffee-bg",
    text: "text-flavour-coffee-text",
    hoverBg: "hover:bg-flavour-coffee-text",
  },
  {
    id: "rasmalai",
    name: "RASMALAI",
    description: "30g protein • Real oats",
    image: "/src/assets/images/rasmalai.png",
    bg: "bg-flavour-rasmalai-bg",
    text: "text-flavour-rasmalai-text",
    hoverBg: "hover:bg-flavour-rasmalai-text",
  },
  {
    id: "savoury",
    name: "SAVOURY",
    description: "Protein, the savoury way",
    image: "/src/assets/images/oat-milk.png",
    bg: "bg-flavour-savoury-bg",
    text: "text-flavour-savoury-text",
    hoverBg: "hover:bg-flavour-savoury-text",
  },
];

const FlavoursSection = () => {
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
          {flavours.map((flavour) => (
            <div
              key={flavour.id}
              className={`${flavour.bg} rounded-2xl p-5 text-left flex flex-col`}
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
  onClick={() => handleNotify(flavour.id)}
  className={`mt-auto bg-white rounded-full py-2.5 flex items-center justify-center gap-2 font-heading text-base font-medium transition-all duration-200 hover:!text-white hover:-translate-y-1 shadow-md ${flavour.text} ${flavour.hoverBg}`}
>
  NOTIFY ME
  <Bell size={14} />
</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlavoursSection;