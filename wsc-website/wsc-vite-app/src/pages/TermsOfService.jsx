import React from 'react';
import Footer from '../components/footer/Footer';
import Nav from '../components/nav/Nav';

function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Nav />
      <div className="container mx-auto px-6 md:px-12 py-16 pt-32 flex-grow max-w-4xl">
        <h1 className="text-4xl font-bold mb-8  border-b pb-4">Terms of Service</h1>
        
        <div className="space-y-8 ">
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">1. Acceptance of Terms</h2>
            <p className="mb-3 leading-relaxed">By accessing or using the Western Sales Club website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">2. Description of Service</h2>
            <p className="mb-3 leading-relaxed">Western Sales Club provides a platform for students interested in sales and marketing to connect, learn, and participate in events. Our services include but are not limited to providing information about club activities, events, resources, and facilitating communication between members.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">3. User Conduct</h2>
            <p className="mb-3 leading-relaxed">Users of the Western Sales Club website agree to:</p>
            <ul className="list-disc pl-8 mb-3 space-y-2 leading-relaxed">
              <li>Provide accurate and complete information when interacting with our website</li>
              <li>Use the website in a manner consistent with all applicable laws and regulations</li>
              <li>Not engage in any activity that disrupts or interferes with our services</li>
              <li>Not attempt to gain unauthorized access to any portion of the website</li>
              <li>Not use our website for any illegal or unauthorized purpose</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">4. Intellectual Property</h2>
            <p className="mb-3 leading-relaxed">All content on the Western Sales Club website, including text, graphics, logos, images, and software, is the property of Western Sales Club or its content suppliers and is protected by Canadian and international copyright laws.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">5. Third-Party Links</h2>
            <p className="mb-3 leading-relaxed">Our website may contain links to third-party websites. Western Sales Club is not responsible for the content or practices of these websites and does not endorse or make any representations about them.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">6. Limitation of Liability</h2>
            <p className="mb-3 leading-relaxed">Western Sales Club shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the website or any content provided on or through the website.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">7. Changes to Terms</h2>
            <p className="mb-3 leading-relaxed">Western Sales Club reserves the right to modify these Terms of Service at any time. We will notify users of any changes by updating the date at the top of this page. Your continued use of the website after any modifications indicates your acceptance of the updated terms.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 ">8. Governing Law</h2>
            <p className="mb-3 leading-relaxed">These Terms of Service are governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law principles.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="mb-3 leading-relaxed">If you have any questions about these Terms of Service, please contact us at <a href="mailto:sales.club@westernusc.ca" className="text-blue-600 hover:text-blue-800 font-medium">sales.club@westernusc.ca</a>.</p>
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

export default TermsOfService;