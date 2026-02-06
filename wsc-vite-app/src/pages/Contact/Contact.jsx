import React from "react";
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import PageTitle from '../../components/PageTitle';
import ContactForm from '../../components/ContactForm';
import './Contact.css';

function Contact() {
  return (
    <>
      <Nav />

      <PageTitle
        title="Contact Us"
        description="We'd love to hear from you! For business inquiries, collaboration opportunities,
            or general questions, please fill out the form below. Share any relevant information
            or resources so we can better understand your needs and work together toward your goals."
      />

      <ContactForm />

      <div className="contact-page-spacer"></div>

      <Footer />
    </>
  );
}

export default Contact;