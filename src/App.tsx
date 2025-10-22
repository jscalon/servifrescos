import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Modules from "./pages/Modules/Modules";
import Products from "./pages/Products/Products";
import NotFound from "./pages/NotFound/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import ModifyProduct from "./pages/ModifyProduct/ModifyProduct";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/products" element={<Products />}>
              <Route path="create" element={<CreateProduct />} />
              <Route path="modify" element={<ModifyProduct />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainContent>
      </BrowserRouter>
      <Footer />
    </AuthProvider>
  );
}
