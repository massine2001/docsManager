import { useMemo } from "react";
import type { File } from "../../../../../types/models";
import type { GroupingType } from "../";
import { getExt, formatMonthYear } from "../utils/format";

export type FileGroups = Record<string, File[]>;

export function useGroupedFiles(files: File[], grouping: GroupingType): FileGroups {
  return useMemo(() => {
    if (!files.length) return {};

    if (grouping === "member") {
      return files.reduce<FileGroups>((acc, f) => {
        const key = f.userUploader ? `${f.userUploader.firstName} ${f.userUploader.lastName}` : "Sans auteur";
        (acc[key] ||= []).push(f);
        return acc;
      }, {});
    }

    if (grouping === "extension") {
      return files.reduce<FileGroups>((acc, f) => {
        const ext = getExt(f.name) || "sans extension";
        (acc[ext] ||= []).push(f);
        return acc;
      }, {});
    }

    return files.reduce<FileGroups>((acc, f) => {
      const key = formatMonthYear(f.createdAt);
      (acc[key] ||= []).push(f);
      return acc;
    }, {});
  }, [files, grouping]);
}
