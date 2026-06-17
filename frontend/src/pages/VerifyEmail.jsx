import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function VerifyEmail() {
    const { token } = useParams();

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate= useNavigate();
    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(
                    `/auth/verify-email/${token}`
                );

                setMessage(res.data.message);
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                    "Verification failed"
                );
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    useEffect(() => {
        if (message === "Email verified successfully") {
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
    }, [message, navigate]);

    if (loading) {
        return <h2>Verifying email...</h2>;
    }

   return (
        <div
            style={{
                textAlign: "center",
                marginTop: "100px",
            }}
        >
            <h2>{message}</h2>

            {message === "Email verified successfully" ? (
                <p>Redirecting to login...</p>
            ) : (
                <Link to="/login">
                    Go to Login
                </Link>
            )}
        </div>
    );
}