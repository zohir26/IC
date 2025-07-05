// pages/404.js
'use client'; // Optional for Next.js 13+ if using App Router
import React from 'react';
import Lottie from "lottie-react";
import animationData from "/public/404-animation.json"; // adjust the path accordingly
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-80">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h1 className="text-3xl font-bold mt-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-4 text-blue-500 underline">Go back home</Link>
    </div>
  );
}
