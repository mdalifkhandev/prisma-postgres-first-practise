import type { TAdminOptions } from "../types/admin";

const calculatePagination = (options: TAdminOptions) => {
  const page = Math.max(1, Number(options.page) || 1);
  const requestedLimit = Number(options.limit) || 10;
  const limit = Math.min(100, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "desc" ? "desc" : "asc";
  return { page, limit, skip, sortBy, sortOrder };
};

export default calculatePagination;
