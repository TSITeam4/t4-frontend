import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <main
      className="mx-auto px-6"
      style={{
        maxWidth: "720px",
        paddingTop: "clamp(6rem, 10vw, 10rem)",
        paddingBottom: "var(--space-12)",
      }}
    >
      <h1
        className="font-semibold text-text-primary"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-display)",
          marginBottom: "var(--space-6)",
        }}
      >
        Privacy Policy
      </h1>

      {/* Gold underline rule */}
      <div
        className="mb-8"
        style={{
          height: "2px",
          background: "var(--color-gold)",
          width: "80px",
          marginTop: "calc(-1 * var(--space-4))",
          marginBottom: "var(--space-8)",
        }}
      />

      <div className="space-y-6">
        <Section title="1. Introduction">
          <p>
            Western Sales Club (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
            &ldquo;us&rdquo;) is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website. Please read
            this policy carefully.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>
            We may collect personal information that you voluntarily provide to
            us when you:
          </p>
          <ul>
            <li>Register for events or workshops</li>
            <li>Sign up for our newsletter</li>
            <li>Complete contact or application forms</li>
            <li>Participate in surveys or contests</li>
          </ul>
          <p>The personal information we may collect includes:</p>
          <ul>
            <li>First and last name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Student information (program, year)</li>
            <li>Resume or CV (when applicable)</li>
          </ul>
          <h3
            className="font-semibold"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-lg)",
              marginTop: "var(--space-6)",
              marginBottom: "var(--space-3)",
              color: "var(--color-text-primary)",
            }}
          >
            Automatically Collected Information
          </h3>
          <p>
            When you visit our website, we may automatically collect certain
            information about your device, including:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Access times</li>
            <li>Pages viewed</li>
            <li>Operating system</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>
            We may use the information we collect for various purposes,
            including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>
              Process event registrations and send related information
            </li>
            <li>
              Send administrative information, updates, and promotional content
            </li>
            <li>Respond to inquiries and provide support</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>
              Protect against unauthorized access to our services
            </li>
          </ul>
        </Section>

        <Section title="4. Disclosure of Your Information">
          <p>
            We may share your information in the following situations:
          </p>
          <ul>
            <li>
              With club sponsors and partners when necessary for events or
              opportunities (with your consent)
            </li>
            <li>
              With service providers who perform services on our behalf
            </li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>With your consent or at your direction</li>
          </ul>
        </Section>

        <Section title="5. Cookies and Tracking Technologies">
          <p>
            We may use cookies and similar tracking technologies to collect
            information about your browsing activities. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We have implemented appropriate technical and organizational
            security measures to protect your information. However, please note
            that no method of transmission over the Internet or electronic
            storage is 100% secure.
          </p>
        </Section>

        <Section title="7. Your Privacy Rights">
          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, such as:
          </p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information
            provided below.
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Our website is not intended for individuals under the age of 18. We
            do not knowingly collect personal information from children under
            18.
          </p>
        </Section>

        <Section title="9. Changes to This Privacy Policy">
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &ldquo;Last Updated&rdquo; date.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have questions or concerns about this Privacy Policy, please
            contact us at{" "}
            <a
              href="mailto:sales.club@westernusc.ca"
              className="hover:underline"
              style={{ color: "var(--color-gold)" }}
            >
              sales.club@westernusc.ca
            </a>
            .
          </p>
        </Section>
      </div>

      <div
        className="border-t"
        style={{
          marginTop: "var(--space-12)",
          paddingTop: "var(--space-6)",
          borderColor: "var(--color-border)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono-sm)",
          color: "var(--color-text-muted)",
        }}
      >
        <p>Last Updated: May 7, 2025</p>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="[&_p]:leading-[1.75] [&_ul]:leading-[1.75] [&_ul]:list-disc [&_li]:ml-2"
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-lg)",
        color: "var(--color-text-secondary)",
      }}
    >
      <h2
        className="font-semibold"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-heading)",
          marginTop: "var(--space-8)",
          marginBottom: "var(--space-3)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h2>
      <div className="space-y-3 [&_ul]:pl-[var(--space-4)] [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
