import { NextRequest, NextResponse } from 'next/server';
import { host } from './urlApi';

export default function middleware(req: NextRequest) {
    const token = req.cookies.get('key')?.value;
    const pathname = req.nextUrl.pathname;

    if (!token && pathname !== '/auth') {
        return NextResponse.redirect(`${host}/auth`);
    }

    if (token) {
        if (token === 'qa') {
            if (pathname === '/auth') {
                return NextResponse.redirect(`${host}/qa`);
            } else if (pathname === '/qa/get-pdf' || pathname === '/qa') {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(`${host}/auth`);
            }
        }

        if (token === 'prod') {
            if (pathname === '/auth') {
                return NextResponse.redirect(`${host}/prod/get-list`);
            } else if (pathname === '/prod/get-list' || pathname === '/prod/get-pdf' || pathname === '/prod/list-upload') {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(`${host}/auth`);
            }
        }

        if (token === 'eng') {
            if (pathname === '/auth') {
                return NextResponse.redirect(`${host}/eng/list-upload`);
            } else if (pathname === '/eng/list-upload' || pathname === '/eng/get-pdf') {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(`${host}/auth`);
            }
        }

        if (token === 'sgi') {
            if (pathname === '/auth') {
                return NextResponse.redirect(`${host}/sgi/upload-it`);
            } else if (pathname === '/sgi/upload-it' || pathname === '/sgi/upload-quality-file' || pathname === '/sgi/get-pdf' || pathname === '/sgi/view-it-qa') {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(`${host}/auth`);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [/* '/qa/:path*', '/eng/:path*', '/prod/:path*', '/sgi/:path*' */ '/auth/'],
};
