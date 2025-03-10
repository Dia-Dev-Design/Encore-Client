import { Params, SortOrder } from "interfaces/table.interface";

export const getDefaultSortOrder = (
  field: string,
  sortOption: string | null | undefined,
  sortOrder: string | null | undefined
) => {
  if (sortOption === field) {
    return sortOrder === SortOrder.ASC ? "ascend" : "descend";
  }
  return undefined;
};
