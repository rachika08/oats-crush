import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function ShippingPolicy() {
    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
                <h1 className="text-4xl font-bold mb-6 text-center">
                    Shipping Policy
                </h1>

                <p className="mb-4">
                    We deliver fresh, delicious high protein oats straight to your door!
                </p>

                <p>
                    <strong>Pan India Delivery:</strong> 5 - 7 business days.
                </p>
            </div>

            <Footer />
        </>
    );
}