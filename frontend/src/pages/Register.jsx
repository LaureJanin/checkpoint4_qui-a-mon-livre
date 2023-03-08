import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Notify from "../utils/notification";
import instance from "../utils/instance";

import "./Register.scss";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, setRegisterUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterUser({ ...registerUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = registerUser;
    console.warn(registerUser);
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        className: "custom-toast-error specific_class",
      });
      return;
    }
    if (username === "" || password === "" || confirmPassword === "") {
      toast.error("Veuillez remplir tous les champs", {
        className: "custom-toast-error specific_class",
      });
      return;
    }
    instance
      .post("/register", registerUser)
      .then(() => Notify.success("Inscription réussie ! 🎉"))
      .then(() => navigate("/"))
      .catch(() => toast.error("Une erreur est survenue ❌"), {
        className: "custom-toast-error specific_class",
      });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="container">
      <h1>Inscription</h1>
      <form
        onSubmit={handleSubmit}
        name="register-form"
        className="register-form"
      >
        <label htmlFor="username">Pseudo</label>
        <input
          onChange={handleChange}
          type="text"
          name="username"
          id="username"
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          onChange={handleChange}
        />
        <label htmlFor="confirmPassword">Confirmez votre mot de passe</label>
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          id="confirmPassword"
          onChange={handleChange}
        />
        <label className="showPassword" htmlFor="show-password">
          <input
            type="checkbox"
            name="show-password"
            id="show-password"
            onChange={togglePassword}
          />
          Show Password
        </label>
        <button className="btn-register" type="submit">
          Register
        </button>
      </form>
    </section>
  );
}
