import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function Contact() {
    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>

                    <p className="mb-4">
                        For any questions, concerns, or support requests, please contact us:
                    </p>

                    <p className="mb-2">
                        📧{" "}
                        <a
                            href="mailto:contact@oatscrush.co.in"
                            className="text-blue-600 hover:underline"
                        >
                            contact@oatscrush.co.in
                        </a>
                    </p>

                    <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-2">Address</h3>
                        <p>
                            Oats Crush
                            <br />
                            Dwarka Sector 14, Near Vegas Mall, New Delhi
                            <br />
                            India
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}