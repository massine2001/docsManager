import { useMemo } from "react";
import type { Access } from "../../../../../types/models";

export const useFilteredMembers = (
  accesses: Access[] | undefined,
  searchTerm: string,
  roleFilter: string
) => {
  return useMemo(() => {
    if (!accesses) return [];

    let filtered = accesses;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((access) => {
        const fullName = `${access.user.firstName} ${access.user.lastName}`.toLowerCase();
        const email = access.user.email.toLowerCase();
        return fullName.includes(term) || email.includes(term);
      });
    }

    if (roleFilter && roleFilter !== "Tous") {
      filtered = filtered.filter(
        (access) => access.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    return filtered;
  }, [accesses, searchTerm, roleFilter]);
};
