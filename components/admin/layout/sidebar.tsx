"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImExit, ImHome } from "react-icons/im";
import { RiFilePaper2Fill, RiInstagramFill } from "react-icons/ri";
import { FaImage, FaTrailer } from "react-icons/fa6";
import { IoClose, IoDesktop } from "react-icons/io5";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { signOut } from "next-auth/react";
import { FaCalendarAlt, FaTasks } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { motion } from "framer-motion";

const links = [
  { name: "Home", href: "/", Icon: ImHome },
  {
    name: "Preventivi",
    href: "/preventivi",
    Icon: RiFilePaper2Fill,
  },
  { name: "Rimorchi", href: "/rimorchi", Icon: FaTrailer },
  { name: "Sito", href: "/sito", Icon: IoDesktop },
  { name: "Post", href: "/post", Icon: RiInstagramFill },
  { name: "Immagini", href: "/immagini", Icon: FaImage },
  // { name: "Calendario", href: "/calendario", Icon: FaCalendarAlt },
  // { name: "Attività", href: "/attivita", Icon: FaTasks },
];

function SideBar() {
  const adminLoader = useAdminLoader();
  const pathName = usePathname();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    console.log(pathName);
  }, [pathName])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="max-h-full h-full overflow-hidden xl:min-w-72 lg:min-w-52 md:w-36 md:flex flex-col hidden bg-primary text-primary-foreground rounded-r-2xl py-6 transition-all duration-150 ease-linear fixed top-0 z-[20]">
        <h1 className="lg:text-3xl xl:text-4xl text-2xl font-extrabold lg:px-7 text-center lg:text-start">
          Ruetta
        </h1>
        <div className="flex-grow mt-20 px-3 flex flex-col gap-3">
          {links.map(({ href, name, Icon }, i) => {
            let isActive = pathName.split("/").includes(href.split("/").at(1) || href);

            if (i === 0 && !isActive && pathName.split("/").length == 2) {
              isActive = true;
            }

            return (
              <Link
                key={i}
                href={"/admin" + href}
                className={`flex flex-row items-center w-full lg:justify-start justify-center gap-4 h-14 rounded-2xl hover:text-primary px-4 transition-all duration-150 ease-in-out ${
                  isActive
                    ? "bg-background text-primary"
                    : "hover:bg-background/40 hover:text-background"
                }`}
              >
                <Icon className="w-6 h-6" />{" "}
                <p className="xl:text-xl lg:text-lg hidden lg:inline-block font-medium">
                  {name}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="px-7">
          <Button
            className="w-full bg-background/40 rounded-2xl"
            size={"lg"}
            onClick={async () => {
              adminLoader.startLoading();
              await signOut();
              adminLoader.stopLoading();
            }}
          >
            <div className="flex flex-row items-center w-full lg:justify-start justify-center  gap-4">
              <ImExit className="w-6 h-6" />{" "}
              <p className="xl:text-xl lg:text-lg hidden lg:inline-block font-semibold">
                Esci
              </p>
            </div>
          </Button>
        </div>
      </aside>

      {/* Mobile button */}
      <div
        className="fixed left-2 top-4 cursor-pointer z-[20] rounded-full w-12 h-12 p-0  md:hidden hover:bg-muted flex flex-col items-center justify-center"
        onClick={() => {
          setIsMobileNavOpen((prev) => true);
        }}
      >
        <IoMenu className="w-8 h-8" />
      </div>

      {/* Mobile navbar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMobileNavOpen ? "0%" : "-100%" }}
        transition={{ ease: "linear" }}
        className="h-full w-full bg-primary z-[20] py-6 flex flex-col fixed top-0"
      >
        <div
          className="fixed left-2 top-4 cursor-pointer z-[20] rounded-full w-12 h-12 p-0  md:hidden hover:bg-background/30 flex flex-col items-center justify-center"
          onClick={() => {
            setIsMobileNavOpen((prev) => false);
          }}
        >
          <IoClose className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-background text-center font-extrabold text-3xl">
          Ruetta
        </h1>
        <div className="flex-grow mt-12 px-3 flex flex-col gap-3">
          {links.map(({ href, name, Icon }, i) => {
            let isActive = pathName.split("/").includes(href.split("/").at(1) || href);

            if (i === 0 && !isActive && pathName.split("/").length == 2) {
              isActive = true;
            }

            return (
              <Link
                key={i}
                href={"/admin" + href}
                className={`flex flex-row items-center w-full lg:justify-start justify-center gap-4 h-14 rounded-2xl hover:text-primary px-3 transition-all duration-150 ease-in-out ${
                  isActive
                    ? "bg-background text-primary"
                    : "hover:bg-background/40 hover:text-background text-white"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Icon className="w-6 h-6" />{" "}
                <p className="text-xl font-bold">
                  {name}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="px-6">
          <Button
            className="w-full bg-background/40 rounded-2xl"
            size={"lg"}
            onClick={async () => {
              setIsMobileNavOpen(false);
              adminLoader.startLoading();
              await signOut();
              adminLoader.stopLoading();
            }}
          >
            <div className="flex flex-row items-center w-full lg:justify-start justify-center  gap-4">
              <ImExit className="w-6 h-6" />{" "}
              <p className="text-xl font-semibold">
                Esci
              </p>
            </div>
          </Button>
        </div>
      </motion.div>
    </>
  );
}

export default SideBar;
