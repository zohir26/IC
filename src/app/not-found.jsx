// src/app/not-found.tsx
'use client';

import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import animationData from '../../public/404-animation.json';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-100">
      <div className="text-center">
        {/* Lottie Animation */}
        <div className="w-150 h-100 mx-auto mb-4">
          <Lottie 
            animationData={animationData}
            loop={true}
            autoplay={true}
          />
        </div>
        
        {/* Error Content */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Navigation Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </button>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}