import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { db } from '../../../../../database/drizzle';
import { orderItems } from '../../../../../database/schema';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const item = await db.select().from(orderItems).where(eq(orderItems.id, params.id));
  if (!item.length) return new Response('Not found', { status: 404 });
  return Response.json(item[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const updated = await db.update(orderItems).set(updates).where(eq(orderItems.id, params.id)).returning();
  if (!updated.length) return new Response('Not found', { status: 404 });
  return Response.json(updated[0]);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const deleted = await db.delete(orderItems).where(eq(orderItems.id, params.id)).returning();
  if (!deleted.length) return new Response('Not found', { status: 404 });
  return Response.json(deleted[0]);
}
