import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courtProviders = await prisma.courtProvider.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(courtProviders);
  } catch (error) {
    console.error("Error fetching court providers:", error);
    return NextResponse.json(
      { message: "Failed to fetch court providers" },
      { status: 500 }
    );
  }
}
