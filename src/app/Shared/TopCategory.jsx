"use client"
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: "Integrated Circuits (ICs)",
    icon: "https://i.ibb.co/jkcJ05dg/IC-removebg-preview.png",
    link: "/category/integrated-circuits"
  },
  {
    id: 2,
    name: "Discrete Semiconductors",
    icon: "https://i.ibb.co/svrpNMjH/discrete-semicondutor-removebg-preview.png",
    link: "/category/discrete-semiconductors"
  },
  {
    id: 3,
    name: "Passive Components",
    icon: "https://i.ibb.co/HTJYxCfm/passive-components-removebg-preview.png",
    link: "/category/passive-components"
  },
  {
    id: 4,
    name: "Electromechanical",
    icon: "https://i.ibb.co/zWHmtW96/electromechanical-removebg-preview.png",
    link: "/category/electromechanical"
  },
  {
    id: 5,
    name: "Connectors",
    icon: "https://i.ibb.co/JjLtCz05/connectors-removebg-preview.png",
    link: "/category/connectors"
  },
  {
    id: 6,
    name: "Test Equipment",
    icon: "https://i.ibb.co/cKznKTk8/test-equipment-of-semicondutor-removebg-preview.png",
    link: "/category/test-equipment"
  },
  {
    id: 7,
    name: "Tools and Supplies",
    icon: "https://i.ibb.co/C5g9mPLM/tools-removebg-preview.png",
    link: "/category/tools-supplies"
  },
  {
    id: 8,
    name: "Sensors",
    icon: "https://i.ibb.co/tTxyPDRH/sensors-removebg-preview.png",
    link: "/category/sensors"
  },
  {
    id: 9,
    name: "Optoelectronics",
    icon: "https://i.ibb.co/39jmj8xc/optoelectronics-removebg-preview.png",
    link: "/category/optoelectronics"
  },
  {
    id: 10,
    name: "Circuit Protection",
    icon: "https://i.ibb.co/5WL2Nbgq/circuit-protection-removebg-preview.png",
    link: "/category/circuit-protection"
  },
  {
    id: 11,
    name: "Power Products",
    icon: "https://i.ibb.co/LDrJRzmw/power-removebg-preview.png",
    link: "/category/power-products"
  },
  {
    id: 12,
    name: "Cables and Wire",
    icon: "https://i.ibb.co/whvgkXQw/cables-and-wires-removebg-preview.png",
    link: "/category/cables-wire"
  }
];

export default function TopCategory() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">TOP CATEGORY</h2>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="w-12 h-12 mx-auto"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}