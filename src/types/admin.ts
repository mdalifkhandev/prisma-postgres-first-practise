type TAdminFilterRequest = {
  searchTerm?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
};

type TAdminOptions = {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type { TAdminFilterRequest, TAdminOptions };