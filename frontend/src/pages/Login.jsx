import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios.js";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", form);
            console.log(res);
            // save token
            localStorage.setItem(
                "user",
                JSON.stringify(res.data.userFound)
            );
            localStorage.setItem("token", res.data.token);

            setMsg("Login successful!");
            setTimeout(() => {
                if (res.data.userFound.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }, 1000);
        } catch (error) {
            setMsg(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">

            {/* LEFT / BOTTOM (mobile) — image */}
            <div
                className="
                    relative order-1 md:order-2
                    h-[300px] sm:h-[360px] md:h-screen
                    w-full md:w-1/2
                    flex-shrink-0
                "
            >
                <div
                    className="
                        absolute inset-0 overflow-hidden
                        md:rounded-tl-[200px] md:rounded-bl-[200px]
                        shadow-[0_-12px_30px_-10px_rgba(0,0,0,0.25)]
                        md:shadow-[-12px_0_30px_-10px_rgba(0,0,0,0.25)]
                    "
                >
                    <img
                        src="/images/banner4.jpg"
                        alt="New drop coming soon"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* RIGHT / TOP (mobile) — form card */}
            <div
                className="
                    relative order-2 md:order-1
                    w-full md:w-1/2
                    flex-1
                    -mt-10 md:mt-0
                    z-10
                "
            >
                <div
                    className="
                        bg-white
                        rounded-t-[40px] md:rounded-none
                        h-full
                        flex flex-col justify-center
                        px-8 sm:px-12 md:px-16 lg:px-20
                        py-10 md:py-0
                    "
                >
                    <div className="max-w-sm mx-auto md:mx-0 w-full">

                        {/* Logo */}
                        <div className="flex justify-center mb-6 md:mb-10">
                            <img
                                src="/images/oats-crush.png"
                                alt="Oats Crush"
                                className="h-16 md:h-20 w-auto object-contain"
                            />
                        </div>

                        {/* Headline */}
                        <h1 className="font-heading text-2xl sm:text-3xl mb-8 text-center">
                            TIME TO CRUSH IT{" "}
                            <span className="text-brand-orange">AGAIN</span>
                        </h1>

                        {msg && (
                            <div className="mb-4 text-center md:text-left text-sm text-brand-orange font-body font-medium">
                                {msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-7">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block font-body text-sm text-black mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block font-body text-sm text-black mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-b border-gray-300 pb-2 pr-8 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-0 bottom-2 text-gray-400 hover:text-black transition cursor-pointer"
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-brand-orange text-white font-heading text-base py-3.5 rounded-full shadow-md hover:-translate-y-1 transition cursor-pointer mt-2"
                            >
                                LOG IN
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}