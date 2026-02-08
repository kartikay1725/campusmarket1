import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export interface AccessPayload extends JwtPayload {
  id: string;
}

export function signAccess(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
export function signRefresh(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export async function setRefreshCookie(token: string) {
  const cookieS = await cookies();
  cookieS.set("refresh", token, {
    httpOnly: true, secure: true, sameSite: "strict", path: "/"
  });
}

export function verifyAccess(token: string): AccessPayload {
  const payload = jwt.verify(token, ACCESS_SECRET);
  if (typeof payload === 'string') {
    throw new Error('Invalid token payload');
  }
  return payload as AccessPayload;
}

// Safe version that returns a result object instead of throwing
export function verifyAccessSafe(token: string):
  | { success: true; payload: AccessPayload }
  | { success: false; error: string; isExpired: boolean } {
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    if (typeof payload === 'string') {
      return { success: false, error: 'Invalid token payload', isExpired: false };
    }
    return { success: true, payload: payload as AccessPayload };
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return { success: false, error: 'Token expired', isExpired: true };
    }
    return { success: false, error: 'Invalid token', isExpired: false };
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
