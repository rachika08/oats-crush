import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function ReturnPolicy() {
    return (
        <>
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    Return & Refund Policy
                </h1>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                        At <strong>Oats Crush</strong>, we strive to ensure that every
                        order reaches you in perfect condition.
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">
                            Returns & Refunds
                        </h2>

                        <p>
                            We do not offer returns or refunds once the order has been
                            delivered.
                        </p>

                        <p className="mt-3">
                            However, if your product arrives damaged, defective, or
                            incorrect, please contact us within <strong>48 hours</strong>{" "}
                            of delivery at:
                        </p>

                        <p className="font-medium mt-2">
                            📧 contact@oatscrush.co.in
                        </p>

                        <p className="mt-4">
                            To help us review your request quickly, please include:
                        </p>

                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Your order number</li>
                            <li>Clear photos of the product</li>
                            <li>
                                A complete unboxing video showing the issue
                            </li>
                        </ul>

                        <p className="mt-3">
                            Requests submitted without an unboxing video may not be
                            eligible for review.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">
                            Refund Approval
                        </h2>

                        <p>
                            Once we receive and verify the issue, our team will notify
                            you regarding the approval or rejection of your refund
                            request.
                        </p>

                        <p className="mt-4">
                            If approved:
                        </p>

                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>
                                The refund will be processed to your original payment
                                method
                            </li>
                            <li>
                                Refunds may take 7–10 business days to reflect,
                                depending on your bank or payment provider
                            </li>
                        </ul>

                        <p className="mt-4">
                            If more than 15 business days have passed since your refund
                            was approved and you still haven’t received it, please
                            contact us again at:
                        </p>

                        <p className="font-medium mt-2">
                            📧 contact@oatscrush.co.in
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">
                            Important Notes
                        </h2>

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
                    </section>

                    <p className="text-sm text-gray-500 pt-6 border-t">
                        Last Updated: June 2026
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
}