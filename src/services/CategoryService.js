import http from "../api/HttpClient";

export const getCategories = () => http.get("/categories");
export const getCategoryById = id => http.get(`/categories/${id}`);
export const addCategory = data => http.post("/categories", data);
export const updateCategory = (id, data) => http.put(`/categories/${id}`, data);
export const deleteCategory = id => http.delete(`/categories/${id}`);