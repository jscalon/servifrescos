import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Modules from "./pages/Modules";
import Products from "./pages/Modules/Products";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts";
import CreateProduct from "./pages/Modules/Products/CreateProduct";
import ModifyProduct from "./pages/Modules/Products/ModifyProduct";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/modules" element={<Modules />}>
              <Route path="products" element={<Products />}>
                <Route path="create" element={<CreateProduct />} />
                <Route path="modify" element={<ModifyProduct />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainContent>
      </BrowserRouter>
      <Footer />
    </AuthProvider>
  );
}
