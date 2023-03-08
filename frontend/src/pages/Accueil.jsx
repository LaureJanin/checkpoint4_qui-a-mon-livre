import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { Player } from "@lottiefiles/react-lottie-player";
import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import instance from "../utils/instance";
import pile from "../assets/lottie/pile.json";
import "./Accueil.scss";

export default function Accueil() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [resume, setResume] = useState("");
  const [date, setDate] = useState("");
  const [isBook, setIsBook] = useState(true);

  const navigate = useNavigate();

  const getData = () => {
    instance
      .get("/book", books)
      .then((result) => {
        setBooks(result.data);
        if (result.data.length > 0) {
          setIsBook(false);
        } else {
          setIsBook(true);
        }
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
    const adminId = window.sessionStorage.getItem("admin_id");
    instance
      .post(`/borrower`, {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@mail.com",
        phone_number: "01 02 03 04 05",
        admin_id: adminId,
      })
      .then((response) => {
        const borrowerId = response.data.id;
        instance
          .post(`/book`, {
            title,
            author,
            year,
            resume,
            isBorrowed: true,
            loan_date: date,
            borrower_id: borrowerId,
            admin_id: adminId,
          })
          .then(() => {
            setBooks(books);
            getData();
            setShowModal(!showModal);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleDisconnected = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

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
              <textarea
                type="text"
                value={resume}
                placeholder="Résumé du livre..."
                onChange={(event) => setResume(event.target.value)}
              />
              <label htmlFor="date">Date d'emprunt</label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
              <button className="save" type="submit">
                Enregistrer
              </button>
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
      {isBook ? (
        <>
          <br />
          <br />
          <p>Vous n'avez pas d'emprunt enregistré</p>
          <br />
          <Player autoplay loop src={pile} className="notFoundLottie" />
        </>
      ) : (
        <>
          <section className="slider-section">
            {books.length >= 3 ? (
              <Slider
                className="slider-flex"
                infinite
                centerMode
                centerPadding="0px"
                slidesToShow={3}
                slidesToScroll={1}
                responsive={[
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                ]}
              >
                {books.map((book) => (
                  <div key={book.id} className="cards">
                    <div
                      key={book.id}
                      className="card"
                      role="button"
                      tabIndex="0"
                    >
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
            ) : (
              <div className="notSlider">
                {books.map((book) => (
                  <div key={book.id} className="cards">
                    <div
                      key={book.id}
                      className="card"
                      role="button"
                      tabIndex="0"
                    >
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
              </div>
            )}
          </section>
          <ul className="card-list">
            {books.map((book) => (
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
            ))}
          </ul>
        </>
      )}
      <button
        type="button"
        className="buttonDisconnect"
        onClick={handleDisconnected}
      >
        Se déconnecter
      </button>
    </section>
  );
}
