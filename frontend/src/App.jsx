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
  // This function check if the user is authenticated with checking if there is a cookie.
  function isAuthenticated() {
    const token = Cookies.get("token");
    return token;
  }

  // This code defines a React functional component called PrivateRoute. The component takes an object with a single property called element as its input parameter.
  function PrivateRoute({ element }) {
    // Within the PrivateRoute function, it calls the useNavigate hook from the react-router-dom package to get a reference to a function that allows the component to navigate to different pages within the app.
    const navigate = useNavigate();
    // The function also calls the useEffect hook to perform a check if the user is authenticated. If not, it redirects the user to the home page using the navigate function.
    useEffect(() => {
      if (!isAuthenticated()) {
        navigate("/");
      }
    }, []);

    return element;
  }

  // The propTypes property is used to define the expected properties of the PrivateRoute component.
  // In this case, it specifies that the element prop is required and must be a node type.
  // This is a way to catch errors or bugs during development where the component may be called with the wrong type of data.
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
