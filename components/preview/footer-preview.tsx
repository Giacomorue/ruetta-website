import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import React from "react";

function FooterPrreview() {
  return (
    <footer className="w-full bg-white text-muted-foreground border-t">
      <div className="mx-auto max-w-[1600px] h-full md:px-3 lg:px-10 relative px-5 py-3 flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
        {/* Sezione Sinistra - Informazioni Legali */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex flex-col items-center lg:flex-row space-y-3 lg:space-y-0 lg:space-x-6 text-sm">
            <p className="cursor-pointer transition-all duration-150 hover:text-primary">
              Termini e Servizi
            </p>
            <p className="cursor-pointer transition-all duration-150 hover:text-primary">
              Privacy Policy
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            P.IVA: 12014180017 | info@ruetta.it
          </p>
        </div>

        {/* Sezione Centrale - Social Icons */}
        <div className="flex space-x-6">
          <FaInstagram className="w-6 h-6 transition-all duration-150 hover:text-primary cursor-pointer" />
          <FaTiktok className="w-6 h-6 transition-all duration-150 hover:text-primary cursor-pointer" />
          <FaFacebook className="w-6 h-6 transition-all duration-150 hover:text-primary cursor-pointer" />
        </div>

        {/* Sezione Destra - Logo */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Ruetta. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterPrreview;
