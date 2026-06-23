const HowToCrushSection = () => {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden">
        {/* Left - pre-made checkered graphic image */}
        <div>
          <img
            src="/src/assets/images/how-to-crush-it.png"
            alt="How To Crush It — One mix, total freedom"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - black info card */}
        <div className="bg-black text-white px-8 sm:px-10 py-10 sm:py-14 flex flex-col justify-center">
          <h2 className="font-heading text-3xl sm:text-4xl leading-tight mb-6">
            REAL PROTEIN.
            <br />
            ZERO TIME WASTED.
          </h2>

          <p className="font-body text-sm sm:text-base font-semibold mb-4">
            Mornings move fast. Your protein shouldn't slow you down.
          </p>

          <p className="font-body text-sm text-white/80 mb-4">
            Skip the bowls, the cooking, the cleanup. Oats Crush is built
            for the version of you that's already running late. Mix it,
            shake it, or prep it the night before, and you're out the door
            in under a minute. 30g of real protein, real oats, zero
            compromise.
          </p>

          <p className="font-body text-sm text-white/80 mb-6">
            Whether it's Rasmalai hitting different at 8am or Coffee
            fueling your next deadline, breakfast keeps up with you now.
          </p>

          <p className="font-body text-sm sm:text-base font-bold">
            No bowls. No spoons. No excuses.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowToCrushSection;