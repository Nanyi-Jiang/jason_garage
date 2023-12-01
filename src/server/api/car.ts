import { type Car } from "@prisma/client";
import { db } from "../db";
import { getUserRole } from "./user";

export async function getCarById(carId: number) {
  return db.car.findUnique({
    where: {
      id: carId,
    },
  });
}

export async function getAllCars(userId: string) {
  // call getRole here
  const userRole = await getUserRole(userId);
  if (userRole === "ADMIN") {
    return db.car.findMany();
  } else {
    return db.car.findMany({
      where: {
        userId,
      },
    });
  }
}

export async function getCarsByUserId(userId: string) {
  return db.car.findMany({
    where: {
      userId,
    },
  });
}

export async function createCar(
  car: {
    make: string;
    model: string;
    year: number;
    vin: string;
    color: string;
    mileage?: number;
  },
  userId: string,
) {
  return db.car.create({
    data: {
      ...car,
      userId,
    },
  });
}

export async function updateCar(car: {
  id: number;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  color?: string;
  mileage?: number;
}) {
  return db.car.update({
    where: {
      id: car.id,
    },
    data: {
      make: car.make,
      model: car.model,
      year: car.year,
      vin: car.vin,
      color: car.color,
      mileage: car.mileage,
    },
  });
}

export async function deleteCarById(carId: number) {
  return db.car.delete({
    where: {
      id: carId,
    },
  });
}

// ====== Stored Procedures ======
export async function getCarsByYearWithUser(
  yearLeft: number,
  yearRight: number,
) {
  return db.$queryRaw<
    Car[]
  >`SELECT * FROM "Car" WHERE "year" >= ${yearLeft} AND "year" < ${yearRight}`;
}

export async function getCarCountByMake(make: string) {
  return db.$queryRaw`SELECT COUNT(*) FROM "Car" WHERE "make" = ${make}`;
}
