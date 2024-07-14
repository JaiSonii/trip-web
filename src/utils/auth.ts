// utils/auth.ts
import { auth } from '@/firebase/firebaseAdmin';

export async function verifyToken(req: Request) {
  const tokenResult = fetchCookie(req)
  const token = tokenResult.token
  if (!token) {
    return { error: 'Unauthorized: No token provided' };
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return { user: decodedToken.uid };
  } catch (err) {
    return { error: 'Unauthorized: Invalid token' };
  }
}


export function fetchCookie(req : Request) {
  const cookie = req.headers.get('cookie')
  const token = cookie?.split('auth_token=')[1]
  if (!token) {
    return {
      token: null,
    }
  }
  else{
    return {
      token : token
    }
  }
}
