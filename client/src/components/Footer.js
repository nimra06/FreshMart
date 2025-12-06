import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#2c3e50] text-white pt-10 pb-5 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="mb-4 text-[#667eea]">FreshMart</h3>
            <p className="leading-relaxed text-gray-400">
              Your trusted grocery shopping destination. We deliver fresh
              groceries straight to your door with quality you can trust.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-gray-100">Quick Links</h4>
            <ul className="list-none">
              <li className="mb-2.5">
                <a href="/" className="text-gray-400 transition-colors hover:text-[#667eea]">Home</a>
              </li>
              <li className="mb-2.5">
                <a href="/products" className="text-gray-400 transition-colors hover:text-[#667eea]">Products</a>
              </li>
              <li className="mb-2.5">
                <a href="/#categories" className="text-gray-400 transition-colors hover:text-[#667eea]">Categories</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-gray-100">Customer Service</h4>
            <ul className="list-none">
              <li className="mb-2.5">
                <a href="#contact" className="text-gray-400 transition-colors hover:text-[#667eea]">Contact Us</a>
              </li>
              <li className="mb-2.5">
                <a href="#faq" className="text-gray-400 transition-colors hover:text-[#667eea]">FAQs</a>
              </li>
              <li className="mb-2.5">
                <a href="#shipping" className="text-gray-400 transition-colors hover:text-[#667eea]">Shipping Info</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-gray-100">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 transition-colors hover:text-[#667eea]">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 transition-colors hover:text-[#667eea]">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 transition-colors hover:text-[#667eea]">Instagram</a>
            </div>
          </div>
        </div>

        <div className="text-center pt-5 border-t border-[#34495e] text-gray-500">
          <p>&copy; 2025 FreshMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



