import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import PageFade from "../components/PageFade";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

    if (name === "phone") {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
        setForm({ ...form, phone: digitsOnly });
        return;
    }

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    

    // NORMAL SIGNUP
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.phone.length !== 10) {
        setMsg("Phone number must be exactly 10 digits");
        return;
    }

    setLoading(true);

    try {
        const response = await api.post("/auth/signup", form);
        setMsg(response.data.message);

        setTimeout(() => {
            navigate("/login");
        }, 1000);
    } catch (error) {
        console.log(error);
        const errorMsg = error.response?.data?.message || "An error occurred";
        setMsg(errorMsg);

        if (errorMsg === "User already exists") {
            navigate("/login");
        }
        setLoading(false);
    }
};

    // GOOGLE SIGNUP / LOGIN
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await api.post("/auth/google", {
                token: credentialResponse.credential,
            });

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            setMsg("Google login successful!");

            setTimeout(() => {
                navigate("/");
            }, 800);

        } catch (error) {
            console.log(error);
            setMsg("Google login failed");
        }
    };

    return (
    <PageFade>
        <div className="min-h-screen md:h-screen w-full flex flex-col md:flex-row bg-white md:overflow-hidden">

            {/* IMAGE SIDE */}
            <div className="relative order-1 md:order-2 h-[300px] md:h-screen w-full md:w-1/2">
    <div className="absolute inset-0 overflow-hidden md:rounded-tl-[200px] md:rounded-bl-[200px]">
        <img
            src="/images/banner4.webp"
            alt="Signup banner"
            className="w-full h-full object-cover"
        />
    </div>
</div>

            {/* FORM SIDE */}
            <div className="order-2 md:order-1 w-full md:w-1/2 flex items-center justify-center px-8 py-10 bg-white relative z-10 -mt-10 rounded-t-[40px] md:mt-0 md:rounded-none">

                <div className="w-full max-w-sm">

                    {/* LOGO */}
                    <div className="flex justify-center mb-4">
                        <img
                            src="/images/oats-crush.webp"
                            className="h-16"
                            alt="logo"
                        />
                    </div>

                    {/* TITLE */}
                    <h1 className="text-2xl text-center mb-6">
    JOIN THE <span className="text-brand-orange">OATS CRUSH COMMUNITY</span>
</h1>

                    {/* GOOGLE LOGIN */}
                    <div className="flex justify-center mb-4">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() =>
                                setMsg("Google login failed")
                            }
                        />
                    </div>

                    {/* MESSAGE */}
                    {msg && (
                        <p className="text-center text-sm text-orange-500 mb-3">
                            {msg}
                        </p>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* NAME */}
                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border-b border-gray-300 p-2 outline-none transition-colors duration-300 focus:border-brand-orange"
                        />

                        {/* EMAIL */}
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border-b border-gray-300 p-2 outline-none transition-colors duration-300 focus:border-brand-orange"
                        />

                        {/* PHONE */}
<input
    name="phone"
    type="tel"
    inputMode="numeric"
    maxLength={10}
    placeholder="Phone"
    value={form.phone}
    onChange={handleChange}
    required
    pattern="\d{10}"
    title="Enter a valid 10-digit phone number"
    className="w-full border-b border-gray-300 p-2 outline-none transition-colors duration-300 focus:border-brand-orange"
/>

                        {/* PASSWORD */}
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-gray-300 p-2 outline-none transition-colors duration-300 focus:border-brand-orange pr-10"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-0 top-2 text-gray-500"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {/* SUBMIT */}
<button
    type="submit"
    disabled={loading}
    className="w-full font-heading text-xl bg-brand-orange text-white py-3 rounded-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
>
    {loading ? "SIGNING YOU UP..." : "SIGN UP"}
</button>
                    </form>

                    {/* LOGIN LINK */}
                    <p className="text-center text-sm mt-4">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-brand-orange cursor-pointer"
                        >
                            Login
                        </span>
                    </p>

                </div>
            </div>
        </div>
        </PageFade>
    );
}