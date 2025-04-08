"use client";

import PrivacyNavbar from "@/components/PrivacyNavbar";

export default function PrivacyHomePage() {
  return (
    <div>
      <PrivacyNavbar />

      <main className="mt-20 px-4 max-w-4xl mx-auto">
        <section className="bg-[var(--foreground)] text-[var(--background)] pt-16 pb-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            Privacy Policy
          </h1>
          <p className="text-center text-lg">Last updated: April 8, 2025</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Introduction
          </h2>
          <p className="leading-relaxed">
            Your privacy is our priority. We are committed to protecting the
            privacy of all personal information obtained from you during your
            visits to our website or while using our services. This policy
            provides detailed information on how we handle your personal data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Information We Collect
          </h2>
          <p className="mb-4 leading-relaxed">
            We collect various types of information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Information you provide to register with us (e.g., name, email
              address).
            </li>
            <li>
              Details of your visits to our platform and the resources that you
              access, including, but not limited to, traffic data, location
              data, weblogs and other communication data.
            </li>
            <li>
              Information that you provide when you communicate with us for any
              reason.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Use of Your Information
          </h2>
          <p className="mb-4 leading-relaxed">
            The information that we collect and store relating to you is
            primarily used to enable us to provide our services to you. In
            addition, we may use the information for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              To provide you with information requested from us relating to our
              projects or services and to provide information on other products
              which we feel may be of interest to you, where you have consented
              to receive such information.
            </li>
            <li>To meet our contractual commitments to you.</li>
            <li>
              To notify you about any changes to our website, such as
              improvements or service/product changes, that may affect our
              service.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Storing Your Personal Data
          </h2>
          <p className="leading-relaxed">
            We may transfer data that we collect from you to locations outside
            of your jurisdiction for processing and storing. Also, it may be
            processed by staff operating outside your jurisdiction who work for
            us or for one of our suppliers. By submitting your personal data,
            you agree to this transfer, storing or processing. We will take all
            reasonable steps to make sure that your data is treated securely and
            in agreement with this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Disclosing Your Information
          </h2>
          <p className="mb-4 leading-relaxed">
            We do not disclose your personal information to any third parties
            other than in accordance with this Privacy Policy and in the
            circumstances detailed below:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              In the event that we sell any or all of our business to the buyer.
            </li>
            <li>Where we are legally required to disclose your information.</li>
            <li>To assist fraud protection and minimize credit risk.</li>
          </ul>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>© 2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
