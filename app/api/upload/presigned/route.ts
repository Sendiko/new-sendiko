import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl, getPresignedDownloadUrl } from '@/lib/storage';

// POST /api/upload/presigned - Request a presigned URL for direct PUT upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, folder = 'uploads', expirySeconds = 86400 } = body;

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing required field "filename"' },
        { status: 400 }
      );
    }

    const result = await getPresignedUploadUrl(filename, folder, expirySeconds);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Presigned upload URL generated successfully',
    });
  } catch (error: any) {
    console.error('[PRESIGNED UPLOAD ERROR]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate presigned upload URL' },
      { status: 500 }
    );
  }
}

// GET /api/upload/presigned?key=uploads/xxx - Request a presigned URL for GET download
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const key = searchParams.get('key');
    const expirySeconds = parseInt(searchParams.get('expiry') || '86400', 10);

    if (!key) {
      return NextResponse.json(
        { error: 'Missing required query parameter "key"' },
        { status: 400 }
      );
    }

    const result = await getPresignedDownloadUrl(key, expirySeconds);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Presigned download URL generated successfully',
    });
  } catch (error: any) {
    console.error('[PRESIGNED DOWNLOAD ERROR]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate presigned download URL' },
      { status: 500 }
    );
  }
}
