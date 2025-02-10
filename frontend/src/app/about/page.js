"use client"; 

import { useState } from 'react';
import AboutNavbar from '@/components/AboutNavbar'; 

export default function AboutHomePage() {
  return (
    <>
      <AboutNavbar /> 
      <main style={{ padding: '120px 1rem 1rem' }}>
        <h1>About Us</h1>
        <p>blah blah blah!</p>
      </main>
    </>
  );
}
