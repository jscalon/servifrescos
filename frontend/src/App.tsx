import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Modules from "./pages/Modules";
import Products from "./pages/Modules/Products";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts";
import CreateProduct from "./pages/Modules/Products/CreateProduct";
import ModifyProduct from "./pages/Modules/Products/ModifyProduct";
import ListProduct from "./pages/Modules/Products/ListProducts";
import Prices from "./pages/Modules/Prices";
import ListPrices from "./pages/Modules/Prices/ListPrices";
import CreatePrice from "./pages/Modules/Prices/CreatePrice";
import Users from "./pages/Modules/Users";
import ListUsers from "./pages/Modules/Users/ListUsers";
import CreateUser from "./pages/Modules/Users/CreateUser";
import ModifyUser from "./pages/Modules/Users/ModifyUser";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/modules" element={<Modules />}>
            <Route path="products" element={<Products />}>
              <Route path="query" element={<ListProduct />} />
              <Route path="create" element={<CreateProduct />} />
              <Route path="modify" element={<ModifyProduct />} />
            </Route>
            <Route path="prices" element={<Prices />}>
              <Route path="query" element={<ListPrices />} />
              <Route path="create" element={<CreatePrice />} />
            </Route>
            <Route path="users" element={<Users />}>
              <Route path="query" element={<ListUsers />} />
              <Route path="create" element={<CreateUser />} />
              <Route path="modify" element={<ModifyUser />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
