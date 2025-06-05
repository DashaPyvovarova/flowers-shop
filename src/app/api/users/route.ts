import { NextRequest } from 'next/server';
import { db } from '../../../../database/drizzle';
import { users } from '../../../../database/schema';

export async function GET() {
  const allUsers = await db.select().from(users);
  return Response.json(allUsers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const requiredFields = ['login', 'email', 'password', 'role'];
  const missingFields = requiredFields.filter((key) => body[key] === undefined);

  if (missingFields.length) {
    return new Response(`Missing fields: ${missingFields.join(', ')}`, { status: 400 });
  }

  const newUser = await db.insert(users).values(body).returning();
  return Response.json(newUser[0]);
}
