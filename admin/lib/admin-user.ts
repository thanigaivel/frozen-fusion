import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { Collection } from "mongodb";

export interface AdminUser {
  _id?: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function getAdminsCollection(): Promise<Collection<AdminUser>> {
  const client = await clientPromise;
  const db = client.db("frozenfusion");
  return db.collection<AdminUser>("admins");
}

/**
 * Verifies email + password against the MongoDB admins collection.
 * Returns the user document (without passwordHash) on success, or null on failure.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<Omit<AdminUser, "passwordHash"> | null> {
  const admins = await getAdminsCollection();
  const user = await admins.findOne({ email: email.toLowerCase().trim() });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Creates the first admin user if none exist. Run this once to seed your database.
 * Only works when ADMIN_SEED_SECRET env var matches.
 */
export async function seedAdminUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const admins = await getAdminsCollection();
  const existing = await admins.findOne({ email: email.toLowerCase().trim() });

  if (existing) {
    return { success: false, message: "Admin user already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await admins.insertOne({
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date(),
  });

  return { success: true, message: "Admin user created successfully." };
}
