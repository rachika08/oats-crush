// Using inline SVG linework icons as placeholders — swap with your real
// finalized SVG files (protein/muscle motif, zero-sugar, vegan, flavours).
const benefits = [
  {
    icon: "/src/assets/icons/icon-protein.svg",
    title: "PACKED WITH PROTEIN",
    description:
      "More protein than two eggs, in a bottle you can crush on the go. No shaker. No fuss.",
  },
  {
    icon: "/src/assets/icons/icon-zero-sugar.svg",
    title: "ZERO REFINED SUGAR",
    description:
      "Sweet without the crash. We use natural sweetness from oats and monk fruit.",
  },
  {
    icon: "/src/assets/icons/icon-vegan.svg",
    title: "ACTUALLY VEGAN-FRIENDLY",
    description:
      "Plant-based, lactose-free, and certified for the lifestyle — not just the label.",
  },
  {
    icon: "/src/assets/icons/icon-flavours.svg",
    title: "FLAVORS THAT HIT DIFFERENT",
    description: "Coffee, Rasmalai, Savoury — you name it, we've got it.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Left half — icons + text on brand orange */}
      <div className="bg-brand-orange text-white px-6 sm:px-10 py-14 sm:py-20 flex flex-col gap-20 justify-center">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex gap-4 items-start">
            <img
              src={benefit.icon}
              alt=""
              className="w-11 h-11 flex-shrink-0 invert"
            />

            <div>
              <h3 className="font-heading text-base sm:text-2xl mb-1">
                {benefit.title}
              </h3>
              <p className="font-body text-sm text-white/90 max-w-sm">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right half — product callout on deep red */}
      <div className="relative overflow-hidden">
  <img
    src="/src/assets/images/brew-chew.jpeg"
    alt="Brew Less, Chew More — Oats Crush Coffee"
    className="w-full h-full object-cover"
  />
</div>
    </section>
  );
};

export default BenefitsSection;