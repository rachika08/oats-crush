import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { ArrowLeft, Leaf, Heart, Flag } from "lucide-react";
import Footer from "../components/home/Footer";

const SLIDE_TRANSITION = { duration: 0.45, ease: [0.65, 0, 0.35, 1] };

export default function AboutUs() {
  const navigate = useNavigate();
  const location = useLocation();
  const controls = useAnimation();

  // slide in on mount
  useEffect(() => {
    controls.start({ x: 0, transition: SLIDE_TRANSITION });
  }, [controls]);

  // slide out, then navigate back (browser history, fallback to home)
  const handleBack = async () => {
    await controls.start({ x: "100%", transition: SLIDE_TRANSITION });

    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={controls}
      className="relative bg-brand-orange overflow-x-clip"
    >
      {/* Back / page-label pill — replaces the Navbar on this page */}
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="fixed top-5 right-4 sm:right-6 z-30 flex items-center gap-2 bg-white rounded-full pl-4 pr-5 py-2.5 shadow-sm font-body text-sm font-medium text-black hover:-translate-x-0.5 transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        About Us
      </button>

      {/* ---------------- SECTION 1: OUR STORY ---------------- */}
      <section className="relative px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Decorative side image - replace src with actual asset path */}
        <img
          src="/images/oat-milk.webp"
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute top-0 left-0 w-48 xl:w-56 rounded-r-3xl object-cover"
        />
        <img
          src="/images/latte.webp"
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute top-100 right-0 w-48 xl:w-56 rounded-l-3xl object-cover"
        />

        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white text-brand-orange-dark font-heading text-xs px-5 py-2 rounded-full mb-6">
            Our Story
          </span>

          <h1 className="font-heading text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-8">
            Protein shouldn't taste like punishment. So we fixed it.
          </h1>

          <div className="space-y-5 font-body text-white/90 text-sm sm:text-base leading-relaxed">
            <p>
              Real fuel. That's what we always wanted. To eat something that
              actually works — packed with protein, made from real oats, and
              doesn't taste like cardboard. But, the health food industry
              wasn't delivering.
            </p>
            <p>
              And we wanted to change that. We wanted to create something
              better — because people who work hard deserve food that works
              harder. Something with real flavour. Real protein. Real
              ingredients you can pronounce.
            </p>
            <p>
              Because that's who Oats Crush is for. The early risers. The
              late grinders. The ones skipping breakfast because nothing was
              worth eating. The ones who wanted protein without the powder-y
              guilt. It's for you.
            </p>
          </div>

          <p className="font-heading italic text-white text-2xl sm:text-3xl mt-10 leading-snug">
            "Oats Crush is for crushers, by crushers."
          </p>

          <p className="font-body text-white/70 text-xs mt-4">
            — Founded in India · 2023
          </p>
        </div>
      </section>

      {/* ---------------- SECTION 2: MISSION + STAND FOR ---------------- */}
      <section className="relative px-4 sm:px-6 pb-16 sm:pb-24">
        <img
          src="/images/oat-milk.webp"
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute top-0 left-0 w-48 xl:w-56 rounded-r-3xl object-cover"
        />

        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white text-brand-orange-dark font-heading text-xs px-5 py-2 rounded-full mb-6">
            Our Story
          </span>

          <h2 className="font-heading text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
            Make real protein accessible to every Indian household.
          </h2>

          <p className="font-body text-white/90 text-sm sm:text-base leading-relaxed mb-12 sm:mb-16">
            We believe nutrition shouldn't be complicated, expensive, or
            tasteless. Oats Crush was built to bring high-protein, clean-label
            food to everyone — from the gym-goer to the busy parent, the
            student to the working professional. One pouch. Total freedom.
          </p>

          <h3 className="font-heading text-white text-2xl sm:text-3xl mb-8">
            What We Stand For?
          </h3>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              icon: Leaf,
              title: "Real Ingredients",
              desc: "Every ingredient on our label is there for a reason. No fillers, no fluff, no fine print.",
            },
            {
              icon: Heart,
              title: "Made With Care",
              desc: "Small batches, tested recipes, and a team that actually tastes every flavour before it ships.",
            },
            {
              icon: Flag,
              title: "No Compromises",
              desc: "Real protein numbers, real nutrition labels — nothing rounded up or hidden in fine print.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="border border-white/40 rounded-2xl p-6 sm:p-8 text-center"
            >
              <div className="w-11 h-11 mx-auto mb-4 rounded-lg bg-white flex items-center justify-center text-brand-orange">
                <Icon size={20} />
              </div>
              <h4 className="font-heading text-white text-lg mb-2">{title}</h4>
              <p className="font-body text-white/80 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 3: WHY OATS CRUSH + CTA ---------------- */}
      <section className="relative px-4 sm:px-6 pb-16 sm:pb-24">
        <img
          src="/images/latte.webp"
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute top-10 right-0 w-48 xl:w-56 rounded-l-3xl object-cover"
        />

        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white text-brand-orange-dark font-heading text-xs px-5 py-2 rounded-full mb-6">
            why Oats Crush
          </span>

          <h2 className="font-heading text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
            Because you deserve better than boring protein.
          </h2>

          <p className="font-body text-white/90 text-sm sm:text-base leading-relaxed mb-10">
            Skip the labels, the cooking, the cleanup. Oats Crush is built for
            the version of you that's already running late, hits the gym in
            under a minute, 30g of real protein, real oats, zero compromise.
            No bowls. No spoons. No excuses.
          </p>

          <Link
            to="/products"
            className="inline-block bg-white text-black font-heading text-sm px-10 py-3.5 rounded-full hover:bg-gray-100 transition"
          >
            Shop The Crush
          </Link>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}