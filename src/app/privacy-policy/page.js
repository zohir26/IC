import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/app/Shared/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function PrivacyPolicy() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div>
        <Navbar session={session} />
      </div>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6 text-center">
                <strong>Last updated:</strong> December 2024
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 mb-4">
                  At Redwood Analytics and Intelligence, we collect information to provide better services to our users. We collect information in the following ways:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and company information when you contact us or sign up for our services.</li>
                  <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and search queries.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies for website functionality and analytics.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>To provide and maintain our semiconductor knowledge hub services</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To improve our website content and user experience</li>
                  <li>To send you relevant updates about semiconductor industry insights (with your consent)</li>
                  <li>To analyze website usage and optimize our services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  3. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>With trusted service providers who assist us in operating our website</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  4. Data Security
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  5. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-700 mb-4">
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  7. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  8. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Email:</strong> info@redwoodanalytics.com</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +8801982498381</p>
                  <p className="text-gray-700"><strong>Address:</strong> House 5/B, Sector-3, Road-13, Uttara</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}