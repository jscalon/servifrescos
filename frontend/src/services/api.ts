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
  id?: number;  // Opcional porque no existe al crear
  code: string;
  description: string;
  brand: string;
  type: string;  // Mantengo como en tu código
  department: string;
  group: string;
  subgroup: string;
}

// Tipos para las respuestas de la API
export interface ApiResponse<T> extends AxiosResponse<T> {}

export const productsAPI = {
  getAll: (): Promise<ApiResponse<Product[]>> => api.get("/products/"),
  getById: (id: number): Promise<ApiResponse<Product>> => api.get(`/products/${id}/`),
  create: (data: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => api.post("/products/", data),
  update: (id: number, data: Partial<Product>): Promise<ApiResponse<Product>> => api.put(`/products/${id}/`, data),
  delete: (id: number): Promise<ApiResponse<void>> => api.delete(`/products/${id}/`),
};

export default api;
