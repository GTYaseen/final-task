import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const cat = searchParams.get("cat");
  const query = searchParams.get("query");

  let whereClause = {};

  if (query) {
    whereClause = {
      name: {
        contains: query,
      },
    };
  }

  try {
    let products = await prisma.product.findMany({
      where: cat
        ? {
            categoryId: parseInt(cat),
            ...whereClause,
          }
        : whereClause,
      orderBy: {
        id: 'asc', // Order by id in ascending order
      },
    });

    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to the appropriate origin in production
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to the appropriate origin in production
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({
        success: false,
        error,
      }),
    };
  }
}

export async function POST(req) {
  const body = await req.json();
  try {
    let product = await prisma.product.create({
      data: body,
    });

    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to the appropriate origin in production
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        product,
      }),
    };
  } catch (error) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to the appropriate origin in production
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: false,
        error,
      }),
    };
  }
}
