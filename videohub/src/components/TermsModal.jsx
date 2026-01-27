import React from 'react';

export default function TermsModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border-2 border-blue-600 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-6">Terms and Conditions</h1>

          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Introduction</h2>
              <p>
                Welcome to DesiHub. These Terms and Conditions govern your use of our website and services. By accessing and using DesiHub, you agree to be bound by these terms. If you do not agree to any part of these terms, you may not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Section 1 - Use of Service</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must be at least 18 years of age to use this service.</li>
                <li>You represent and warrant that you have the legal capacity to enter into this agreement and use VideoHub in compliance with all applicable laws and regulations.</li>
                <li>You agree to use VideoHub only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of VideoHub.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Section 2 - Content</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All content on VideoHub is provided for personal use only.</li>
                <li>You may not reproduce, distribute, transmit, or display any content without explicit written permission from VideoHub.</li>
                <li>Unauthorized distribution or reproduction of content is strictly prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Section 3 - User Conduct</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You agree not to engage in any conduct that restricts or inhibits anyone's use or enjoyment of VideoHub.</li>
                <li>Prohibited behavior includes: harassment, threats, defamation, obscenity, or any illegal activity.</li>
                <li>VideoHub reserves the right to terminate service to users who violate these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Section 4 - Privacy</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of VideoHub may involve the collection and processing of personal data.</li>
                <li>We are committed to protecting your privacy and handling your data responsibly.</li>
                <li>Third-party services may be used to enhance your experience, subject to their privacy policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Section 5 - Disclaimer</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>DesiHub is provided on an "as is" basis without any warranties or guarantees.</li>
                <li>We do not warrant that the platform will be uninterrupted or error-free.</li>
                <li>DesiHub is not responsible for any damages resulting from the use or inability to use our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Section 6 - Modifications</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>DesiHub reserves the right to modify these Terms and Conditions at any time.</li>
                <li>Users will be notified of significant changes to these terms.</li>
                <li>Continued use of DesiHub following any modifications constitutes acceptance of the updated terms.</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
