import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/app/Shared/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function TermsOfService() {
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
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6 text-center">
                <strong>Last updated:</strong> December 2024
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the Redwood Analytics and Intelligence website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree with any part of these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 mb-4">
                  Redwood Analytics and Intelligence is a semiconductor knowledge hub that provides:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Expert insights and analysis on semiconductor technologies</li>
                  <li>Product comparisons and component information</li>
                  <li>Industry reports and market intelligence</li>
                  <li>Educational content for engineers and decision-makers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  3. User Responsibilities
                </h2>
                <p className="text-gray-700 mb-4">
                  As a user of our services, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate and complete information when required</li>
                  <li>Use our services only for lawful purposes</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not distribute malware or engage in harmful activities</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not use automated systems to scrape content without permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  4. Intellectual Property Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  All content, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Redwood Analytics and Intelligence or its content suppliers and is protected by international copyright laws.
                </p>
                <p className="text-gray-700 mb-4">
                  You may view, download, and print content for personal, non-commercial use only. Any other use, including reproduction, modification, distribution, or republication, without our prior written consent is strictly prohibited.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  5. Disclaimer of Warranties
                </h2>
                <p className="text-gray-700 mb-4">
                  Our services are provided "as is" without any warranties, express or implied. We do not warrant that:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>The service will meet your specific requirements</li>
                  <li>The service will be uninterrupted, timely, secure, or error-free</li>
                  <li>The information provided will be accurate or reliable</li>
                  <li>Any defects in the service will be corrected</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  6. Limitation of Liability
                </h2>
                <p className="text-gray-700 mb-4">
                  In no event shall Redwood Analytics and Intelligence be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of our services, even if we have been advised of the possibility of such damages.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  7. Privacy Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, to understand our practices regarding the collection and use of your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  8. Termination
                </h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  9. Changes to Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-700 mb-4">
                  These Terms of Service shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  11. Contact Information
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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