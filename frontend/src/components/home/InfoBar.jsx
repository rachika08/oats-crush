const infoItems = [
  "PROTEIN PACKED",
  "LACTOSE-FREE",
  "VEGAN-FRIENDLY",
  "ZERO REFINED SUGAR",
  "MADE FROM REAL OATS",
  "NO PRESERVATIVES",
];

const InfoBar = () => {
  // Duplicate the list once so the track can scroll -50% seamlessly.
  const items = [...infoItems, ...infoItems];

  return (
    <div className="marquee-wrapper bg-brand-orange text-white overflow-hidden whitespace-nowrap">
      <div
        className="marquee-track py-3"
        style={{ "--marquee-duration": "20s" }}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className="font-heading text-sm sm:text-lg px-4 sm:px-6 flex items-center gap-20 sm:gap-20 flex-shrink-0"
          >
            {item}
            <span aria-hidden="true">|</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default InfoBar;