import http from "../api/HttpClient";

export const getAuthors = () => http.get("/authors");
export const getAuthorById = id => http.get(`/authors/${id}`);
export const addAuthor = data => http.post("/authors", data);
export const updateAuthor = (id, data) => http.put(`/authors/${id}`, data);
export const deleteAuthor = id => http.delete(`/authors/${id}`);