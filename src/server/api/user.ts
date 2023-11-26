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
