import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "1d" });
}

export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch {
    return null;
  }
}
