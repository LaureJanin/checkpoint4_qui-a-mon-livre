import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import instance from "../../utils/instance";
import Notify from "../../utils/notification";

import "./Login.scss";

export default function Login() {
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
        Cookies.set("admin-auth", token);
        navigate("/accueil");
      })
      .catch((err) =>
        console.error(err, Notify.error("Mauvaises informations ! ❌"))
      );
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
            type="password"
            name="password"
            onChange={handleChangeLogin}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </section>
  );
}
