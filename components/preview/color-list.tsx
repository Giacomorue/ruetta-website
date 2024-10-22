// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   Category,
//   Colors,
//   Configuration,
//   ConfigurationChange,
//   ConfigurationChangeAction,
//   ConfigurationValue,
//   ConfigurationVisibilityCondition,
//   Image,
//   Node,
//   Selector,
//   SelectorOption,
//   SelectorOptionChange,
//   SelectorOptionChangeAction,
//   SelectorVisibilityCondition,
//   Trailer,
//   Variant,
// } from "prisma/prisma-client";
// import ImageL from "next/image";

// export type VariantData = Variant & {
//   nodes: (Node & {
//     configurationChangeAction: ConfigurationChangeAction[];
//   })[];
//   configurations: (Configuration & {
//     values: (ConfigurationValue & {
//       configurationChange: (ConfigurationChange & {
//         change: ConfigurationChangeAction[];
//         elseChange: ConfigurationChangeAction[];
//       })[];
//     })[];
//     configurationVisibilityCondition: ConfigurationVisibilityCondition[];
//   })[];
//   colors: Colors[];
//   selectors: (Selector & {
//     options: (SelectorOption & {
//       selectorOptionChange: (SelectorOptionChange & {
//         change: SelectorOptionChangeAction[];
//         elseChange: SelectorOptionChangeAction[];
//       })[];
//     })[];
//     selectorVisibilityCondition: SelectorVisibilityCondition[];
//   })[];
// };

// interface SelectorListProps {
//   variant: VariantData;
//   activeColorId: string;
//   onColorClick: (color: Colors) => void;
// }

// function RenderColorPreview({
//   primary,
//   secondary,
//   hasSecondaryColor,
// }: {
//   primary: string;
//   secondary?: string;
//   hasSecondaryColor?: boolean;
// }) {
//   return (
//     <div className="flex items-center gap-4">
//       {hasSecondaryColor ? (
//         <div
//           className="relative w-8 h-8 rounded-full border border-border"
//           style={{
//             background: `linear-gradient(210deg, ${primary} 50%, ${secondary} 50%)`,
//             boxShadow:
//               "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
//           }}
//         >
//           <div
//             className="absolute inset-0 rounded-full"
//             style={{
//               background:
//                 "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
//               maskImage: "radial-gradient(circle, black 60%, transparent 70%)",
//             }}
//           />
//         </div>
//       ) : (
//         <div
//           className="relative w-8 h-8 rounded-full border border-border"
//           style={{
//             backgroundColor: primary,
//             boxShadow:
//               "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
//           }}
//         >
//           <div
//             className="absolute inset-0 rounded-full"
//             style={{
//               background:
//                 "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
//               maskImage: "radial-gradient(circle, black 60%, transparent 70%)",
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// function ColorList({
//   variant,
//   activeColorId,
//   onColorClick,
// }: SelectorListProps) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) return null;

//   return (
//     <div className="grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
//       {variant.colors.map((color) => {
//         if (!color.visible) return null;

//         if(variant.has3DModel){
//             if(color.has3DModel === false){
//                 return null;
//             }
//         }
//         else{
//             if(color.has3DModel === true){
//                 return null;
//             }
//         }

//         const isSelected = color.id === activeColorId;

//         return (
//           <div
//             key={color.id}
//             onClick={() => onColorClick(color)}
//             className={`relative w-full p-7 rounded-lg flex items-center justify-center cursor-pointer border ${
//               isSelected
//                 ? "border-red-600"
//                 : "border-neutral-300 hover:border-red-600"
//             }`}
//           >
//             {/* <div className="w-[1px] h-full absolute top-0 left-1/2 -translate-x-1/2 bg-primary"></div> */}
//             {/* Contenitore flessibile per il pallino e il testo */}
//             <div className="absolute top-1/2 -translate-y-1/2 -translate-x-[18px]">
//               <div className="flex items-center gap-3">
//                 {/* Usa gap molto piccolo */}
//                 {/* RenderColorPreview per creare il pallino di colore */}
//                 <RenderColorPreview
//                   primary={color.colorCodePrincipal}
//                   secondary={color.colorCodeSecondary}
//                   hasSecondaryColor={color.hasSecondaryColor}
//                 />
//                 {/* Testo vicino al pallino */}
//                 <h3
//                   className={`font-semibold max-w-[100px] truncate text-lg ${
//                     isSelected ? "text-red-600" : "text-neutral-800"
//                   }`}
//                 >
//                   {color.name}
//                 </h3>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default ColorList;
