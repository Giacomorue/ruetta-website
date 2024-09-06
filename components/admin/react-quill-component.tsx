"use client";

import React from "react";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function ReactQuillComponent({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const modules = {
    toolbar: [
      [{ font: [] }], // Font size dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header sizes
      [{ align: [] }], // Text alignment
      ["bold", "italic", "underline", "strike"], // Bold, Italic, Underline, Strike-through
      [{ color: [] }, { background: [] }], // Font color and background color (highlight)
      [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
      [{ list: "ordered" }, { list: "bullet" }], // Lists (ordered/unordered)
      [{ indent: "-1" }, { indent: "+1" }], // Indent/outdent
      ["clean"], // Remove formatting button
    ],
  };


  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      className="h-[200px]"
      modules={modules}
    />
  );
}

export default ReactQuillComponent;
