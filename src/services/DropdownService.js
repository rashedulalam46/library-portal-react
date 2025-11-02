import http from "../api/HttpClient";

export const getBooks = () => http.get("/books");
export const getBookById = id => http.get(`/books/${id}`);
export const addBook = data => http.post("/books", data);
export const updateBook = (id, data) => http.put(`/books/${id}`, data);
export const deleteBook = id => http.delete(`/books/${id}`);