"use server";

import { db } from "@/lib/prisma";

export const GetAllImages = async () => {
  try {
    return await db.image.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    return [];
  }
};
