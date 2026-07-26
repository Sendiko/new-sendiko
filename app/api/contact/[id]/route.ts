import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MessageStatus } from '@prisma/client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/contact/[id] - Update message status (e.g., READ / ARCHIVED)
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(MessageStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid message status' }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: status as MessageStatus },
    });

    return NextResponse.json({ data: updated, message: 'Message status updated' });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

// DELETE /api/contact/[id] - Delete contact message
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
