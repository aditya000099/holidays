// app/middleware.js

import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server';

export default withAuth(
    async function middleware(req) {
        const url = req.nextUrl.pathname;

        if (url.startsWith('/admin')) {
          const isAdmin = req.nextauth.token?.user?.isAdmin;
          const isAuthenticated = !!req.nextauth.token;

            if(!isAuthenticated) {
                return NextResponse.redirect(new URL('/auth', req.url))
            }

           if (!isAdmin) {
                return NextResponse.redirect(new URL('/', req.url))
           }
        }
     },
    {
        callbacks: {
          authorized: () => {
            return true
           }
        }
     }
);

export const config = {
    matcher: ["/admin"],
 };