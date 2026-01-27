import React from 'react';

export default function Footer({ onTermsClick, onAboutClick }) {
  return (
    <footer className="bg-gray-900/80 backdrop-blur border-t-2 border-blue-600 mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Branding */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400">DesiHub</h3>
            <p className="text-gray-300">
              Your premier destination for quality video content.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onTermsClick}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={onAboutClick}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <p className="text-gray-400">
              Email: <span className="text-gray-300">info@desihub.online</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-400">
            © 2026 DesiHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
