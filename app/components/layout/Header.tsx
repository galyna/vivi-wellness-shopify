import React from "react";

const Header = () => (
  <header className="w-full py-4 px-8 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
    <div className="text-xl font-bold">Vivi Wellness</div>
    <nav>
      <ul className="flex gap-6 text-sm">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">About</a></li>
        <li><a href="#" className="hover:underline">Contact</a></li>
      </ul>
    </nav>
  </header>
);

export default Header; 