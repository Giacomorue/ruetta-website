"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion } from "framer-motion";

function NavbarPreview() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <div className="w-full min-h-[80px] border-b border-border shadow-sm flex items-center justify-center">
      <div className="w-full max-w-[1600px] h-full flex flex-row items-center justify-between px-5 md:px-3 lg:px-10 relative">
        <Image
          src={"/logo.png"}
          alt="Logo"
          height={60}
          width={150}
          className="cursor-pointer z-10"
        />

        {/* Desktop button */}
        <div className="bg-primary text-primary-foreground text-[16px]  py-2 shadow-sm transition-all duration-150 hover:bg-primary/90 cursor-pointer z-10 hidden md:flex h-12 rounded-[10px] px-8 text-center flex-col items-center justify-center">
          Contattaci
        </div>

        {/* Mobile hamburger menu */}
        <div className="flex md:hidden transition-all duration-100 hover:opacity-80 cursor-pointer">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Menu className="w-8 h-8" />
            </SheetTrigger>

            {/* Open Sheet from right side */}
            <SheetContent side="right" className="p-0 w-3/4 sm:w-[300px]">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6 p-6 h-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <Image
                    src={"/logo.png"}
                    alt="Logo"
                    height={60}
                    width={150}
                    className="cursor-pointer z-10"
                  />
                  {/* <SheetClose asChild>
                    <Menu className="w-8 h-8 text-red-600 cursor-pointer" />
                  </SheetClose> */}
                </div>

                <nav className="flex flex-col gap-4 text-lg text-right">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="#"
                    className="text-muted-foreground"
                  >
                    Home
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="#"
                    className="text-muted-foreground"
                  >
                    Chi Siamo
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="#"
                    className="text-muted-foreground"
                  >
                    Rimorchi
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="#"
                    className="text-muted-foreground"
                  >
                    Usato
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="#"
                    className="text-muted-foreground"
                  >
                    Post
                  </motion.a>
                </nav>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <div className="absolute w-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex-row items-center justify-center gap-[20px] lg:gap-[35px] xl:gap-[50px] text-muted-foreground text-lg hidden md:flex">
          <p className="cursor-pointer">Home</p>
          <p className="cursor-pointer">Chi Siamo</p>
          <p className="cursor-pointer">Rimorchi</p>
          <p className="cursor-pointer">Usato</p>
          <p className="cursor-pointer">Post</p>
        </div>
      </div>
    </div>
  );
}

export default NavbarPreview;
