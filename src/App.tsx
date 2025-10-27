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
import QueryProduct from "./pages/Modules/Products/QueryProduct";
import Prices from "./pages/Modules/Prices";
import History from "./pages/Modules/Prices/History";
import NewPrice from "./pages/Modules/Prices/NewPrice";

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
              <Route path="query" element={<QueryProduct />} />
            </Route>
            <Route path="prices" element={<Prices />}>
              <Route path="history" element={<History />} />
              <Route path="new" element={<NewPrice />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </AuthProvider>
  );
}
