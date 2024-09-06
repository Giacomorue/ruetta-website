import React from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

function HeaderBar({
  title,
  children,
  subtitle,
  possibleBackButton,
}: {
  title: string;
  children?: React.ReactNode;
  subtitle?: boolean;
  possibleBackButton?: React.ReactElement;
}) {
  return (
    <div className="w-full">
      <div className="w-full flex sm:flex-row flex-col items-center justify-between gap-3 sm:gap-0">
        <div className="flex flex-row items-center gap-x-3">
          {possibleBackButton}
          <h1
            className={`${
              !subtitle
                ? "text-2xl md:text-4xl font-bold"
                : "text-lg md:text-2xl font-medium mt-5 text-neutral-700"
            }  line-clamp-1`}
          >
            {title}
          </h1>
        </div>
        {children}
      </div>
      <Separator className="my-3" />
    </div>
  );
}

export default HeaderBar;
