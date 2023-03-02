import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import instance from "../utils/instance";
import "./Accueil.scss";

export default function Accueil() {
  const [active, setActive] = useState(1);
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [resume, setResume] = useState("");
  const [date, setDate] = useState("");

  const getData = () => {
    instance
      .get("/book", books)
      .then((result) => {
        setBooks(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const selectCard = (id) => {
    setActive((id - 1) % books.length);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  function handleNewBook(e) {
    e.preventDefault();
    instance
      .post(`/book`, {
        title,
        author,
        year,
        resume,
        isBorrowed: true,
        loan_date: date,
        borrower_id: 1,
      })
      .then(() => {
        setBooks(books);
        getData();
        setShowModal(!showModal);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <section className="container">
      <h1>Vos livres empruntés</h1>
      <div>
        {showModal ? (
          <form className="modal_form" onSubmit={handleNewBook}>
            <p>Enregistrer un nouvel emprunt</p>
            <input
              type="text"
              value={title}
              placeholder="Titre"
              onChange={(event) => setTitle(event.target.value)}
            />
            <input
              type="text"
              value={author}
              placeholder="Auteur"
              onChange={(event) => setAuthor(event.target.value)}
            />
            <input
              type="text"
              value={year}
              placeholder="Année"
              onChange={(event) => setYear(event.target.value)}
            />
            <input
              type="text"
              value={resume}
              placeholder="Résumé du livre"
              onChange={(event) => setResume(event.target.value)}
            />
            <label htmlFor="date">Date d'emprunt</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <button type="submit">Enregistrer</button>
          </form>
        ) : (
          <button type="button" onClick={() => toggleModal()}>
            Ajouter un livre emprunté
          </button>
        )}
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
              <p>{moment(book.loan_date).format("DD MMM YYYY")}</p>

              <Link to={`/book/${book.id}`} key={book.id}>
                <button type="button">En savoir plus</button>
              </Link>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
