import React from 'react';

export default function AgeVerificationModal({ onVerify }) {
  const handleNo = () => {
    window.close();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 z-50 flex items-center justify-center">
      <div className="bg-gray-900/95 border-2 border-red-500 rounded-lg p-8 max-w-md w-full mx-4 animate-slide-up">
        <div className="flex justify-center mb-6">
          <span className="text-5xl">⚠️</span>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-4 text-white">
          Age Verification Required
        </h1>
        
        <p className="text-center text-gray-300 mb-6">
          This website contains content intended for adults only. You must be 18 years or older to proceed.
        </p>
        
        <p className="text-center text-red-400 font-semibold mb-8 text-lg">
          Are you 18 years of age or older?
        </p>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={onVerify}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Yes, I'm 18+
          </button>
          <button
            onClick={handleNo}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            No, Exit
          </button>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6 px-4">
          By clicking "Yes, I'm 18+", you confirm that you are at least 18 years old and agree to our Terms and Conditions.
        </p>
      </div>
    </div>
  );
}
