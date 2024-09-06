"use client";

import { Suspense, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import {
  Category,
  Colors,
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
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { createNodesAction } from "@/actions/trailer";
import { toast } from "../ui/use-toast";
import CanvasLoader from "../CanvasLoader";

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
  colors: Colors[];
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

const Mesh = ({
  variant,
  currentColor,
  configurations,
}: {
  variant: VariantData;
  currentColor: Colors;
  configurations: { configurationId: string; valueId: string }[];
}) => {
  const adminLoader = useAdminLoader();

  const gltf = useLoader(GLTFLoader, `${currentColor.fileUrl}`, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/"); // Assicurati che questo percorso corrisponda alla posizione dei file decoder Draco
    loader.setDRACOLoader(dracoLoader);
  });

  function traverseNodes(node: any, variant: VariantData, newNodes: string[]) {
    // Controlla se il nodo esiste già nella variante
    const existingNode = variant.nodes.find(
      (variantNode) => variantNode.name === node.name
    );

    if (!existingNode) {
      // Aggiungi il nodo all'array provvisorio se non esiste
      newNodes.push(node.name);
    }

    // Se il nodo ha dei figli, esegui la funzione ricorsivamente su ciascun figlio
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverseNodes(child, variant, newNodes);
      }
    }
  }

  useEffect(() => {
    console.log("Updating configurations");

    const processNodes = async () => {
      // Array provvisorio per i nuovi nodi che non esistono ancora nella variante
      const newNodes: string[] = [];

      // Cicla su tutti i nodi presenti nel modello GLTF
      for (const n of gltf.scene.children) {
        // Avvia la traversata per ogni figlio della scena
        traverseNodes(n, variant, newNodes);
      }

      // Se ci sono nuovi nodi da salvare
      if (newNodes.length > 0) {
        // Avvia il caricamento
        adminLoader.startLoading();

        await createNodesAction(variant.id, newNodes).then((res) => {
          if (!res) {
            return;
          }

          if (res.error) {
            toast({
              variant: "destructive",
              title: "Errore",
              description: res.error,
            });
          }

          if (res.message) {
            toast({
              title: "Nodi creati con successo",
              description: `${newNodes.length} nodi aggiunti.`,
            });
          }
        });

        adminLoader.stopLoading();
      }

      // console.log(newNodes);
    };

    // Processa i nodi del GLTF
    processNodes();
  }, []);

  useEffect(() => {
    variant.nodes.forEach((node) => {

      if (node.alwaysHidden === true) {
        if (gltf.nodes[node.name]) {
          gltf.nodes[node.name].visible = false;
        }
      }
    });

    for (const currentConfig of configurations) {
      const configuration = variant.configurations.find(
        (c) => c.id === currentConfig.configurationId
      );

      if (!configuration) continue;
      analizeConfigurationValue(configuration, currentConfig, configurations);
    }

  }, [configurations, currentColor]);

  const analizeConfigurationValue = (
    configuration: {
      id: string;
      name: string;
      defaultValue: string | null;
      createdAt: Date;
      updatedAt: Date;
      order: number;
      variantId: string;
      visibilityConditionId: string | null;
    } & {
      values: (ConfigurationValue & {
        configurationChange: (ConfigurationChange & {
          change: ConfigurationChangeAction[];
          elseChange: ConfigurationChangeAction[];
        })[];
      })[];
      configurationVisibilityCondition: ConfigurationVisibilityCondition[];
    },
    currentConfig: { configurationId: string; valueId: string },
    totalConfigurationState: { configurationId: string; valueId: string }[]
  ) => {
    for (const value of configuration.values) {
      if (value.id === currentConfig.valueId) {
        if (value.configurationChangeFirstNode.length > 0) {
          //RICORSIONE CON AZIONI
          for (const action of value.configurationChangeFirstNode) {
            const change = value.configurationChange.find(
              (c) => c.id === action
            );

            if (!change) continue;

            doConfigurationChangeAction(value, change, totalConfigurationState);
          }
        }
      } else {
        if (value.configurationElseChangeFirstNode.length > 0) {
          //RICORSIONE CON AZIONI

          // console.log("Value:", value.value, " n:",  value.configurationElseChangeFirstNode.length);

          for (const action of value.configurationElseChangeFirstNode) {
            // console.log(action);
            const change = value.configurationChange.find(
              (c) => c.id === action
            );

            if (!change) continue;

            doConfigurationChangeAction(value, change, totalConfigurationState);
          }
        }
      }
    }
  };

  const doConfigurationChangeAction = (
    value: ConfigurationValue & {
      configurationChange: (ConfigurationChange & {
        change: ConfigurationChangeAction[];
        elseChange: ConfigurationChangeAction[];
      })[];
    },
    change: ConfigurationChange & {
      change: ConfigurationChangeAction[];
      elseChange: ConfigurationChangeAction[];
    },
    totalConfigurationState: { configurationId: string; valueId: string }[]
  ) => {
    // console.log(change);

    if (change.haveIf) {
      //FARE AZIONI CON IF

      const currentConfigurationValue = totalConfigurationState.find(
        (c) => c.configurationId === change.configurationId
      );

      if (!currentConfigurationValue) {
        return;
      }

      let check = false;

      if (change.checkType === "EQUAL") {
        check = currentConfigurationValue.valueId === change.expectedValue;
      } else {
        check = currentConfigurationValue.valueId !== change.expectedValue;
      }

      if (check && change.change.length > 0) {
        for (const action of change.change) {
          const node = variant.nodes.find((n) => n.id === action.nodeId);

          if (!node) continue;

          if (gltf.nodes[node.name]) {
            gltf.nodes[node.name].visible = action.visible;

            if (action.changePosition && action.position) {
              gltf.nodes[node.name].position.set(
                action.position.x ?? 0,
                action.position.y ?? 0,
                action.position.z ?? 0
              );
            }

            if (action.changeScale && action.scale) {
              gltf.nodes[node.name].scale.set(
                action.scale.x ?? 0,
                action.scale.y ?? 0,
                action.scale.z ?? 0
              );
            }
          }
        }
      } else if (!check && change.elseChange.length > 0) {
        for (const action of change.elseChange) {
          const node = variant.nodes.find((n) => n.id === action.nodeId);

          if (!node) continue;

          if (gltf.nodes[node.name]) {
            gltf.nodes[node.name].visible = action.visible;

            if (action.changePosition && action.position) {
              gltf.nodes[node.name].position.set(
                action.position.x ?? 0,
                action.position.y ?? 0,
                action.position.z ?? 0
              );
            }

            if (action.changeScale && action.scale) {
              gltf.nodes[node.name].scale.set(
                action.scale.x ?? 0,
                action.scale.y ?? 0,
                action.scale.z ?? 0
              );
            }
          }
        }
      }

      if (check) {
        for (const action of change.ifRecId) {
          const newChange = value.configurationChange.find(
            (c) => c.id === action
          );

          if (!newChange) continue;

          doConfigurationChangeAction(
            value,
            newChange,
            totalConfigurationState
          );
        }
      } else {
        for (const action of change.elseRecId) {
          const newChange = value.configurationChange.find(
            (c) => c.id === action
          );

          if (!newChange) continue;

          doConfigurationChangeAction(
            value,
            newChange,
            totalConfigurationState
          );
        }
      }
    } else {
      //FARE AZIONI SENZA IF

      for (const action of change.change) {
        const node = variant.nodes.find((n) => n.id === action.nodeId);

        if (!node) continue;

        if (gltf.nodes[node.name]) {
          gltf.nodes[node.name].visible = action.visible;

          if (action.changePosition && action.position) {
            gltf.nodes[node.name].position.set(
              action.position.x ?? 0,
              action.position.y ?? 0,
              action.position.z ?? 0
            );
          }

          if (action.changeScale && action.scale) {
            gltf.nodes[node.name].scale.set(
              action.scale.x ?? 0,
              action.scale.y ?? 0,
              action.scale.z ?? 0
            );
          }
        }
      }
    }
  };

  return (
    <>
      <OrbitControls
        enablePan={false}
        zoomToCursor={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={15}
        maxDistance={45}
        panSpeed={1}
      />
      <mesh
        position={[0, 0, 0]}
        scale={[1, 1, 1]}
        castShadow
        frustumCulled={true}
      >
        <primitive object={gltf.scene} />
      </mesh>
    </>
  );
};

export default Mesh;