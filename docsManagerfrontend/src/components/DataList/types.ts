export interface DataItem {
  id: number;
  [key: string]: any;
}


export interface DataListConfig<T extends DataItem> {
  title: string;
  searchPlaceholder: string;
  actionButtonText?: string;
  onActionClick?: () => void;
  getSearchText: (item: T) => string;
  getDisplayText: (item: T) => string;
  loadingText?: string;
  emptyText?: string;
  errorText?: string;
}


export interface DataListProps<T extends DataItem> {
  items: T[] | null;
  loading: boolean;
  error: Error | null;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  config: DataListConfig<T>;
}
