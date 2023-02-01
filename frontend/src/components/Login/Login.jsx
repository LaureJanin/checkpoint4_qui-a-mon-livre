import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
// import instance from "../../utils/instance";
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
    axios
      .post("http://localhost:5000/login", loginAdmin)
      .then((res) => console.warn(res.data))
      .then(() => navigate("/accueil"))
      .catch((err) =>
        console.error(err, Notify.error("Mauvaises informations ! ❌"))
      );
  };

  return (
    <section className="container">
      <div className="login">
        <h1 className="texte">
          Pour entrer dans la bibliothèque, veuillez renseigner un mot de passe{" "}
        </h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Username : </label>
          <input
            className="input-username"
            type="username"
            name="username"
            onChange={handleChangeLogin}
            required
          />
          <br />
          <br />
          <label htmlFor="mdp">Mot De Passe : </label>
          <input
            className="input-mdp"
            type="password"
            name="password"
            onChange={handleChangeLogin}
            required
          />
          <div className="button">
            <button type="submit">Se connecter</button>
          </div>
        </form>
      </div>
    </section>
  );
}
