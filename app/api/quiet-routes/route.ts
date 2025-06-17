// app/api/quiet-routes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const createRouteSchema = z.object({
  startAddress: z.string().min(1),
  endAddress: z.string().min(1),
  routeData: z.object({
    coordinates: z.array(z.array(z.number())),
    instructions: z.array(z.string()).optional(),
  }),
  distance: z.number().positive(),
  avgNoiseLevel: z.number().min(0).max(150),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const routes = await prisma.quietRoute.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(routes);
  } catch (error) {
    console.error("GET quiet routes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createRouteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const route = await prisma.quietRoute.create({
      data: {
        userId: session.user.id,
        ...validationResult.data,
      },
    });

    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    console.error("POST quiet route error:", error);
    return NextResponse.json(
      { error: "Failed to create route" },
      { status: 500 }
    );
  }
}
