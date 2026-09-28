import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Access Denied', message: 'This resource is not available' },
    {
      status: 403,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'Access Denied', message: 'This resource is not available' },
    {
      status: 403,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
