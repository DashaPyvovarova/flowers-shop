import { NextRequest } from 'next/server';
import { db } from '../../../../database/drizzle';
import { reviews } from '../../../../database/schema';

export async function GET() {
  const all = await db.select().from(reviews);
  return Response.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const required = ['user_id', 'flower_id', 'rating'];
  const missing = required.filter((key) => body[key] === undefined);
  if (missing.length) return new Response(`Missing: ${missing.join(', ')}`, { status: 400 });

  const created = await db.insert(reviews).values(body).returning();
  return Response.json(created[0]);
}
