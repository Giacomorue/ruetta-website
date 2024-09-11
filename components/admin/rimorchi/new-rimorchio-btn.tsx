"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { Image } from "prisma/prisma-client";
// import SelectLogo from "./select-logo";
import ImageL from "next/image";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  CreateNewTrailerSchema,
  CreateNewTrailerType,
} from "@/schemas/schema-trailer";

import "react-quill/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fornitori } from "@/constants";
import { CreateTrailer } from "@/actions/trailer";

function NewRimorchioBtn({ socketId, onRevalidate } : { socketId: string, onRevalidate: () => void }) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateNewTrailerType>({
    resolver: zodResolver(CreateNewTrailerSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
      fornitore: "",
    },
  });

  const onSubmit = async (data: CreateNewTrailerType) => {
    adminLoader.startLoading();
    await CreateTrailer(data, socketId)
      .then((res) => {
        if (!res) return;
        if (res.error) {
          toast({
            variant: "destructive",
            title: "Errore",
            description: res.error,
          });
        }
        if (res.trailer) {
          router.push("/admin/rimorchi/" + res.trailer.id);
          adminLoader.stopLoading();
          onRevalidate();
        }
      })
      .catch((err) => {
        console.log(err);
        adminLoader.stopLoading();
      });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <Button className="gap-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi un rimorchio</span>
        </Button>
      </>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi un rimorchio</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Aggiungi un rimorchio</DialogTitle>
          <DialogDescription>
            Crea qua un nuovo rimorchio da poter visualizzare sul sito.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>
                      Nome{" "}
                      {/* <span className="after:content-['*'] after:text-primary" /> */}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome rimorchio" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fornitore"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Fornitore</FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un fornitore" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Fornitori.map((fornitore) => (
                          <SelectItem key={fornitore.id} value={fornitore.id}>
                            {fornitore.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-3" type="submit">
                Aggiungi rimorchio
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default NewRimorchioBtn;
