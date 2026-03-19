import React from 'react';
import Footer from '../components/footer/Footer';
import Nav from '../components/nav/Nav';

function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Nav />
      <div className="container mx-auto px-6 md:px-12 py-16 pt-32 flex-grow max-w-4xl">
        <h1 className="text-4xl font-bold mb-8  border-b pb-4">Privacy Policy</h1>
        
        <div className="space-y-8 ">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="mb-3 leading-relaxed">Western Sales Club ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">2. Information We Collect</h2>
            <p className="mb-3 leading-relaxed">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-8 mb-3 space-y-2 leading-relaxed">
              <li>Register for events or workshops</li>
              <li>Sign up for our newsletter</li>
              <li>Complete contact or application forms</li>
              <li>Participate in surveys or contests</li>
            </ul>
            <p className="mb-3 leading-relaxed">The personal information we may collect includes:</p>
            <ul className="list-disc pl-8 mb-3 space-y-2 leading-relaxed">
              <li>First and last name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Student information (program, year)</li>
              <li>Resume or CV (when applicable)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3 ">Automatically Collected Information</h3>
            <p className="mb-3 leading-relaxed">When you visit our website, we may automatically collect certain information about your device, including:</p>
            <ul className="list-disc pl-8 mb-3 space-y-2 leading-relaxed">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Access times</li>
              <li>Pages viewed</li>
              <li>Operating system</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">3. How We Use Your Information</h2>
            <p className="mb-3 leading-relaxed">We may use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-8 mb-3 space-y-2 leading-relaxed">
              <li>Provide, maintain, and improve our services</li>
              <li>Process event registrations and send related information</li>
              <li>Send administrative information, updates, and promotional content</li>
              <li>Respond to inquiries and provide support</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Protect against unauthorized access to our services</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">4. Disclosure of Your Information</h2>
            <p className="mb-3 leading-relaxed">We may share your information in the following situations:</p>
            <ul className="list-disc pl-8 mb-3 space-y-2 leading-relaxed">
              <li>With club sponsors and partners when necessary for events or opportunities (with your consent)</li>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">5. Cookies and Tracking Technologies</h2>
            <p className="mb-3 leading-relaxed">We may use cookies and similar tracking technologies to collect information about your browsing activities. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">6. Data Security</h2>
            <p className="mb-3 leading-relaxed">We have implemented appropriate technical and organizational security measures to protect your information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">7. Your Privacy Rights</h2>
            <p className="mb-3 leading-relaxed">Depending on your location, you may have certain rights regarding your personal information, such as:</p>
            <ul className="list-disc pl-8 mb-3 space-y-2 leading-relaxed">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
            </ul>
            <p className="mb-3 leading-relaxed">To exercise these rights, please contact us using the information provided below.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">8. Children's Privacy</h2>
            <p className="mb-3 leading-relaxed">Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">9. Changes to This Privacy Policy</h2>
            <p className="mb-3 leading-relaxed">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">10. Contact Us</h2>
            <p className="mb-3 leading-relaxed">If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:sales.club@westernusc.ca" className="text-blue-600 hover:text-blue-800 font-medium">sales.club@westernusc.ca</a>.</p>
          </section>
        </div>
        
        <div className="mt-12 mb-8 pt-6 border-t text-sm ">
          <p>Last Updated: May 7, 2025</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;