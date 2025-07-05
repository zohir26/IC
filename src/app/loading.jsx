'use client'
import Lottie from 'lottie-react';
import loaderAnimation from '../../public/loader.json'; // Adjust path to your JSON file

const Loader = ({ size = 200, text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <Lottie 
        animationData={loaderAnimation}
        loop={true}
        style={{ width: size, height: size }}
      />
      {text && <p className="mt-5 text-lg text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default Loader;