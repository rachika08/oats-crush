import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function RefundPolicy() {
    const sections = [
        {
            id: "returns-and-refunds",
            title: "Returns and Refunds",
            content: (
                <>
                    <p>
                        We do not offer returns or refunds once the order has been delivered.
                    </p>

                    <p className="mt-4">
                        However, if your product arrives damaged, defective, or
                        incorrect, please contact us within <strong>48 hours</strong>{" "}
                        of delivery at:
                    </p>

                    <a
                        href="mailto:dm@oatscrush.co.in"
                        className="inline-block mt-3 border-2 border-brand-orange rounded-full px-5 py-2 text-brand-orange-dark hover:bg-brand-orange hover:text-white transition shadow-md"
                    >
                        dm@oatscrush.co.in
                    </a>

                    <p className="mt-6 font-semibold">
                        To help us review your request quickly, please include:
                    </p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>Your order number</li>
                        <li>Clear photos of the product</li>
                        <li>A complete unboxing video showing the issue</li>
                    </ul>

                    <p className="mt-4">
                        Requests submitted without an unboxing video may not be
                        eligible for review.
                    </p>
                </>
            ),
        },
        {
            id: "refund-approval",
            title: "Refund Approval",
            content: (
                <>
                    <p>
                        Once we receive and verify the issue, our team will notify
                        you regarding the approval or rejection of your refund
                        request.
                    </p>

                    <p className="mt-4 font-semibold">If approved:</p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>The refund will be processed to your original payment method</li>
                        <li>Refunds may take 7–10 business days to reflect, depending on your bank or payment provider</li>
                    </ul>

                    <p className="mt-4">
                        If more than 15 business days have passed since your refund
                        was approved and you still haven't received it, please
                        contact us again at:
                    </p>

                    <a
                        href="mailto:dm@oatscrush.co.in"
                        className="inline-block mt-3 border-2 border-brand-orange rounded-full px-5 py-2 text-brand-orange-dark hover:bg-brand-orange hover:text-white transition shadow-md"
                    >
                        dm@oatscrush.co.in
                    </a>
                </>
            ),
        },
        {
            id: "important-notes",
            title: "Important Notes",
            isHighlighted: true,
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        Refunds are only applicable for damaged, defective, or
                        incorrect products
                    </li>
                    <li>
                        Taste preferences or change of mind are not eligible
                        for refunds
                    </li>
                    <li>
                        Oats Crush reserves the right to refuse refund requests
                        that do not meet the above conditions
                    </li>
                </ul>
            ),
        },
    ];

    const [activeId, setActiveId] = useState(sections[0].id);
    const sectionRefs = useRef({});
    const isClickScrolling = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isClickScrolling.current) return;
                const visible = entries.filter((entry) => entry.isIntersecting);

                if (visible.length > 0) {
                    const topMost = visible.reduce((a, b) =>
                        a.boundingClientRect.top < b.boundingClientRect.top ? a : b
                    );
                    setActiveId(topMost.target.id);
                }
            },
            {
                rootMargin: "-140px 0px -70% 0px",
                threshold: 0,
            }
        );

        sections.forEach((section) => {
            const el = sectionRefs.current[section.id];
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();

    }, []);

    const handleSidebarClick = (id) => {
        setActiveId(id);
        isClickScrolling.current = true;

        const el = sectionRefs.current[id];
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top, behavior: "smooth" });
        }

        window.clearTimeout(handleSidebarClick._t);
        handleSidebarClick._t = window.setTimeout(() => {
            isClickScrolling.current = false;
        }, 700);
    };

    return (
        <>
            <Navbar />

            {/* Hero band */}
            <div className="bg-brand-orange px-6 sm:px-10 pt-40 sm:pt-48 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-heading text-white text-4xl sm:text-5xl md:text-6xl">
                        RETURN POLICY
                    </h1>
                    <p className="font-body text-white/80 text-sm sm:text-base mt-3">
                        Last updated in June, 2026
                    </p>
                </div>
            </div>

            {/* Intro line */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-10 sm:pt-12 text-center">
                <p className="font-body text-black text-sm sm:text-base">
                    At <strong>Oats Crush</strong> we strive to ensure that every
                    order reaches you in perfect condition.
                </p>
            </div>

            {/* Sidebar + content */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-24">
                    {/* Sidebar */}
                    <aside className="hidden md:block">
                        <div className="sticky top-32">
                            <h2 className="font-heading text-sm tracking-wide text-black mb-4 mt-1.5">
                                SECTIONS
                            </h2>

                            <nav className="space-y-3">
                                {sections.map((section) => {
                                    const isActive = activeId === section.id;

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => handleSidebarClick(section.id)}
                                            className={`group relative block w-full text-left font-body text-sm cursor-pointer ${
                                                isActive
                                                    ? "font-semibold text-brand-orange"
                                                    : "text-black hover:text-black"
                                            }`}
                                        >
                                            <span className="relative">
                                                {section.title}
                                                {!isActive && (
                                                    <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-full bg-brand-orange scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="space-y-14">
                        {sections.map((section, index) =>
                            section.isHighlighted ? (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    ref={(el) => (sectionRefs.current[section.id] = el)}
                                    className="scroll-mt-32 bg-brand-orange/10 border-2 border-brand-orange rounded-2xl shadow-md p-6 sm:p-8"
                                >
                                    <h2 className="font-heading text-2xl sm:text-3xl mb-4">
                                        {section.title.toUpperCase()}
                                    </h2>

                                    <div className="font-body text-sm sm:text-base text-black leading-relaxed">
                                        {section.content}
                                    </div>
                                </section>
                            ) : (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    ref={(el) => (sectionRefs.current[section.id] = el)}
                                    className="scroll-mt-32"
                                >
                                    <h2 className="font-heading text-2xl sm:text-3xl mb-4">
                                        {index + 1}. {section.title.toUpperCase()}
                                    </h2>

                                    <div className="font-body text-sm sm:text-base text-black leading-relaxed">
                                        {section.content}
                                    </div>
                                </section>
                            )
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}