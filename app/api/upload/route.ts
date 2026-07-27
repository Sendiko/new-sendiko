import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, listFiles, deleteFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadFile(buffer, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'File uploaded successfully',
    });
  } catch (error: any) {
    console.error('[API UPLOAD ERROR]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file to MinIO object storage' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const prefix = searchParams.get('prefix') || '';

    const files = await listFiles(prefix);

    return NextResponse.json({
      success: true,
      data: files,
      count: files.length,
    });
  } catch (error: any) {
    console.error('[API STORAGE LIST ERROR]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve storage files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    let key = searchParams.get('key');

    if (!key) {
      try {
        const body = await request.json();
        key = body.key;
      } catch {
        // body json parsing failed or empty
      }
    }

    if (!key) {
      return NextResponse.json({ error: 'Missing object key to delete' }, { status: 400 });
    }

    await deleteFile(key);

    return NextResponse.json({
      success: true,
      message: `Object "${key}" deleted successfully`,
    });
  } catch (error: any) {
    console.error('[API STORAGE DELETE ERROR]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete file from object storage' },
      { status: 500 }
    );
  }
}
