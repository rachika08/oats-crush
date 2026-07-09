import { useState } from "react";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import PageFade from "../components/PageFade";

const faqCategories = [
  {
    id: "general",
    label: "Product & Ingredients",
    faqs: [
      {
        question: "What exactly is Oats Crush?",
        answer:
          "Oats Crush is a premium, high-protein oat beverage designed for busy lifestyles. It delivers a clean, nutritious, and filling meal alternative or post-workout boost in a convenient, grab-and-go format.",
      },
      {
        question: "Does it contain any artificial sweeteners or refined sugar?",
        answer:
          "We use only natural sweetness derived from oats and monk fruit. You get zero refined sugar and zero artificial sweeteners.",
      },
      {
        question: " How much protein will I get from a single serving?",
        answer:
          " Each serving packs an impressive 30g of plant-based protein—which is more than two whole eggs—packed into a single pouch.",
      },
    ],
  },
  {
    id: "orders-shipping",
    label: "Preparation & Usage",
    faqs: [
      {
        question: " How do I prepare my Oats Crush?",
        answer:
          " It’s incredibly easy! Simply mix one pouch with 240ml of milk or your favorite dairy-free alternative, shake or blend, and it’s ready to drink in seconds. No bowls, no spoons, and no mess.",
      },
      {
        question: " Can I mix Oats Crush with water instead of milk?",
        answer:
          "Yes, you can mix it with water! However, for the creamiest texture and optimal flavor profile, we highly recommend using milk or a plant-based alternative like almond, oat, or soy milk.",
      },
      {
        question: "Can I blend it with ice or fruits?",
        answer:
          "Definitely. While it tastes fantastic just shaken up, it makes a great base for smoothies. Feel free to toss it in a blender with ice, a banana, berries, or nut butter to customize your drink.",
      },
      {
        question: "Is it safe to consume more than one serving a day?",
        answer:
          "Yes, Oats Crush can be consumed multiple times a day as part of a balanced diet. It is an excellent way to cleanly hit your daily protein and caloric targets.",
      },
    ],
  },
  {
    id: "payments-refunds",
    label: "Storage & Packaging",
    faqs: [
      {
        question: "What is the shelf life of Oats Crush?",
        answer:
          "Unopened pouches stay completely fresh for up to 9 months. Always check the exact expiration date printed on the back of your pouch.",
      },
      {
        question: "How should I store my unopened pouches?",
        answer:
          "Keep them stored in a cool, dry place out of direct sunlight. There is absolutely no refrigeration needed until the product is opened or mixed.",
      },
      {
        question: "Once mixed, how long does the drink stay good?",
        answer:
          " Once you mix Oats Crush with a liquid, we recommend consuming it immediately for the best taste and texture. If you need to save it, keep it refrigerated and consume it within 24 hours.",
      },
      {
        question: "Can I travel with Oats Crush pouches?",
        answer:
          "Yes! The durable, lightweight, airtight pouches are perfectly sealed and travel-friendly. They easily fit into gym bags, backpacks, or luggage without any risk of spilling.",
      },
    ],
  },
  {
    id: "product-nutrition",
    label: " Orders & Shipping",
    faqs: [
      {
        question: "Can I buy a variety pack to sample multiple flavors?",
        answer:
          "Yes! We offer customizable bundles and variety packs so you can discover your absolute favorite flavors before committing to a larger single-flavor pack.",
      },
      {
        question: "How long does shipping typically take?",
        answer:
          "Orders are processed within 24–48 hours. Standard domestic shipping usually takes between 5 to 7 business days, depending on your location.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We do not offer returns or refunds once the order has been delivered. However, if your product arrives damaged, defective, or incorrect, please contact us within 48 hours of delivery at dm@oatscrush.co.in",
      },
    ],
  },
  {
    id: "account-support",
    label: "Account & Support",
    faqs: [
      {
        question: "How do I contact support?",
        answer:
          "Head to our Contact page, or reach out directly at dm@oatscrush.co.in — we typically respond within 24 hours.",
      },
    ],
  },
];

const FAQPage = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(faqCategories[0].id);
  const [openIndex, setOpenIndex] = useState(0);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const activeCategory =
    faqCategories.find((c) => c.id === activeCategoryId) || faqCategories[0];

  const selectCategory = (id) => {
    setActiveCategoryId(id);
    setOpenIndex(0);
    setIsCategoryMenuOpen(false);
  };

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
<PageFade>
      <Navbar />

      <section className="px-4 sm:px-6 pt-32 sm:pt-40 pb-16 sm:pb-24 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-3">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="font-body text-gray-600 text-sm sm:text-base">
            Everything you need to know about Oats Crush — from the shake in your hand to the order on its way.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-10">
{/* Left - category selector */}
          {/* Mobile: collapsible dropdown showing only the active category */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-xl text-left font-body text-sm font-medium bg-black text-white cursor-pointer"
            >
              {activeCategory.label}
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  isCategoryMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {faqCategories
                  .filter((category) => category.id !== activeCategoryId)
                  .map((category) => (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category.id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left font-body text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      {category.label}
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Desktop: full stacked list */}
          <div className="hidden md:flex flex-col gap-3">
            {faqCategories.map((category) => {
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl text-left font-body text-sm sm:text-base font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.label}
                  <ChevronRight
                    size={18}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                </button>
              );
            })}
          </div>

          {/* Right - accordion for selected category */}
          <div className="flex flex-col gap-4">
            {activeCategory.faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
                    isOpen
                      ? "bg-brand-orange border-brand-orange"
                      : "bg-white border-brand-orange shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                  >
                    <span
                      className={`font-body text-sm sm:text-base font-medium transition-colors duration-300 ${
                        isOpen ? "text-white" : "text-black"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <Plus
                      size={18}
                      className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                        isOpen ? "rotate-45 text-white" : "text-black"
                      }`}
                    />
                  </button>

                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="mx-5 border-t border-white/40" />
                      <p className="font-body text-sm text-white/90 px-5 py-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </PageFade>
  );
};

export default FAQPage;