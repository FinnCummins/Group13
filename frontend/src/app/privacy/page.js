"use client"; 

import { useState } from 'react';
import PrivacyNavbar from '@/components/PrivacyNavbar'; 

export default function PrivacyHomePage() {
  return (
    <>
      <PrivacyNavbar /> 
      <main style={{ padding: '120px 1rem 1rem' }}>
        <h1>Privacy Policy</h1>
        <p>Last updated: April 5, 2025</p>
        <section>
          <h2>Introduction</h2>
          <p>At Best Computer Science Project, your privacy is our priority. We are committed to protecting the privacy of all personal information obtained from you during your visits to our website or while using our services. This policy provides detailed information on how we handle your personal data.</p>
        </section>
        <section>
          <h2>Information We Collect</h2>
          <p>We collect various types of information, including:</p>
          <ul>
            <li>Information you provide to register with us (e.g., name, email address).</li>
            <li>Details of your visits to our platform and the resources that you access, including, but not limited to, traffic data, location data, weblogs and other communication data.</li>
            <li>Information that you provide when you communicate with us for any reason.</li>
          </ul>
        </section>
        <section>
          <h2>Use of Your Information</h2>
          <p>The information that we collect and store relating to you is primarily used to enable us to provide our services to you. In addition, we may use the information for the following purposes:</p>
          <ul>
            <li>To provide you with information requested from us relating to our projects or services and to provide information on other products which we feel may be of interest to you, where you have consented to receive such information.</li>
            <li>To meet our contractual commitments to you.</li>
            <li>To notify you about any changes to our website, such as improvements or service/product changes, that may affect our service.</li>
          </ul>
        </section>
        <section>
          <h2>Storing Your Personal Data</h2>
          <p>We may transfer data that we collect from you to locations outside of your jurisdiction for processing and storing. Also, it may be processed by staff operating outside your jurisdiction who work for us or for one of our suppliers. By submitting your personal data, you agree to this transfer, storing or processing. We will take all reasonable steps to make sure that your data is treated securely and in agreement with this Privacy Policy.</p>
        </section>
        <section>
          <h2>Disclosing Your Information</h2>
          <p>We do not disclose your personal information to any third parties other than in accordance with this Privacy Policy and in the circumstances detailed below:</p>
          <ul>
            <li>In the event that we sell any or all of our business to the buyer.</li>
            <li>Where we are legally required to disclose your information.</li>
            <li>To assist fraud protection and minimize credit risk.</li>
          </ul>
        </section>
        <section>
          <h2>Third Party Links</h2>
          <p>You might find links to third party websites on our website. These websites should have their own privacy policies which you should check. We do not accept any responsibility or liability for their policies whatsoever as we have no control over them.</p>
        </section>
        <section>
          <h2>Contact Information</h2>
          <p>We welcome any queries, comments or requests you may have regarding this Privacy Policy. Please do not hesitate to contact us on Discord.</p>
        </section>
      </main>
    </>
  );
}
