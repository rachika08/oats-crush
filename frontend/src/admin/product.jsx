import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import api from "../api/axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await api.get("/product/admin/all");
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await api.delete(`/product/${id}`);
            fetchProducts();
        } catch (error) {
            console.log(error);
        }
    };

    const basePack = (p) =>
        p.packSizes?.find((pack) => pack.units === 1) || p.packSizes?.[0];

    return (
        <AdminLayout>
            <h1 className="font-heading text-3xl sm:text-4xl text-brand-orange mb-6">
                Products
            </h1>

            {/* Column header bar — desktop only */}
            <div className="hidden md:grid grid-cols-[2.2fr_1fr_0.8fr_1fr_140px] items-center bg-brand-orange rounded-xl px-6 py-3 mb-5">
                <span className="font-heading text-white text-sm">Name</span>
                <span className="font-heading text-white text-sm text-center border-l border-white/30">
                    Price
                </span>
                <span className="font-heading text-white text-sm text-center border-l border-white/30">
                    Stock
                </span>
                <span className="font-heading text-white text-sm text-center border-l border-white/30">
                    Categories
                </span>
                <span className="border-l border-white/30" />
            </div>

            <button
                onClick={() => navigate("/admin/add-product")}
                className="flex items-center gap-2 bg-brand-orange text-white font-body text-sm font-medium px-5 py-2.5 rounded-full mb-6 cursor-pointer hover:bg-brand-orange-dark transition-colors"
            >
                Add Product <Plus size={16} />
            </button>

            {loading && (
                <p className="font-body text-sm text-gray-500">Loading products…</p>
            )}

            {!loading && products.length === 0 && (
                <p className="font-body text-sm text-gray-500">No products yet.</p>
            )}

            <div className="space-y-4">
                {products.map((p) => {
                    const pack = basePack(p);

                    return (
                        <div
                            key={p._id}
                            className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 md:grid md:grid-cols-[2.2fr_1fr_0.8fr_1fr_140px] md:items-center gap-2"
                        >
                            {/* Name + image */}
                            <div className="flex items-center gap-4 min-w-0">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="font-heading text-brand-orange text-base uppercase truncate">
                                        {p.name}
                                    </p>
                                    {pack?.label && (
                                        <p className="font-body text-sm text-gray-400">
                                            {pack.label}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="font-body text-sm font-semibold mt-3 md:mt-0 md:text-center">
                                <span className="md:hidden text-gray-400 font-normal mr-1">
                                    Price:
                                </span>
                                {pack?.price != null ? `₹${pack.price.toFixed(2)}` : "-"}
                            </div>

                            {/* Stock */}
                            <div className="font-body text-sm font-semibold mt-1 md:mt-0 md:text-center">
                                <span className="md:hidden text-gray-400 font-normal mr-1">
                                    Stock:
                                </span>
                                {p.stock}
                            </div>

                            {/* Category */}
                            <div className="font-body text-sm font-semibold mt-1 md:mt-0 md:text-center">
                                <span className="md:hidden text-gray-400 font-normal mr-1">
                                    Category:
                                </span>
                                {p.category?.name || "—"}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 mt-3 md:mt-0 md:justify-end">
                                <button
                                    onClick={() => navigate(`/admin/edit/${p._id}`)}
                                    className="flex items-center gap-1 font-body text-sm font-medium text-black cursor-pointer hover:text-brand-orange transition-colors"
                                >
                                    <Pencil size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => deleteProduct(p._id)}
                                    className="flex items-center gap-1 font-body text-sm font-medium text-red-500 cursor-pointer hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}