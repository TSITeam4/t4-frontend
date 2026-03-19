import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfServicePage() {
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
        Terms of Service
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
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the Western Sales Club website, you agree to
            be bound by these Terms of Service. If you do not agree to these
            terms, please do not use our website.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            Western Sales Club provides a platform for students interested in
            sales and marketing to connect, learn, and participate in events.
            Our services include but are not limited to providing information
            about club activities, events, resources, and facilitating
            communication between members.
          </p>
        </Section>

        <Section title="3. User Conduct">
          <p>Users of the Western Sales Club website agree to:</p>
          <ul>
            <li>
              Provide accurate and complete information when interacting with
              our website
            </li>
            <li>
              Use the website in a manner consistent with all applicable laws
              and regulations
            </li>
            <li>
              Not engage in any activity that disrupts or interferes with our
              services
            </li>
            <li>
              Not attempt to gain unauthorized access to any portion of the
              website
            </li>
            <li>
              Not use our website for any illegal or unauthorized purpose
            </li>
          </ul>
        </Section>

        <Section title="4. Intellectual Property">
          <p>
            All content on the Western Sales Club website, including text,
            graphics, logos, images, and software, is the property of Western
            Sales Club or its content suppliers and is protected by Canadian and
            international copyright laws.
          </p>
        </Section>

        <Section title="5. Third-Party Links">
          <p>
            Our website may contain links to third-party websites. Western
            Sales Club is not responsible for the content or practices of these
            websites and does not endorse or make any representations about
            them.
          </p>
        </Section>

        <Section title="6. Limitation of Liability">
          <p>
            Western Sales Club shall not be liable for any direct, indirect,
            incidental, special, consequential, or punitive damages resulting
            from your access to or use of, or inability to access or use, the
            website or any content provided on or through the website.
          </p>
        </Section>

        <Section title="7. Changes to Terms">
          <p>
            Western Sales Club reserves the right to modify these Terms of
            Service at any time. We will notify users of any changes by
            updating the date at the top of this page. Your continued use of
            the website after any modifications indicates your acceptance of
            the updated terms.
          </p>
        </Section>

        <Section title="8. Governing Law">
          <p>
            These Terms of Service are governed by and construed in accordance
            with the laws of the Province of Ontario, Canada, without regard to
            its conflict of law principles.
          </p>
        </Section>

        <Section title="9. Contact Information">
          <p>
            If you have any questions about these Terms of Service, please
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
