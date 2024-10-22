"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const DescriptionComponent = ({ description }: { description?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const isInView = useInView(descriptionRef);

  // Collapse the description when it's not in view
  useEffect(() => {
    if (!isInView && isExpanded) {
      setIsExpanded(false);
    }
  }, [isInView, isExpanded]);

  return (
    <div className="pt-1 text-[16px] text-muted-foreground">
      <motion.div
        ref={descriptionRef}
        initial={false}
        animate={{
          height: isExpanded ? "auto" : "150px", // Adjust height for collapsed/expanded state
          opacity: isExpanded ? 1 : 0.8,
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }} // Smooth transition
        layout
        className={`overflow-hidden relative`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }} // Fade-in effect for text
        >
          <div dangerouslySetInnerHTML={{ __html: description ?? "" }} />
        </motion.div>
      </motion.div>
      <motion.span
        className="text-sm underline transition-all duration-150 cursor-pointer text-muted-foreground hover:text-primary"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }} // Slight scale on hover for feedback
        whileTap={{ scale: 0.95 }} // Slight scale down on click
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {isExpanded ? "Mostra meno" : "Maggiori informazioni"}
      </motion.span>
    </div>
  );
};

export default DescriptionComponent;
