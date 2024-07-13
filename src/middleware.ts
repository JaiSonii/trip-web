import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { verifyToken } from './utils/auth'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  const loggedInUserNotAccessPaths = request.nextUrl.pathname === '/login' || request.nextUrl.pathname == '/'
  
  if(loggedInUserNotAccessPaths){
    if(token){
      return NextResponse.redirect(new URL('/user/parties', request.url))
    }
  }else{
    if(!token){
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }


  
  return NextResponse.next()
}

export const config = {
  matcher : [
    '/',
    '/login',
    '/user/:path',
    '/user/:path*',
    '/user/parties/:path/party-details',
    '/user/parties/:path/passbook',
    '/user/parties/:path/trips',
    '/api/:path*'
  ]
}
// See "Matching Paths" below to learn more
