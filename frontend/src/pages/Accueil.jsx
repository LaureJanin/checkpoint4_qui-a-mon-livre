import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Accueil.scss";

export default function Accueil() {
  const [active, setActive] = useState(1);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/book", books)
      .then((result) => {
        setBooks(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const selectCard = (id) => {
    setActive((id - 1) % books.length);
  };

  return (
    <section className="container">
      <h1>Votre Bibliothèque</h1>
      <div className="button">
        <button type="button">Ajouter un livre emprunté</button>
        <button type="button">Ajouter un emprunteur</button>
      </div>
      <section className="slider-section">
        <div
          className="slider-flex"
          // layoutId="cardId"
          style={{
            transition: active === 0 && "none",
            transform: `translateX(-${(active / books.length) * 100}%)`,
          }}
        >
          {books.map((book, index) => (
            <button
              type="button"
              // layoutId={`card-${index}`}
              className={`card ${
                active === index ? "card-active" : "".slice("")
              }`}
              key={book.id}
              onClick={() => selectCard(book.id)}
            >
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.year}</p>
              <p>{book.resume}</p>
              <p>{book.isBorrowed ? book.loan_date.split("T")[0] : ""}</p>

              <Link to={`/book/${book.id}`} key={book.id}>
                <button type="button">Contacter l'emprunteur</button>
              </Link>
            </button>
          ))}
        </div>
      </section>
      <div className="button">
        <button type="button">Previous</button>
        <button type="button">Next</button>
      </div>
    </section>
  );
}
