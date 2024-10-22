"use client";

import { useAdminLoader } from "@/hooks/useAdminLoader";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";
import { Prisma, Person } from "prisma/prisma-client";
import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../../header-bar";
import { Button } from "@/components/ui/button";
import { IoArrowBack, IoTrash } from "react-icons/io5";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Reorder } from "framer-motion";
import { MdMenu } from "react-icons/md";
import { ConfigurationVisibilityCondition } from "prisma/prisma-client";
import ReactQuillComponent from "../../react-quill-component";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

type RequestOfPrevType = Prisma.RequestOfPrevGetPayload<{
  include: {
    person: true;
    variant: true;
  };
}>;

type VariantType = Prisma.VariantGetPayload<{
  include: {
    nodes: {
      include: {
        configurationChangeAction: true;
      };
    };
    configurations: {
      orderBy: { order: "asc" };
      include: {
        values: {
          include: {
            configurationChange: {
              include: {
                change: true;
                elseChange: true;
              };
            };
          };
        };
        configurationVisibilityCondition: true;
      };
    };
    selectors: {
      orderBy: { order: "asc" };
      include: {
        options: {
          orderBy: { order: "asc" };
          include: {
            selectorOptionChange: {
              include: {
                change: true;
                elseChange: true;
              };
            };
          };
        };
        selectorVisibilityCondition: true;
      };
    };
  };
}>;

type ConfigurazioniType = Prisma.ConfigurationGetPayload<{
  orderBy: { order: "asc" };
  include: {
    values: {
      include: {
        configurationChange: {
          include: {
            change: true;
            elseChange: true;
          };
        };
      };
    };
    configurationVisibilityCondition: true;
  };
}>;

import { format } from "date-fns";
import { it } from "date-fns/locale";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FaFacebookF, FaSquareInstagram, FaWhatsapp } from "react-icons/fa6";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
import PdfPreventivoFormat from "@/components/pdf-test/pdf-preventivo-format";
import dynamic from "next/dynamic";

