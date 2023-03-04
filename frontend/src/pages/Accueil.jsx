import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import instance from "../utils/instance";
import "./Accueil.scss";

export default function Accueil() {
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
          <div>
            <div className="overlay" />
            <form className="modal_form" onSubmit={handleNewBook}>
              <button
                type="button"
                className="close-button"
                onClick={toggleModal}
              >
                X
              </button>
              <label htmlFor="text">Enregistrer un nouvel emprunt</label>
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
          </div>
        ) : (
          <button
            className="buttonAdd"
            type="button"
            onClick={() => toggleModal()}
          >
            Ajouter un livre emprunté
          </button>
        )}
      </div>
      <section className="slider-section">
        <Slider
          className="slider-flex"
          infinite
          slidesToShow={3}
          slidesToScroll={6}
          centerMode
          centerPadding="0px"
        >
          {books.map((book) => (
            <div className="cards">
              <div key={book.id} className="card" role="button" tabIndex="0">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.year}</p>
                <p>{book.resume}</p>
                <p>{moment(book.loan_date).format("DD MMM YYYY")}</p>

                <Link to={`/book/${book.id}`} key={book.id}>
                  <button className="buttonKnow" type="button">
                    En savoir plus
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </section>
  );
}
