import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageL from "next/image";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface SelectorDialogProps {
  images: string[];
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void; // Funzione per selezionare la configurazione
}

const MoreInfoModal: React.FC<SelectorDialogProps> = ({
  images,
  name,
  description,
  isSelected,
  onSelect,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const goToPreviousImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsDialogOpen(false);
  };

  const goToNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
    setIsDialogOpen(false);
  };

  const openFullScreen = (index: number) => {
    setActiveImageIndex(index);
    setIsFullScreen(true);
    setIsDialogOpen(false);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setIsDialogOpen(true);
  };

  const handleSelectAndClose = () => {
    onSelect();
    setIsDialogOpen(false); // Chiude il modal
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullScreen();
        setIsDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <span
            className={`text-sm underline transition-all duration-150 cursor-pointer ${
              isSelected
                ? "text-primary-foreground hover:text-muted-foreground"
                : "text-muted-foreground hover:text-primary"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            Maggiori informazioni
          </span>
        </DialogTrigger>
        <DialogContent
          className="max-w-[90%] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>

          {/* Carosello di immagini - tutte le immagini sono visibili e cliccabili */}
          <div className="flex space-x-4 overflow-x-auto py-4">
            {images.map((image, idx) => (
              <div
                key={idx}
                className="relative min-w-[300px] min-h-[200px] rounded-[10px] border border-muted-foreground overflow-hidden cursor-pointer"
                onClick={() => openFullScreen(idx)} // Apre la preview full-screen
              >
                <ImageL
                  className="object-cover"
                  src={image ?? "/default-image.png"}
                  alt={`Immagine ${idx + 1}`}
                  fill
                />
              </div>
            ))}
          </div>

          {/* Descrizione */}
          <div className="py-4">
            <h2 className="text-xl font-semibold mb-2">
              Maggiori informazioni
            </h2>
            <p
              className="text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* Bottoni per selezionare e chiudere */}
          <div className="flex justify-end space-x-4 mt-4">
            <DialogTrigger asChild>
              <Button variant="outline">
                <FaTimes className="mr-2" />
                Chiudi
              </Button>
            </DialogTrigger>
            <Button onClick={handleSelectAndClose} disabled={isSelected}>
              {isSelected
                ? "Configurazione Selezionata"
                : "Seleziona Configurazione"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modalità full-screen con frecce */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[999999999] flex items-center justify-center"
          onClick={closeFullScreen} // Chiude solo la preview
        >
          {/* Immagine full-screen */}
          <div
            className="relative w-[90vw] h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Impedisce la propagazione al dialogo principale
          >
            <ImageL
              className="object-contain"
              src={images[activeImageIndex] ?? "/default-image.png"}
              alt={`Immagine ${activeImageIndex + 1}`}
              fill
            />
            {/* Pulsante Chiudi */}
            <Button
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white"
              onClick={closeFullScreen}
            >
              <FaTimes className="w-6 h-6" />
            </Button>
            {/* Freccia sinistra */}
            <Button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
            >
              <FaArrowLeft className="w-5 h-5" />
            </Button>
            {/* Freccia destra */}
            <Button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
            >
              <FaArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreInfoModal;

