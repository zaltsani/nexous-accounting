import type { IApiListQueryParams } from "@nexous-accounting/types";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export interface PaginationResponse<T> {
  data: {
    items: T[];
    page: number;
    limit: number;
    totalCount: number;
  };
}

interface UseInfiniteListOptions<
  T,
  TExtraParams extends Record<string, unknown> = Record<string, unknown>,
> {
  queryKey: string;
  params?: IApiListQueryParams & TExtraParams;
  fetchFn: (
    params?: IApiListQueryParams & TExtraParams & { page: number },
  ) => Promise<PaginationResponse<T>>;
}

export function useInfiniteList<
  T,
  TExtraParams extends Record<string, unknown> = Record<string, unknown>,
>({ queryKey, params, fetchFn }: UseInfiniteListOptions<T, TExtraParams>) {
  return useInfiniteQuery({
    queryKey: [queryKey, params],
    queryFn: ({ pageParam }) =>
      fetchFn({
        ...params,
        page: pageParam,
      } as IApiListQueryParams & TExtraParams & { page: number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, limit, totalCount } = lastPage.data;
      const totalPages = Math.ceil(totalCount / limit);

      return page < totalPages ? page + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });
}
