import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password securely using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
}

/**
 * Encodes a session payload into a base64 signature string
 */
export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/**
 * Decodes and validates a session token
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      phone: payload.phone,
    };
  } catch {
    return null;
  }
}
