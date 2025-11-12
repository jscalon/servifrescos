import axios, { type AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface para el modelo Product (basado en tu modelo Django)
export interface Product {
  code: string; // Ahora es la primary key, siempre presente
  description: string;
  brand: string;
  type: string; // Mantengo como en tu código
  department: string;
  group: string;
  subgroup: string;
}

// Tipos para las respuestas de la API
export interface ApiResponse<T> extends AxiosResponse<T> {}

export const productsAPI = {
  getAll: (): Promise<ApiResponse<Product[]>> => api.get("/products/"),
  getByCode: (code: string): Promise<ApiResponse<Product>> =>
    api.get(`/products/${code}/`),
  create: (data: Product): Promise<ApiResponse<Product>> =>
    api.post("/products/", data),
  update: (
    code: string,
    data: Partial<Product>
  ): Promise<ApiResponse<Product>> => api.put(`/products/${code}/`, data),
  delete: (code: string): Promise<ApiResponse<void>> =>
    api.delete(`/products/${code}/`),
};

export default api;
