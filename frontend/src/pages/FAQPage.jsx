import { useState } from "react";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import PageFade from "../components/PageFade";

const faqCategories = [
  {
    id: "general",
    label: "General Questions",
    faqs: [
      {
        question: "How to Crush it?",
        answer:
          "Mix with 240ml milk or alternative, shake or blend, and you're ready in seconds. No bowls, no spoons, no mess.",
      },
      {
        question: "How much protein does one serving contain?",
        answer:
          "Each serving packs 30g of protein — more than two whole eggs, in a single pouch.",
      },
      {
        question: "Does it contain artificial sweeteners?",
        answer:
          "No. We use natural sweetness from oats and monk fruit — zero refined sugar, zero artificial sweeteners.",
      },
    ],
  },
  {
    id: "orders-shipping",
    label: "Orders & Shipping",
    faqs: [
      {
        question: "How long does delivery take?",
        answer:
          "Most orders are delivered within 3-5 business days, depending on your location.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes — once your order ships, you'll get a tracking link via email/SMS, and you can also check status from your Profile page.",
      },
    ],
  },
  {
    id: "payments-refunds",
    label: "Payments & Refunds",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept UPI, credit/debit cards, net banking, and popular wallets via Razorpay.",
      },
      {
        question: "What's your refund policy?",
        answer:
          "We don't offer returns or refunds once an order is delivered, unless it arrives damaged, defective, or incorrect — reach out within 48 hours of delivery.",
      },
    ],
  },
  {
    id: "product-nutrition",
    label: "Product & Nutrition",
    faqs: [
      {
        question: "Is Oats Crush vegan and lactose-free?",
        answer:
          "Yes — every flavour is 100% plant-based, dairy-free, and lactose-free, without compromising on taste or protein.",
      },
      {
        question: "What's the shelf life and how should I store it?",
        answer:
          "Unopened, it stays fresh for up to 9 months in a cool, dry place. No refrigeration needed until opened.",
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
          "Head to our Contact page, or reach out directly at contact@oatscrush.co.in — we typically respond within 24 hours.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Go to the Login page and click 'Forgot Password' to receive a reset link on your registered email.",
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