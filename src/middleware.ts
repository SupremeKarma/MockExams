import { withImplementationHiding } from '@/middleware/implementation-hiding';
import { type NextRequest, NextResponse } from 'next/server';

const middleware = (_request: NextRequest) => {
  return NextResponse.next();
};

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

export default withImplementationHiding(middleware);
