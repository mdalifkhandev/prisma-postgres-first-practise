import { UserRole } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import bcrypt from "bcrypt";

const createAdmin = async (data: any) => {
  const hashPassword = await bcrypt.hash(data.password, 10);

  const userData = {
    email: data.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  const adminData = {
    name: data.name,
    email: data.email,
  };

  const result = await prisma.$transaction(async (transctionClient) => {
    const createUserData = await transctionClient.user.create({
      data: userData,
    });
    const createAdminData = await transctionClient.admin.create({
      data: adminData,
    });
    return { createUserData, createAdminData };
  });
  return result;
};

export const userService = {
  createAdmin,
};
