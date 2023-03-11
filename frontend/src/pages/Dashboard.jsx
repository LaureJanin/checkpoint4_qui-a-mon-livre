import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import instance from "../utils/instance";
import trash from "../assets/img/trash.png";
import "./styles/Dashboard.scss";

export default function Dashboard() {
  const [admins, setAdmins] = useState([]);
  const [books, setBooks] = useState([]);
  const [adminIdToDelete, setAdminIdToDelete] = useState(null);

  const getAdmin = () => {
    instance
      .get("/admin", admins)
      .then((result) => {
        setAdmins(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getBook = () => {
    instance
      .get("/books", books)
      .then((result) => {
        setBooks(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getAdmin();
    getBook();
  }, []);

  const handleDelete = (id) => {
    setAdminIdToDelete(id);
  };

  const handleConfirmDelete = (id) => {
    instance
      .delete(`/admin/${id}`)
      .then(() => {
        setAdmins(admins.filter((admin) => admin.id !== id));
        setAdminIdToDelete(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  let filteredBooks = [];

  return (
    <section className="container_dashboard">
      <h1>Dashboard</h1>
      <h2>Tableau des utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Pseudo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => {
            filteredBooks = books.filter((book) => book.admin_id === admin.id);
            return (
              <>
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.username}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(admin.id)}
                      className="deleteButton"
                    >
                      <img src={trash} alt="trash" />
                    </button>
                  </td>
                </tr>
                <tr key={`${admin.id}-books`}>
                  <td>Livres</td>
                  <td colSpan="1">
                    {filteredBooks.map((book) => (
                      <div key={book.id}>
                        {book.title} de {book.author}
                      </div>
                    ))}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
      {adminIdToDelete && (
        <div className="modal">
          <form>
            <p>Êtes-vous sûr de vouloir supprimer cet administrateur ?</p>
            <button
              type="button"
              onClick={() => handleConfirmDelete(adminIdToDelete)}
            >
              Confirmer
            </button>
            <button type="button" onClick={() => setAdminIdToDelete(null)}>
              Annuler
            </button>
          </form>
        </div>
      )}
      <Link to="/accueil">
        <button className="accueilButton" type="button">
          Accueil
        </button>
      </Link>
    </section>
  );
}
