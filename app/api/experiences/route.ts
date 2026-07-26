import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/experiences - Fetch career history timeline
export async function GET() {
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: { order: 'asc' },
    });

    const formatted = experiences.map((exp) => ({
      ...exp,
      achievements: JSON.parse(exp.achievements || '[]'),
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/experiences - Create new work experience record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, role, employmentType, location, startDate, endDate, isCurrent, description, achievements, order } = body;

    if (!company || !role || !startDate || !description) {
      return NextResponse.json({ error: 'Missing required fields (company, role, startDate, description)' }, { status: 400 });
    }

    const newExperience = await prisma.workExperience.create({
      data: {
        company,
        role,
        employmentType: employmentType || 'FULL_TIME',
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent ?? false,
        description,
        achievements: JSON.stringify(achievements || []),
        order: order ?? 0,
      },
    });

    return NextResponse.json({ data: newExperience, message: 'Experience added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to add experience' }, { status: 500 });
  }
}
