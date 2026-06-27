import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function PrivacyPolicy() {
    const sections = [
        {
            id: "changes-to-privacy-policy",
            title: "Changes to This Privacy Policy",
            content: (
                <>
                    <p>
                        Oats Crush reserves the right to update, amend, modify, or
                        revise this Privacy Policy at any time without prior notice
                        to users. Changes may be made to reflect modifications in
                        business practices, legal or regulatory requirements,
                        technological developments, operational changes, or customer
                        feedback.
                    </p>
                    <p className="mt-4">
                        Any revised version of this Privacy Policy will be updated
                        on the Platform along with the revised "Last Updated" date.
                        Your continued use of the Platform after any such changes
                        shall constitute your consent to such modifications.
                    </p>
                </>
            ),
        },
        {
            id: "information-we-collect",
            title: "Information We Collect",
            content: (
                <>
                    <p className="font-body font-semibold mt-2">2.1 Personal Information</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Mobile number</li>
                        <li>Shipping and billing address</li>
                        <li>PIN code and location details</li>
                        <li>Payment information</li>
                        <li>Order and transaction history</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">2.2 Account Information</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Username</li>
                        <li>Login credentials</li>
                        <li>Passwords</li>
                        <li>Wishlist activity</li>
                        <li>Saved preferences</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">2.3 Shopping & Transaction Information</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Products viewed</li>
                        <li>Cart activity</li>
                        <li>Purchase history</li>
                        <li>Product reviews and ratings</li>
                        <li>Customer service interactions</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">2.4 Device & Usage Information</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Device information</li>
                        <li>Operating system</li>
                        <li>Website activity</li>
                        <li>Referral URLs</li>
                        <li>Time spent on pages</li>
                        <li>Cookies and analytics data</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">2.5 Publicly Available Information</p>
                    <p className="mt-2">
                        Any information that is publicly available or furnished
                        under applicable laws shall not be regarded as sensitive or
                        confidential information.
                    </p>
                </>
            ),
        },
        {
            id: "how-we-collect-information",
            title: "How We Collect Information",
            content: (
                <ul className="list-disc pl-6">
                    <li>Directly from you when you place orders, create an account, or contact us</li>
                    <li>Through cookies and tracking technologies</li>
                    <li>Through payment gateways and shipping partners</li>
                    <li>Through social media integrations and analytics tools</li>
                    <li>Through marketplace platforms and third-party vendors</li>
                </ul>
            ),
        },
        {
            id: "how-we-use-your-information",
            title: "How We Use Your Information",
            content: (
                <>
                    <p className="font-body font-semibold mt-2">4.1 Providing Services</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Processing and fulfilling orders</li>
                        <li>Shipping and delivery coordination</li>
                        <li>Managing returns and refunds</li>
                        <li>Customer support and grievance handling</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">4.2 Improving User Experience</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Enhancing Platform functionality</li>
                        <li>Personalizing content and product recommendations</li>
                        <li>Improving customer experience</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">4.3 Marketing & Promotions</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Sending promotional emails, SMS, and WhatsApp messages</li>
                        <li>Launch announcements</li>
                        <li>Exclusive offers and campaigns</li>
                        <li>Advertising and retargeting</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">4.4 Security & Fraud Prevention</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Preventing fraudulent transactions</li>
                        <li>Monitoring suspicious activity</li>
                        <li>Protecting Platform integrity and users</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">4.5 Legal Compliance</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Compliance with applicable laws</li>
                        <li>Enforcement of Terms and Conditions</li>
                        <li>Responding to lawful requests by authorities</li>
                    </ul>
                </>
            ),
        },
        {
            id: "marketing-communications",
            title: "Marketing Communications",
            content: (
                <>
                    <p>
                        By using our Platform and sharing your details, you consent
                        to receiving communication from Oats Crush through:
                    </p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>Email</li>
                        <li>SMS</li>
                        <li>Phone calls</li>
                        <li>WhatsApp</li>
                        <li>Push notifications</li>
                    </ul>

                    <p className="mt-4">
                        You may opt out of promotional communications at any time by:
                    </p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>Clicking the unsubscribe link in emails</li>
                        <li>
                            Contacting us directly at{" "}
                            <a
                                href="mailto:contact@oatscrush.co.in"
                                className="text-brand-orange hover:underline"
                            >
                                contact@oatscrush.co.in
                            </a>
                        </li>
                    </ul>

                    <p className="mt-4">
                        Please note that even if you opt out of marketing
                        communication, we may still send transactional or
                        service-related messages.
                    </p>
                </>
            ),
        },
        {
            id: "cookies-tracking-technologies",
            title: "Cookies & Tracking Technologies",
            content: (
                <>
                    <p>
                        Oats Crush uses cookies and similar technologies to improve
                        Platform functionality, analyze traffic and usage behavior,
                        personalize user experience, and run targeted advertising
                        campaigns.
                    </p>

                    <ul className="list-disc pl-6 mt-3">
                        <li>Browser activity</li>
                        <li>Session information</li>
                        <li>Device identifiers</li>
                    </ul>

                    <p className="mt-3">
                        Users may disable cookies through browser settings; however,
                        certain functionalities of the Platform may be affected.
                    </p>
                </>
            ),
        },
        {
            id: "sharing-disclosure-information",
            title: "Sharing & Disclosure of Information",
            content: (
                <>
                    <p className="font-body font-semibold mt-2">7.1 Service Providers</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Payment gateways</li>
                        <li>Logistics and shipping partners</li>
                        <li>Marketing agencies</li>
                        <li>Analytics providers</li>
                        <li>Technology infrastructure providers</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">7.2 Legal Authorities</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>To comply with applicable laws</li>
                        <li>To enforce our legal rights</li>
                        <li>To prevent fraud or illegal activities</li>
                        <li>Pursuant to lawful governmental requests</li>
                    </ul>

                    <p className="font-body font-semibold mt-6">7.3 Business Transfers</p>
                    <p className="mt-2">
                        In the event of merger, acquisition, restructuring, sale, or
                        transfer of business assets, user information may be
                        transferred as part of such transaction.
                    </p>
                </>
            ),
        },
        {
            id: "third-party-links-services",
            title: "Third-Party Links and Services",
            content:
                "Our Platform may contain links to third-party websites or applications. Oats Crush shall not be responsible for privacy practices, content, policies, or security measures of third-party platforms.",
        },
        {
            id: "user-generated-content",
            title: "User Generated Content",
            content:
                "Users may voluntarily post reviews, ratings, comments, testimonials, social media tags, or other public content. Such content may become publicly accessible.",
        },
        {
            id: "data-security",
            title: "Data Security",
            content:
                "We implement commercially reasonable technical and organizational measures to safeguard your information against unauthorized access, misuse, loss, disclosure, or alteration.",
        },
        {
            id: "data-retention",
            title: "Data Retention",
            content:
                "We retain your information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements and policies.",
        },
        {
            id: "your-rights",
            title: "Your Rights",
            content: (
                <>
                    <p>
                        Subject to applicable laws, users may have the right to
                        access, correct, delete data, withdraw consent, and opt out
                        of marketing communications.
                    </p>

                    <p className="mt-4">
                        To exercise any such rights, users may contact:
                    </p>

                    <a
                        href="mailto:contact@oatscrush.co.in"
                        className="text-brand-orange hover:underline mt-2 inline-block"
                    >
                        contact@oatscrush.co.in
                    </a>
                </>
            ),
        },
        {
            id: "childrens-privacy",
            title: "Children's Privacy",
            content:
                "The Platform and Services are not intended for individuals below the age of 18 years.",
        },
        {
            id: "international-users",
            title: "International Users",
            content:
                "Users accessing the Platform from outside India acknowledge and agree that their information may be stored, processed, and transferred in India or other jurisdictions where our service providers operate.",
        },
        {
            id: "limitation-of-liability",
            title: "Limitation of Liability",
            content:
                "Oats Crush shall not be liable for unauthorized disclosure due to no fault of the Company, hacking attempts, force majeure events, cyber-attacks, or misuse of information by third parties beyond our reasonable control.",
        },
        {
            id: "governing-law-jurisdiction",
            title: "Governing Law & Jurisdiction",
            content:
                "This Privacy Policy shall be governed by and construed in accordance with the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.",
        },
        {
            id: "contact-us",
            title: "Contact Us",
            content: (
                <>
                    <p>
                        For any queries, complaints, concerns, or requests regarding
                        this Privacy Policy or your personal information, you may
                        contact us at:
                    </p>

                    <a
                        href="mailto:contact@oatscrush.co.in"
                        className="text-brand-orange hover:underline mt-2 inline-block"
                    >
                        contact@oatscrush.co.in
                    </a>

                    <div className="mt-4">
                        <p>Oats Crush</p>
                        <p>Dwarka Sector 14, Near Vagas Mall, New Delhi</p>
                    </div>
                </>
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        PRIVACY POLICY
                    </h1>
                    <p className="font-body text-white/80 text-sm sm:text-base mt-3">
                        Last updated on 26th June, 2026
                    </p>
                </div>
            </div>

            {/* Intro paragraphs */}
            <div className="max-w-7xl mx-auto px-10 sm:px-16 pt-10 sm:pt-12">
                <div className="font-body text-black text-sm sm:text-base space-y-4">
                    <p>
                        This Privacy Policy applies to Oats Crush (hereinafter referred
                        to as "Oats Crush", "the Company", "we", "us", or "our"), a
                        company incorporated under the applicable laws of India and
                        having its registered office at Dwarka Sector 14, Near Vagas
                        Mall, New Delhi. Oats Crush is the owner and operator of the
                        website oatscrush.com, social media platforms, and related
                        services (collectively referred to as the "Platform" or
                        "Services").
                    </p>

                    <p>
                        We value the trust you place in us and recognize the importance
                        of secure transactions and information privacy. This Privacy
                        Policy describes how Oats Crush collects, uses, stores,
                        processes, transfers, and protects your personal information
                        when you visit, access, or use our Platform, products, and
                        services.
                    </p>

                    <p>
                        By visiting our Platform or availing any services offered by
                        Oats Crush, you expressly agree to be bound by the terms and
                        conditions of this Privacy Policy, the Terms of Use, and
                        applicable laws of India including the Information Technology
                        Act, 2000 and rules made thereunder. If you do not agree with
                        the terms of this Privacy Policy, please do not use or access
                        our Platform.
                    </p>
                </div>
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
                        {sections.map((section, index) => (
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
                                    {typeof section.content === "string" ? (
                                        <p>{section.content}</p>
                                    ) : (
                                        section.content
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}