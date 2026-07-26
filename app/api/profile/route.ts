import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/profile - Fetch developer profile details
export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/profile - Update developer profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const existingProfile = await prisma.profile.findFirst();

    if (!existingProfile) {
      const newProfile = await prisma.profile.create({
        data: body,
      });
      return NextResponse.json({ data: newProfile, message: 'Profile created' }, { status: 201 });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: existingProfile.id },
      data: body,
    });

    return NextResponse.json({ data: updatedProfile, message: 'Profile updated' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
