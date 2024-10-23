"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Category,
  Configuration,
  ConfigurationChange,
  ConfigurationChangeAction,
  ConfigurationValue,
  ConfigurationVisibilityCondition,
  Image,
  Node,
  Selector,
  SelectorOption,
  SelectorOptionChange,
  SelectorOptionChangeAction,
  SelectorVisibilityCondition,
  Trailer,
  Variant,
} from "prisma/prisma-client";
import ImageL from "next/image";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdBlock } from "react-icons/md";
import MoreInfoModal from "./more-info-modal";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export type VariantData = Variant & {
  nodes: (Node & {
    configurationChangeAction: ConfigurationChangeAction[];
  })[];
  configurations: (Configuration & {
    values: (ConfigurationValue & {
      configurationChange: (ConfigurationChange & {
        change: ConfigurationChangeAction[];
        elseChange: ConfigurationChangeAction[];
      })[];
    })[];
    configurationVisibilityCondition: ConfigurationVisibilityCondition[];
  })[];
  selectors: (Selector & {
    options: (SelectorOption & {
      selectorOptionChange: (SelectorOptionChange & {
        change: SelectorOptionChangeAction[];
        elseChange: SelectorOptionChangeAction[];
      })[];
    })[];
    selectorVisibilityCondition: SelectorVisibilityCondition[];
  })[];
};

