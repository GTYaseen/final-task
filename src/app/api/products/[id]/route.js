import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  try {
    let product = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });
    
    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to the appropriate origin in production
        'Access-Control-Allow-Methods': 'PUT',
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
        'Access-Control-Allow-Methods': 'PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: false,
        error,
      }),
    };
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    let product = await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to the appropriate origin in production
        'Access-Control-Allow-Methods': 'DELETE',
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
        'Access-Control-Allow-Methods': 'DELETE',
      },
      body: JSON.stringify({
        success: false,
        error,
      }),
    };
  }
}
