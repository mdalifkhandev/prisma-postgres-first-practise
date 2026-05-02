import { UserRole } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import bcrypt from "bcrypt";

type TCreateAdminPayload = {
  email: string;
  password: string;
  name: string;
  contactNumber?: string;
};

const createAdmin = async (data: TCreateAdminPayload) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashPassword = await bcrypt.hash(data.password, saltRounds);

  const userData = {
    email: data.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  const adminData = {
    name: data.name,
    email: data.email,
    contactNumber: data.contactNumber ?? null,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
    });
    const createAdminData = await transactionClient.admin.create({
      data: adminData,
    });
    return { createUserData, createAdminData };
  });
  return result;
};

export const userService = {
  createAdmin,
};
