import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function Addresses() {
    const [addresses, setAddresses] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        label: "Home",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: ""
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await api.get("/address");
            setAddresses(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            label: "Home",
            fullName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(
                    `/address/${editingId}`,
                    formData
                );
            } else {
                await api.post(
                    "/address",
                    formData
                );
            }

            fetchAddresses();
            resetForm();

        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (address) => {
        setEditingId(address._id);

        setFormData({
            label: address.label,
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            pincode: address.pincode
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Delete this address?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/address/${id}`);

            fetchAddresses();

            if (editingId === id) {
                resetForm();
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-10">

                <h2 className="text-3xl font-bold mb-6">
                    Manage Addresses
                </h2>

                {/* Form */}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="p-6">

                        <h4 className="text-xl font-semibold mb-4">
                            {editingId
                                ? "Edit Address"
                                : "Add New Address"}
                        </h4>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Address Type
                                    </label>

                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="label"
                                        value={formData.label}
                                        onChange={handleChange}
                                    >
                                        <option value="Home">
                                            Home
                                        </option>

                                        <option value="Office">
                                            Office
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-medium">
                                        Address Line 1
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-medium">
                                        Address Line 2
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {editingId
                                        ? "Update Address"
                                        : "Save Address"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Saved Addresses */}

                <h4 className="text-xl font-semibold mb-4">
                    Saved Addresses
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length === 0 ? (
                        <p>No addresses found.</p>
                    ) : (
                        addresses.map((address) => (
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200"
                                key={address._id}
                            >
                                <div className="p-6">

                                    <h5 className="text-lg font-semibold mb-2">
                                        {address.label}
                                    </h5>

                                    <p className="mb-1">
                                        <strong>
                                            {address.fullName}
                                        </strong>
                                    </p>

                                    <p className="mb-1">
                                        {address.addressLine1}
                                    </p>

                                    {address.addressLine2 && (
                                        <p className="mb-1">
                                            {address.addressLine2}
                                        </p>
                                    )}

                                    <p className="mb-1">
                                        {address.city},{" "}
                                        {address.state}
                                    </p>

                                    <p className="mb-2">
                                        {address.pincode}
                                    </p>

                                    <p className="mb-4">
                                        {address.phone}
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() =>
                                                handleEdit(address)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() =>
                                                handleDelete(address._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            <Footer />
        </>
    );
}