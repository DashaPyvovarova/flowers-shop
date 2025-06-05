import { NextRequest } from 'next/server';
import { db } from '../../../../database/drizzle';
import { addresses } from '../../../../database/schema';

export async function GET() {
  const all = await db.select().from(addresses);
  return Response.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const required = ['user_id', 'city', 'street', 'house_number'];
  const missing = required.filter((key) => body[key] === undefined);
  if (missing.length) return new Response(`Missing: ${missing.join(', ')}`, { status: 400 });

  const created = await db.insert(addresses).values(body).returning();
  return Response.json(created[0]);
}
