import { GetAllPrevRequest, GetAllPerson } from "@/data/preventivi";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  const { requestId } = params;

  try {
    const requestOfPrev = await db.requestOfPrev.findUnique({
      where: { id: requestId },
      include: {
        person: true,
        variant: true,
      },
    });
    const variant = await db.variant.findUnique({
      where: {
        id: requestOfPrev?.variantId,
      },
      include: {
        nodes: {
          include: {
            configurationChangeAction: true,
          },
        },
        configurations: {
          orderBy: { order: "asc" },
          include: {
            values: {
              include: {
                configurationChange: {
                  include: {
                    change: true,
                    elseChange: true,
                  },
                },
              },
            },
            configurationVisibilityCondition: true,
          },
        },
        selectors: {
          orderBy: { order: "asc" },
          include: {
            options: {
              orderBy: { order: "asc" },
              include: {
                selectorOptionChange: {
                  include: {
                    change: true,
                    elseChange: true,
                  },
                },
              },
            },
            selectorVisibilityCondition: true,
          },
        },
      },
    });

    let person = null;
    if(requestOfPrev?.personId !== "" && requestOfPrev?.personId!== null) {
      person = await db.person.findUnique({
        where: {
          id: requestOfPrev?.personId??""
        }
      });
    }

    return NextResponse.json({requestOfPrev, variant, person}, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(null, { status: 200 });
  }
}
