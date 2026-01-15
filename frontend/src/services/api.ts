import axios, { type AxiosResponse } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido, redirigir al login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Interfaces para categorías
export interface Brand {
  id: number;
  name: string;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  code: string;
  description: string;
}

export interface Group {
  id: number;
  code: string;
  description: string;
  department: number; // FK ID
}

export interface Subgroup {
  id: number;
  code: string;
  description: string;
  group: number; // FK ID
}

// Interface para el modelo Product (actualizado con FKs)
export interface Product {
  id: number;
  code: string;
  description: string;
  brand: string; // Nombre (StringRelatedField)
  type: string; // Nombre
  subgroup: string; // Nombre
}

// Interface para crear un Product
export interface ProductCreate {
  code: string;
  description: string;
  brand: number; // ID
  type: number; // ID
  subgroup: number; // ID
}

// Interface para el modelo Store
export interface Store {
  id: number;
  number: number;
  name: string;
  address: string;
}

// Interface para el modelo Price
export interface Price {
  id: number;
  product: string;
  product_code: string;
  product_description: string;
  product_type: string;
  store: string;
  store_number: number;
  store_name: string;
  price: string;
  registration_date: string;
  effective_date: string;
  expiration_date: string | null;
  is_active: boolean;
  status: string;
  comment: string;
  created_by_username: string;
}

// Interface para crear un Price
export interface PriceCreate {
  product: string;
  store: number;
  price: string;
  effective_date: string;
  comment: string;
}

// Interface para el modelo Permission
export interface Permission {
  name: string;
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
  last_login: string | null;
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
  create: (data: ProductCreate): Promise<ApiResponse<Product>> =>
    api.post("/products/", data),
  update: (
    code: string,
    data: Partial<ProductCreate>
  ): Promise<ApiResponse<Product>> => api.put(`/products/${code}/`, data),
  delete: (code: string): Promise<ApiResponse<void>> =>
    api.delete(`/products/${code}/`),
};

export const categoriesAPI = {
  brands: {
    getAll: (): Promise<ApiResponse<Brand[]>> => api.get("/brands/"),
    getById: (id: number): Promise<ApiResponse<Brand>> =>
      api.get(`/brands/${id}/`),
    create: (data: Omit<Brand, "id">): Promise<ApiResponse<Brand>> =>
      api.post("/brands/", data),
    update: (
      id: number,
      data: Partial<Omit<Brand, "id">>
    ): Promise<ApiResponse<Brand>> => api.put(`/brands/${id}/`, data),
    delete: (id: number): Promise<ApiResponse<void>> =>
      api.delete(`/brands/${id}/`),
  },
  productTypes: {
    getAll: (): Promise<ApiResponse<ProductType[]>> =>
      api.get("/product-types/"),
    getById: (id: number): Promise<ApiResponse<ProductType>> =>
      api.get(`/product-types/${id}/`),
    create: (
      data: Omit<ProductType, "id">
    ): Promise<ApiResponse<ProductType>> => api.post("/product-types/", data),
    update: (
      id: number,
      data: Partial<Omit<ProductType, "id">>
    ): Promise<ApiResponse<ProductType>> =>
      api.put(`/product-types/${id}/`, data),
    delete: (id: number): Promise<ApiResponse<void>> =>
      api.delete(`/product-types/${id}/`),
  },
  departments: {
    getAll: (): Promise<ApiResponse<Department[]>> => api.get("/departments/"),
    getByCode: (code: string): Promise<ApiResponse<Department>> =>
      api.get(`/departments/${code}/`),
    create: (data: Omit<Department, "id">): Promise<ApiResponse<Department>> =>
      api.post("/departments/", data),
    update: (
      code: string,
      data: Partial<Omit<Department, "id">>
    ): Promise<ApiResponse<Department>> =>
      api.put(`/departments/${code}/`, data),
    delete: (code: string): Promise<ApiResponse<void>> =>
      api.delete(`/departments/${code}/`),
  },
  groups: {
    getAll: (): Promise<ApiResponse<Group[]>> => api.get("/groups/"),
    getByCode: (code: string): Promise<ApiResponse<Group>> =>
      api.get(`/groups/${code}/`),
    create: (data: Omit<Group, "id">): Promise<ApiResponse<Group>> =>
      api.post("/groups/", data),
    update: (
      code: string,
      data: Partial<Omit<Group, "id">>
    ): Promise<ApiResponse<Group>> => api.put(`/groups/${code}/`, data),
    delete: (code: string): Promise<ApiResponse<void>> =>
      api.delete(`/groups/${code}/`),
  },
  subgroups: {
    getAll: (): Promise<ApiResponse<Subgroup[]>> => api.get("/subgroups/"),
    getByCode: (code: string): Promise<ApiResponse<Subgroup>> =>
      api.get(`/subgroups/${code}/`),
    create: (data: Omit<Subgroup, "id">): Promise<ApiResponse<Subgroup>> =>
      api.post("/subgroups/", data),
    update: (
      code: string,
      data: Partial<Omit<Subgroup, "id">>
    ): Promise<ApiResponse<Subgroup>> => api.put(`/subgroups/${code}/`, data),
    delete: (code: string): Promise<ApiResponse<void>> =>
      api.delete(`/subgroups/${code}/`),
  },
};

export const storesAPI = {
  getAll: (): Promise<ApiResponse<Store[]>> => api.get("/stores/"),
  getByNumber: (number: number): Promise<ApiResponse<Store>> =>
    api.get(`/stores/${number}/`),
  create: (data: Store): Promise<ApiResponse<Store>> =>
    api.post("/stores/", data),
  update: (number: number, data: Partial<Store>): Promise<ApiResponse<Store>> =>
    api.put(`/stores/${number}/`, data),
  delete: (number: number): Promise<ApiResponse<void>> =>
    api.delete(`/stores/${number}/`),
};

export const pricesAPI = {
  getAll: (): Promise<ApiResponse<Price[]>> => api.get("/prices/"),
  activePrices: (store?: number): Promise<ApiResponse<Price[]>> =>
    api.get(`/prices/active_prices/${store ? `?store=${store}` : ""}`),
  priceHistory: (
    product: string,
    store: number
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
    api.patch(`/users/${id}/`, data),
  delete: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/users/${id}/`),
};

export const permissionsAPI = {
  getAll: (): Promise<ApiResponse<Permission[]>> => api.get("/permissions/"),
};

export default api;
