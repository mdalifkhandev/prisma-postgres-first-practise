import type { Prisma } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { adminSearchableFields } from "./admin.constant";
import type { TAdminFilterRequest, TAdminOptions } from "../../../types/admin";
import calculatePagination from "../../../helper/pagination";



const getAllAdmins = async (
  params: TAdminFilterRequest,
  options: TAdminOptions,
) => {
  const addCondirion: Prisma.AdminWhereInput[] = [];

  const { searchTerm, ...filterData } = params;
  const { limit, page, sortBy, sortOrder, skip } = calculatePagination(options);

  console.log(filterData);

  if (params.searchTerm) {
    addCondirion.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    addCondirion.push({
      AND: Object.keys(filterData).map((field) => ({
        [field]: {
          equals: filterData[field as keyof typeof filterData],
        },
      })),
    });
  }

  const whereCondition = { AND: addCondirion };
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return { result, count: result.length };
};

export const adminService = {
  getAllAdmins,
};
