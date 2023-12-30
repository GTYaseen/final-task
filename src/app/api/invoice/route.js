import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

export async function POST(req) {
  const body = await req.json();
  try {
    const invoice = await prisma.invoice.create({
      data: body,
    });
    const response = new Response(JSON.stringify({
      success: true,
      invoice,
    }));
    return setCorsHeaders(response);
  } catch (error) {
    const response = new Response(JSON.stringify({
      success: false,
      error,
    }));
    return setCorsHeaders(response);
  }
}

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany();
    const response = new Response(JSON.stringify({
      success: true,
      invoices,
    }));
    return setCorsHeaders(response);
  } catch (error) {
    const response = new Response(JSON.stringify({
      success: false,
      error,
    }));
    return setCorsHeaders(response);
  }
}
