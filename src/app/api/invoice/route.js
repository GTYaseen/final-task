import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  try {
    let invoice = await prisma.invoice.create({
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
        invoice,
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

export async function GET() {
  try {
    let invoices = await prisma.invoice.findMany();
    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to the appropriate origin in production
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({
        success: true,
        invoices,
      }),
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
