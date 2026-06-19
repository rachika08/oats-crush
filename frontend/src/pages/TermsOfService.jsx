import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function TermsOfService() {
    const sections = [
        {
            title: "1. Online Store Terms",
            content: (
                <>
                    <p>By agreeing to these Terms of Service, you represent and warrant that:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>You are at least 18 years of age or the age of majority in your jurisdiction;</li>
                        <li>You possess the legal authority and capacity to enter into binding agreements;</li>
                        <li>Any information provided by you is true, accurate, and complete.</li>
                    </ul>

                    <p className="mt-4">
                        You may not use our products or services for any unlawful or unauthorized purpose. You shall not violate any applicable laws, regulations, or third-party rights while using our website or services.
                    </p>

                    <p className="mt-4">You must not transmit:</p>
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
            title: "2. General Conditions",
            content: (
                <>
                    <p>
                        We reserve the right to refuse service to anyone for any reason at any time without assigning any reason.
                    </p>

                    <p className="mt-4">
                        You understand that your content (excluding payment information) may be transferred unencrypted and involve:
                    </p>

                    <ul className="list-disc pl-6 mt-2">
                        <li>Transmissions over various networks</li>
                        <li>Changes to conform and adapt to technical requirements</li>
                    </ul>

                    <p className="mt-4">
                        Payment information and sensitive financial data are encrypted and processed through secure third-party payment gateways.
                    </p>

                    <p className="mt-4">You agree not to:</p>

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
            title: "3. Accuracy, Completeness & Timeliness of Information",
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
            title: "4. Modifications to Products, Services & Pricing",
            content: (
                <>
                    <p>Prices for products are subject to change without prior notice.</p>

                    <p className="mt-4">We reserve the right to:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Modify</li>
                        <li>Suspend</li>
                        <li>Discontinue</li>
                        <li>Withdraw any product or service at any time without liability</li>
                    </ul>

                    <p className="mt-4">We shall not be liable to you or any third party for:</p>
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
            title: "5. Products & Services",
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

                    <p className="mt-4">We reserve the right to:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Limit sales geographically</li>
                        <li>Restrict quantities</li>
                        <li>Refuse orders</li>
                        <li>Discontinue products at our sole discretion</li>
                    </ul>

                    <p className="mt-4">
                        All product descriptions and pricing are subject to change without notice.
                    </p>

                    <p className="mt-4">We do not warrant that:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Product quality will meet expectations</li>
                        <li>Errors will be corrected</li>
                        <li>Services will remain uninterrupted</li>
                    </ul>
                </>
            ),
        },
        {
            title: "6. Billing & Account Information",
            content: (
                <>
                    <p>We reserve the right to refuse or cancel any order placed with us.</p>

                    <p className="mt-4">Restrictions may apply to:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Quantities purchased</li>
                        <li>Multiple orders under the same account</li>
                        <li>Billing address</li>
                        <li>Shipping address</li>
                        <li>Payment method</li>
                    </ul>

                    <p className="mt-4">
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
            title: "7. Third-Party Tools",
            content:
                "We may provide access to third-party tools and services over which we exercise no control. Such tools are provided 'as is' and 'as available' without warranties or representations of any kind. Your use of third-party tools shall be entirely at your own risk and discretion.",
        },
        {
            title: "8. Third-Party Links",
            content:
                "Our website may contain links to third-party websites or services that are not owned or controlled by Oats Crush. We are not responsible for examining content accuracy, evaluating third-party practices, or any damages arising from third-party transactions. Users are advised to carefully review the terms and policies of third-party websites.",
        },
        {
            title: "9. User Comments & Submissions",
            content:
                "Any suggestions, feedback, reviews, comments, or submissions sent to Oats Crush may be used by us without restriction. We may edit, reproduce, publish, distribute, or use such content in any medium. You agree that your submissions shall not violate third-party rights, contain unlawful or defamatory content, contain malware, or mislead users. We reserve the right to remove objectionable content at our discretion.",
        },
        {
            title: "10. Personal Information",
            content:
                "Your submission of personal information through the website is governed by our Privacy Policy. By using our services, you consent to the collection and processing of personal information in accordance with applicable laws.",
        },
        {
            title: "11. Errors, Inaccuracies & Omissions",
            content:
                "Occasionally there may be information containing typographical errors, inaccuracies, or omissions relating to products, pricing, promotions, shipping charges, transit times, or availability. We reserve the right to correct errors, update information, or cancel orders without prior notice.",
        },
        {
            title: "12. Prohibited Uses",
            content:
                "You are prohibited from using the website for unlawful purposes, to violate laws, to infringe intellectual property rights, to harass or discriminate, to spread malware, to collect personal information unlawfully, or to spam, phish, scrape, crawl, or exploit website data. Violation may result in immediate termination of access.",
        },
        {
            title: "13. Disclaimer of Warranties & Limitation of Liability",
            content:
                "All products and services are provided on an 'as is' and 'as available' basis without warranties of any kind. We do not guarantee uninterrupted service, error-free functionality, or complete accuracy of information. To the maximum extent permitted by law, Oats Crush and its affiliates shall not be liable for any direct, indirect, incidental, punitive, consequential damages, loss of profits, or loss of data arising from use of our services.",
        },
        {
            title: "14. Indemnification",
            content:
                "You agree to indemnify, defend, and hold harmless Oats Crush and its affiliates, directors, officers, employees, agents, and service providers from any claims, liabilities, damages, costs, or legal expenses arising from breach of these Terms, violation of laws, misuse of services, or infringement of third-party rights.",
        },
        {
            title: "15. Severability",
            content:
                "If any provision of these Terms is found unlawful or unenforceable, such provision shall nevertheless be enforceable to the maximum extent permitted by law, and remaining provisions shall remain valid and enforceable.",
        },
        {
            title: "16. Termination",
            content:
                "These Terms remain effective unless terminated by either party. We reserve the right to terminate or suspend access to our Services without notice if you breach these Terms, engage in fraudulent activity, or misuse our Platform. Obligations and liabilities incurred prior to termination shall survive termination.",
        },
        {
            title: "17. Entire Agreement",
            content:
                "These Terms of Service, together with all policies posted on our website, constitute the entire agreement between you and Oats Crush and supersede all prior communications or agreements.",
        },
        {
            title: "18. Governing Law & Jurisdiction",
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
            title: "19. Changes to Terms of Service",
            content:
                "We reserve the right to update, modify, or replace any part of these Terms at our sole discretion. Users are responsible for periodically reviewing this page for changes. Continued use of the website following updates constitutes acceptance of revised Terms.",
        },
        {
            title: "20. Grievance Officer",
            content: (
                <>
                    <p>
                        In accordance with applicable laws, users may contact our Grievance Officer regarding complaints or concerns:
                    </p>

                    <a
                        href="mailto:contact@oatscrush.co.in"
                        className="text-blue-600 hover:underline mt-2 inline-block"
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
            title: "21. Contact Information",
            content: (
                <>
                    <p>For any questions regarding these Terms of Service, you may contact us at:</p>

                    <a
                        href="mailto:contact@oatscrush.co.in"
                        className="text-blue-600 hover:underline mt-2 inline-block"
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

    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
                <h1 className="text-4xl font-bold text-center mb-4">
                    Terms of Service
                </h1>

                <p className="mb-8 text-gray-600 text-center">
                    Last Updated: June 2026
                </p>

                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-2xl font-semibold mb-3">
                                SECTION {section.title}
                            </h2>

                            <div className="leading-relaxed">
                                {typeof section.content === "string" ? (
                                    <p>{section.content}</p>
                                ) : (
                                    section.content
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}