"use client"; 

import { useState } from 'react';
import AboutNavbar from '@/components/AboutNavbar'; 

export default function AboutHomePage() {
  return (
    <>
      <AboutNavbar /> 
      <main style={{ padding: '120px 1rem 1rem' }}>
        <h1>About Us</h1>
        <p>Welcome to <strong>Best Computer Science Project</strong> – Your Gateway to a Perfect Future!</p>
        <section>
          <h2>Our Mission</h2>
          <p>At TBSCP, we are dedicated to empowering final year computer science students by facilitating informed decisions about their capstone projects. Our platform doesn't just connect students to a vast array of project options; it tailors recommendations to match their personal interests and academic goals.</p>
        </section>
        <section>
          <h2>Our Team</h2>
          <p>The <strong>Best Computer Science Project</strong> team is comprised of passionate developers, educators, and advisors dedicated to enhancing student outcomes:</p>
          <ul>
            <li><strong>Finn</strong> - Project Manager</li>
            <li><strong>Nehal & Mark</strong> - Frontend Developers</li>
            <li><strong>Hazel & Dishant</strong> - Backend Developers</li>
          </ul>
        </section>
        <section>
          <h2>Our Journey</h2>
          <p>Launched in 2025, Project Navigator was conceived from a simple yet profound observation: many students struggle to find projects that truly resonate with their personal and professional ambitions. Our platform has since empowered over a thousand students to find their ideal projects, significantly enhancing their academic engagement and career preparedness.</p>
        </section>
        <section>
          <h2>Our Aim & Future</h2>
          <p>With over 1,000 success stories and a 95% satisfaction rate, we are not resting on our laurels. Looking forward, we are excited to introduce AI-driven analytics to provide even more personalized project recommendations and to expand our reach to more universities worldwide.</p>
        </section>
        <section>
          <h2>Get in Touch</h2>
          <p>We’re here to answer any questions and assist with your project needs. Reach out to us on Discord, or follow us on <strong>Github</strong> to stay updated on our latest developments.</p>
        </section>
      </main>
    </>
  );
}
