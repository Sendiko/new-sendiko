import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/skills/[id] - Update skill details
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ data: updatedSkill, message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

// DELETE /api/skills/[id] - Remove skill
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
