import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AsyncCombobox, type Option } from "./async-combobox";
import { useInfiniteList, type PaginationResponse } from "~/hooks/use-infinite-list";
import type { IApiListQueryParams } from "@nexous-accounting/types";

export interface GenericAsyncComboboxProps<
  TData,
  TExtraParams extends Record<string, unknown> = Record<string, unknown>
> {
  value?: string;
  onChange: (value: string | undefined) => void;
  onItemSelect?: (item: TData) => void;

  queryKey: string;
  fetchListFn: (params?: IApiListQueryParams & TExtraParams & { page: number }) => Promise<PaginationResponse<TData>>;
  fetchByIdFn?: (id: string) => Promise<{ data: TData }>;

  params?: TExtraParams;

  getOptionLabel: (item: TData) => string;
  getOptionValue: (item: TData) => string;
  getOptionCode?: (item: TData) => string | undefined;

  placeholder?: string;
  disabled?: boolean;
  renderItem?: (item: Option) => React.ReactNode;
}

export function GenericAsyncCombobox<TData, TExtraParams extends Record<string, unknown> = Record<string, unknown>>({
  value,
  onChange,
  onItemSelect,
  queryKey,
  fetchListFn,
  fetchByIdFn,
  params,
  getOptionLabel,
  getOptionValue,
  getOptionCode,
  placeholder = "Pilih...",
  disabled = false,
  renderItem,
}: GenericAsyncComboboxProps<TData, TExtraParams>) {
  const [search, setSearch] = React.useState("");

  const {
    data: pagesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteList<TData, TExtraParams>({
    queryKey,
    params: { ...params, search } as IApiListQueryParams & TExtraParams,
    fetchFn: fetchListFn,
  });

  const listData = React.useMemo(() => {
    return pagesData?.pages.flatMap((page) => page.data.items) ?? [];
  }, [pagesData]);

  const isValueInList = React.useMemo(() => {
    return !!value && listData.some((item) => getOptionValue(item) === value);
  }, [listData, value, getOptionValue]);

  const { data: singleItemData, isLoading: isLoadingSingle } = useQuery({
    queryKey: [queryKey, value],
    queryFn: () => fetchByIdFn!(value!),
    select: (res) => res.data,
    enabled: !!value && !isValueInList && !!fetchByIdFn,
    staleTime: 1000 * 60 * 5,
  });

  const options = React.useMemo(() => {
    const list: Option[] = listData.map((item) => ({
      value: getOptionValue(item),
      label: getOptionLabel(item),
      code: getOptionCode ? getOptionCode(item) : undefined,
      raw: item,
    }));

    if (value && !isValueInList && singleItemData) {
      list.unshift({
        value: getOptionValue(singleItemData),
        label: getOptionLabel(singleItemData),
        code: getOptionCode ? getOptionCode(singleItemData) : undefined,
        raw: singleItemData,
      });
    }

    return list;
  }, [listData, isValueInList, singleItemData, value, getOptionValue, getOptionLabel, getOptionCode]);

  return (
    <AsyncCombobox
      value={value}
      onChange={(val) => {
        onChange(val);
        const selected = options.find((opt) => opt.value === val);
        onItemSelect?.(selected?.raw as TData);
      }}
      placeholder={placeholder}
      disabled={disabled}
      options={options}
      onSearchChange={setSearch}
      onFetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetching={isFetching || (isLoadingSingle && !isValueInList)}
      isFetchingNextPage={isFetchingNextPage}
      renderItem={renderItem}
    />
  );
}