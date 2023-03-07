import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import instance from "../../utils/instance";
import "react-toastify/dist/ReactToastify.css";

import "./Login.scss";
import "../../assets/_variables.scss";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginAdmin, setLoginAdmin] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginAdmin({ ...loginAdmin, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    instance
      .post("/login", loginAdmin)
      .then(({ data: { token } }) => {
        Cookies.set("admin_auth_frontend", token);
        navigate("/accueil");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Pseudo ou mot de passe incorrect !", {
          className: "custom-toast-error specific_class",
        });
      });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="container">
      <div className="login">
        <h1>
          Pour entrer dans la bibliothèque, veuillez renseigner un mot de passe.{" "}
        </h1>
        <form className="formLogin" onSubmit={handleLogin}>
          <label htmlFor="email">Pseudo</label>
          <input
            type="username"
            name="username"
            onChange={handleChangeLogin}
            required
          />
          <label htmlFor="mdp">Mot De Passe</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChangeLogin}
            required
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
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </section>
  );
}
