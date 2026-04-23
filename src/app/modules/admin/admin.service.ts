import type { Prisma } from "@prisma/client";
import { prisma } from "../../../shared/prisma";

const getAllAdmins = async (params: { searchTerm?: string }) => {
  //   if (!params.searchTerm || params.searchTerm.trim() == "") {
  //     return await prisma.admin.findMany();
  //   } else {
  //     const result = await prisma.admin.findMany({
  //       where: {
  //         OR: [
  //           {
  //             name: {
  //               contains: params.searchTerm,
  //               mode: "insensitive",
  //             },
  //           },
  //           {
  //             email: {
  //               contains: params.searchTerm,
  //               mode: "insensitive",
  //             },
  //           },
  //         ],
  //       },
  //     });
  //     return result;
  //   }

  const addCondirion: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    addCondirion.push({
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const whereCondition = { AND: addCondirion };
  const result = await prisma.admin.findMany({
    where: whereCondition,
  });

  return result;
};

export const adminService = {
  getAllAdmins,
};
