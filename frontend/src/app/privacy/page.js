"use client"; 

import { useState } from 'react';
import PrivacyNavbar from '@/components/PrivacyNavbar'; 

export default function PrivacyHomePage() {
  return (
    <>
      <PrivacyNavbar /> 
      <main style={{ padding: '120px 1rem 1rem' }}>
        <h1>Privacy Policy</h1>
        <p>blah blah blah!</p>
      </main>
    </>
  );
}