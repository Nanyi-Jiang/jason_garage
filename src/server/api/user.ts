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

export async function deleteUserById(userId: string) {
  // using transaction here to make sure we don't delete the last admin
  // also, delete all the related car records for this user
  return db.$transaction([
    db.car.deleteMany({
      where: {
        userId,
      },
    }),
    db.user.delete({
      where: {
        id: userId,
      },
    }),
  ]);
}
