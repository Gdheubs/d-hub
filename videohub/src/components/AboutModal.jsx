import React from 'react';

export default function AboutModal({ onClose }) {
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
          <h1 className="text-3xl font-bold text-blue-400 mb-6">About Us</h1>

          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Introduction</h2>
              <p>
                Welcome to DesiHub, your premier destination for quality video content. We are dedicated to providing a seamless, engaging platform where viewers can discover, watch, and enjoy exceptional video content from around the world.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Our Mission</h2>
              <p>
                At DesiHub, our mission is to revolutionize how people consume video content. We strive to provide a platform that is intuitive, modern, and focused on user satisfaction. We believe in the power of quality content and are committed to supporting creators and viewers alike.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Diverse Content Library:</strong> A carefully curated selection of videos covering various topics and interests.</li>
                <li><strong>User-Friendly Interface:</strong> An intuitive platform designed for seamless navigation and content discovery.</li>
                <li><strong>High-Quality Streaming:</strong> Advanced technology ensuring smooth playback and optimal viewing experience.</li>
                <li><strong>Smart Recommendations:</strong> Intelligent content suggestions tailored to your interests.</li>
                <li><strong>Secure Platform:</strong> A safe environment with age verification and content protection measures.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Our Commitment</h2>
              <p>
                We are committed to maintaining the highest standards of quality and user satisfaction. Our team works tirelessly to ensure that VideoHub remains a trustworthy, engaging, and innovative platform for all our users. We continuously improve our services and welcome your feedback.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Visit Our Store</h2>
              <p>
                Beyond our streaming platform, DesiHub offers an exclusive store experience at <a href="https://desihub.store" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">desihub.store</a>. There you'll find:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Exclusive merchandise and collectibles</li>
                <li>Premium content and exclusive releases</li>
                <li>Special offers and limited-time deals</li>
                <li>Unique products from our creator community</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Contact Information</h2>
              <p>
                Have questions or feedback? We'd love to hear from you!
              </p>
              <p className="mt-2">
                Email: <span className="text-blue-400">info@videohub.online</span>
              </p>
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
