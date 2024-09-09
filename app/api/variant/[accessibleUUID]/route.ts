import { GetVariantDataByAccessibleUUID } from "@/data/trailer";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { accessibleUUID: string } }) {
  const { accessibleUUID } = params;

  try {
    const variant = await GetVariantDataByAccessibleUUID(accessibleUUID);

    if (!variant) {
      return NextResponse.json({ message: 'Variant not found' }, { status: 404 });
    }

    return NextResponse.json(variant, { status: 200 });
  } catch (error) {
    console.error('Error fetching variant data:', error);
    return NextResponse.json({ message: 'Error fetching variant data' }, { status: 500 });
  }
}
