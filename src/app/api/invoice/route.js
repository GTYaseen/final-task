import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  try {
    let invoice = await prisma.invoice.create({
      data: body,
    });
    return Response.json({
      success: true,
      invoice,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
