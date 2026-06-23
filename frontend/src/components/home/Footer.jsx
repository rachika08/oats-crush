import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top divider */}
        <div className="border-t border-gray-200" />

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 py-10 gap-10">
          {/* Quick Links */}
          <div className="md:border-r border-gray-200 md:pr-10">
            <h3 className="font-heading text-brand-orange text-lg tracking-wide mb-4">
              QUICK LINKS
            </h3>

            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-brand-orange transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-brand-orange transition"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:border-r border-gray-200 md:pr-10">
            <h3 className="font-heading text-brand-orange text-lg tracking-wide mb-4">
              SUPPORT
            </h3>

            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-brand-orange transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-brand-orange transition"
                >
                  Terms of Services
                </Link>
              </li>
              <li>
                <Link
                  to="/shippingpolicy"
                  className="hover:text-brand-orange transition"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returnpolicy"
                  className="hover:text-brand-orange transition"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacypolicy"
                  className="hover:text-brand-orange transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="font-body text-sm mb-2">Connect With Us</p>

            <a
              href="mailto:dm@oatscrush.co.in"
              className="font-heading text-brand-orange text-2xl sm:text-2xl break-all hover:translate-y-1 transition"
            >
              DM@OATSCRUSH.CO.IN
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-gray-200" />

        {/* Bottom strip */}
        <div className="flex items-center justify-between py-5 font-body text-sm">
          <p>© {new Date().getFullYear()} Oats Crush. All Rights Reserved.</p>

          <div className="flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 flex items-center justify-center rounded-md text-brand-orange hover:-translate-y-1 transition"
            >
              <FaInstagram size={25} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 flex items-center justify-center rounded-md text-brand-orange hover:-translate-y-1 transition"
            >
              <FaLinkedin size={25} />
            </a>
          </div>
        </div>
      </div>

      {/* Full-bleed logo wordmark */}
      <img
        src="/src/assets/images/oats-crush-logo2.png"
        alt="Oats Crush"
        className="w-full select-none pointer-events-none"
      />
    </footer>
  );
};

export default Footer;