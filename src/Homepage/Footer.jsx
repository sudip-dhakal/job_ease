import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-4">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">JobEase</h3>
            <p className="text-gray-400">
              Your trusted job portal to find the perfect job opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Quick Links
            </h3>
            <ul className="text-gray-400 space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition duration-300"
                >
                  Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
              >
                <FaFacebook size={28} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
              >
                <FaTwitter size={28} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
              >
                <FaLinkedin size={28} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
              >
                <FaInstagram size={28} />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-6">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-blue-400">JobEase</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
