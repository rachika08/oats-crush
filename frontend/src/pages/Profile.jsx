import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Home,
  ClipboardList,
  ChevronRight,
  Pencil,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import AddressModal from "../components/AddressModal";

const TABS = [
  { id: "overview", label: "OVERVIEW", icon: User },
  { id: "addresses", label: "ADDRESSES", icon: Home },
  { id: "orders", label: "ORDERS", icon: ClipboardList },
];

const STATUS_STYLES = {
  Pending: "text-yellow-600 border-yellow-600",
  Processing: "text-yellow-600 border-yellow-600",
  Shipped: "text-blue-600 border-blue-600",
  Delivered: "text-green-600 border-green-600",
  Cancelled: "text-red-500 border-red-500",
};

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const requestedTab = searchParams.get("tab");
  const validTabs = TABS.map((t) => t.id);

  const [activeTab, setActiveTab] = useState(
    validTabs.includes(requestedTab) ? requestedTab : "overview"
  );

  const [user, setUser] = useState(storedUser);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [overviewForm, setOverviewForm] = useState({ name: "", phone: "" });

  const [addresses, setAddresses] = useState([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "addresses" && !addressesLoaded) fetchAddresses();
    if (activeTab === "orders" && !ordersLoaded) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setOverviewForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
      });
    } catch (error) {
      console.log(error);
      setOverviewForm({
        name: storedUser.name || "",
        phone: storedUser.phone || "",
      });
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await api.get("/address");
      setAddresses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAddresses(false);
      setAddressesLoaded(true);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get("/order");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingOrders(false);
      setOrdersLoaded(true);
    }
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const handleOverviewChange = (e) => {
    setOverviewForm({ ...overviewForm, [e.target.name]: e.target.value });
  };

  const handleOverviewSave = async () => {
    try {
      const res = await api.put("/auth/update", {
        name: overviewForm.name,
        phone: overviewForm.phone,
      });

      const updatedUser = { ...storedUser, name: res.data.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setUser(res.data);
      setIsEditingOverview(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleOverviewCancel = () => {
    setOverviewForm({
      name: user?.name || storedUser?.name || "",
      phone: user?.phone || "",
    });
    setIsEditingOverview(false);
  };

const handleAddAddress = () => {
  setEditingAddress(null);
  setIsAddressModalOpen(true);
};

const handleEditAddress = (address) => {
  setEditingAddress(address);
  setIsAddressModalOpen(true);
};

const handleSaveAddress = async (formData, addressId) => {
  try {
    if (addressId) {
      await api.put(`/address/${addressId}`, formData);
    } else {
      await api.post("/address", formData);
    }
    await fetchAddresses();
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  } catch (error) {
    alert(error.response?.data?.message || "Failed to save address");
  }
};

  const handleDeleteAddress = async (id) => {
    const confirmDelete = window.confirm("Delete this address?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/address/${id}`);
      fetchAddresses();
    } catch (error) {
      console.log(error);
    }
  };

  const displayName = user?.name || storedUser?.name || "there";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <Navbar />

        <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
          <img
            src="/images/banner2.png"
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Avatar overlapping the hero/content boundary */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-orange text-white font-heading text-2xl sm:text-3xl flex items-center justify-center shadow-md">
            {initial}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16 pb-16 sm:pb-20">
        {/* Greeting */}
        <p className="text-center font-body text-black text-base sm:text-lg mb-10">
          Hey, <span className="font-semibold">{displayName}</span>
        </p>

        {/* Tab cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`text-left border-2 rounded-2xl p-5 sm:p-6 transition cursor-pointer ${
                  isActive
                    ? "border-brand-orange shadow-md"
                    : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0">
                      <Icon size={16} />
                    </span>
                    <span className="font-heading text-lg sm:text-xl">
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-black flex-shrink-0" />
                </div>

                <p className="font-body text-sm text-gray-500">
                  View and edit your personal details
                </p>
              </button>
            );
          })}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="border border-gray-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl sm:text-3xl">Overview</h2>

              {!isEditingOverview && (
                <button
                  onClick={() => setIsEditingOverview(true)}
                  className="text-brand-orange cursor-pointer"
                  aria-label="Edit profile"
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>

            <div className="border-t border-gray-200 mb-6" />

            {!isEditingOverview ? (
              <div className="space-y-6">
                <div>
                  <p className="font-body text-sm text-gray-400 mb-1">Name</p>
                  <p className="font-body font-semibold text-base">
                    {user?.name || storedUser?.name}
                  </p>
                </div>

                <div>
                  <p className="font-body text-sm text-gray-400 mb-1">Email</p>
                  <p className="font-body font-semibold text-base">
                    {user?.email || storedUser?.email}
                  </p>
                </div>

                <div>
                  <p className="font-body text-sm text-gray-400 mb-1">
                    Contact Number
                  </p>
                  <p className="font-body font-semibold text-base">
                    {user?.phone || "Not added"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block font-body text-sm text-gray-500 mb-2">
                    Name
                  </label>
                  <input
                    name="name"
                    value={overviewForm.name}
                    onChange={handleOverviewChange}
                    className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-gray-500 mb-2">
                    Contact Number
                  </label>
                  <input
                    name="phone"
                    value={overviewForm.phone}
                    onChange={handleOverviewChange}
                    className="w-full border-b border-gray-300 pb-2 font-body text-sm focus:outline-none focus:border-brand-orange transition bg-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleOverviewSave}
                    className="bg-brand-orange text-white font-heading text-sm px-6 py-2.5 rounded-full shadow-md hover:-translate-y-1 transition cursor-pointer"
                  >
                    SAVE
                  </button>

                  <button
                    onClick={handleOverviewCancel}
                    className="border-2 border-gray-300 font-heading text-sm px-6 py-2.5 rounded-full hover:-translate-y-1 transition cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADDRESSES */}
        {activeTab === "addresses" && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl mb-3">
              My Addresses
            </h2>

            <div className="border-t border-gray-200 mb-5" />

            <button
              onClick={handleAddAddress}
              className="flex items-center gap-1 text-brand-orange font-body text-sm font-medium mb-6 cursor-pointer hover:underline"
            >
              <Plus size={16} /> Add New Address
            </button>

            {loadingAddresses ? (
              <p className="font-body text-gray-500">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="font-body text-gray-500">No addresses found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="border border-gray-200 rounded-2xl p-6"
                  >
                    <h3 className="font-heading text-lg mb-2">
                      {address.label}
                    </h3>

                    <p className="font-body text-sm text-black">
                      {address.fullName}
                    </p>

                    <p className="font-body text-sm text-black">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>

                    <p className="font-body text-sm text-black">
                      {address.city}, {address.state}
                    </p>

                    <p className="font-body text-sm text-black mb-1">
                      {address.pincode}
                    </p>

                    <p className="font-body text-sm text-black mb-4">
                      {address.phone}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="flex items-center gap-1 bg-brand-orange text-white font-heading text-xs px-4 py-2 rounded-full hover:-translate-y-0.5 transition cursor-pointer"
                      >
                        <Edit2 size={12} /> EDIT
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="flex items-center gap-1 bg-red-500 text-white font-heading text-xs px-4 py-2 rounded-full hover:-translate-y-0.5 transition cursor-pointer"
                      >
                        <Trash2 size={12} /> DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl mb-3">
              My Orders
            </h2>

            <div className="border-t border-gray-200 mb-6" />

            {loadingOrders ? (
              <p className="font-body text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="font-body text-gray-500">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl overflow-hidden border border-gray-200"
                  >
                    {/* Header bar */}
                    <div className="bg-brand-orange text-white grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 text-center">
                      <div>
                        <p className="font-body text-xs text-white/80 mb-1">
                          Order ID
                        </p>
                        <p className="font-heading text-sm sm:text-base">
                          {order._id.slice(-6)}
                        </p>
                      </div>

                      <div>
                        <p className="font-body text-xs text-white/80 mb-1">
                          Total Payment
                        </p>
                        <p className="font-heading text-sm sm:text-base">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      <div>
                        <p className="font-body text-xs text-white/80 mb-1">
                          Payment Method
                        </p>
                        <p className="font-heading text-sm sm:text-base">
                          {order.paymentMethod === "RAZORPAY"
                            ? "Razorpay"
                            : "Cash on Delivery"}
                        </p>
                      </div>

                      <div>
                        <p className="font-body text-xs text-white/80 mb-1">
                          Order Date
                        </p>
                        <p className="font-heading text-sm sm:text-base">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 relative">
                      <span
                        className={`absolute top-6 right-6 border-2 rounded-full px-4 py-1 font-heading text-xs ${
                          STATUS_STYLES[order.orderStatus] ||
                          "text-gray-500 border-gray-300"
                        }`}
                      >
                        {order.orderStatus?.toUpperCase()}
                      </span>

                      <div className="space-y-5 mb-6 pr-28">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex gap-4 items-center"
                          >
                            <img
                              src={item.product?.image}
                              alt={item.product?.name}
                              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                            />

                            <div>
                              <h4 className="font-heading text-base">
                                {item.product?.name}
                              </h4>
                              <p className="font-body text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="bg-brand-orange text-white font-heading text-sm px-6 py-2.5 rounded-full hover:-translate-y-1 transition cursor-pointer shadow-md"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
      <AddressModal
  isOpen={isAddressModalOpen}
  onClose={() => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  }}
  onSave={handleSaveAddress}
  initialData={editingAddress}
/>
    </>
  );
}