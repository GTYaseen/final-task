import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const cat = searchParams.get("cat");

  let products = await prisma.product.findMany(
    cat
      ? {
          where: {
            categoryId: parseInt(cat),
          },
        }
      : {}
  );

  return Response.json(products);
}

export async function POST(req) {
  const body = await req.json();
  try {
    let product = await prisma.product.create({
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
