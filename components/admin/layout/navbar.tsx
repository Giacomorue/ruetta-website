import Image from "next/image";
import React from "react";
import SearchAdmin from "./search-admin";
import { IoMdNotifications } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { MdOutlinePendingActions } from "react-icons/md";

function Navbar() {
  return (
    <div className="h-20 w-[100vw] border-b fixed top-0 flex flex-row items-center justify-center bg-white xl:pl-72 lg:pl-52 md:pl-36 z-10">
      <div className="h-full flex flex-row items-center md:w-[70%] w-full max-w-[1000px] md:gap-10 gap-4 ml-14 mr-6 md:ml-0 md:mr-0">
        <SearchAdmin />
        <div className="flex flex-row items-center justify-center md:gap-5 gap-2">
          <Button
            className="rounded-full w-12 h-12 p-0 text-primary hover:bg-primary hover:text-background transition-all duration-150"
            variant={"secondary"}
          >
            <IoMdNotifications className="w-6 h-6" />
          </Button>
          <Button
            className="rounded-full w-12 h-12 p-0 text-primary hover:bg-primary hover:text-background transition-all duration-150"
            variant={"secondary"}
          >
            <MdOutlinePendingActions className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
