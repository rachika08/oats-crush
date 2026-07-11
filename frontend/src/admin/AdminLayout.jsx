import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Tag,
    ClipboardList,
    Newspaper,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Categories", path: "/category", icon: Tag },
    { label: "Orders", path: "/admin/orders", icon: ClipboardList },
    { label: "Blogs", path: "/admin/blogs", icon: Newspaper },
];

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    const SidebarContent = (
        <>
            <div className="px-6 pt-8 pb-6">
                <h1 className="font-heading text-2xl leading-tight text-brand-orange uppercase">
                    Admin
                    <br />
                    Dashboard
                </h1>
                <div className="h-px bg-gray-200 mt-6" />
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map(({ label, path, icon: Icon }) => {
                    const isActive =
                        path === "/admin"
                            ? location.pathname === "/admin"
                            : location.pathname.startsWith(path);

                    return (
                        <button
                            key={label}
                            onClick={() => handleNavigate(path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm cursor-pointer transition-colors ${
                                isActive
                                    ? "bg-brand-orange/10 text-brand-orange font-medium"
                                    : "text-black hover:bg-gray-100"
                            }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            <div className="px-4 pb-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-9 h-9 rounded-full bg-brand-orange text-white font-heading text-sm flex items-center justify-center shrink-0">
                        {user.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <span className="font-body text-sm font-medium truncate">
                        {user.name || "Admin"}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-2 mt-1 rounded-xl font-body text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0">
                {SidebarContent}
            </aside>

            {/* Mobile drawer + backdrop */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden fixed inset-0 z-40 bg-black/40"
                />
            )}
            <aside
                className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col transition-transform duration-300 ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute top-6 right-4 text-gray-500 cursor-pointer"
                >
                    <X size={20} />
                </button>
                {SidebarContent}
            </aside>

            {/* Main content */}
            <div className="flex-1 md:ml-64">
                <div className="flex items-center justify-between px-6 sm:px-8 pt-6">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="md:hidden bg-white border border-gray-200 rounded-full p-2.5 cursor-pointer"
                    >
                        <Menu size={18} />
                    </button>
                    <div className="ml-auto bg-white border border-gray-200 rounded-full px-5 py-2 font-body text-sm font-medium">
                        Admin
                    </div>
                </div>

                <main className="px-6 sm:px-8 pb-10 pt-4">{children}</main>
            </div>
        </div>
    );
}