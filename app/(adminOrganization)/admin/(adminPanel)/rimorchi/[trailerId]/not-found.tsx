import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function PageNotFound() {
  return (
    <div className="h-[calc(100vh-132px)] w-full flex flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-semibold">Pagina non trovata</h1>
      <p className="text-muted-foreground text-sm">Potrebbe esserci un problema con il link</p>
      <Button asChild>
        <Link href={"/admin/rimorchi"}>Ritorna alla home</Link>
      </Button>
    </div>
  );
}

export default PageNotFound;
