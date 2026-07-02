const benefits = [
  {
    icon: "/images/icon-protein.svg",
    title: "PACKED WITH PROTEIN",
    description:
      "More protein than two eggs, in a bottle you can crush on the go. No shaker. No fuss.",
  },
  {
    icon: "/images/icon-zero-sugar.svg",
    title: "ZERO REFINED SUGAR",
    description:
      "Sweet without the crash. We use natural sweetness from oats and monk fruit.",
  },
  {
    icon: "/images/icon-vegan.svg",
    title: "ACTUALLY VEGAN-FRIENDLY",
    description:
      "Plant-based, lactose-free, and certified for the lifestyle — not just the label.",
  },
  {
    icon: "/images/icon-flavours.svg",
    title: "FLAVORS THAT HIT DIFFERENT",
    description: "Coffee, Rasmalai, Savoury — you name it, we've got it.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Trust-badge style row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 mb-12 sm:mb-16 text-center">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center mb-3">
                <img src={benefit.icon} alt="" className="w-8 h-8 invert" />
              </div>
              <p className="font-body font-semibold text-sm mb-1">
                {benefit.title}
              </p>
              <p className="font-body text-xs text-gray-500 max-w-[180px]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Video, centered */}
        <div className="relative overflow-hidden rounded-2xl max-w-4xl mx-auto">
          <video
            src="/images/video2.mp4"
            className="w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;