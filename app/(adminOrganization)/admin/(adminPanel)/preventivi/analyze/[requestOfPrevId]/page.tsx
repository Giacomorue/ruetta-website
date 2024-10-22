import AnalyzePage from "@/components/admin/preventivi/analyze/analyze-page";
import PDFForm from "@/components/pdf-test/pdf-form";
import React from "react";

function Page({
  params: { requestOfPrevId },
}: {
  params: { requestOfPrevId: string };
}) {
  return <AnalyzePage requestOfPrevId={requestOfPrevId} />;

  // return <PDFForm />;
}

export default Page;
