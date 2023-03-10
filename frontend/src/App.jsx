import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import Background from "./components/Background/Background";
import Home from "./pages/Home";
import Accueil from "./pages/Accueil";
import Book from "./pages/Book";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./App.scss";

export default function App() {
  function isAuthenticated() {
    const token = Cookies.get("admin_auth_frontend");
    return token;
  }

  function PrivateRoute({ element }) {
    const navigate = useNavigate();
    useEffect(() => {
      if (!isAuthenticated()) {
        navigate("/");
      }
    }, []);

    return element;
  }

  PrivateRoute.propTypes = {
    element: PropTypes.node.isRequired,
  };

  return (
    <div className="App">
      <Background />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/accueil"
            element={<PrivateRoute element={<Accueil />} />}
          />
          <Route
            path="/book/:id"
            element={<PrivateRoute element={<Book />} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
