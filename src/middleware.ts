import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { getUserCountry } from './lib/utils';

const protectedRoutes = createRouteMatcher([
  '/dashboard',
  '/dashboard/(.*)',
  '/checkout',
  '/profile',
  '/profile/(.*)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (protectedRoutes(req)) {
    await auth.protect();
  }

  // Creating a basic response
  let response = NextResponse.next();

  /*---------Handle Country detection----------*/
  // Step 1: Check if country is already set in cookies
  const countryCookie = req.cookies.get('userCountry');

  if (!countryCookie) {
    // Step 2: Get the user country using the helper function
    const userCountry = await getUserCountry();

    // Step 3: Set a cookie with the detected or default country for future requests
    response.cookies.set('userCountry', JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return response;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
