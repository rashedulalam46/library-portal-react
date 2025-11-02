import http from "../api/HttpClient";

export const getPublishers = () => http.get("/publishers");
export const getPublisherById = id => http.get(`/publishers/${id}`);
export const addPublisher = data => http.post("/publishers", data);
export const updatePublisher = (id, data) => http.put(`/publishers/${id}`, data);
export const deletePublisher = id => http.delete(`/publishers/${id}`);