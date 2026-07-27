import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Platform } from '@prisma/client';

// GET /api/projects - List projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const platform = searchParams.get('platform');
    const featuredOnly = searchParams.get('featured') === 'true';

    const whereClause: Record<string, unknown> = {};

    if (platform && Object.values(Platform).includes(platform as Platform)) {
      whereClause.platform = platform as Platform;
    }

    if (featuredOnly) {
      whereClause.featured = true;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        features: {
          orderBy: { order: 'asc' },
        },
        assets: {
          orderBy: { order: 'asc' },
        },
        skills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: [
        { featuredOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ data: projects, count: projects.length });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      tagline,
      description,
      platform,
      longDescription,
      coverImageUrl,
      architecture,
      githubUrl,
      appStoreUrl,
      playStoreUrl,
      demoUrl,
      skillIds,
      features,
      featured,
      featuredOrder,
      challenge,
      solution,
      status,
    } = body;

    if (!title || !slug || !tagline || !description) {
      return NextResponse.json({ error: 'Missing required fields (title, slug, tagline, description)' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        tagline,
        description,
        longDescription,
        challenge,
        solution,
        platform: platform || 'CROSS_PLATFORM',
        status: status || 'COMPLETED',
        featured: Boolean(featured),
        featuredOrder: featuredOrder !== undefined ? Number(featuredOrder) : 0,
        coverImageUrl,
        architecture,
        githubUrl,
        appStoreUrl,
        playStoreUrl,
        demoUrl,
        features: features ? {
          create: features.map((f: { title: string; description: string; icon?: string }, index: number) => ({
            title: f.title,
            description: f.description,
            icon: f.icon,
            order: index + 1,
          })),
        } : undefined,
        skills: skillIds ? {
          create: skillIds.map((sId: string) => ({
            skillId: sId,
          })),
        } : undefined,
      },
      include: {
        features: true,
        skills: { include: { skill: true } },
      },
    });

    return NextResponse.json({ data: project, message: 'Project created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
