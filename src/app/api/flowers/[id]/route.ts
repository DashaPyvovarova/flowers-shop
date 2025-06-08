import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { db } from '../../../../../database/drizzle';
import { flowers } from '../../../../../database/schema';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.select().from(flowers).where(eq(flowers.id, id));
  if (!item.length) return new Response('Not found', { status: 404 });
  return Response.json(item[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const updated = await db.update(flowers).set(updates).where(eq(flowers.id, id)).returning();
  if (!updated.length) return new Response('Not found', { status: 404 });
  return Response.json(updated[0]);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await db.delete(flowers).where(eq(flowers.id, id)).returning();
  if (!deleted.length) return new Response('Not found', { status: 404 });
  return Response.json(deleted[0]);
}
