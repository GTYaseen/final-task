import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import cors from "cors";

app.use(cors());
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  try {
    let category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });
    return Response.json({
      success: true,
      category,
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
    // Check if there are associated products
    const productsInCategory = await prisma.product.findMany({
      where: {
        categoryId: parseInt(id),
      },
    });

    if (productsInCategory.length > 0) {
      return Response.json({
        success: false,
        error: "Cannot delete category with associated products.",
      });
    }

    // If no associated products, proceed with deletion
    const deletedCategory = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    return Response.json({
      success: true,
      category: deletedCategory,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}