import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full py-16 bg-[#1F1F1F]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-2 md:px-24">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Western Sales Club</h3>
            <p className="mb-6 text-sm text-gray-300">
              Empowering students to succeed in the world of professional sales through education,
              networking, and hands-on experiences.
            </p>
            <div className="flex space-x-4 items-center justify-center">
              <a href="https://www.instagram.com/westernsalesclub/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-western-gold transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/western-sales-club/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-western-gold transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-western-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-western-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/executive-team" className="text-gray-300 hover:text-western-gold transition-colors">Executive Team</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-western-gold transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/sponsors" className="text-gray-300 hover:text-western-gold transition-colors">Partners</Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-300 hover:text-western-gold transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center items-center">
            <h3 className="text-xl font-serif font-bold mb-4">Notice</h3>
            <p className="mb-4 text-sm text-gray-300">
              This site is not affiliated with the University Students' Council (USC) of Western
              University. All content is independently managed by the Western Sales Club.
            </p>
            <div className="flex flex-col pt-4 sm:flex-row gap-3 sm:gap-6">
              <Link to="/terms-of-service" className="text-gray-300 hover:text-western-gold transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy-policy" className="text-gray-300 hover:text-western-gold transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <a
                href="https://uwotsi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="/TSI.avif"
                  alt="TSI Logo"
                  className="w-16 h-16 object-contain hover:opacity-75 transition-opacity duration-200"
                />
              </a>
              <p className="text-xs text-gray-400 mt-2">Developed and Built by Tech for Social Impact ®</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 justify-center text-gray-400">
          <p>&copy; {currentYear} Western Sales Club. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}

export default Footer;