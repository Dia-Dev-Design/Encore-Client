import { entries, isNil, set } from "lodash";
import qs from "qs";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useQueryParams<T = any>(
  defaults?: Partial<T>
): [T, (value?: Partial<T>) => void] {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    return qs.parse(search, {
      ignoreQueryPrefix: true,
    });
  }, [search, pathname, navigate]);

  const setValue = (value?: Partial<T>) => {
    entries(value).forEach(([key, value]) => {
      if (isNil(value)) {
        delete queryParams[key];
      } else {
        set(queryParams, key, value);
      }
    });

    navigate({
      pathname,
      search: qs.stringify(queryParams),
    });
  };

  return [{ ...defaults, ...queryParams } as T, setValue];
}
