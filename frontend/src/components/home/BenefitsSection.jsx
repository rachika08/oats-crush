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
<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 md:items-center">
        {/* Trust-badge style column */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-y-10 md:gap-y-16 text-center md:text-left">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center md:items-start md:flex-row md:gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center mb-3 md:mb-0 flex-shrink-0">
                <img src={benefit.icon} alt="" className="w-8 h-8 invert" />
              </div>
              <div>
                <p className="font-body font-semibold text-base md:text-lg mb-1">
                  {benefit.title}
                </p>
<p className="font-body text-sm md:text-base text-gray-500 max-w-[180px] md:max-w-[280px] mx-auto md:mx-0">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

{/* Video */}
<div className="relative overflow-hidden rounded-2xl aspect-[4/5] md:h-[600px] md:aspect-auto">
          <video
            src="/images/video2.mp4"
            className="w-full h-full object-cover"
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