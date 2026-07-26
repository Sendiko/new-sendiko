import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/education/[id] - Update education record
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { institution, degree, fieldOfStudy, location, startDate, endDate, isCurrent, description, grade, order } = body;

    const updated = await prisma.education.update({
      where: { id },
      data: {
        institution,
        degree,
        fieldOfStudy,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        description,
        grade,
        order,
      },
    });

    return NextResponse.json({ data: updated, message: 'Education updated successfully' });
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

// DELETE /api/education/[id] - Delete education record
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
