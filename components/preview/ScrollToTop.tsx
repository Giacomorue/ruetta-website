"use client"

import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { motion } from "framer-motion";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostra il pulsante quando l'utente scorre verso il basso di una certa distanza
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50"
    >
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-3 rounded-[10px] bg-primary text-primary-foreground shadow-lg hover:bg-primary/80 focus:outline-none"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}
    </motion.div>
  );
};

export default ScrollToTopButton;