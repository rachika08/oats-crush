import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function TermsOfService() {
    const sections = [
        {
            id: "online-store-terms",
            title: "Online Store Terms",
            content: (
                <>
                    <p className="font-semibold">By agreeing to these Terms of Service, you represent and warrant that:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>You are at least 18 years of age or the age of majority in your jurisdiction;</li>
                        <li>You possess the legal authority and capacity to enter into binding agreements;</li>
                        <li>Any information provided by you is true, accurate, and complete.</li>
                    </ul>

                    <p className="mt-4">
                        You may not use our products or services for any unlawful or unauthorized purpose. You shall not violate any applicable laws, regulations, or third-party rights while using our website or services.
                    </p>

                    <p className="mt-4 font-semibold">You must not transmit:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Worms</li>
                        <li>Malware</li>
                        <li>Viruses</li>
                        <li>Ransomware</li>
                        <li>Malicious code</li>
                        <li>Any destructive technological material</li>
                    </ul>

                    <p className="mt-4">
                        Any breach or violation of these Terms may result in immediate suspension or termination of access to our Services without prior notice.
                    </p>
                </>
            ),
        },
        {
            id: "general-conditions",
            title: "General Conditions",
            content: (
                <>
                    <p>
                        We reserve the right to refuse service to anyone for any reason at any time without assigning any reason.
                    </p>

                    <p className="mt-4 font-semibold">
                        You understand that your content (excluding payment information) may be transferred unencrypted and involve:
                    </p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>Transmissions over various networks</li>
                        <li>Changes to conform and adapt to technical requirements</li>
                    </ul>

                    <p className="mt-4">
                        Payment information and sensitive financial data are encrypted and processed through secure third-party payment gateways.
                    </p>

                    <p className="mt-4 font-semibold">You agree not to:</p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>Reproduce</li>
                        <li>Duplicate</li>
                        <li>Copy</li>
                        <li>Sell</li>
                        <li>Exploit</li>
                        <li>Commercially use any portion of the website, services, branding, or content without express written consent from Oats Crush</li>
                    </ul>

                    <p className="mt-4">
                        The headings used in these Terms are for convenience only and shall not limit or affect these Terms.
                    </p>
                </>
            ),
        },
        {
            id: "accuracy-completeness-timeliness",
            title: "Accuracy, Completeness & Timeliness of Information",
            content: (
                <>
                    <p>
                        We are not responsible if information made available on this website is inaccurate, incomplete, or outdated.
                    </p>
                    <p className="mt-4">
                        All materials provided are for general informational purposes only and should not be solely relied upon for making decisions without consulting more accurate or authoritative sources.
                    </p>
                    <p className="mt-4">
                        Historical information may not be current and is provided solely for reference purposes.
                    </p>
                    <p className="mt-4">
                        We reserve the right to modify website content at any time without obligation to update any information.
                    </p>
                </>
            ),
        },
        {
            id: "modifications-products-pricing",
            title: "Modifications to Products, Services & Pricing",
            content: (
                <>
                    <p>Prices for products are subject to change without prior notice.</p>

                    <p className="mt-4 font-semibold">We reserve the right to:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Modify</li>
                        <li>Suspend</li>
                        <li>Discontinue</li>
                        <li>Withdraw any product or service at any time without liability</li>
                    </ul>

                    <p className="mt-4 font-semibold">We shall not be liable to you or any third party for:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Price changes</li>
                        <li>Product discontinuation</li>
                        <li>Modifications</li>
                        <li>Delays</li>
                        <li>Suspension of services</li>
                    </ul>
                </>
            ),
        },
        {
            id: "products-services",
            title: "Products & Services",
            content: (
                <>
                    <p>
                        Certain products may be available exclusively online and may have limited quantities.
                    </p>

                    <p className="mt-4">
                        All products are subject to our Refund Policy and applicable laws.
                    </p>

                    <p className="mt-4">
                        We strive to display product images, packaging, colors, and descriptions as accurately as possible. However, we do not guarantee that your device display will accurately reflect actual product appearance.
                    </p>

                    <p className="mt-4 font-semibold">We reserve the right to:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Limit sales geographically</li>
                        <li>Restrict quantities</li>
                        <li>Refuse orders</li>
                        <li>Discontinue products at our sole discretion</li>
                    </ul>

                    <p className="mt-4">
                        All product descriptions and pricing are subject to change without notice.
                    </p>

                    <p className="mt-4 font-semibold">We do not warrant that:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Product quality will meet expectations</li>
                        <li>Errors will be corrected</li>
                        <li>Services will remain uninterrupted</li>
                    </ul>
                </>
            ),
        },
        {
            id: "billing-account-information",
            title: "Billing & Account Information",
            content: (
                <>
                    <p>We reserve the right to refuse or cancel any order placed with us.</p>

                    <p className="mt-4 font-semibold">Restrictions may apply to:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Quantities purchased</li>
                        <li>Multiple orders under the same account</li>
                        <li>Billing address</li>
                        <li>Shipping address</li>
                        <li>Payment method</li>
                    </ul>

                    <p className="mt-4 font-semibold">
                        In the event of cancellation or modification, we may attempt to notify you through:
                    </p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>Email</li>
                        <li>Phone number</li>
                        <li>Billing details provided</li>
                    </ul>

                    <p className="mt-4">
                        You agree to provide current, complete, and accurate purchase and account information for all transactions.
                    </p>
                </>
            ),
        },
        {
            id: "third-party-tools",
            title: "Third-Party Tools",
            content:
                "We may provide access to third-party tools and services over which we exercise no control. Such tools are provided 'as is' and 'as available' without warranties or representations of any kind. Your use of third-party tools shall be entirely at your own risk and discretion.",
        },
        {
            id: "third-party-links",
            title: "Third-Party Links",
            content:
                "Our website may contain links to third-party websites or services that are not owned or controlled by Oats Crush. We are not responsible for examining content accuracy, evaluating third-party practices, or any damages arising from third-party transactions. Users are advised to carefully review the terms and policies of third-party websites.",
        },
        {
            id: "user-comments-submissions",
            title: "User Comments & Submissions",
            content:
                "Any suggestions, feedback, reviews, comments, or submissions sent to Oats Crush may be used by us without restriction. We may edit, reproduce, publish, distribute, or use such content in any medium. You agree that your submissions shall not violate third-party rights, contain unlawful or defamatory content, contain malware, or mislead users. We reserve the right to remove objectionable content at our discretion.",
        },
        {
            id: "personal-information",
            title: "Personal Information",
            content:
                "Your submission of personal information through the website is governed by our Privacy Policy. By using our services, you consent to the collection and processing of personal information in accordance with applicable laws.",
        },
        {
            id: "errors-inaccuracies-omissions",
            title: "Errors, Inaccuracies & Omissions",
            content:
                "Occasionally there may be information containing typographical errors, inaccuracies, or omissions relating to products, pricing, promotions, shipping charges, transit times, or availability. We reserve the right to correct errors, update information, or cancel orders without prior notice.",
        },
        {
            id: "prohibited-uses",
            title: "Prohibited Uses",
            content:
                "You are prohibited from using the website for unlawful purposes, to violate laws, to infringe intellectual property rights, to harass or discriminate, to spread malware, to collect personal information unlawfully, or to spam, phish, scrape, crawl, or exploit website data. Violation may result in immediate termination of access.",
        },
        {
            id: "disclaimer-warranties-liability",
            title: "Disclaimer of Warranties & Limitation of Liability",
            content:
                "All products and services are provided on an 'as is' and 'as available' basis without warranties of any kind. We do not guarantee uninterrupted service, error-free functionality, or complete accuracy of information. To the maximum extent permitted by law, Oats Crush and its affiliates shall not be liable for any direct, indirect, incidental, punitive, consequential damages, loss of profits, or loss of data arising from use of our services.",
        },
        {
            id: "indemnification",
            title: "Indemnification",
            content:
                "You agree to indemnify, defend, and hold harmless Oats Crush and its affiliates, directors, officers, employees, agents, and service providers from any claims, liabilities, damages, costs, or legal expenses arising from breach of these Terms, violation of laws, misuse of services, or infringement of third-party rights.",
        },
        {
            id: "severability",
            title: "Severability",
            content:
                "If any provision of these Terms is found unlawful or unenforceable, such provision shall nevertheless be enforceable to the maximum extent permitted by law, and remaining provisions shall remain valid and enforceable.",
        },
        {
            id: "termination",
            title: "Termination",
            content:
                "These Terms remain effective unless terminated by either party. We reserve the right to terminate or suspend access to our Services without notice if you breach these Terms, engage in fraudulent activity, or misuse our Platform. Obligations and liabilities incurred prior to termination shall survive termination.",
        },
        {
            id: "entire-agreement",
            title: "Entire Agreement",
            content:
                "These Terms of Service, together with all policies posted on our website, constitute the entire agreement between you and Oats Crush and supersede all prior communications or agreements.",
        },
        {
            id: "governing-law-jurisdiction",
            title: "Governing Law & Jurisdiction",
            content: (
                <>
                    <p>
                        These Terms of Service shall be governed by and construed in accordance with the laws of India, including:
                    </p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>The Indian Contract Act, 1872</li>
                        <li>The Information Technology Act, 2000</li>
                        <li>Consumer Protection Act, 2019</li>
                        <li>Other applicable laws</li>
                    </ul>

                    <p className="mt-4">
                        All disputes shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
                    </p>
                </>
            ),
        },
        {
            id: "changes-to-terms",
            title: "Changes to Terms of Service",
            content:
                "We reserve the right to update, modify, or replace any part of these Terms at our sole discretion. Users are responsible for periodically reviewing this page for changes. Continued use of the website following updates constitutes acceptance of revised Terms.",
        },
        {
            id: "grievance-officer",
            title: "Grievance Officer",
            content: (
                <>
                    <p>
                        In accordance with applicable laws, users may contact our Grievance Officer regarding complaints or concerns:
                    </p>

                    <a
                        href="mailto:contact@oatscrush.co.in"
                        className="text-brand-orange-dark font-semibold hover:underline mt-2 inline-block"
                    >
                        contact@oatscrush.co.in
                    </a>

                    <p className="mt-4">
                        We shall endeavor to resolve grievances within a reasonable timeframe.
                    </p>
                </>
            ),
        },
        {
            id: "contact-information",
            title: "Contact Information",
            content: (
                <>
                    <p>For any questions regarding these Terms of Service, you may contact us at:</p>

                    <a
                        href="mailto:contact@oatscrush.co.in"
                        className="text-brand-orange-dark font-semibold hover:underline mt-2 inline-block"
                    >
                        contact@oatscrush.co.in
                    </a>

                    <div className="mt-4">
                        <p>Oats Crush</p>
                        <p>Dwarka Sector 14, Near Vegas Mall, New Delhi</p>
                        <p>India</p>
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
                        TERMS OF SERVICE
                    </h1>
                    <p className="font-body text-white/80 text-sm sm:text-base mt-3">
                        Last updated in June, 2026
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