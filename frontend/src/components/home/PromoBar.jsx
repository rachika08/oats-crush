const promoMessages = [
  "Free delivery on orders above ₹499",
  "Free electric juice blender on orders above ₹2999",
  "Free delivery on orders above ₹499",
];

const PromoBar = () => {
  // Duplicate the list once so the track can scroll -50% seamlessly.
  const items = [...promoMessages, ...promoMessages];

  return (
    <div className="marquee-wrapper bg-brand-orange text-white overflow-hidden whitespace-nowrap">
      <div
        className="marquee-track py-2"
        style={{ "--marquee-duration": "22s" }}
      >
        {items.map((msg, index) => (
          <span
            key={index}
            className="font-body text-xs sm:text-sm font-medium px-6 sm:px-10 flex-shrink-0"
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PromoBar;