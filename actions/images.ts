"use server";

import { db } from "@/lib/prisma";
import { pusher } from "@/lib/pusherServer";
import { revalidatePath } from "next/cache";

export async function InsertImageInDb(images: string[], socketId: string) {
  if (!images || images.length === 0) {
    return { error: "Nessuna immagine da inserire." };
  }

  try {
    const dbImages = await db.image.createMany({
      data: images.map((image) => ({
        link: image,
      })),
    });
    if (dbImages.count === 0) {
      return { error: "Nessuna immagine è stata inserita nel database." };
    }
    const createdImages = await db.image.findMany({
      where: {
        link: {
          in: images,
        },
      },
    });
    revalidatePath("/admin/immagini");

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return {
      success: "Immagini inserite con successo.",
      images: createdImages,
    };
  } catch (err) {
    console.error("Error:", err);
    return { error: "Impossibile inserire le immagini nel database." };
  }
}

export async function DeleteImageFromDb(imageId: string, socketId: string) {
  if (!imageId || imageId === "") {
    return { error: "Id immagine non valido." };
  }

  //Logica di check per le immagini da eliminare

  try {
    const deltedImage = await db.image.delete({
      where: {
        id: imageId,
      },
    });
    revalidatePath("/admin/immagini");

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: "Immagine eliminata con successo." };
  } catch (err) {
    console.error("Error:", err);
    return { error: "Impossibile eliminare l'immagine dal database." };
  }
}
