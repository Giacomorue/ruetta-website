"use server";

import { db } from "@/lib/prisma";

export const GetAllPrevRequest = async () => {
  try {
    return await db.requestOfPrev.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        person: true,
        variant: true,
      },
    });
  } catch (err) {
    return [];
  }
};

export const GetAllPerson = async () => {
  try {
    return await db.person.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        requestOfPrev: true,
      },
    });
  } catch (err) {
    return [];
  }
};
