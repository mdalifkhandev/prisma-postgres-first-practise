import type { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";

const getAllAdmins = async (params: any) => {
  let whereCondition: Prisma.AdminWhereInput | undefined = undefined;
  const queryData: Prisma.AdminFindManyArgs = {};

  if (params?.searchTerm) {
    whereCondition = {
      AND: [
        {
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
        },
      ],
    };
  }

  if (whereCondition) {
    queryData.where = whereCondition;
  }

  const result = await prisma.admin.findMany(queryData);
  return { result, count: result.length };
};
