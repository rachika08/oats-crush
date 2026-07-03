import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


const FAQSection = ({ faqs = [],image }) => {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (key) => {
    setOpenId((prev) => (prev === key ? null : key));
};

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* Left image */}
        <div className="rounded-3xl overflow-hidden aspect-[4/5]">
          <img
            src={image}
            alt="Oats Crush Coffee"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - heading + accordion */}
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] leading-tight mb-8">
            FREQUENTLY
            <br />
            ASKED QUESTIONS
          </h2>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
  const faqKey = faq.id ?? faq._id ?? index;
  const isOpen = openId === faqKey;

  return (
    <div
      key={faqKey}
      className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
        isOpen
          ? "bg-brand-orange border-brand-orange"
          : "bg-white border-brand-orange shadow-sm"
      }`}
    >
      <button
        onClick={() => toggleFaq(faqKey)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
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

          <button
            onClick={() => navigate("/faq")}
            className="mt-6 w-full bg-brand-orange sm:w-auto  text-white rounded-full px-6 py-2.5 font-heading text-lg font-medium hover:-translate-y-1 transition-all duration-200 shadow-md cursor-pointer"
          >
            EXPLORE ALL FAQS
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;




