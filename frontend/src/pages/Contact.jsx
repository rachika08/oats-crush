import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState("idle"); // idle | sent

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // TODO: wire to a real /contact endpoint once the backend exists.
    //     // For now this just confirms the message was "sent" on the frontend.
    //     console.log("Contact form submitted:", form);

    //     setStatus("sent");
    //     setForm({ name: "", email: "", message: "" });
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/contact", form);

            setStatus("sent");
            setForm({
                name: "",
                email: "",
                message: "",
            });
        } catch (err) {
            console.error(err);
            alert("Failed to send message");
        }
    };

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 sm:pt-40 pb-16 sm:pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-6">
                    {/* Row 1 - Heading spans only the left column */}
                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
                        GET IN
                        <br />
                        TOUCH WITH US
                    </h1>
                    <div className="hidden md:block" aria-hidden="true" />

                    {/* Row 2 - Left: intro text, contact info, map. Right: form. */}
                    <div>
                        <p className="font-body text-gray-600 text-sm sm:text-base mb-8 max-w-md">
                            Do you have any questions about our products?
                            You can contact us on our socials or fill in the
                            following form.
                        </p>

                        <div className="space-y-4 mb-8">
                            <a
                                href="mailto:dm@oatscrush.co.in"
                                className="flex items-center gap-3 font-body text-sm sm:text-base hover:text-brand-orange transition"
                            >
                                <Mail size={18} className="text-brand-orange flex-shrink-0" />
                                dm@oatscrush.co.in
                            </a>

                            <a
                                href="tel:+91123456789"
                                className="flex items-center gap-3 font-body text-sm sm:text-base hover:text-brand-orange transition"
                            >
                                <Phone size={18} className="text-brand-orange flex-shrink-0" />
                                +91 123456789
                            </a>

                            <div className="flex items-start gap-3 font-body text-sm sm:text-base">
                                <MapPin size={18} className="text-brand-orange flex-shrink-0 mt-0.5" />
                                <span>
                                    Oats Crush, Dwarka Sector 14, Near Vegas Mall,
                                    New Delhi, India
                                </span>
                            </div>
                        </div>

                        {/* Live Google Map embed */}
                        <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-[4/3] sm:aspect-[16/10]">
                            <iframe
                                title="Oats Crush location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.9676470447203!2d77.02699707549962!3d28.60074737568218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1dd61eb460af%3A0xe89377d97456bc5e!2sVegas%20Mall!5e0!3m2!1sen!2sin!4v1782563624684!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* RIGHT - Form */}
                    <div>
                        {status === "sent" ? (
                            <div className="h-full flex flex-col items-center justify-center text-center border border-gray-200 rounded-2xl p-10 sm:p-14">
                                <h2 className="font-heading text-2xl sm:text-3xl mb-3">
                                    MESSAGE SENT
                                </h2>
                                <p className="font-body text-gray-600 text-sm sm:text-base max-w-xs">
                                    Thanks for reaching out. We aim to respond
                                    to inquiries within 24 hours.
                                </p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="mt-6 font-body text-sm text-brand-orange-dark hover:underline cursor-pointer"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-body text-sm text-gray-500 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-body text-sm text-gray-500 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-body text-sm text-gray-500 mb-2">
                                        Write your message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full border-b border-gray-300 pb-2 font-body text-sm resize-none focus:outline-none focus:border-brand-orange transition"
                                    />
                                </div>

                                <p className="font-body text-xs sm:text-sm text-gray-500">
                                    We aim to respond to inquiries within 24 hours.
                                </p>

                                <button
                                    type="submit"
                                    className="block mx-auto bg-brand-orange text-white font-heading text-base px-8 py-3 rounded-full border border-brand-orange border-2  shadow-md hover:bg-white hover:text-brand-orange hover:-translate-y-1 transition cursor-pointer"
                                >
                                    SEND
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}