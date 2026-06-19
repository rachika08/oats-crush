import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Oats Crush
            </h2>

            <p className="text-gray-400">
              Premium products crafted for quality, performance, and trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/products">Products</Link>
              </li>

              <li>
                <Link to="/">Categories</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Support
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li> <Link to="/contact">Contact us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shippingpolicy">Shipping Policy</Link></li>
              <li><Link to="/returnpolicy">Return Policy</Link></li>
              <li><Link to="/privacypolicy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Connect With Us
            </h3>

            <div className="flex gap-4">
              <FaFacebook className="cursor-pointer hover:scale-110 transition" />
              <FaInstagram className="cursor-pointer hover:scale-110 transition" />
              <FaLinkedin className="cursor-pointer hover:scale-110 transition" />
              
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Your Brand. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;