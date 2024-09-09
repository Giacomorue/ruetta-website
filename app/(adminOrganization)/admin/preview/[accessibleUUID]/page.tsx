import PreviewComponent from "@/components/preview/preview-component";
import {
  GetVariantDataByAccessibleUUID,
} from "@/data/trailer";
import { notFound } from "next/navigation";
import React from "react";

async function Page({
  params: { accessibleUUID },
}: {
  params: { accessibleUUID: string };
}) {
  // const variant = await GetVariantDataByAccessibleUUID(accessibleUUID);

  // if (!variant) {
  //   notFound();
  // }

  // const haveSelectorVisible = variant.selectors.some((s) => s.visible === true);

  // if(!haveSelectorVisible) {
  //   notFound();
  // }

  // variant={variant}

  return <PreviewComponent accessibleUUID={accessibleUUID} />;
}

export default Page;
