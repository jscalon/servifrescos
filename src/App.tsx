import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashborad";
import Products from "./pages/Products/Products";
import NotFound from "./pages/NotFound/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import CreateProduct from "./pages/CreateProduct/CreateProduct";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/createproduct" element={<CreateProduct />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainContent>
      </BrowserRouter>
      <Footer />
    </AuthProvider>
  );
}
