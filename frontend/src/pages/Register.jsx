import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Notify from "../utils/notification";
import instance from "../utils/instance";

import "./styles/Register.scss";

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

  // This function is a form submission handler.
  const handleSubmit = (e) => {
    // When the form is submitted, it first prevents the default form submission behavior.
    e.preventDefault();
    const { username, password, confirmPassword } = registerUser;
    // It then checks if the entered password and confirmed password match, and if not, displays an error message using the toast function.
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        className: "custom-toast-error specific_class",
      });
      return;
    }
    // It also checks if the username, password, and confirmed password fields are not empty, and if any of them are empty, it displays another error message using the toast function.
    if (username === "" || password === "" || confirmPassword === "") {
      toast.error("Veuillez remplir tous les champs", {
        className: "custom-toast-error specific_class",
      });
      return;
    }
    // It then checks if the password meets a specific regular expression pattern that requires it to have at least one digit, one lowercase letter, one uppercase letter, one special character, and a minimum length of 8 characters. If the password does not meet this requirement, it displays another error message using the toast function.
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[?._+\-<>!@#$%^&*]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Le mot de passe doit contenir au moins une minuscule, une majuscule, un caractère spécial et doit avoir une longueur minimale de 8 caractères",
        {
          className: "custom-toast-error specific_class",
        }
      );
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
      <h1>
        Pour vous inscrire, veuillez renseigner un pseudo et un mot de passe
      </h1>
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
        <Link to="/">
          <button className="btn-register" type="button">
            Retour
          </button>
        </Link>
      </form>
    </section>
  );
}
