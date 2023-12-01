import { db } from "../db";

export async function getUserRole(userId: string): Promise<string> {
  const userRole = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });
  if (!userRole) {
    return "USER";
  }
  return userRole.role;
}

export async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

export async function getUserById(userId: string) {
  return db.user.findUnique({
    where: {
      id: userId,
    },
  });
}
