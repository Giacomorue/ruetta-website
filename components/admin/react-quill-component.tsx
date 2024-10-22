"use client";

import React from "react";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function ReactQuillComponent({
  value,
  onChange,
  big,
  onBlur,
  onFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  big?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
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
      className={!!big ? "h-[500px]" : "h-[200px]"}
      modules={modules}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}

export default ReactQuillComponent;
