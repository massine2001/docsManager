import { useMemo } from "react";
import type { File } from "../../../../../types/models";

export function useFilteredFiles(files: File[] | undefined, searchTerm: string) {
  return useMemo(() => {
    if (!files) return [];
    if (!searchTerm) {
      return [...files].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; 
      });
    }

    const term = searchTerm.toLowerCase();
    const filtered = files.filter((file) => {
      const name = file.name?.toLowerCase() ?? "";
      const fn = file.userUploader?.firstName?.toLowerCase() ?? "";
      const ln = file.userUploader?.lastName?.toLowerCase() ?? "";
      return name.includes(term) || fn.includes(term) || ln.includes(term);
    });

    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [files, searchTerm]);
}
