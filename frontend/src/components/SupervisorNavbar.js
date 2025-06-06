import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function SupervisorNavbar() {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen(!navOpen);

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove userId from local storage
  };

  return (
    <div className="fixed top-0 w-full h-[100px] flex justify-between items-center px-4 bg-[var(--background)] text-[var(--text)] z-50 shadow">
      {/* Trinity Logo */}
      <div>
        <img
          src="/Trinity.jpg"
          alt="Trinity Logo"
          className="h-22 max-h-[100px] w-auto"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex">
        <li className="px-4">
          <Link href="/addProject">Add Project</Link>
        </li>
        <li className="px-4">
          <Link href="/manage-candidates">Manage Candidates</Link>
        </li>
        <li className="px-4">
          <Link href="/" onClick={handleLogout}>
            Logout
          </Link>
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
          <Link href="/addProject" onClick={toggleNav}>
            Add Project
          </Link>
        </li>
        <li className="py-6 text-4xl">
          <Link href="/manage-candidates" onClick={toggleNav}>
            Manage Candidates
          </Link>
        </li>
        <li className="py-6 text-4xl">
          <Link
            href="/"
            onClick={() => {
              toggleNav();
              handleLogout();
            }}
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
