import http from "../api/HttpClient";

export const getCategories = () => http.get("/dropdown/categories");
export const getAuthors = () => http.get("/dropdown/authors");
export const getPublishers = () => http.get("/dropdown/publishers");
export const getCountries = () => http.get("/dropdown/countries");
