import { Navbar, Footer } from "./components";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CataloguePage from "./pages/catalogue/CataloguePage";

function App() {
  return (
    <div className="text-white font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
