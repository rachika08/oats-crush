import Navbar from "../components/Navbar";
import PageFade from "../components/PageFade";
import Footer from "../components/home/Footer";
import { Truck } from "lucide-react";

export default function ShippingPolicy() {
    return (
        <PageFade>

            <Navbar />

            {/* Hero band */}
            <div className="bg-brand-orange px-6 sm:px-10 pt-40 sm:pt-48 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-heading text-white text-4xl sm:text-5xl md:text-6xl">
                        SHIPPING POLICY
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-20 text-center">
                <p className="font-body text-base sm:text-lg font-semibold text-black mb-8">
                    We Deliver Fresh, Delicious High Protein Oats Straight To Your Door!
                </p>

                <div className="flex justify-center mb-6 text-brand-orange">
                    <Truck size={56} strokeWidth={1.5} />
                </div>

                <p className="font-body text-base sm:text-lg text-black">
                    <strong>Pan India Delivery :</strong> 5-7 Business Days
                </p>
            </div>

            <Footer />
</PageFade>
        
    );
}