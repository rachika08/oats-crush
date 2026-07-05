import { Reveal, RevealGroup, RevealItem } from "../Reveal";

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
        {/* Trust badges */}
        {/* Mobile: horizontal scroll-snap carousel, one card at a time */}
        <div className="md:hidden -mx-4 px-4">
          <RevealGroup
            staggerDelay={0.15}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {benefits.map((benefit, index) => (
              <RevealItem
                key={index}
                variant="noticeable"
                className="snap-center flex-shrink-0 w-[78%] bg-white border border-brand-orange/15 shadow-sm rounded-2xl px-5 py-8 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center mb-4 flex-shrink-0">
                  <img src={benefit.icon} alt="" loading="lazy" className="w-8 h-8 invert" />
                </div>
                <p className="font-body font-semibold text-base mb-2">
                  {benefit.title}
                </p>
                <p className="font-body text-sm text-gray-500 max-w-[220px]">
                  {benefit.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* dot indicators, purely visual */}
          <div className="flex justify-center gap-1.5 mt-4">
            {benefits.map((_, index) => (
              <span
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-brand-orange/30"
              />
            ))}
          </div>
        </div>

        {/* Desktop: original vertical list, untouched */}
        <RevealGroup
          staggerDelay={0.15}
          className="hidden md:grid md:grid-cols-1 md:gap-y-16 md:text-left"
        >
          {benefits.map((benefit, index) => (
            <RevealItem
              key={index}
              variant="subtle"
              className="flex md:items-start md:flex-row md:gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                <img src={benefit.icon} alt="" loading="lazy" className="w-8 h-8 invert" />
              </div>
              <div>
                <p className="font-body font-semibold text-lg mb-1">
                  {benefit.title}
                </p>
                <p className="font-body text-base text-gray-500 max-w-[280px]">
                  {benefit.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Video */}
        <Reveal
          variant="subtle"
          className="relative overflow-hidden rounded-2xl aspect-[4/5] md:h-[600px] md:aspect-auto"
        >
          <video
            src="/images/video2.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </Reveal>
      </div>
    </section>
  );
};

export default BenefitsSection;