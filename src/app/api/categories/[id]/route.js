import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  try {
    let product = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });
    return Response.json({
      success: true,
      product,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    let product = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });
    return Response.json({
      success: true,
      product,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