function RenderColorPreview({
  primary,
  secondary,
  hasSecondaryColor,
}: {
  primary: string;
  secondary?: string;
  hasSecondaryColor?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      {hasSecondaryColor ? (
        <div
          className="relative w-8 h-8 rounded-full border border-border"
          style={{
            background: `linear-gradient(210deg, ${primary} 50%, ${secondary} 50%)`,
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
              maskImage: "radial-gradient(circle, black 60%, transparent 70%)",
            }}
          />
        </div>
      ) : (
        <div
          className="relative w-8 h-8 rounded-full border border-border"
          style={{
            backgroundColor: primary,
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
              maskImage: "radial-gradient(circle, black 60%, transparent 70%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

interface SelectorListProps {
  variant: VariantData;
  configurations: { configurationId: string; valueId: string }[];
  onOptionClick: (
    selector: Selector,
    option: SelectorOption,
    configName: string
  ) => void;
}

function SelectorList({
  variant,
  configurations,
  onOptionClick,
}: SelectorListProps) {
  // const router = useRouter();

  // const searchParams = useSearchParams();

  // const [configurations, setConfigurations] = useState<{configurationId: string; valueId: string;}[]>();

  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   const updateConfigurations: Array<{configurationId: string; valueId: string;}> = [];

  //   variant.configurations.forEach((configuration) => {

  //     const configurationValue = params.get(configuration.name);

  //     if(!configurationValue){
  //       updateConfigurations.push({configurationId: configuration.id, valueId: configuration.defaultValue??""});
  //     }

  //     const configurationValueId = configuration.values.find((v) => v.value === configurationValue)?.id;

  //     if(!configurationValueId){
  //       updateConfigurations.push({configurationId: configuration.id, valueId: configuration.defaultValue??""});
  //     }
  //     else{
  //       updateConfigurations.push({configurationId: configuration.id, valueId: configurationValueId});
  //     }

  //   });

  //   setConfigurations(updateConfigurations);
  // }, [searchParams, variant]);

  // useEffect(() => {
  //   console.log("configurations", configurations);
  // }, [configurations]);

  // const handleOptionClick = (
  //   selector: Selector,
  //   option: SelectorOption,
  //   configName: string
  // ) => {
  //   const params = new URLSearchParams(searchParams.toString());

  //   // Trova il nome del valore che corrisponde all'ID del valore associato all'opzione
  //   const selectedConfiguration = variant.configurations.find(
  //     (config) => config.id === selector.configurationToRefer
  //   );

  //   if (selectedConfiguration) {
  //     const matchingValue = selectedConfiguration.values.find(
  //       (value) => value.id === option.valueOfConfigurationToRefer
  //     );

  //     if (matchingValue) {
  //       // Aggiorna lo stato locale
  //       setConfigurations((prev) => {
  //         const updatedConf = [...(prev || [])];
  //         const index = updatedConf.findIndex(
  //           (conf) => conf.configurationId === selectedConfiguration.id
  //         );
  //         updatedConf[index] = {
  //           configurationId: selectedConfiguration.id,
  //           valueId: option.valueOfConfigurationToRefer,
  //         };
  //         return updatedConf;
  //       });

  //       // Aggiorna l'URL dopo l'aggiornamento dello stato locale
  //       params.set(configName, matchingValue.value);

  //       // Costruisci l'URL completo come stringa
  //       const url = `${window.location.pathname}?${params.toString()}`;

  //       // Esegui `router.replace` con un leggero ritardo per permettere l'aggiornamento della UI
  //       setTimeout(() => {
  //         router.replace(url, {
  //           scroll: false,
  //         });
  //       }, 50); // Debounce leggero di 50ms
  //     }
  //   }
  // };

  const [isClient, steIsClient] = useState(false);

  useEffect(() => {
    steIsClient(true);
  }, []);

  if (!isClient) return null;

  const checkVisibilityCondition = (
    selector: Selector & {
      options: (SelectorOption & {
        selectorOptionChange: (SelectorOptionChange & {
          change: SelectorOptionChangeAction[];
          elseChange: SelectorOptionChangeAction[];
        })[];
      })[];
      selectorVisibilityCondition: SelectorVisibilityCondition[];
    }
  ) => {
    if (
      selector.visibilityConditionId === null ||
      selector.visibilityConditionId === "" ||
      selector.visibilityConditionId.length <= 0
    )
      return true;

    const visibilityCondition = selector.selectorVisibilityCondition.find(
      (v) => v.id === selector.visibilityConditionId
    );

    if (!visibilityCondition) {
      return true;
    }

    return checkVisibilityConditionRecursive(selector, visibilityCondition);
  };

  const checkVisibilityConditionRecursive = (
    selector: Selector & {
      options: (SelectorOption & {
        selectorOptionChange: (SelectorOptionChange & {
          change: SelectorOptionChangeAction[];
          elseChange: SelectorOptionChangeAction[];
        })[];
      })[];
      selectorVisibilityCondition: SelectorVisibilityCondition[];
    },
    selectorVisibilityCondition: SelectorVisibilityCondition
  ) => {
    if (!selectorVisibilityCondition) {
      return true;
    }

    //Ottengo la configurazione che corrisponde alla visibilità del selettore
    const configuration = variant.configurations.find(
      (c) => c.id === selectorVisibilityCondition.configurationId
    );

    if (!configuration) {
      return true;
    }

    //Ottengo il valore associato alla visibilità del selettore
    const configurationValue = configuration.values.find(
      (v) => v.id === selectorVisibilityCondition.expectedValue
    );

    if (!configurationValue) {
      return true;
    }

    //Ottengo il valore corrente della configurazione nella URL
    const currentConfigurationValueCurrent = configurations.find(
      (c) => c.configurationId === configuration.id
    )?.valueId;

    if (!currentConfigurationValueCurrent) {
      return true;
    }

    //Ottengo l'id del valore corrente nella URL

    let checkTrue = false;

    if (selectorVisibilityCondition.checkType === "EQUAL") {
      checkTrue = currentConfigurationValueCurrent === configurationValue.id;
    } else {
      checkTrue = currentConfigurationValueCurrent !== configurationValue.id;
    }

    if (checkTrue) {
      if (
        selectorVisibilityCondition.ifRecId === null ||
        selectorVisibilityCondition.ifRecId === ""
      ) {
        return selectorVisibilityCondition.ifVisible;
      } else {
        const newSelectorVisibilityCondition =
          selector.selectorVisibilityCondition.find(
            (v) => v.id === selectorVisibilityCondition.ifRecId
          );

        if (!newSelectorVisibilityCondition) {
          return selectorVisibilityCondition.ifVisible;
        } else {
          return checkVisibilityConditionRecursive(
            selector,
            newSelectorVisibilityCondition
          );
        }
      }
    } else {
      if (
        selectorVisibilityCondition.elseRecId === null ||
        selectorVisibilityCondition.elseRecId === ""
      ) {
        return selectorVisibilityCondition.elseVisible;
      } else {
        const newSelectorVisibilityCondition =
          selector.selectorVisibilityCondition.find(
            (v) => v.id === selectorVisibilityCondition.elseRecId
          );

        if (!newSelectorVisibilityCondition) {
          return selectorVisibilityCondition.elseVisible;
        } else {
          return checkVisibilityConditionRecursive(
            selector,
            newSelectorVisibilityCondition
          );
        }
      }
    }
  };

  return (
    <>
      {variant.selectors.map((selector, index) => {
        const realSelector = variant.selectors.find(
          (s) => s.id === selector.id
        );

        if (!realSelector) return null;

        if (realSelector.visible == false) return null;

        const visibilityConditionResult =
          checkVisibilityCondition(realSelector);

        if (visibilityConditionResult === false) return null;

        const configurationValue = configurations?.find(
          (c) => c.configurationId === selector.configurationToRefer
        );

        const configuration = variant.configurations.find(
          (c) => c.id === selector.configurationToRefer
        );

        if (
          !configuration ||
          !configurationValue ||
          configuration.id !== configurationValue.configurationId
        )
          return null;

        return (
          <motion.div
            key={index}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
          >
            <h1 className="text-[32px]">{selector.name}</h1>
            <div
              className={`text-[16px] text-muted-foreground pt-1 ${selector.moreInfoModal ? "" : "pb-4"}`}
              dangerouslySetInnerHTML={{ __html: selector.description ?? "" }}
            />
            {selector.moreInfoModal && (
              <div className="mt-0 pb-5">
                <MoreInfoModal
                  name={selector.name}
                  description={selector.moreInfoDescription}
                  images={selector.moreInfoImages}
                />
              </div>
            )}
            <div className="grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
              {realSelector.options.map((option) => {
                if (option.visible === false) return null;

                const isSelected =
                  configurationValue.valueId ===
                  option.valueOfConfigurationToRefer;

                if (selector.isColorSelector) {
                  return (
                    <motion.div
                      key={option.id}
                      onClick={() =>
                        onOptionClick(selector, option, configuration?.name)
                      }
                      className={`relative w-full p-7 rounded-lg flex items-center justify-center cursor-pointer border ${
                        isSelected
                          ? "border-red-600"
                          : "border-neutral-300 hover:border-red-600"
                      }`}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.1 }}
                    >
                      {/* Contenuto per il selettore colore */}
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-[18px]">
                        <div className="flex items-center gap-3">
                          <RenderColorPreview
                            primary={option.colorCodePrincipal}
                            secondary={option.colorCodeSecondary}
                            hasSecondaryColor={option.hasSecondaryColor}
                          />
                          <h3
                            className={`font-semibold max-w-[200px] truncate text-lg ${
                              isSelected ? "text-red-600" : "text-neutral-800"
                            }`}
                          >
                            {option.label}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  );
                } else {
                  return (
                    <motion.div
                      key={option.id}
                      onClick={() =>
                        onOptionClick(selector, option, configuration?.name)
                      }
                      className={`relative rounded-[10px] shadow-lg cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground outline-2 outline outline-primary"
                          : "bg-white outline-2 outline outline-muted-foreground hover:border-primary"
                      }`}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <div className="relative w-full h-[200px] mb-4 rounded-t-[10px] overflow-hidden">
                        {option.block && (
                          <div className="shrink-0 w-full h-full absolute top-0 left-0 z-40 bg-white/50 flex flex-col items-center justify-center">
                            <MdBlock className="w-28 h-28 text-secondary-foreground/70" />
                          </div>
                        )}
                        <ImageL
                          className="object-cover"
                          src={option.images[0] ?? "/default-image.png"}
                          alt={option.label}
                          fill
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                        )}
                      </div>
                      <div className="px-4 pb-4">
                        <div className="z-20">
                          <h3
                            className={`font-semibold text-lg ${
                              isSelected ? "text-primary-foreground" : ""
                            }`}
                          >
                            {option.label}
                          </h3>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: option.modalDescription,
                            }}
                            className={`text-sm line-clamp-3 max-h-[60px] min-h-[60px] ${
                              isSelected
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            }`}
                          ></p>
                        </div>
                        <div
                          className="mt-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreInfoModal
                            images={option.images}
                            name={option.label}
                            description={option.modalDescription}
                            isSelected={isSelected}
                            onSelect={() =>
                              onOptionClick(
                                selector,
                                option,
                                configuration?.name
                              )
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              })}
            </div>
            <div className="w-full h-[1px] bg-muted-foreground my-10" />
          </motion.div>
        );
      })}
    </>
  );
}

export default SelectorList;
