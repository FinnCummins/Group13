import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export default function StudentNavbar() {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen(!navOpen);

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Remove userId from local storage
    localStorage.removeItem('projectId'); // Remove projectId from local storage
  };

  const handleNavClick = () => {
    localStorage.removeItem('projectId'); // Remove projectId from local storage
    toggleNav();
  };

  return (
    <div className="fixed top-0 w-full h-[100px] flex justify-between items-center px-4 bg-[var(--background)] text-[var(--text)] z-50 shadow">
      {/* Trinity Logo */}
      <div>
        <img src="/Trinity.jpg" alt="Trinity Logo" className="h-22 max-h-[100px] w-auto" />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex">
        <li className="px-4">
          <Link href="/status" onClick={handleNavClick}>Proposal Status</Link>
        </li>
        <li className="px-4">
          <Link href="/dashboard" onClick={handleNavClick}>Final Project Dashboard</Link>
        </li>
        <li className="px-4">
          <Link href="/" onClick={handleLogout}>Logout</Link>
        </li>
      </ul>

      {/* Hamburger Icon for Mobile */}
      <div onClick={toggleNav} className="md:hidden z-10 cursor-pointer">
        {!navOpen ? <FaBars size={30} /> : <FaTimes size={30} />}
      </div>

      {/* Mobile Menu */}
      <ul
        className={
          !navOpen
            ? "hidden"
            : "absolute top-0 left-0 w-full h-screen bg-[var(--background)] text-[var(--text)] flex flex-col justify-center items-center"
        }
      >
        <li className="py-6 text-4xl">
          <Link href="/status" onClick={toggleNav}>
          Proposal Status
          </Link>
        </li>
        <li className="py-6 text-4xl">
          <Link href="/dashboard" onClick={toggleNav}>
          Final Project Dashboard
          </Link>
        </li>
        <li className="py-6 text-4xl">
          <Link href="/" onClick={() => { toggleNav(); handleLogout(); }}>Logout</Link>
        </li>
      </ul>
    </div>
  );
}
