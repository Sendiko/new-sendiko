import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/projects/[id] - Fetch single project by ID or slug
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        features: {
          orderBy: { order: 'asc' },
        },
        assets: {
          orderBy: { order: 'asc' },
        },
        skills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/projects/[id] - Update project details
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { id: _id, features, assets, skills, createdAt, updatedAt, ...updateData } = body;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        features: true,
        assets: true,
        skills: { include: { skill: true } },
      },
    });

    return NextResponse.json({ data: updatedProject, message: 'Project updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating project:', error);
    let errorMessage = 'Failed to update project';
    const err = error as { code?: string; message?: string };
    if (err?.code === 'P2002') {
      errorMessage = 'A project with this URL slug already exists. Please enter a unique URL slug.';
    } else if (err?.message) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// DELETE /api/projects/[id] - Remove project
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
