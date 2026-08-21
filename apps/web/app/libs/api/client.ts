import * as http from './http';

export const apiClient = {
  get: http.get,
  post: http.post,
  patch: http.patch,
  put: http.put,
  delete: http.del,
  getFile: http.getFile,
};