import { Star } from "lucide-react";

// Fake placeholder reviews — swap with real consumer reviews once available.
const reviews = [
  {
    id: 1,
    quote:
      "It doesn't have that chalky protein taste, and I don't feel bloated after, it just goes down super easy.",
    name: "Rahul",
  },
  {
    id: 2,
    quote:
      "Genuinely the best tasting protein shake I've tried. Doesn't feel like a chore to drink.",
    name: "Aditi",
  },
  {
    id: 3,
    quote:
      "I keep one in my bag at all times now. Perfect for busy mornings before college.",
    name: "Karan",
  },
  {
    id: 4,
    quote:
      "Rasmalai flavour tastes exactly like the real thing. Didn't expect that from an oats shake.",
    name: "Simran",
  },
  {
    id: 5,
    quote:
      "No weird aftertaste, no sugar crash later in the day. My new go-to.",
    name: "Vikram",
  },
];

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-2xl shadow-lg px-6 py-5 w-72 sm:w-80 flex-shrink-0 mx-3">
    <p className="font-body text-sm text-black mb-4">"{review.quote}"</p>

    <div className="flex items-center gap-2">
      <div className="flex text-brand-orange">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="fill-brand-orange" />
        ))}
      </div>
    </div>

    <div className="flex items-center gap-2 mt-2">
      <span className="font-body text-sm text-gray-700">{review.name}</span>
    </div>
  </div>
);

const ConsumerReviews = () => {
  // Duplicate the list once so the track can scroll -50% seamlessly.
  const items = [...reviews, ...reviews];

  return (
    <section className="relative py-10 sm:py-16 overflow-hidden">
      {/* Background line 1 */}
      <h2 className="font-heading text-brand-orange/60 text-[18vw] sm:text-[12vw] md:text-[180px] leading-none whitespace-nowrap text-center select-none tracking-[0.15em]">
        CONSUMER
      </h2>

      {/* Floating review card marquee, sits between the two text lines */}
      <div className="relative z-10 -mt-4 sm:-mt-10 md:-mt-12 -mb-4 sm:-mb-10 md:-mb-12">
        <div className="marquee-wrapper overflow-hidden">
          <div
            className="marquee-track py-2"
            style={{ "--marquee-duration": "35s" }}
          >
            {items.map((review, index) => (
              <ReviewCard key={`${review.id}-${index}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      {/* Background line 2 */}
      <h2 className="font-heading text-brand-orange/60 text-[18vw] sm:text-[12vw] md:text-[180px] leading-none whitespace-nowrap text-center select-none tracking-[0.15em] -mt-8 sm:-mt-14 md:-mt-16">
  REVIEWS
</h2>
    </section>
  );
};

export default ConsumerReviews;