function AnalyzePage({ requestOfPrevId }: { requestOfPrevId: string }) {
  const previewRef = useRef(null);

  const [requestOfPrev, setRequestOfPrev] = useState<RequestOfPrevType>();
  const [variant, setVariant] = useState<VariantType>();
  const adminLoading = useAdminLoader();
  const [socketId, setSocketId] = useState<string>();

  const [configurationAtTime, setConfigurationAtTime] =
    useState<ConfigurazioniType[]>();

  const [person, setPerson] = useState<Person | null>(null);

  const [variantName, setVariantName] = useState("");
  const [variantDescription, setVariantDescription] = useState("");

  const [defaultConfigurations, setDefaultConfigurations] = useState<
    { configurationId: string; configurationValueId: string; bigText: string }[]
  >([]);

  const formattedDate = format(new Date(), "dd.MM.yyyy", { locale: it });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditing2, setIsEditing2] = useState(false);
  const [isEditing3, setIsEditing3] = useState(false);

  const [dragIndex1, setDragIndex1] = useState<string | null>(null);
  const [dragIndex2, setDragIndex2] = useState<string | null>(null);
  const [dragIndex3, setDragIndex3] = useState<string | null>(null);

  const [personName, setPersonName] = useState("");
  const [personState, setPersonState] = useState("Spett.le");
  const [personCity, setPersonCity] = useState("");

  const [numberDay, setNumberDay] = useState(30);

  const [requestConfigurations, setRequestConfigurations] = useState<
    {
      uuid: string;
      configurationId?: string;
      configurationValueId?: string;
      simpleName?: string;
      isReal: boolean;
      littleText: string;
      scount: number;
      scount2: number;
      price: number;
    }[]
  >([]);

  const [optionalConfigurations, setOptionalConfigurations] = useState<
    {
      uuid: string;
      configurationId?: string;
      configurationValueId?: string;
      simpleName?: string;
      isReal: boolean;
      littleText: string;
      scount: number;
      scount2: number;
      price: number;
    }[]
  >([]);

  const [
    showRequestedConfigurationsPrice,
    setShowRequestedConfigurationsPrice,
  ] = useState(false);

  const [scontBasedTrailer, setScontBasedTrailer] = useState(0);

  const [priceBasedTrailer, setPriceBasedTrailer] = useState(30);

  const [showBasedTrailerPrice, setShowBasedTrailerPrice] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [selectedConfigValueId, setSelectedConfigValueId] = useState<
    string | null
  >(null);

  // State variables for adding optional configurations
  const [isOptionalDialogOpen, setIsOptionalDialogOpen] = useState(false);
  const [selectedOptionalConfigId, setSelectedOptionalConfigId] = useState<
    string | null
  >(null);
  const [selectedOptionalConfigValueId, setSelectedOptionalConfigValueId] =
    useState<string | null>(null);

  const handleAddConfiguration = () => {
    if (!selectedConfigId || !selectedConfigValueId) return;

    // Ensure the configuration isn't already in requestConfigurations
    const isAlreadyAdded = requestConfigurations.some(
      (config) => config.configurationId === selectedConfigId
    );

    if (isAlreadyAdded) return; // Avoid adding duplicates

    // Find the configuration details to add
    const configDetails = configurationAtTime?.find(
      (config) => config.id === selectedConfigId
    );

    if (!configDetails) return;

    // Find the selected value details
    const selectedValue = configDetails.values.find(
      (value) => value.id === selectedConfigValueId
    );

    if (!selectedValue) return;

    // Remove from optionalConfigurations if exists
    setOptionalConfigurations((prevConfigs) =>
      prevConfigs.filter(
        (config) =>
          !(
            config.configurationId === selectedConfigId &&
            config.configurationValueId === selectedConfigValueId
          )
      )
    );

    // Add the new configuration to the state
    setRequestConfigurations((prevConfigs) => [
      ...prevConfigs,
      {
        uuid: uuidv4(),
        configurationId: selectedConfigId,
        configurationValueId: selectedConfigValueId,
        simpleName: configDetails.name,
        isReal: true,
        littleText: selectedValue.textLittle || "",
        scount: 0,
        scount2: 0,
        price: selectedValue.prezzo ?? 0,
      },
    ]);

    // Close the modal and reset selections
    setIsDialogOpen(false);
    setSelectedConfigId(null);
    setSelectedConfigValueId(null);
  };

  const handleAddEmpityConfiguration = () => {
    // Add the new configuration to the state
    setRequestConfigurations((prevConfigs) => [
      ...prevConfigs,
      {
        uuid: uuidv4(),
        simpleName: "Configurazione vuota",
        isReal: true,
        littleText: "Configurazione vuota",
        scount: 0,
        scount2: 0,
        price: 0,
      },
    ]);
  };

  const handleAddOptionalConfiguration = () => {
    if (!selectedOptionalConfigId || !selectedOptionalConfigValueId) return;

    // Find the configuration details to add
    const configDetails = configurationAtTime?.find(
      (config) => config.id === selectedOptionalConfigId
    );

    if (!configDetails) return;

    // Find the selected value details
    const selectedValue = configDetails.values.find(
      (value) => value.id === selectedOptionalConfigValueId
    );

    if (!selectedValue) return;

    // Add the new configuration to the optionalConfigurations state
    setOptionalConfigurations((prevConfigs) => [
      ...prevConfigs,
      {
        uuid: uuidv4(),
        configurationId: selectedOptionalConfigId,
        configurationValueId: selectedOptionalConfigValueId,
        simpleName: configDetails.name,
        isReal: true,
        littleText: selectedValue.textLittle || "",
        scount: 0,
        scount2: 0,
        price: selectedValue.prezzo ?? 0,
      },
    ]);

    // Close the modal and reset selections
    setIsOptionalDialogOpen(false);
    setSelectedOptionalConfigId(null);
    setSelectedOptionalConfigValueId(null);
  };

  const handleAddEmptyOptionalConfiguration = () => {
    // Add the new empty configuration to the optionalConfigurations state
    setOptionalConfigurations((prevConfigs) => [
      ...prevConfigs,
      {
        uuid: uuidv4(),
        simpleName: "Configurazione opzionale vuota",
        isReal: true,
        littleText: "Configurazione opzionale vuota",
        scount: 0,
        scount2: 0,
        price: 0,
      },
    ]);
  };

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch(
        "/api/preventivi/analyze/" + requestOfPrevId,
        { cache: "no-cache" }
      );
      const data = await response.json();

      setVariant(data.variant);
      setRequestOfPrev(data.requestOfPrev);
      setPerson(data.person);

      setConfigurationAtTime(data.variant.configurations);
      setVariantName(data.variant.nomePrev);
      setVariantDescription(data.variant.descriptionPrev);

      setPersonName(data.person.ragioneSociale);
      setPersonCity(data.person.citta);

      setPriceBasedTrailer(data.variant.prezzo);

      const initialConfigurations: {
        configurationId: string;
        configurationValueId: string;
        bigText: string;
      }[] = data.variant.configurations.map((config: ConfigurazioniType) => {
        const defaultValue = config.values.find(
          (value) => value.id === config.defaultValuePreventivo
        );

        console.log("Configu: " + config.name + " - Default: " + defaultValue?.value);

        return {
          configurationId: config.id,
          configurationValueId: defaultValue
            ? defaultValue.id
            : config.values[0]?.id,
          bigText: defaultValue?.textBig || config.values[0]?.textBig || "", // Ensure bigText is correctly assigned
        };
      });
      setDefaultConfigurations(initialConfigurations);

      const nonDefaultConfigurations: {
        uuid: string;
        configurationId?: string;
        configurationValueId?: string;
        simpleName?: string;
        isReal: boolean;
        littleText: string;
        scount: number;
        scount2: number;
        price: number;
      }[] = data.requestOfPrev.configurations
        .filter(
          (requestedConfig: {
            configurationId: string;
            configurationValueId: string;
          }) => {
            // Check if the requested configuration is in initialConfigurations
            const isDefault = initialConfigurations.some(
              (config) =>
                config.configurationId === requestedConfig.configurationId &&
                config.configurationValueId ===
                  requestedConfig.configurationValueId
            );
            // Include in nonDefaultConfigurations if not found in initialConfigurations
            return !isDefault;
          }
        )
        .map(
          (config: {
            configurationId: string;
            configurationValueId: string;
          }) => {
            // Find the configuration in variant configurations
            const configuration = data.variant.configurations.find(
              (variantConfig: ConfigurazioniType) =>
                variantConfig.id === config.configurationId
            );

            // Find the specific value in the configuration
            const configurationValue = configuration?.values.find(
              (value: any) => value.id === config.configurationValueId
            );

            return {
              uuid: uuidv4(),
              configurationId: config.configurationId,
              configurationValueId: config.configurationValueId,
              simpleName: "", // Initialize simpleName to an empty string
              isReal: true, // Set isReal to true
              littleText: configurationValue?.textLittle || "", // Extract the little text or use an empty string if not found
              scount: 0, // Default value for scount
              scount2: 0, // Default value for scount2
              price: configurationValue.prezzo ?? 0, // Default value for price
            };
          }
        );

      // Set the state for non-default configurations
      setRequestConfigurations(nonDefaultConfigurations);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      adminLoading.stopLoading();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfigurationChange = (
    configurationId: string,
    configurationValueId: string
  ) => {
    const configuration = variant?.configurations.find(
      (c) => c.id === configurationId
    );

    if (!configuration) return;

    const configurationValue = configuration.values.find(
      (v) => v.id === configurationValueId
    );

    // Remove the configuration from `requestConfigurations` if it exists
    setRequestConfigurations((prevRequestConfigs) =>
      prevRequestConfigs.filter(
        (reqConfig) =>
          !(
            reqConfig.configurationId === configurationId &&
            reqConfig.configurationValueId === configurationValueId
          )
      )
    );

    // Update the `defaultConfigurations`
    setDefaultConfigurations((prevConfigs) =>
      prevConfigs.map((config) =>
        config.configurationId === configurationId
          ? {
              ...config,
              configurationValueId,
              bigText: configurationValue?.textBig ?? "",
            }
          : config
      )
    );
  };

  const handleChangeBigText = (configurationId: string, bigText: string) => {
    setDefaultConfigurations((prevConfigs) =>
      prevConfigs.map((config) =>
        config.configurationId === configurationId
          ? { ...config, bigText }
          : config
      )
    );
  };

  const checkConfigurationVisibilityCondition = (
    configuration: ConfigurazioniType,
    configurations: { configurationId: string; configurationValueId: string }[]
  ) => {
    if (
      !configuration.visibilityConditionId ||
      configuration.visibilityConditionId === "" ||
      configuration.visibilityConditionId.length <= 0
    ) {
      return true;
    }

    const visibilityCondition =
      configuration.configurationVisibilityCondition.find(
        (v) => v.id === configuration.visibilityConditionId
      );

    if (!visibilityCondition) {
      return true;
    }

    return checkConfigurationVisibilityConditionRecursive(
      configuration,
      visibilityCondition,
      configurations
    );
  };

  const checkConfigurationVisibilityConditionRecursive = (
    configuration: ConfigurazioniType,
    visibilityCondition: ConfigurationVisibilityCondition,
    configurations: { configurationId: string; configurationValueId: string }[]
  ) => {
    if (!visibilityCondition) {
      return true;
    }

    const currentConfig = configurations.find(
      (c) => c.configurationId === visibilityCondition.configurationId
    );

    if (!currentConfig) {
      return true;
    }

    const isConditionMet =
      (visibilityCondition.checkType === "EQUAL" &&
        currentConfig.configurationValueId ===
          visibilityCondition.expectedValue) ||
      (visibilityCondition.checkType === "NOTEQUAL" &&
        currentConfig.configurationValueId !==
          visibilityCondition.expectedValue);

    if (isConditionMet) {
      if (
        visibilityCondition.ifRecId === null ||
        visibilityCondition.ifRecId === ""
      ) {
        return visibilityCondition.ifVisible;
      } else {
        const newVisibilityCondition =
          configuration.configurationVisibilityCondition.find(
            (v) => v.id === visibilityCondition.ifRecId
          );

        if (!newVisibilityCondition) {
          return visibilityCondition.ifVisible;
        } else {
          return checkConfigurationVisibilityConditionRecursive(
            configuration,
            newVisibilityCondition,
            configurations
          );
        }
      }
    } else {
      if (
        visibilityCondition.elseRecId === null ||
        visibilityCondition.elseRecId === ""
      ) {
        return visibilityCondition.elseVisible;
      } else {
        const newVisibilityCondition =
          configuration.configurationVisibilityCondition.find(
            (v) => v.id === visibilityCondition.elseRecId
          );

        if (!newVisibilityCondition) {
          return visibilityCondition.elseVisible;
        } else {
          return checkConfigurationVisibilityConditionRecursive(
            configuration,
            newVisibilityCondition,
            configurations
          );
        }
      }
    }
  };

  const handleRequestConfigurationChange = (
    configurationId: string,
    configurationValueId: string
  ) => {
    // Find the configuration in variant configurations
    const configuration = variant?.configurations.find(
      (config) => config.id === configurationId
    );

    // Find the specific value in the configuration
    const configurationValue = configuration?.values.find(
      (value) => value.id === configurationValueId
    );

    // Remove from optionalConfigurations if exists
    setOptionalConfigurations((prevConfigs) =>
      prevConfigs.filter(
        (config) =>
          !(
            config.configurationId === configurationId &&
            config.configurationValueId === configurationValueId
          )
      )
    );

    setRequestConfigurations((prevConfigs) =>
      prevConfigs.map((config) =>
        config.configurationId === configurationId
          ? {
              ...config,
              configurationValueId,
              littleText: configurationValue?.textLittle || "", // Set the new littleText
              price: configurationValue?.prezzo ?? 0, // Set the new price
            }
          : config
      )
    );
  };

  const handleDeleteRequestConfiguration = (configurationId: string) => {
    setRequestConfigurations((prevConfigs) =>
      prevConfigs.filter((config) => config.configurationId !== configurationId)
    );
  };

  const [isClientVisible, setIsClientVisible] = useState(false);

  useEffect(() => {
    setIsClientVisible(true);
  }, []);

  function formatHtmlString(htmlString: string) {
    // Create a DOM parser to parse the HTML string
    if (!isClientVisible) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Extract the first paragraph and retain its inner HTML to keep nested tags
    const paragraph = doc.querySelector("p");
    const paragraphInnerHTML = paragraph ? paragraph.innerHTML : "";
    // Extract paragraph styles and classes
    const paragraphStyle = paragraph
      ? paragraph.getAttribute("style") || ""
      : "";
    const paragraphClass = paragraph
      ? paragraph.getAttribute("class") || ""
      : "";

    // Extract the list items and filter out empty ones
    const listItems = doc.querySelectorAll("ul li");

    // Generate the formatted HTML by retaining inline styles, classes, and nested tags
    const formattedHtml = `
      <div>
        <p class="${paragraphClass}" style="${paragraphStyle}"><span style={{fontFamily: "DejaVuSans"}}>&#10147;</span>${paragraphInnerHTML}</p>
        <ul style="list-style-type: none; padding-left: 20px;"> <!-- Added padding -->
          ${Array.from(listItems)
            .map((li) => {
              const liInnerHTML = li.innerHTML.trim(); // Use innerHTML to keep nested tags
              if (!liInnerHTML) return ""; // Skip empty items

              // Get inline styles and classes of list items
              const liStyle = li.getAttribute("style") || "";
              const liClass = li.getAttribute("class") || "";
              return `
                <li class="${liClass}" style="display: flex; align-items: start; padding: 0; ${liStyle}"> <!-- Added padding to each item -->
                  <span style="margin-right: 5px;">&#10003;</span> ${liInnerHTML}
                </li>
              `;
            })
            .join("")}
        </ul>
      </div>
    `;

    return formattedHtml;
  }

  if (!isClientVisible) return null;

  const discountedBasedTrailerPrice = Math.round(
    priceBasedTrailer * (1 - scontBasedTrailer / 100)
  );

  const handleOptionalConfigurationChange = (
    configurationId: string,
    configurationValueId: string
  ) => {
    // Find the configuration in variant configurations
    const configuration = variant?.configurations.find(
      (config) => config.id === configurationId
    );

    // Find the specific value in the configuration
    const configurationValue = configuration?.values.find(
      (value) => value.id === configurationValueId
    );

    // Remove from requestConfigurations if it exists
    setRequestConfigurations((prevConfigs) =>
      prevConfigs.filter(
        (config) =>
          !(
            config.configurationId === configurationId &&
            config.configurationValueId === configurationValueId
          )
      )
    );

    // Update optionalConfigurations
    setOptionalConfigurations((prevConfigs) =>
      prevConfigs.map((config) =>
        config.configurationId === configurationId
          ? {
              ...config,
              configurationValueId,
              littleText: configurationValue?.textLittle || "", // Set the new littleText
              price: configurationValue?.prezzo ?? 0, // Set the new price
            }
          : config
      )
    );
  };

  const handleDeleteOptionalConfiguration = (configurationId: string) => {
    setOptionalConfigurations((prevConfigs) =>
      prevConfigs.filter((config) => config.configurationId !== configurationId)
    );
  };

  const calculateTotalTrailerPrice = () => {
    // Step 1: Calculate the discounted base price
    const discountedBasePrice =
      priceBasedTrailer * (1 - scontBasedTrailer / 100);

    // Step 2: Calculate the total for requested configurations
    const totalConfigurationsPrice = requestConfigurations.reduce(
      (total, requestedConfig) => {
        // Calculate the price after applying both discounts
        const discountedConfigPrice =
          requestedConfig.price *
          (1 - requestedConfig.scount / 100) *
          (1 - requestedConfig.scount2 / 100);
        return total + discountedConfigPrice;
      },
      0 // Initial value for the reduce function
    );

    // Step 3: Sum the discounted base price and the total configurations price
    const totalPrice = discountedBasePrice + totalConfigurationsPrice;

    return totalPrice;
  };

  function formatNumberWithSeparators(number: number) {
    // Use Intl.NumberFormat to format the number
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }

  function mergeRequestedIntoBaseConfigurations() {
    // Crea una copia delle configurazioni di base per la modifica
    const updatedConfigurations = [...defaultConfigurations];
  
    // Itera sulle configurazioni richieste
    requestConfigurations.forEach((requestedConfig) => {
      if (!requestedConfig.isReal) return;
  
      if (
        !requestedConfig.configurationId ||
        !requestedConfig.configurationValueId
      )
        return;
  
      // Cerca i dettagli della configurazione attuale basandosi sul configurationId
      const configDetails = configurationAtTime?.find(
        (config) => config.id === requestedConfig.configurationId
      );
  
      if (!configDetails) return; // Se la configurazione non esiste, ignora
  
      // Cerca il valore della configurazione attuale
      const requestedValue = configDetails.values.find(
        (value) => value.id === requestedConfig.configurationValueId
      );
  
      if (!requestedValue) return; // Se il valore non esiste, ignora
  
      // Trova se esiste già una configurazione di base con lo stesso configurationId
      const existingConfigIndex = updatedConfigurations.findIndex(
        (baseConfig) =>
          baseConfig.configurationId === requestedConfig.configurationId
      );
  
      if (existingConfigIndex !== -1) {
        // Se esiste già, aggiorna il configurationValueId e il bigText con il nuovo valore dalla configurazione corrente
        updatedConfigurations[existingConfigIndex] = {
          ...updatedConfigurations[existingConfigIndex],
          configurationValueId: requestedConfig.configurationValueId,
          bigText: requestedValue.textBig || "", // Usa il nuovo testo grande della configurazione corrente
        };
      } else {
        // Se non esiste, aggiungi una nuova configurazione di base con il nuovo testo grande
        updatedConfigurations.push({
          configurationId: requestedConfig.configurationId,
          configurationValueId: requestedConfig.configurationValueId,
          bigText: requestedValue.textBig || "", // Usa il nuovo testo grande della configurazione corrente
        });
      }
    });
  
    // Aggiorna le configurazioni di base
    setDefaultConfigurations(updatedConfigurations);
  
    // Svuota le configurazioni richieste
    setRequestConfigurations([]);
  }
  

  const handleDownloadPDF = async () => {};

  const filteredConfigurations = defaultConfigurations
    .map((defaultConfig) => {
      const configDetails = configurationAtTime?.find(
        (config) => config.id === defaultConfig.configurationId
      );

      if (!configDetails) return null;

      const isVisible = checkConfigurationVisibilityCondition(
        configDetails,
        defaultConfigurations
      );

      if (!isVisible) return null;

      const configurationValue = configDetails.values.find(
        (c) => c.id === defaultConfig.configurationValueId
      );

      if (!configurationValue) return null;

      if (!configurationValue.hasText) return null;

      if (!configurationValue.textBig) return null;

      // Ritorna il testo formattato se tutte le condizioni sono soddisfatte
      return defaultConfig.bigText ?? "";
    })
    .filter((config) => config !== null);

  // Step 1: Start with the base price of the trailer
  let totalPriceBased = priceBasedTrailer;

  // Step 2: Loop through each base configuration and adjust the price
  defaultConfigurations.forEach((defaultConfig) => {
    const configDetails = configurationAtTime?.find(
      (config) => config.id === defaultConfig.configurationId
    );

    if (!configDetails) return; // If no configuration details, skip

    const configurationValue = configDetails.values.find(
      (value) => value.id === defaultConfig.configurationValueId
    );

    if (!configurationValue) return; // If no configuration value, skip

    const configPrice = configurationValue.prezzo ?? 0;

    // Step 3: Adjust the total price based on the configuration price
    totalPriceBased += configPrice; // Add or subtract the configuration price
  });

  // Step 4: Apply the base discount
  const discountedTotalPrice = totalPriceBased * (1 - scontBasedTrailer / 100);

  let totalPrice = discountedTotalPrice;

  // Step 2: Loop through each requested configuration and adjust the price
  requestConfigurations.forEach((requestedConfig) => {
    // Find the corresponding base configuration, if it exists
    const baseConfig = defaultConfigurations.find(
      (defaultConfig) =>
        defaultConfig.configurationId === requestedConfig.configurationId
    );

    // Find the details of the configuration in variant
    const configDetails = configurationAtTime?.find(
      (config) => config.id === requestedConfig.configurationId
    );

    if (!configDetails) return; // If no details found, skip

    // Find the specific value of both the base configuration and the requested configuration
    const requestedValue = configDetails.values.find(
      (value) => value.id === requestedConfig.configurationValueId
    );

    const baseValue = baseConfig
      ? configDetails.values.find(
          (value) => value.id === baseConfig.configurationValueId
        )
      : null;

    // Step 3: Determine how to adjust the price based on the presence of the base configuration

    if (baseValue) {
      // Case 1: The configuration exists in both base and requested configurations
      const basePrice = baseValue?.prezzo ?? 0;
      const requestedPrice = requestedValue?.prezzo ?? 0;
      const priceDifference = requestedPrice - basePrice;

      // Apply compound discounts to the price difference
      const discountedDifference =
        priceDifference *
        (1 - requestedConfig.scount / 100) *
        (1 - requestedConfig.scount2 / 100);

      // Adjust the total price based on the discounted price difference
      totalPrice += discountedDifference;
    } else {
      // Case 2: The configuration exists only in the requested configurations
      const requestedPrice = requestedValue?.prezzo ?? 0;

      // Apply compound discounts to the requested configuration price
      const discountedPrice =
        requestedPrice *
        (1 - requestedConfig.scount / 100) *
        (1 - requestedConfig.scount2 / 100);

      // Adjust the total price by adding the discounted price of the requested configuration
      totalPrice += discountedPrice;
    }
  });

  return (
    <div>
      <HeaderBar
        title="Analisi della richiesta di preventivo"
        possibleBackButton={
          <>
            <Button variant={"ghost"}>
              <Link href={"/admin/preventivi/"}>
                <IoArrowBack className="w-6 h-6" />
              </Link>
            </Button>
          </>
        }
      ></HeaderBar>
      <div className="mt-5"></div>

      <HeaderBar
        title="Il cliente ha richiesto le seguenti configurazioni"
        subtitle
      />
      <div className="flex flex-col gap-2">
        {requestOfPrev?.configurations.map((configuration, index) => {
          const config = variant?.configurations.find(
            (c) => c.id === configuration.configurationId
          );

          if (!config)
            return (
              <div key={index}>
                <span className="font-bold">
                  {configuration.configurationName}:
                </span>{" "}
                <span>
                  {configuration.configurationValueName} (La configurazione è
                  stata cancellata)
                </span>
              </div>
            );

          const configurationValue = config.values.find(
            (c) => c.id === configuration.configurationValueId
          );

          if (!configurationValue) {
            return (
              <div key={index}>
                <span className="font-bold">{config.name}:</span>{" "}
                <span>
                  {configuration.configurationValueName} (Il valore è stato
                  cancellato)
                </span>
              </div>
            );
          }

          return (
            <div key={index}>
              <span className="font-bold">{config.name}:</span>{" "}
              <span>{configurationValue.value}</span>
            </div>
          );
        })}
      </div>
      <Accordion type="multiple" className="my-5 space-y-5">
        <AccordionItem value="datiPersona">
          <AccordionTrigger>
            <h1 className="text-lg md:text-2xl font-medium text-neutral-700">
              Dati richiedente
            </h1>
          </AccordionTrigger>
          <AccordionContent className="px-4 space-y-3">
            <div className="space-y-1">
              <div>
                <span className="font-bold">Ragione sociale:</span>{" "}
                <span>{person?.ragioneSociale}</span>
              </div>
              <div>
                <span className="font-bold">Citta:</span>{" "}
                <span>{person?.citta}</span>
              </div>
              <div>
                <span className="font-bold">P.IVA:</span>{" "}
                <span>{person?.partitaIva || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold">Codice fiscale:</span>{" "}
                <span>{person?.codiceFiscale || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold">Telefono:</span>{" "}
                <span>{person?.telefono || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold">Email:</span>{" "}
                <span>{person?.email || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Stato sociale</Label>
              <Input
                className="w-full"
                value={personState}
                onChange={(e) => setPersonState(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ragione Sociale</Label>
              <Input
                className="w-full"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Città</Label>
              <Input
                className="w-full"
                value={personCity}
                onChange={(e) => setPersonCity(e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nomeRimorchio">
          <AccordionTrigger>
            <h1 className="text-lg md:text-2xl font-medium text-neutral-700">
              Dati Rimorchio
            </h1>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <ReactQuillComponent
                value={variantName}
                onChange={setVariantName}
              />
            </div>
            <div className="mt-16 space-y-2">
              <Label>Descirzione iniziale</Label>
              <ReactQuillComponent
                value={variantDescription}
                onChange={setVariantDescription}
              />
            </div>
            <div className="mt-16 space-y-2">
              <Label>Prezzo rimorchio base</Label>
              <Input
                value={priceBasedTrailer}
                onChange={(e) =>
                  setPriceBasedTrailer(Number(e.target.value) || 0)
                }
                min={0}
              />
            </div>
            <div className="mt-5 space-y-2">
              <Label>Sconto rimorchio %</Label>
              <Input
                value={scontBasedTrailer}
                onChange={(e) =>
                  setScontBasedTrailer(Number(e.target.value) || 0)
                }
                min={0}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="configurazioniBase">
          <AccordionTrigger>
            <h1 className="text-lg md:text-2xl font-medium text-neutral-700">
              Configurazioni base
            </h1>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Reorder.Group
              values={defaultConfigurations}
              onReorder={setDefaultConfigurations}
              className="configurations-list mt-6"
              axis="y"
            >
              {defaultConfigurations.map((defaultConfig) => {
                const configDetails = configurationAtTime?.find(
                  (config) => config.id === defaultConfig.configurationId
                );

                if (!configDetails) return null;

                const isVisible = checkConfigurationVisibilityCondition(
                  configDetails,
                  defaultConfigurations
                );

                if (!isVisible) return null;

                return (
                  <Reorder.Item
                    key={defaultConfig.configurationId}
                    value={defaultConfig}
                    className={`${
                      dragIndex1 === defaultConfig.configurationId
                        ? "bg-primary text-primary-foreground"
                        : "bg-white"
                    } configuration-item my-3 px-5 py-2 border rounded-md shadow-sm  flex flex-row items-center gap-5 cursor-grab`}
                    drag={!isEditing}
                    onDragStart={() =>
                      setDragIndex1(defaultConfig.configurationId)
                    }
                    onDragEnd={() => setDragIndex1(null)}
                  >
                    <MdMenu className="w-6 h-6 " />
                    <div className="flex flex-col gap-2 w-full">
                      <div className="w-full flex flex-row items-center gap-3">
                        <h3 className="configuration-name text-lg font-semibold">
                          {configDetails.name}
                        </h3>
                        <Select
                          onValueChange={(value) =>
                            handleConfigurationChange(
                              defaultConfig.configurationId,
                              value
                            )
                          }
                          value={defaultConfig.configurationValueId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleziona un valore" />
                          </SelectTrigger>
                          <SelectContent>
                            {configDetails.values.map((value) => (
                              <SelectItem key={value.id} value={value.id}>
                                {value.value}{" "}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Accordion inside each Reorder.Item */}
                      <Accordion
                        type="single"
                        collapsible
                        onMouseDown={(e) => e.stopPropagation()}
                        onDragStart={(e) => e.stopPropagation()}
                        onDrag={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                      >
                        <AccordionItem value={defaultConfig.configurationId}>
                          <AccordionTrigger className="text-[16px]">
                            Modifica il testo per {configDetails.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div
                              onMouseDown={(e) => e.stopPropagation()}
                              onDragStart={(e) => e.stopPropagation()}
                              onDrag={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                            >
                              <ReactQuillComponent
                                value={defaultConfig.bigText}
                                onChange={(value) =>
                                  handleChangeBigText(
                                    defaultConfig.configurationId,
                                    value
                                  )
                                }
                                onFocus={() => setIsEditing(true)}
                                onBlur={() => setIsEditing(false)}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="configurazioniRichieste">
          <AccordionTrigger>
            <h1 className="text-lg md:text-2xl font-medium text-neutral-700">
              Configurazioni richieste
            </h1>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Reorder.Group
              values={requestConfigurations.map((config) => config.uuid)} // Utilizza solo gli UUID per riordinare
              onReorder={(newOrder) =>
                setRequestConfigurations(
                  (prevConfigs) =>
                    newOrder
                      .map((uuid) =>
                        prevConfigs.find((config) => config.uuid === uuid)
                      )
                      .filter(
                        (config): config is NonNullable<typeof config> =>
                          config !== undefined
                      ) // Filtra gli undefined
                )
              }
              className="configurations-list mt-6"
              axis="y"
            >
              {requestConfigurations.map((requestedConfig, index) => {
                const configDetails = configurationAtTime?.find(
                  (config) => config.id === requestedConfig.configurationId
                );

                const nonDefaultValues = configDetails?.values.filter(
                  (value) =>
                    !defaultConfigurations.some(
                      (defaultConfig) =>
                        defaultConfig.configurationId === configDetails.id &&
                        defaultConfig.configurationValueId === value.id
                    )
                );

                // Calculate the final price with compound discounts
                const discountedPrice = Math.round(
                  requestedConfig.price *
                    (1 - requestedConfig.scount / 100) *
                    (1 - requestedConfig.scount2 / 100)
                );

                return (
                  <Reorder.Item
                    key={requestedConfig.uuid}
                    value={requestedConfig.uuid}
                    className={`${
                      dragIndex2 === requestedConfig.uuid
                        ? "bg-primary text-primary-foreground"
                        : "bg-white"
                    } configuration-item my-3 px-5 py-2 border rounded-md shadow-sm  flex flex-row items-center gap-5 cursor-grab`}
                    drag={!isEditing2}
                    onDragStart={() => setDragIndex2(requestedConfig.uuid)}
                    onDragEnd={() => setDragIndex2(null)}
                  >
                    <MdMenu className="w-6 h-6 " />
                    <div className="flex flex-col gap-2 w-full">
                      {configDetails ? (
                        <div className="w-full flex flex-row items-center gap-3">
                          <h3 className="configuration-name text-lg font-semibold">
                            {configDetails?.name}
                          </h3>
                          <Select
                            onValueChange={(value) =>
                              handleRequestConfigurationChange(
                                requestedConfig.configurationId ?? "",
                                value
                              )
                            }
                            value={requestedConfig.configurationValueId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleziona un valore" />
                            </SelectTrigger>
                            <SelectContent>
                              {nonDefaultValues?.map((value) => (
                                <SelectItem key={value.id} value={value.id}>
                                  {value.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleDeleteRequestConfiguration(
                                requestedConfig.configurationId ?? ""
                              )
                            }
                          >
                            <IoTrash className="text-red-500 w-5 h-5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full flex flex-row items-center gap-3">
                          <Input
                            value={requestedConfig.simpleName ?? ""}
                            onChange={(e) =>
                              setRequestConfigurations((prevConfigs) =>
                                prevConfigs.map((config, i) =>
                                  config.uuid === requestedConfig.uuid
                                    ? {
                                        ...config,
                                        simpleName: e.target.value,
                                      }
                                    : config
                                )
                              )
                            }
                          />
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            onClick={() =>
                              setRequestConfigurations((prevConfigs) =>
                                prevConfigs.filter((config, i) => index !== i)
                              )
                            }
                          >
                            <IoTrash className="text-red-500 w-5 h-5" />
                          </Button>
                        </div>
                      )}

                      {/* Accordion to edit fields */}
                      <Accordion type="single" collapsible>
                        <AccordionItem value={"editFor" + index}>
                          <AccordionTrigger className="text-[16px]">
                            Modifica dettagli per{" "}
                            {configDetails?.name ??
                              requestedConfig.simpleName ??
                              ""}
                          </AccordionTrigger>
                          <AccordionContent>
                            {/* Edit Price */}
                            <div className="my-3">
                              <Label className="block text-sm font-medium">
                                Prezzo (può essere negativo)
                              </Label>
                              <Input
                                type="number"
                                className="w-full"
                                value={requestedConfig.price}
                                onChange={(e) =>
                                  setRequestConfigurations((prevConfigs) =>
                                    prevConfigs.map((config, i) =>
                                      config.uuid === requestedConfig.uuid
                                        ? {
                                            ...config,
                                            price: parseFloat(e.target.value),
                                          }
                                        : config
                                    )
                                  )
                                }
                              />
                            </div>

                            {/* Edit Discounts 1 & 2 on the same row */}
                            <div className="my-3 flex flex-row gap-4">
                              <div className="flex-1">
                                <Label className="block text-sm font-medium">
                                  Sconto 1 (%)
                                </Label>
                                <Input
                                  type="number"
                                  className="w-full"
                                  value={requestedConfig.scount}
                                  onChange={(e) =>
                                    setRequestConfigurations((prevConfigs) =>
                                      prevConfigs.map((config, i) =>
                                        config.uuid === requestedConfig.uuid
                                          ? {
                                              ...config,
                                              scount: parseFloat(
                                                e.target.value
                                              ),
                                            }
                                          : config
                                      )
                                    )
                                  }
                                />
                              </div>

                              <div className="flex-1">
                                <Label className="block text-sm font-medium">
                                  Sconto 2 (%)
                                </Label>
                                <Input
                                  type="number"
                                  className="w-full"
                                  value={requestedConfig.scount2}
                                  onChange={(e) =>
                                    setRequestConfigurations((prevConfigs) =>
                                      prevConfigs.map((config, i) =>
                                        config.uuid === requestedConfig.uuid
                                          ? {
                                              ...config,
                                              scount2: parseFloat(
                                                e.target.value
                                              ),
                                            }
                                          : config
                                      )
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Final Price (Read-only) */}
                            <div className="my-3">
                              <Label className="block text-sm font-medium">
                                Prezzo finale (dopo sconti)
                              </Label>
                              <Input
                                type="text"
                                className="w-full bg-gray-100 cursor-not-allowed"
                                value={discountedPrice.toFixed(2)}
                                readOnly
                              />
                            </div>

                            {/* Edit Little Text */}
                            <div className="my-3">
                              <Label className="block text-sm font-medium">
                                Modifica il testo piccolo
                              </Label>
                              <ReactQuillComponent
                                value={requestedConfig.littleText}
                                onChange={(value) => {
                                  setRequestConfigurations((prevConfigs) =>
                                    prevConfigs.map((config, i) =>
                                      config.uuid === requestedConfig.uuid
                                        ? { ...config, littleText: value }
                                        : config
                                    )
                                  );
                                }}
                                onFocus={() => setIsEditing2(true)}
                                onBlur={() => setIsEditing2(false)}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
            {/* ALERT DIALOG PER AGGIUNGERE UNA CONFIGURAZIONE ALLE RICHIESTE */}
            <div className="my-4 flex flex-row items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    Aggiungi configurazione
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Aggiungi configurazione alla richiesta
                    </DialogTitle>
                    <DialogDescription>
                      Seleziona una configurazione e il suo valore per
                      aggiungerla al preventivo
                    </DialogDescription>
                  </DialogHeader>
                  {/* Select Configuration */}
                  <div className="space-y-1">
                    <Label>Configurazione</Label>
                    <Select
                      onValueChange={(value) => setSelectedConfigId(value)}
                      value={selectedConfigId || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona una configurazione" />
                      </SelectTrigger>
                      <SelectContent>
                        {configurationAtTime
                          ?.filter(
                            (config) =>
                              !requestConfigurations.some(
                                (reqConfig) =>
                                  reqConfig.configurationId === config.id
                              )
                          )
                          .map((config) => (
                            <SelectItem key={config.id} value={config.id}>
                              {config.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select Configuration Value */}
                  {selectedConfigId && (
                    <div className="space-y-1">
                      <Label>Valore</Label>
                      <Select
                        onValueChange={(value) =>
                          setSelectedConfigValueId(value)
                        }
                        value={selectedConfigValueId || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona un valore" />
                        </SelectTrigger>
                        <SelectContent>
                          {configurationAtTime
                            ?.find((config) => config.id === selectedConfigId)
                            ?.values.map((value) => (
                              <SelectItem key={value.id} value={value.id}>
                                {value.value}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      variant={"outline"}
                    >
                      Cancella
                    </Button>
                    <Button onClick={handleAddConfiguration}>
                      Aggiungi configurazione
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                className=""
                variant={"outline"}
                onClick={handleAddEmpityConfiguration}
              >
                Aggiungi configurazione vuota
              </Button>
              <Button variant={"outline"} onClick={mergeRequestedIntoBaseConfigurations} disabled={requestConfigurations.length <= 0}>
                Sposta configurazioni nelle configurazioni base
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="configurazioniOpzionali">
          <AccordionTrigger>
            <h1 className="text-lg md:text-2xl font-medium text-neutral-700">
              Configurazioni opzionali
            </h1>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Reorder.Group
              values={optionalConfigurations.map((config) => config.uuid)} // Utilizza solo gli UUID per riordinare
              onReorder={(newOrder) =>
                setOptionalConfigurations(
                  (prevConfigs) =>
                    newOrder
                      .map((uuid) =>
                        prevConfigs.find((config) => config.uuid === uuid)
                      )
                      .filter(
                        (config): config is NonNullable<typeof config> =>
                          config !== undefined
                      ) // Filtra gli undefined
                )
              }
              className="configurations-list mt-6"
              axis="y"
            >
              {optionalConfigurations.map((optionalConfig, index) => {
                const configDetails = configurationAtTime?.find(
                  (config) => config.id === optionalConfig.configurationId
                );

                const nonDefaultValues = configDetails?.values.filter(
                  (value) =>
                    // Check if this specific value of the current configuration is not in `requestConfigurations`
                    !requestConfigurations.some(
                      (reqConfig) =>
                        reqConfig.configurationId === configDetails.id &&
                        reqConfig.configurationValueId === value.id
                    )
                );

                // Calculate the final price with compound discounts
                const discountedPrice = Math.round(
                  optionalConfig.price *
                    (1 - optionalConfig.scount / 100) *
                    (1 - optionalConfig.scount2 / 100)
                );

                return (
                  <Reorder.Item
                    key={optionalConfig.uuid}
                    value={optionalConfig.uuid}
                    className={`${
                      dragIndex3 === optionalConfig.uuid
                        ? "bg-primary text-primary-foreground"
                        : "bg-white"
                    } configuration-item my-3 px-5 py-2 border rounded-md shadow-sm  flex flex-row items-center gap-5 cursor-grab`}
                    drag={!isEditing3}
                    onDragStart={() => setDragIndex3(optionalConfig.uuid)}
                    onDragEnd={() => setDragIndex3(null)}
                  >
                    <MdMenu className="w-6 h-6 " />
                    <div className="flex flex-col gap-2 w-full">
                      {configDetails ? (
                        <div className="w-full flex flex-row items-center gap-3">
                          <h3 className="configuration-name text-lg font-semibold">
                            {configDetails?.name}
                          </h3>
                          <Select
                            onValueChange={(value) =>
                              handleOptionalConfigurationChange(
                                optionalConfig.configurationId ?? "",
                                value
                              )
                            }
                            value={optionalConfig.configurationValueId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleziona un valore" />
                            </SelectTrigger>
                            <SelectContent>
                              {nonDefaultValues?.map((value) => (
                                <SelectItem key={value.id} value={value.id}>
                                  {value.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleDeleteOptionalConfiguration(
                                optionalConfig.configurationId ?? ""
                              )
                            }
                          >
                            <IoTrash className="text-red-500 w-5 h-5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full flex flex-row items-center gap-3">
                          <Input
                            value={optionalConfig.simpleName ?? ""}
                            onChange={(e) =>
                              setOptionalConfigurations((prevConfigs) =>
                                prevConfigs.map((config, i) =>
                                  config.uuid === optionalConfig.uuid
                                    ? {
                                        ...config,
                                        simpleName: e.target.value,
                                      }
                                    : config
                                )
                              )
                            }
                          />
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            onClick={() =>
                              setOptionalConfigurations((prevConfigs) =>
                                prevConfigs.filter((config, i) => index !== i)
                              )
                            }
                          >
                            <IoTrash className="text-red-500 w-5 h-5" />
                          </Button>
                        </div>
                      )}

                      {/* Accordion to edit fields */}
                      <Accordion type="single" collapsible>
                        <AccordionItem value={"editOptionalFor" + index}>
                          <AccordionTrigger className="text-[16px]">
                            Modifica dettagli per{" "}
                            {configDetails?.name ??
                              optionalConfig.simpleName ??
                              ""}
                          </AccordionTrigger>
                          <AccordionContent>
                            {/* Edit Price */}
                            <div className="my-3">
                              <Label className="block text-sm font-medium">
                                Prezzo (può essere negativo)
                              </Label>
                              <Input
                                type="number"
                                className="w-full"
                                value={optionalConfig.price}
                                onChange={(e) =>
                                  setOptionalConfigurations((prevConfigs) =>
                                    prevConfigs.map((config, i) =>
                                      config.uuid === optionalConfig.uuid
                                        ? {
                                            ...config,
                                            price: parseFloat(e.target.value),
                                          }
                                        : config
                                    )
                                  )
                                }
                              />
                            </div>

                            {/* Edit Discounts 1 & 2 on the same row */}
                            <div className="my-3 flex flex-row gap-4">
                              <div className="flex-1">
                                <Label className="block text-sm font-medium">
                                  Sconto 1 (%)
                                </Label>
                                <Input
                                  type="number"
                                  className="w-full"
                                  value={optionalConfig.scount}
                                  onChange={(e) =>
                                    setOptionalConfigurations((prevConfigs) =>
                                      prevConfigs.map((config, i) =>
                                        config.uuid === optionalConfig.uuid
                                          ? {
                                              ...config,
                                              scount: parseFloat(
                                                e.target.value
                                              ),
                                            }
                                          : config
                                      )
                                    )
                                  }
                                />
                              </div>

                              <div className="flex-1">
                                <Label className="block text-sm font-medium">
                                  Sconto 2 (%)
                                </Label>
                                <Input
                                  type="number"
                                  className="w-full"
                                  value={optionalConfig.scount2}
                                  onChange={(e) =>
                                    setOptionalConfigurations((prevConfigs) =>
                                      prevConfigs.map((config, i) =>
                                        config.uuid === optionalConfig.uuid
                                          ? {
                                              ...config,
                                              scount2: parseFloat(
                                                e.target.value
                                              ),
                                            }
                                          : config
                                      )
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Final Price (Read-only) */}
                            <div className="my-3">
                              <Label className="block text-sm font-medium">
                                Prezzo finale (dopo sconti)
                              </Label>
                              <Input
                                type="text"
                                className="w-full bg-gray-100 cursor-not-allowed"
                                value={discountedPrice.toFixed(2)}
                                readOnly
                              />
                            </div>

                            {/* Edit Little Text */}
                            <div className="my-3">
                              <Label className="block text-sm font-medium">
                                Modifica il testo piccolo
                              </Label>
                              <ReactQuillComponent
                                value={optionalConfig.littleText}
                                onChange={(value) => {
                                  setOptionalConfigurations((prevConfigs) =>
                                    prevConfigs.map((config, i) =>
                                      config.uuid === optionalConfig.uuid
                                        ? { ...config, littleText: value }
                                        : config
                                    )
                                  );
                                }}
                                onFocus={() => setIsEditing3(true)}
                                onBlur={() => setIsEditing3(false)}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
            {/* ALERT DIALOG PER AGGIUNGERE UNA CONFIGURAZIONE OPZIONALE */}
            <div className="my-4 flex flex-row items-center gap-2">
              <Dialog
                open={isOptionalDialogOpen}
                onOpenChange={setIsOptionalDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => setIsOptionalDialogOpen(true)}>
                    Aggiungi configurazione opzionale
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Aggiungi configurazione opzionale alla richiesta
                    </DialogTitle>
                    <DialogDescription>
                      Seleziona una configurazione e il suo valore per
                      aggiungerla come opzionale
                    </DialogDescription>
                  </DialogHeader>
                  {/* Select Optional Configuration */}
                  <div className="space-y-1">
                    <Label>Configurazione</Label>
                    <Select
                      onValueChange={(value) =>
                        setSelectedOptionalConfigId(value)
                      }
                      value={selectedOptionalConfigId || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona una configurazione opzionale" />
                      </SelectTrigger>
                      <SelectContent>
                        {configurationAtTime?.map((config) => (
                          <SelectItem key={config.id} value={config.id}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select Optional Configuration Value */}
                  {selectedOptionalConfigId && (
                    <div className="space-y-1">
                      <Label>Valore</Label>
                      <Select
                        onValueChange={(value) =>
                          setSelectedOptionalConfigValueId(value)
                        }
                        value={selectedOptionalConfigValueId || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona un valore" />
                        </SelectTrigger>
                        <SelectContent>
                          {configurationAtTime
                            ?.find(
                              (config) => config.id === selectedOptionalConfigId
                            )
                            ?.values.filter(
                              (value) =>
                                // Ensure the value is not part of the requested configurations
                                !requestConfigurations.some(
                                  (reqConfig) =>
                                    reqConfig.configurationId ===
                                      selectedOptionalConfigId &&
                                    reqConfig.configurationValueId === value.id
                                )
                            )
                            .map((value) => (
                              <SelectItem key={value.id} value={value.id}>
                                {value.value}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      onClick={() => setIsOptionalDialogOpen(false)}
                      variant={"outline"}
                    >
                      Cancella
                    </Button>
                    <Button onClick={handleAddOptionalConfiguration}>
                      Aggiungi configurazione opzionale
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                className=""
                variant={"outline"}
                onClick={handleAddEmptyOptionalConfiguration}
              >
                Aggiungi configurazione opzionale vuota
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="opzioniPreventivo">
          <AccordionTrigger>
            <h1 className="text-lg md:text-2xl font-medium text-neutral-700">
              Opzioni preventivo
            </h1>
          </AccordionTrigger>
          <AccordionContent className="px-4 space-y-3">
            <div
              className={`relative rounded-md border border-input bg-transparent shadow px-5 py-3 space-y-1`}
              style={{ minHeight: "100%" }}
            >
              <Label>Prezzi configurazioni richieste visibili</Label>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={showRequestedConfigurationsPrice}
                  onCheckedChange={(check) =>
                    setShowRequestedConfigurationsPrice(Boolean(check))
                  }
                />
                <div className="text-[0.8rem] text-muted-foreground">
                  Attiva questa spunta per rendere visibili i prezzi scontati
                  delle configurazioni richieste{" "}
                  {/* <span className="text-primary font-medium">
                  (Può essere attivata solo se è configurabile e se sono
                  inseriti i nodi e i modelli 3D nei vari colori visibili)
                </span> */}
                </div>
              </div>
            </div>

            <div
              className={`relative rounded-md border border-input bg-transparent shadow px-5 py-3 space-y-1`}
              style={{ minHeight: "100%" }}
            >
              <Label>Prezzo rimorchio base</Label>
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  checked={showBasedTrailerPrice}
                  onCheckedChange={(check) =>
                    setShowBasedTrailerPrice(Boolean(check))
                  }
                />
                <div className="text-[0.8rem] text-muted-foreground">
                  Attiva questa spunta per rendere visibile il del rimorchio
                  base{" "}
                  {/* <span className="text-primary font-medium">
                  (Può essere attivata solo se è configurabile e se sono
                  inseriti i nodi e i modelli 3D nei vari colori visibili)
                </span> */}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Label>Numero di giorni per cui è valido il preventivo</Label>
              <Select
                onValueChange={(value) => setNumberDay(Number(value) || 0)}
                value={numberDay.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleziona un valore" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 giorno</SelectItem>
                  <SelectItem value="5">5 giorni</SelectItem>
                  <SelectItem value="10">10 giorni</SelectItem>
                  <SelectItem value="15">15 giorni</SelectItem>
                  <SelectItem value="30">30 giorni</SelectItem>
                  <SelectItem value="45">45 giorni</SelectItem>
                  <SelectItem value="60">60 giorni</SelectItem>
                  <SelectItem value="90">90 giorni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-5 w-full flex-col items-center">
        <HeaderBar subtitle title="Preventivo"></HeaderBar>

        {/* VISUALIZZAZIONE PREVENTIVO */}

        <div className="w-full h-[700px] my-10">
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            <PdfPreventivoFormat
              personCity={personCity}
              personName={personName}
              personState={personState}
              formattedDate={formattedDate}
              defaultConfigurations={filteredConfigurations}
              trailerName={variantName}
              trailerDescription={variantDescription}
              requestConfigurations={[
                ...requestConfigurations.map((requestedConfig) => {
                  // Trova la configurazione di base corrispondente, se esiste
                  const baseConfig = defaultConfigurations.find(
                    (defaultConfig) =>
                      defaultConfig.configurationId ===
                      requestedConfig.configurationId
                  );

                  // Trova i dettagli della configurazione nel variant
                  const configDetails = configurationAtTime?.find(
                    (config) => config.id === requestedConfig.configurationId
                  );

                  if (!configDetails)
                    return { text: requestedConfig.littleText, price: 0 }; // Se non trova i dettagli, salta

                  // Trova il valore specifico della configurazione richiesta
                  const requestedValue = configDetails.values.find(
                    (value) => value.id === requestedConfig.configurationValueId
                  );

                  // Trova il valore della configurazione di base, se esiste
                  const baseValue = baseConfig
                    ? configDetails.values.find(
                        (value) => value.id === baseConfig.configurationValueId
                      )
                    : null;

                  // Inizializza il prezzo da calcolare
                  let finalPrice = 0;

                  if (baseValue) {
                    // Caso 1: La configurazione esiste in entrambe (base e richiesta)
                    const basePrice = baseValue?.prezzo ?? 0;
                    const requestedPrice = requestedValue?.prezzo ?? 0;

                    // Calcola la differenza di prezzo tra la configurazione richiesta e quella di base
                    const priceDifference = requestedPrice - basePrice;

                    // Applica gli sconti alla differenza di prezzo
                    const discountedDifference =
                      priceDifference *
                      (1 - requestedConfig.scount / 100) *
                      (1 - requestedConfig.scount2 / 100);

                    // Usa la differenza scontata come prezzo finale
                    finalPrice = discountedDifference;
                  } else {
                    // Caso 2: La configurazione esiste solo nelle configurazioni richieste
                    const requestedPrice = requestedValue?.prezzo ?? 0;

                    // Applica gli sconti direttamente al prezzo richiesto
                    const discountedPrice =
                      requestedPrice *
                      (1 - requestedConfig.scount / 100) *
                      (1 - requestedConfig.scount2 / 100);

                    // Usa il prezzo scontato come prezzo finale
                    finalPrice = discountedPrice;
                  }

                  // Restituisci il testo e il prezzo calcolato
                  return {
                    text: requestedConfig.littleText,
                    price: Math.round(finalPrice),
                  };
                }),
              ]}
              showRequestedConfigurationsPrice={
                showRequestedConfigurationsPrice
              }
              totalBasedTrailerPrice={discountedTotalPrice}
              showBasedTrailerPrice={showBasedTrailerPrice}
              totalPrice={totalPrice}
              numberDay={numberDay}
              optionalConfigurations={[
                ...optionalConfigurations.map((optionalConfig) => {
                  // 1. Verifica se la configurazione opzionale è "real"
                  if (
                    !optionalConfig.isReal ||
                    !optionalConfig.configurationId
                  ) {
                    // Se non è real, calcola solo lo sconto 1 e 2
                    const discountedPrice =
                      optionalConfig.price *
                      (1 - optionalConfig.scount / 100) *
                      (1 - optionalConfig.scount2 / 100);
                    return {
                      text: optionalConfig.littleText,
                      price: Math.round(discountedPrice),
                    };
                  }

                  // 2. Cerca corrispondenza nelle configurazioni richieste
                  const matchingRequestedConfig = requestConfigurations.find(
                    (reqConfig) =>
                      reqConfig.configurationId ===
                      optionalConfig.configurationId
                  );

                  if (matchingRequestedConfig) {
                    // Calcola la differenza tra i prezzi delle configurazioni richieste e opzionali
                    const requestedPrice = matchingRequestedConfig.price ?? 0;
                    const optionalPrice = optionalConfig.price ?? 0;

                    // Calcola la differenza e applica gli sconti
                    const priceDifference = optionalPrice - requestedPrice;
                    const discountedDifference =
                      priceDifference *
                      (1 - optionalConfig.scount / 100) *
                      (1 - optionalConfig.scount2 / 100);

                    // Restituisci il testo e il prezzo scontato
                    return {
                      text: optionalConfig.littleText,
                      price: Math.round(discountedDifference),
                    };
                  }

                  // 3. Se non trova corrispondenza nelle configurazioni richieste, cerca nelle configurazioni di base
                  const matchingBaseConfig = defaultConfigurations.find(
                    (baseConfig) =>
                      baseConfig.configurationId ===
                      optionalConfig.configurationId
                  );

                  if (matchingBaseConfig) {
                    // Trova i dettagli della configurazione di base
                    const baseDetails = configurationAtTime?.find(
                      (config) =>
                        config.id === matchingBaseConfig.configurationId
                    );

                    const baseValue = baseDetails?.values.find(
                      (value) =>
                        value.id === matchingBaseConfig.configurationValueId
                    );

                    // Se c'è una configurazione di base corrispondente, calcola la differenza e gli sconti
                    if (baseValue) {
                      const basePrice = baseValue.prezzo ?? 0;
                      const optionalPrice = optionalConfig.price ?? 0;

                      // Calcola la differenza e applica gli sconti
                      const priceDifference = optionalPrice - basePrice;
                      const discountedDifference =
                        priceDifference *
                        (1 - optionalConfig.scount / 100) *
                        (1 - optionalConfig.scount2 / 100);

                      // Restituisci il testo e il prezzo scontato
                      return {
                        text: optionalConfig.littleText,
                        price: Math.round(discountedDifference),
                      };
                    }
                  }

                  // 4. Se non trova corrispondenza né nelle configurazioni richieste né in quelle di base, applica solo gli sconti
                  const discountedPrice =
                    optionalConfig.price *
                    (1 - optionalConfig.scount / 100) *
                    (1 - optionalConfig.scount2 / 100);

                  return {
                    text: optionalConfig.littleText,
                    price: Math.round(discountedPrice),
                  };
                }),
              ]}
            />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}

export default AnalyzePage;
