import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { DataItem, DataListProps } from "./types";
import { DataListDesktop } from "./DataListDesktop";
import { DataListMobile } from "./DataListMobile";

export type { DataItem, DataListConfig, DataListProps } from "./types";

export function DataList<T extends DataItem>(props: DataListProps<T>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? <DataListDesktop {...props} /> : <DataListMobile {...props} />;
}
