import { useEffect, useState } from "react";
import { X } from "lucide-react";
// import LocationPicker from "./LocationPicker";

const EMPTY_FORM = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AddressModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(
      initialData
        ? {
            label: initialData.label || "Home",
            fullName: initialData.fullName || "",
            phone: initialData.phone || "",
            addressLine1: initialData.addressLine1 || "",
            addressLine2: initialData.addressLine2 || "",
            city: initialData.city || "",
            state: initialData.state || "",
            pincode: initialData.pincode || "",
          }
        : EMPTY_FORM
    );
    setErrors({});
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({ ...formData, phone: value.replace(/\D/g, "").slice(0, 10) });
      return;
    }

    if (name === "pincode") {
      setFormData({ ...formData, pincode: value.replace(/\D/g, "").slice(0, 6) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // const handleLocationSelect = (loc) => {
  //       setFormData((prev) => ({
  //           ...prev,
  //           addressLine1: loc.addressLine1 || prev.addressLine1,
  //           city: loc.city || prev.city,
  //           state: loc.state || prev.state,
  //           pincode: loc.pincode || prev.pincode,
  //           lat: loc.lat,
  //           lng: loc.lng,
  //       }));
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (formData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      await onSave(formData, initialData?._id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-10"
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? "Edit address" : "Add a new address"}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl text-black">
            {isEditing ? "Edit Address" : "Add a New Address"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-black hover:text-brand-orange transition cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>
        {/* <div className="mb-4">
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </div> */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-8">
            <div>
              <label className="block font-body text-sm text-gray-500 mb-2">
                Address Type
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent cursor-pointer"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-body text-sm text-gray-500 mb-2">
                Full Name
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
              />
            </div>

<div>
              <label className="block font-body text-sm text-gray-500 mb-2">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block font-body text-sm text-gray-500 mb-2">
                Pincode
              </label>
              <input
                name="pincode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-body text-sm text-gray-500 mb-2">
                Address Line 1
              </label>
              <input
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-body text-sm text-gray-500 mb-2">
                Address Line 2
              </label>
              <input
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-gray-500 mb-2">
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-gray-500 mb-2">
                State
              </label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-orange text-white font-heading text-base py-3.5 rounded-full shadow-md hover:-translate-y-1 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {saving ? "SAVING..." : "SAVE ADDRESS"}
          </button>
        </form>
      </div>
    </div>
  );
}