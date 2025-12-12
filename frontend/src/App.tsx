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
import QueryProduct from "./pages/Modules/Products/ListProducts";
import Prices from "./pages/Modules/Prices";
import ListPrices from "./pages/Modules/Prices/ListPrices";
import CreatePrice from "./pages/Modules/Prices/CreatePrice";
import UserManagement from "./pages/Modules/Users";
import NewUser from "./pages/Modules/Users/NewUser";

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
              <Route path="create" element={<CreateProduct />} />
              <Route path="modify" element={<ModifyProduct />} />
              <Route path="list" element={<QueryProduct />} />
            </Route>
            <Route path="prices" element={<Prices />}>
              <Route path="list" element={<ListPrices />} />
              <Route path="create" element={<CreatePrice />} />
            </Route>
            <Route path="users" element={<UserManagement />}>
              <Route path="new" element={<NewUser />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
