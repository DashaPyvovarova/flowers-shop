import { NextRequest } from 'next/server';
import { db } from '../../../../database/drizzle';
import { flowerCategories } from '../../../../database/schema';

export async function GET() {
  const all = await db.select().from(flowerCategories);
  return Response.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) {
    return new Response('Missing field: name', { status: 400 });
  }

  const created = await db.insert(flowerCategories).values(body).returning();
  return Response.json(created[0]);
}
