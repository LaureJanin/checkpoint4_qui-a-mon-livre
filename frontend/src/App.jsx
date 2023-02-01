import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Accueil from "./pages/Accueil";
// import Login from "../Login/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accueil" element={<Accueil />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/borrower" element={<Profile />} />
        <Route path="/borrower/:id" element={<ProfileCandidat />} />
        <Route path="/book" element={<FavoriteOffers />} />
        <Route path="/book/:id" element={<Candidatures />} /> */}

        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="*" element={<Error />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
