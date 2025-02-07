"use client"; 

import { useState } from 'react';
import StudentNavbar from '@/components/StudentNavbar'; 

export default function StudentHomePage() {


  return (
    <>
      <StudentNavbar /> 
      <main style={{ padding: '120px 1rem 1rem' }}>
        <h1>Student Home</h1>
        <p>Welcome, Student! Here are the projects you can work on.</p>
      </main>
    </>
  );
}
