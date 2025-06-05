import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { db } from '../../../../../database/drizzle';
import { users } from '../../../../../database/schema';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.select().from(users).where(eq(users.id, id));
  if (!user.length) return new Response('User not found', { status: 404 });
  return Response.json(user[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const updated = await db.update(users).set(updates).where(eq(users.id, id)).returning();
  if (!updated.length) return new Response('User not found', { status: 404 });
  return Response.json(updated[0]);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await db.delete(users).where(eq(users.id, id)).returning();
  if (!deleted.length) return new Response('User not found', { status: 404 });
  return Response.json(deleted[0]);
}
