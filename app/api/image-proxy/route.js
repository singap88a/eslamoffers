import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Image URL is required', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch image from external source: ${response.status} ${response.statusText}`, errorText);
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }

    const imageBlob = await response.blob();
    
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      },
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
} 