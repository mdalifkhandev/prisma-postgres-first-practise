type TAdminFilterRequest = {
  searchTerm?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
};

type TAdminOptions = {
  limit?: string | number;
  page?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type { TAdminFilterRequest, TAdminOptions };
