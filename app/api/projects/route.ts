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

    const sanitizedSlug = slug ? String(slug).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '';

    if (!title || !sanitizedSlug || !tagline || !description) {
      return NextResponse.json({ error: 'Missing required fields (title, slug, tagline, description)' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: sanitizedSlug,
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
        downloadsCount: body.downloadsCount ? Number(body.downloadsCount) : 0,
        rating: body.rating !== undefined && body.rating !== '' ? Number(body.rating) : 5.0,
        testCoverage: body.testCoverage !== undefined && body.testCoverage !== '' && body.testCoverage !== null ? Number(body.testCoverage) : null,
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
  } catch (error: unknown) {
    console.error('Error creating project:', error);
    let errorMessage = 'Failed to create project';
    const err = error as { code?: string; message?: string };
    if (err?.code === 'P2002') {
      errorMessage = 'A project with this URL slug already exists. Please enter a unique URL slug.';
    } else if (err?.message) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
