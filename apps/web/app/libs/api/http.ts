import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ZodType } from "zod";
import { api } from "./axios";

type RequestOptions<T> = {
  url: string;
  schema?: ZodType<T>;
  data?: unknown;
  config?: AxiosRequestConfig;
};

export async function get<T>({ url, schema }: RequestOptions<T>): Promise<T> {
  const res = await api.get(url);

  if (schema) {
    try {
      return schema.parse(res.data);
    } catch (error) {
      console.error(`[Schema Error] GET ${url} failed validation:`, error);
      throw error;
    }
  }
  return res.data as T;
}

export async function post<T>({ url, data, schema, config }: RequestOptions<T>): Promise<T> {
  const res = await api.post(url, data, config);

  if (schema) return schema.parse(res.data);
  return res.data as T;
}

export async function put<T>({ url, data, schema, config }: RequestOptions<T>): Promise<T> {
  const res = await api.put(url, data, config);

  if (schema) {
    try {
      return schema.parse(res.data);
    } catch (error) {
      console.error(`[Schema Error] POST ${url} failed validation:`, error);
      throw error;
    }
  }

  return res.data as T;
}

export async function patch<T>({ url, data, schema, config }: RequestOptions<T>): Promise<T> {
  const res = await api.patch(url, data, config);

  if (schema) {
    try {
      return schema.parse(res.data);
    } catch (error) {
      console.error(`[Schema Error] PATCH ${url} failed validation:`, error);
      throw error;
    }
  }

  return res.data as T;
}

export async function del<T>({ url, schema, config }: RequestOptions<T>): Promise<T> {
  const res = await api.delete(url, config);

  if (schema) {
    try {
      return schema.parse(res.data);
    } catch (error) {
      console.error(`[Schema Error] DELETE ${url} failed validation:`, error);
      throw error;
    }
  }

  return res.data as T;
}

export async function getFile({
  url,
  config,
}: {
  url: string;
  config?: AxiosRequestConfig;
}): Promise<AxiosResponse<Blob>> {
  return api.get(url, {
    ...config,
    responseType: "blob",
  });
}
