import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/skills - List skill categories and skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featuredOnly = searchParams.get('featured') === 'true';

    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          where: featuredOnly ? { featured: true } : undefined,
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/skills - Create a new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, name, yearsOfExp, iconUrl, featured, order } = body;

    if (!categoryId || !name) {
      return NextResponse.json({ error: 'Missing required fields (categoryId, name)' }, { status: 400 });
    }

    const newSkill = await prisma.skill.create({
      data: {
        categoryId,
        name,
        yearsOfExp,
        iconUrl,
        featured: featured ?? false,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ data: newSkill, message: 'Skill created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
