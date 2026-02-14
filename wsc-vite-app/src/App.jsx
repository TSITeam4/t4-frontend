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
import AdminAuthProvider from "./contexts/AdminAuthProvider"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import ErrorBoundary from "./components/shared/ErrorBoundary"
import { useSupabaseQuery } from "./lib/hooks/useSupabaseQuery"
import "./App.css"

const ScrollToTop = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.pathname]);

  return null;
}

import Preloader from "./components/preloader/Preloader"

function App() {
  const [appReady, setAppReady] = React.useState(false);

  // Fetch events from Supabase (public read — RLS filters to published only)
  const {
    data: events,
    loading,
    error,
  } = useSupabaseQuery('events', {
    orderBy: 'date',
    ascending: false,
  });

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Preloader onLoadComplete={() => setAppReady(true)} />
        <div className={`transition-opacity duration-700 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
          <main className="flex-grow">
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={
                  <Landing events={events} loading={loading} error={error} />
                } />
                <Route path="/about" element={<About />} />
                <Route path="/executive-team" element={<ExecutiveTeam />} />
                <Route path="/events" element={
                  <Events events={events} loading={loading} error={error} />
                } />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/admin" element={
                  <AdminAuthProvider>
                    <AdminDashboard />
                  </AdminAuthProvider>
                } />
              </Routes>
            </Router>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
