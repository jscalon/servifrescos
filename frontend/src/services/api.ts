import axios, { type AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface para el modelo Product (basado en tu modelo Django)
export interface Product {
  code: string; // Primary key
  description: string;
  brand: string;
  type: string;
  department: string;
  group: string;
  subgroup: string;
}

// Interface para el modelo Store
export interface Store {
  number: string;
  name: string;
}

// Interface para el modelo Price
export interface Price {
  id: number;
  product: string;
  product_code: string;
  product_description: string;
  product_type: string;
  store: string;
  store_number: string;
  store_name: string;
  price: string;
  registration_date: string;
  effective_date: string;
  expiration_date: string | null;
  is_active: boolean;
  status: string;
  comment: string;
}

// Interface para crear un Price
export interface PriceCreate {
  product: string;
  store: string;
  price: string;
  effective_date: string;
  comment: string;
}

// Interface para el modelo User
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  permissions: string[];
  is_active: boolean;
  date_joined: string;
}

// Interface para crear un User
export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  permissions: string[];
  is_active: boolean;
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

export const storesAPI = {
  getAll: (): Promise<ApiResponse<Store[]>> => api.get("/stores/"),
};

export const pricesAPI = {
  getAll: (): Promise<ApiResponse<Price[]>> => api.get("/prices/"),
  activePrices: (store?: string): Promise<ApiResponse<Price[]>> =>
    api.get(`/prices/active_prices/${store ? `?store=${store}` : ""}`),
  priceHistory: (
    product: string,
    store: string
  ): Promise<ApiResponse<Price[]>> =>
    api.get(`/prices/price_history/?product=${product}&store=${store}`),
  create: (data: PriceCreate): Promise<ApiResponse<Price>> =>
    api.post("/prices/", data),
};

export const usersAPI = {
  getAll: (): Promise<ApiResponse<User[]>> => api.get("/users/"),
  getById: (id: number): Promise<ApiResponse<User>> => api.get(`/users/${id}/`),
  create: (data: UserCreate): Promise<ApiResponse<User>> =>
    api.post("/users/", data),
  update: (id: number, data: Partial<UserCreate>): Promise<ApiResponse<User>> =>
    api.put(`/users/${id}/`, data),
  delete: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/users/${id}/`),
};

export default api;
