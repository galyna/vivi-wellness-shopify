"use client";

import React, { useState, useEffect } from "react";

const Footer = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="w-full py-4 px-8 bg-mint border-t border-gray-200 text-center text-xs text-green-900 mt-8">
      © {year} Vivi Wellness. All rights reserved.
    </footer>
  );
};

export default Footer; 