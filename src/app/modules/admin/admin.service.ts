import { UserStatus, type Admin, type Prisma } from "@prisma/client";
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

  addCondirion.push({
    isDeleted: !true,
  });

  const whereCondition = { AND: addCondirion };
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const count = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: result,
  };
};

const getSingleAdmin = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAdmin = async (id: string, data: Partial<Admin>) => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deletedAdmin = async (id: string) => {
  const result = await prisma.$transaction(async (deletedTrangection) => {
    const admineDeletedData = await deletedTrangection.admin.delete({
      where: {
        id,
      },
    });
    const userDeletedData = await deletedTrangection.user.delete({
      where: {
        email: admineDeletedData.email,
      },
    });

    return {
      admineDeletedData,
      userDeletedData,
    };
  });

  return result;
};

const adminSoftDeleted = async (id: string) => {
  const result = await prisma.$transaction(async (softDeleted) => {
    const adminSoftDeletedData = await softDeleted.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const userSoftDeletedData = await softDeleted.user.update({
      where: {
        email: adminSoftDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return {
      adminSoftDeletedData,
      userSoftDeletedData,
    };
  });
  return result;
};

export const adminService = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deletedAdmin,
  adminSoftDeleted,
};
