import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/education - List education background
export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ data: education });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/education - Add new education record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institution, degree, fieldOfStudy, location, startDate, endDate, isCurrent, description, grade, order } = body;

    if (!institution || !degree || !fieldOfStudy || !startDate) {
      return NextResponse.json({ error: 'Missing required fields (institution, degree, fieldOfStudy, startDate)' }, { status: 400 });
    }

    const newEducation = await prisma.education.create({
      data: {
        institution,
        degree,
        fieldOfStudy,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent ?? false,
        description,
        grade,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ data: newEducation, message: 'Education added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding education:', error);
    return NextResponse.json({ error: 'Failed to add education' }, { status: 500 });
  }
}
