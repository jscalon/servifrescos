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
  id: number;
  code: string; // Ahora es la primary key, siempre presente
  description: string;
  brand: string;
  type: string; // Mantengo como en tu código
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
  store: string;
  store_number: string;
  store_name: string;
  price: string;
  registration_date: string;
  effective_date: string;
  expiration_date: string | null;
  is_active: boolean;
  status: string;
  comentary: string;
}

// Interface para crear un Price
export interface PriceCreate {
  product: string;
  store: string;
  price: string;
  effective_date: string;
  comentary: string;
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
  priceHistory: (product: string, store: string): Promise<ApiResponse<Price[]>> =>
    api.get(`/prices/price_history/?product=${product}&store=${store}`),
  create: (data: PriceCreate): Promise<ApiResponse<Price>> =>
    api.post("/prices/", data),
};

export default api;
