"use client"

import React from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Landing from "./pages/Landing/Landing"
import About from "./pages/About/About"
import ExecutiveTeam from "./pages/Team/ExecutiveTeam"
import Events from "./pages/Events/Events"
import ContactUs from "./pages/Contact/Contact"
import Sponsors from "./pages/Sponsors/Sponsors"
import TermsOfService from "./pages/TermsOfService"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import EventData from "../data/EventData.json"
import "./App.css"

const ScrollToTop = () => {
  const location = useLocation(); // Import useLocation from react-router-dom

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.pathname]); // Re-run whenever the route changes

  return null;
}

import Preloader from "./components/Preloader"

function App() {

  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [appReady, setAppReady] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      if (EventData && Array.isArray(EventData.events)) {
        setEvents(EventData.events);
        console.log("Loaded events from EventData.json:", EventData.events);
      } else {
        console.error("Unexpected EventData format:", EventData);
        setError("Unexpected data format");
      }
    } catch (err) {
      console.error("Failed to load events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Preloader onLoadComplete={() => setAppReady(true)} />
      <div className={`transition-opacity duration-700 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
        <main className="flex-grow">
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={
                <Landing events={events} />
              } />
              <Route path="/about" element={<About />} />
              <Route path="/executive-team" element={<ExecutiveTeam />} />
              <Route path="/events" element={
                <Events events={events} />
              } />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>

          </Router>
        </main>
      </div>
    </div>
  )
}

export default App
