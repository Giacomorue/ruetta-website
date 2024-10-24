"use client";

import React, { useRef, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Category,
  Configuration,
  ConfigurationChange,
  ConfigurationChangeAction,
  ConfigurationValue,
  ConfigurationVisibilityCondition,
  Node,
  Selector,
  SelectorOption,
  SelectorOptionChange,
  SelectorOptionChangeAction,
  SelectorVisibilityCondition,
  Trailer,
  Variant,
} from "prisma/prisma-client";
import SelectorList from "./selector-list";
import Image from "next/image";
import NavbarPreview from "./navbar-preview";
import FooterPrreview from "./footer-preview";
import ImageCarouselPreview from "./image-carousel-preview";
// import ColorList from "./color-list";
import TrailerCanvas from "./TrailerCanvas";
import Mesh from "./Mesh";
import CanvasLoader from "../CanvasLoader";
import { FaArrowLeft, FaExpand } from "react-icons/fa6";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import ScrollToTopButton from "./ScrollToTop";
import DescriptionComponent from "./description-component";

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

const DEBOUNCE_TIME = 100;

// { variant }: { variant: VariantData }

function PreviewComponent({ accessibleUUID }: { accessibleUUID: string }) {
  const [variant, setVariant] = useState<VariantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessibleUUID) return;

    console.log("Fetching variant data...");

    const fetchData = async () => {
      try {
        setLoading(true); // Imposta lo stato di caricamento
        const response = await fetch(`/api/preview/${accessibleUUID}`, {
          method: "GET",
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch variant data");
        }

        const data = await response.json();
        setVariant(data); // Imposta i dati della variante
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false); // Fine caricamento
      }
    };

    fetchData();
  }, []);

  const router = useRouter();
  const [configurations, setConfigurations] = useState<
    { configurationId: string; valueId: string }[]
  >([]);

  useEffect(() => {
    if (!variant) return;

    const queryParams = new URLSearchParams(window.location.search);
    const updatedParams = new URLSearchParams();
    const updateConfigurations: Array<{
      configurationId: string;
      valueId: string;
    }> = [];

    variant.configurations.forEach((config) => {
      const currentUrlValue = queryParams.get(config.name);
      const isValidValue = config.values.some(
        (value) => value.value === currentUrlValue
      );

      if (currentUrlValue && isValidValue) {
        // Se esiste e il valore è valido, lo mantieni
        updatedParams.set(config.name, currentUrlValue);
        const configurationValueId = config.values.find(
          (v) => v.value === currentUrlValue
        )?.id;
        if (configurationValueId) {
          updateConfigurations.push({
            configurationId: config.id,
            valueId: configurationValueId,
          });
        }
      } else {
        // Altrimenti, imposta il valore di default
        const defaultValueId = config.defaultValue;
        const defaultValue = config.values.find(
          (value) => value.id === defaultValueId
        );

        if (defaultValue) {
          updatedParams.set(config.name, defaultValue.value);
          updateConfigurations.push({
            configurationId: config.id,
            valueId: defaultValue.id,
          });
        }
      }
    });

    setConfigurations(updateConfigurations);

    // Rimuovi le configurazioni non valide (non presenti in variant.configurations)
    queryParams.forEach((value, key) => {
      const isValidConfig = variant.configurations.some(
        (config) => config.name === key
      );
    });

    // Solo se ci sono cambiamenti rispetto all'URL attuale, aggiorna l'URL
    if (updatedParams.toString() !== queryParams.toString()) {
      console.log("Updating URL");
      const pathname = window.location.pathname;
      const url = `${pathname}?${updatedParams.toString()}`;
      router.replace(url);
    }
  }, [variant]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOptionClick = (
    selector: Selector,
    option: SelectorOption,
    configName: string
  ) => {
    if (!variant) return;

    const params = new URLSearchParams(window.location.search);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    configurations.forEach((conf) => {
      const config = variant.configurations.find(
        (c) => c.id === conf.configurationId
      );

      if (config) {
        const selectedValue = config.values.find(
          (value) => value.id === conf.valueId
        );
        if (selectedValue) {
          // Imposta il parametro URL per ciascuna configurazione
          params.set(config.name, selectedValue.value);
        }
      }
    });

    // Trova la configurazione associata al selettore
    const selectedConfiguration = variant.configurations.find(
      (config) => config.id === selector.configurationToRefer
    );

    if (selectedConfiguration) {
      changeConfiguration(
        selectedConfiguration.id,
        option.valueOfConfigurationToRefer,
        params
      );

      const completeSelectorOption = variant.selectors
        .find((s) => s.id === selector.id)
        ?.options.find((o) => o.id === option.id);

      if (completeSelectorOption) {
        CheckSelectorChange(completeSelectorOption, params);
      }

      // Costruisci l'URL completo come stringa
      const url = `${window.location.pathname}?${params.toString()}`;

      // Esegui `router.replace` con un leggero ritardo per permettere l'aggiornamento della UI
      timeoutRef.current = setTimeout(() => {
        router.replace(url, {
          scroll: false,
        });
      }, DEBOUNCE_TIME); // Debounce leggero
    }
  };

  const changeConfiguration = (
    configurationId: string,
    newValueId: string,
    params: URLSearchParams
  ) => {
    if (!variant) return;

    const configuration = variant.configurations.find(
      (c) => c.id === configurationId
    );
    const newValue = configuration?.values.find((v) => v.id === newValueId);

    if (!configuration || !newValue) {
      return null;
    }

    setConfigurations((prev) => {
      const updatedConf = [...(prev || [])];
      const index = updatedConf.findIndex(
        (conf) => conf.configurationId === configurationId
      );
      updatedConf[index] = {
        configurationId: configurationId,
        valueId: newValueId,
      };
      return updatedConf;
    });

    params.set(configuration.name, newValue.value);
  };

  const CheckSelectorChange = (
    selectorOption: SelectorOption & {
      selectorOptionChange: (SelectorOptionChange & {
        change: SelectorOptionChangeAction[];
        elseChange: SelectorOptionChangeAction[];
      })[];
    },
    params: URLSearchParams
  ) => {
    if (selectorOption.selectorOptionChange.length <= 0) {
      return null;
    }

    for (const change of selectorOption.selectorOptionFirstNode) {
      const currentSelectorOption = selectorOption.selectorOptionChange.find(
        (s) => change === s.id
      );

      if (!currentSelectorOption) {
        continue;
      }

      CheckSelectorChangeRec(selectorOption, currentSelectorOption, params);
    }
  };

  const CheckSelectorChangeRec = (
    selectorOption: SelectorOption & {
      selectorOptionChange: (SelectorOptionChange & {
        change: SelectorOptionChangeAction[];
        elseChange: SelectorOptionChangeAction[];
      })[];
    },
    currentSelectorOptionChange: SelectorOptionChange & {
      change: SelectorOptionChangeAction[];
      elseChange: SelectorOptionChangeAction[];
    },
    params: URLSearchParams
  ) => {
    if (currentSelectorOptionChange.haveIf) {
      const configurationValue = configurations.find(
        (c) => c.configurationId === currentSelectorOptionChange.configurationId
      );

      if (!configurationValue) {
        return null;
      }

      let checkTrue = false;

      if (currentSelectorOptionChange.checkType === "EQUAL") {
        checkTrue =
          configurationValue.valueId ===
          currentSelectorOptionChange.expectedValue;
      } else {
        checkTrue =
          configurationValue.valueId !==
          currentSelectorOptionChange.expectedValue;
      }

      console.log(checkTrue);

      //FARE AZIONI E RICORSIONE
      if (checkTrue) {
        //FARE AZIONI VERE
        if (currentSelectorOptionChange.change.length > 0) {
          for (const change of currentSelectorOptionChange.change) {
            changeConfiguration(
              change.configurationToChangeId,
              change.newValueValue ?? "",
              params
            );
          }
        }

        if (currentSelectorOptionChange.ifRecId.length > 0) {
          for (const ifRecId of currentSelectorOptionChange.ifRecId) {
            const currentSelectorOption =
              selectorOption.selectorOptionChange.find((s) => ifRecId === s.id);

            if (!currentSelectorOption) {
              continue;
            }

            CheckSelectorChangeRec(
              selectorOption,
              currentSelectorOption,
              params
            );
          }
        }
      } else {
        //FARE AZIONI FALSE
        if (currentSelectorOptionChange.elseChange.length > 0) {
          for (const change of currentSelectorOptionChange.elseChange) {
            changeConfiguration(
              change.configurationToChangeId,
              change.newValueValue ?? "",
              params
            );
          }
        }

        if (currentSelectorOptionChange.elseRecId.length > 0) {
          for (const elseRecId of currentSelectorOptionChange.elseRecId) {
            const currentSelectorOption =
              selectorOption.selectorOptionChange.find(
                (s) => elseRecId === s.id
              );

            if (!currentSelectorOption) {
              continue;
            }

            CheckSelectorChangeRec(
              selectorOption,
              currentSelectorOption,
              params
            );
          }
        }
      }
    } else {
      if (currentSelectorOptionChange.change.length > 0) {
        for (const change of currentSelectorOptionChange.change) {
          changeConfiguration(
            change.configurationToChangeId,
            change.newValueValue ?? "",
            params
          );
        }
      }
    }
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [shadowCounter, setShadowCounter] = useState(0);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setShadowCounter((prev) => prev + 1);
  }, [configurations, setIsClient]);

  if (!isClient || !variant)
    return (
      <div className="z-[100] flex flex-col items-center justify-center inset-0 bg-background/30 fixed top-0 left-0 h-[100vh] w-[100vw]">
        <ImSpinner2 className="animate-spin w-20 h-20 text-primary" />
      </div>
    );

  const haveSelectorVisible = variant.selectors.some((s) => s.visible === true);

  if (!haveSelectorVisible) {
    notFound();
  }

  // const hasColor = variant.colors.some((c) => c.visible === true);

  return (
    <div className="h-[100dvh] w-screen md:max-h-screen max-w-full bg-white flex flex-col">
      <NavbarPreview />

      {/* Layout per schermi lg e oltre */}
      <div
        className={`flex-1 flex flex-col lg:flex-row ${
          isFullScreen ? "" : "gap-6"
        } py-6 lg:overflow-hidden`}
      >
        {/* Blocco di sinistra */}
        <div
          className={`transition-all duration-150 w-full lg:h-auto ${
            isFullScreen
              ? "lg:w-[100%] h-[calc(100dvh-80px-80px-24px-24px)] pr-6"
              : "lg:w-[60%] h-[50dvh] pr-6 lg:pr-0"
          } flex items-center justify-center lg:rounded-r-[10px] overflow-hidden relative group pl-6`}
        >
          {variant.has3DModel ? (
            <div className="h-full w-full rounded-[10px] overflow-hidden relative">
              <TrailerCanvas shadowCounter={shadowCounter} variant={variant}>
                <>
                  {variant.fileUrl ? (
                    <Mesh
                      variant={variant}
                      configurations={configurations}
                      updateShadowCounter={() =>
                        setShadowCounter((prev) => prev + 1)
                      }
                    />
                  ) : (
                    <CanvasLoader />
                  )}
                </>
              </TrailerCanvas>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="absolute z-10 bottom-3 right-3 hidden group-hover:block"
              >
                <Button
                  className="p-1"
                  size={"icon"}
                  onClick={() => setIsFullScreen((prev) => !prev)}
                >
                  {!isFullScreen && (
                    <AiOutlineFullscreen className="w-10 h-10 " />
                  )}
                  {isFullScreen && (
                    <AiOutlineFullscreenExit className="w-10 h-10 " />
                  )}
                </Button>
              </motion.div>
            </div>
          ) : (
            <>
              {variant.images.length > 0 ? (
                <div className="w-full h-full relative lg:rounded-[10px] overflow-hidden">
                  <ImageCarouselPreview images={variant.images} />
                </div>
              ) : (
                <p>Non ha immagini</p>
              )}
            </>
          )}
        </div>

        {/* Blocco di destra */}
        <div
          className={`transition-all duration-150 w-full ${
            isFullScreen ? "lg:w-0" : "lg:w-[40%]"
          }`}
        >
          <div className="h-full p-6 lg:overflow-y-auto">
            <div className="flex flex-row items-center gap-2">
              <FaArrowLeft
                className="w-8 h-8 cursor-pointer"
                onClick={() => router.back()}
              />
              <h1 className="text-[48px] font-semibold">{variant.name}</h1>
            </div>
            {/* <div className="text-[16px] text-muted-foreground pt-1"> */}
              <DescriptionComponent description={variant.description ?? ""} />
            {/* </div> */}
            <div className="w-full h-[1px] bg-muted-foreground my-8" />
            {/* {hasColor && color && (
              <>
                <h1 className="text-[32px]">Colore</h1>
                <div className="text-[16px] text-muted-foreground pb-4 pt-1">
                  Scegli il colore più adatto secondo i tuoi gusti per il
                  rimorchio {variant.name}
                </div>
                <ColorList
                  activeColorId={color?.id}
                  onColorClick={(color) => handleClickColor(color)}
                  variant={variant}
                />
                <div className="w-full h-[1px] bg-muted-foreground my-8" />
              </>
            )} */}
            <SelectorList
              variant={variant}
              onOptionClick={handleOptionClick}
              configurations={configurations}
            />
            <ScrollToTopButton />
          </div>
        </div>
      </div>

      <FooterPrreview />
    </div>
  );
}

export default PreviewComponent;
