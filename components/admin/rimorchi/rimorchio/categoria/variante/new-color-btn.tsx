// "use client";

// import React, { useState, useEffect } from "react";
// import { Variant } from "prisma/prisma-client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { FaPlus } from "react-icons/fa6";
// import { useAdminLoader } from "@/hooks/useAdminLoader";
// import { useRouter } from "next/navigation";
// import { toast } from "@/components/ui/use-toast";
// import { NewColorSchema, NewColorType } from "@/schemas/schema-trailer";
// // import { AddNewColor } from "@/actions/trailer";

// function NewColorBtn({ variant, socketId }: { variant: Variant, socketId: string }) {
//   const adminLoader = useAdminLoader();
//   const router = useRouter();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const form = useForm<NewColorType>({
//     resolver: zodResolver(NewColorSchema),
//     defaultValues: {
//       name: "",
//     },
//   });

//   const onSubmit = async (data: NewColorType) => {
//     adminLoader.startLoading();

//     await AddNewColor(data, variant.id, socketId).then((res) => {
//       if (!res) return;
//       if (res.error) {
//         toast({
//           variant: "destructive",
//           title: "Errore",
//           description: res.error,
//         });
//       }

//       if (res.success) {
//         toast({
//           title: "Successo",
//           description: "Colore creato con successo",
//         });
//         setIsDialogOpen(false);
//         form.reset();
//         // router.refresh(); // Rimuovendo il commento, aggiorni la pagina.
//         router.push(res.revalidatePath + "color/" + res.newColor.id);
//       }
//     });

//     adminLoader.stopLoading();
//   };

//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return (
//       <Button size={"lg"} className="gap-x-2">
//         <FaPlus className="w-4 h-4" />
//         <span>Aggiungi un colore</span>
//       </Button>
//     );
//   }

//   return (
//     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//       <DialogTrigger asChild>
//         <Button className="gap-x-2">
//           <FaPlus className="w-4 h-4" />
//           <span>Aggiungi un colore</span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
//         <DialogHeader>
//           <DialogTitle>Aggiungi un nuovo colore</DialogTitle>
//           <DialogDescription>
//             Crea un nuovo colore per la variante {variant.name}
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem className="space-y-1">
//                   <FormLabel>Nome</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder="Nome del colore" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button className="mt-3" type="submit">
//               Aggiungi Colore
//             </Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default NewColorBtn;
