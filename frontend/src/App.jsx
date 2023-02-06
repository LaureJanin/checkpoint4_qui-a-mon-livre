import { BrowserRouter, Routes, Route } from "react-router-dom";
import Background from "./components/Background/Background";
import Home from "./pages/Home";
import Accueil from "./pages/Accueil";
import Book from "./pages/Book";

export default function App() {
  return (
    <>
      <Background />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/book/:id" element={<Book />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
