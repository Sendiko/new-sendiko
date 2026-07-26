import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/experiences/[id] - Update work experience
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { company, role, employmentType, location, startDate, endDate, isCurrent, description, achievements, order } = body;

    const updated = await prisma.workExperience.update({
      where: { id },
      data: {
        company,
        role,
        employmentType,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        description,
        achievements: Array.isArray(achievements) ? JSON.stringify(achievements) : achievements,
        order,
      },
    });

    return NextResponse.json({ data: updated, message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

// DELETE /api/experiences/[id] - Delete work experience
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
