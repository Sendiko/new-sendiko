import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/contact - List contact messages (for admin dashboard)
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: messages, count: messages.length });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/contact - Submit a contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderName, senderEmail, subject, message } = body;

    if (!senderName || !senderEmail || !subject || !message) {
      return NextResponse.json({ error: 'All fields (senderName, senderEmail, subject, message) are required' }, { status: 400 });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        senderName,
        senderEmail,
        subject,
        message,
      },
    });

    return NextResponse.json({ data: newMessage, message: 'Message sent successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
