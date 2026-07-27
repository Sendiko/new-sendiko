import { NextRequest, NextResponse } from 'next/server';
import { getFileStream } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.key || resolvedParams.key.length === 0) {
      return new NextResponse('File key required', { status: 400 });
    }

    const key = resolvedParams.key.join('/');
    const { stream, stat } = await getFileStream(key);

    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err: Error) => controller.error(err));
      },
      cancel() {
        stream.destroy();
      },
    });

    const headers = new Headers();
    const contentType = stat.metaData?.['content-type'] || stat.metaData?.['Content-Type'] || 'application/octet-stream';
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', stat.size.toString());
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (stat.etag) {
      headers.set('ETag', stat.etag);
    }

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('[STORAGE PROXY ERROR]:', error);
    if (error?.code === 'NotFound' || error?.code === 'NoSuchKey' || error?.notFound) {
      return new NextResponse('File not found', { status: 404 });
    }
    return new NextResponse('Error retrieving file from storage', { status: 500 });
  }
}
