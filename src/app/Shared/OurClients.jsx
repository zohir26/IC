"use client"
import { useState, useEffect } from 'react';
import { Button } from "../../Components/ui/button.jsx";

// const clients = [
//     { id: 1, name: "TSMC", logo: "https://i.ibb.co/zTNxGvRY/tsmc-removebg-preview.png" },
//     { id: 2, name: "Apple", logo: "https://i.ibb.co/ym6HRjzK/apple-logo-removebg-preview.png" },
//     { id: 3, name: "GlobalFoundries", logo: "https://i.ibb.co/1JsJ6bJg/global-f-removebg-preview.png" },
//     { id: 4, name: "Samsung", logo: "https://i.ibb.co/jkXw9S3w/samsung-removebg-preview.png" },
//     { id: 5, name: "Intel", logo: "https://i.ibb.co/whZwqsbR/intel-removebg-preview.png" },
//     { id: 6, name: "AMD", logo: "https://i.ibb.co/21YP6KKQ/amd-removebg-preview.png" },
//     { id: 7, name: "NVIDIA", logo: "https://i.ibb.co/MxScJ8Yw/nvidia-removebg-preview.png" },
//     { id: 8, name: "Qualcomm", logo: "https://i.ibb.co/HTHL9QSF/qualcom-removebg-preview.png" },
//     { id: 9, name: "Phoenix", logo: "https://i.ibb.co/gZcsY93V/phoenix-contact-removebg-preview.png" }
// ];
const clients = [
    { id: 1, name: "muRata", logo: "https://i.ibb.co/BVjnJ1Gn/muratea-removebg-preview.png" },
    { id: 2, name: "Positronic", logo: "https://i.ibb.co/XkdXc5Y9/Positronic.png" },
    { id: 3, name: "Microchip", logo: "https://i.ibb.co/TM8qdZLN/microchip-removebg-preview.png" },
    { id: 4, name: "Littelfuse", logo: "https://i.ibb.co/BKZ2d6Dr/diodes-removebg-preview.png" },
    { id: 5, name: "Diodes", logo: "https://i.ibb.co/whZwqsbR/intel-removebg-preview.png" },
    { id: 6, name: "Allegro", logo: "https://i.ibb.co/VYK54kRJ/allergo-removebg-preview.png" },
    { id: 7, name: "NXP", logo: "https://i.ibb.co/HfzDSJ0v/nxp-removebg-preview.png" },
    { id: 8, name: "CuDevice", logo: "https://i.ibb.co/JJDz9Pq/CUdevices-removebg-preview.png" },
    { id: 9, name: "Toshiba", logo: "https://i.ibb.co/tT9PDsHM/tosibha-removebg-preview.png" },
    { id: 10, name: "Advantech", logo: "https://i.ibb.co/CpT6HPLX/adhntech-removebg-preview.png" },
    { id: 11, name: "Texas Instruments", logo: "https://i.ibb.co/nGjLhhd/texas-removebg-preview.png" },
    { id: 12, name: "Analog Devices", logo: "https://i.ibb.co/XkdXc5Y9/Positronic.png" },
    { id: 13, name: "ST", logo: "https://i.ibb.co/9kYDg4F5/ST-removebg-preview.png" },
    { id: 14, name: "Onsemi", logo: "https://i.ibb.co/0VKfQRXz/onsemi-removebg-preview.png" },
    { id: 15, name: "ROHM", logo: "https://i.ibb.co/PvSBvCd2/rohm-removebg-preview.png" },
    { id: 16, name: "Renesas", logo: "https://i.ibb.co/wFw0N0f0/renesas-removebg-preview.png" },
    { id: 17, name: "Sgmicro", logo: "https://i.ibb.co/fY1P85N6/sgmicro-removebg-preview.png" },
    { id: 18, name: "Brocade", logo: "https://i.ibb.co/vCdnG5jq/brocade-removebg-preview.png" },
    { id: 19, name: "Kemet", logo: "https://i.ibb.co/sz47NJH/kemet-removebg-preview.png" },
    { id: 20, name: "Vishay", logo: "https://i.ibb.co/XfZRYSdZ/vishay-removebg-preview.png" }
];

export default function OurClients() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % clients.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const getVisibleClients = () => {
        const visibleCount = 3;
        const result = [];

        for (let i = 0; i < visibleCount; i++) {
            const index = (currentIndex + i) % clients.length;
            result.push(clients[index]);
        }

        return result;
    };

    return (
        <section className="py-16 bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="relative mb-12">
                    <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
                        <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">OUR CLIENTS</h2>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">

                        {/* Left Side - Experience */}
                        <div className="text-center md:text-left">
                            <div className="mb-6 h-10 ">
                                <img src="https://i.ibb.co/c4CKkh8/18-year-removebg-preview.png" className="h-30 w-32 -mt-12" alt="" />

                                <p className="text-lg md:text-xl text-gray-600 mt-2 font-bold">
                                    Years of Experience
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Client Logos Carousel */}
                        <div className="relative">
                            <div
                                className="flex items-center justify-center gap-8 transition-transform duration-500 ease-in-out"
                                onMouseEnter={() => setIsAutoPlaying(false)}
                                onMouseLeave={() => setIsAutoPlaying(true)}
                            >
                                {getVisibleClients().map((client, index) => (
                                    <div
                                        key={`${client.id}-${currentIndex}-${index}`}
                                        className={`transition-all duration-500 ${index === 1
                                                ? 'scale-110 opacity-100'
                                                : 'scale-90 opacity-70'
                                            }`}
                                    >
                                        <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                                            <img
                                                src={client.logo}
                                                alt={client.name}
                                                className="h-12 w-auto mx-auto object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Explore More Button */}
                            <div className="text-center mt-8">
                                <Button
                                    variant="outline"
                                    className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 px-6 py-2 rounded-lg font-semibold"
                                >
                                    EXPLORE MORE
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {clients.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors duration-200 ${currentIndex === index
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}