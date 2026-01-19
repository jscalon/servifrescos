import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Modules from "./pages/Modules";
import Products from "./pages/Modules/Products";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts";
import CreateProduct from "./pages/Modules/Products/CreateProduct";
import ModifyProduct from "./pages/Modules/Products/ModifyProduct";
import QueryProducts from "./pages/Modules/Products/QueryProducts";
import Prices from "./pages/Modules/Prices";
import QueryPrices from "./pages/Modules/Prices/QueryPrices";
import CreatePrice from "./pages/Modules/Prices/CreatePrice";
import Users from "./pages/Modules/Users";
import QueryUsers from "./pages/Modules/Users/QueryUsers";
import CreateUser from "./pages/Modules/Users/CreateUser";
import ModifyUser from "./pages/Modules/Users/ModifyUser";
import Stores from "./pages/Modules/Stores";
import QueryStores from "./pages/Modules/Stores/QueryStores";
import CreateStore from "./pages/Modules/Stores/CreateStore";
import ModifyStore from "./pages/Modules/Stores/ModifyStore";
import Categories from "./pages/Modules/Categories";
import Brands from "./pages/Modules/Categories/Brands";
import CreateBrand from "./pages/Modules/Categories/Brands/CreateBrand";
import ModifyBrand from "./pages/Modules/Categories/Brands/ModifyBrand";
import QueryBrands from "./pages/Modules/Categories/Brands/QueryBrands";
import ProductTypes from "./pages/Modules/Categories/ProductTypes";
import CreateProductType from "./pages/Modules/Categories/ProductTypes/CreateProductType";
import ModifyProductType from "./pages/Modules/Categories/ProductTypes/ModifyProductType";
import QueryProductTypes from "./pages/Modules/Categories/ProductTypes/QueryProductTypes";
import Departments from "./pages/Modules/Categories/Departments";
import CreateDepartment from "./pages/Modules/Categories/Departments/CreateDepartment";
import ModifyDepartment from "./pages/Modules/Categories/Departments/ModifyDepartment";
import QueryDepartments from "./pages/Modules/Categories/Departments/QueryDepartments";
import type { ReactNode } from "react";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // O un spinner
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/modules"
            element={
              <ProtectedRoute>
                <Modules />
              </ProtectedRoute>
            }
          >
            <Route path="products" element={<Products />}>
              <Route path="query" element={<QueryProducts />} />
              <Route path="create" element={<CreateProduct />} />
              <Route path="modify" element={<ModifyProduct />} />
            </Route>
            <Route path="prices" element={<Prices />}>
              <Route path="query" element={<QueryPrices />} />
              <Route path="create" element={<CreatePrice />} />
            </Route>
            <Route path="users" element={<Users />}>
              <Route path="query" element={<QueryUsers />} />
              <Route path="create" element={<CreateUser />} />
              <Route path="modify" element={<ModifyUser />} />
            </Route>
            <Route path="stores" element={<Stores />}>
              <Route path="query" element={<QueryStores />} />
              <Route path="create" element={<CreateStore />} />
              <Route path="modify" element={<ModifyStore />} />
            </Route>
            <Route path="categories" element={<Categories />}>
              <Route path="brands" element={<Brands />}>
                <Route path="query" element={<QueryBrands />} />
                <Route path="create" element={<CreateBrand />} />
                <Route path="modify" element={<ModifyBrand />} />
              </Route>
              <Route path="product-types" element={<ProductTypes />}>
                <Route path="query" element={<QueryProductTypes />} />
                <Route path="create" element={<CreateProductType />} />
                <Route path="modify" element={<ModifyProductType />} />
              </Route>
              <Route path="departments" element={<Departments />}>
                <Route path="query" element={<QueryDepartments />} />
                <Route path="create" element={<CreateDepartment />} />
                <Route path="modify" element={<ModifyDepartment />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
