import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios.js";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // NORMAL LOGIN
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", form);

            const user = res.data.userFound;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", res.data.token);

            setMsg("Login successful!");
            setTimeout(() => {
                if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }, 800);

        } catch (error) {
            setMsg(error.response?.data?.message || "Login failed");
        }
    };

    // GOOGLE LOGIN
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await api.post("/auth/google", {
                token: credentialResponse.credential,
            });
            console.log("login credentials:  ",res);
            const user = res.data.user;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", res.data.token);

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
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">

            {/* IMAGE SIDE */}
            <div className="relative order-1 md:order-2 h-[300px] md:h-screen w-full md:w-1/2">
                <div className="absolute inset-0 overflow-hidden md:rounded-tl-[200px] md:rounded-bl-[200px]">
                    <img
                        src="/images/banner4.jpg"
                        alt="Login banner"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* FORM SIDE */}
            <div className="order-2 md:order-1 w-full md:w-1/2 flex items-center justify-center px-8 py-10 bg-white relative z-10 -mt-10 rounded-t-[40px] md:mt-0 md:rounded-none">

                <div className="w-full max-w-sm">

                    {/* LOGO */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/images/oats-crush.png"
                            className="h-16"
                            alt="logo"
                        />
                    </div>

                    <h1 className="text-2xl text-center mb-6">
    TIME TO CRUSH IT <span className="text-brand-orange">AGAIN</span>
</h1>

                    {/* GOOGLE LOGIN */}
                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setMsg("Google login failed")}
                        />
                    </div>

                    {/* MESSAGE */}
                    {msg && (
                        <p className="text-center text-sm text-orange-500 mb-4">
                            {msg}
                        </p>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* EMAIL */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border-b border-gray-300 p-2 outline-none transition-colors duration-300 focus:border-brand-orange"
                        />

                        {/* PASSWORD */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-gray-300 p-2 outline-none transition-colors duration-300 focus:border-brand-orange"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="w-full font-heading text-xl bg-brand-orange text-white py-3 rounded-full cursor-pointer"
                        >
                            LOGIN
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}