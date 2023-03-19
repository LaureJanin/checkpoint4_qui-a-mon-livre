import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { Player } from "@lottiefiles/react-lottie-player";
import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import instance from "../utils/instance";
import pile from "../assets/lottie/pile.json";
import "./styles/Accueil.scss";

export default function Accueil() {
  const [books, setBooks] = useState([]);
  const [admin, setAdmin] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [resume, setResume] = useState("");
  const [date, setDate] = useState("");

  const [isBook, setIsBook] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  // The function begins by getting the value of the "token" cookie using the get() function from the Cookies library.
  const getAdmin = () => {
    // The token is retrieved from the cookies
    const token = Cookies.get("token");
    // The next line decodes the JWT token to obtain the admin ID using the jwtDecode() function.
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.id;
    // The instance object is presumably an Axios instance configured to communicate with a particular API backend.
    // The function then sends a GET request to the backend to obtain the admin object associated with the decoded admin ID.
    instance
      .get(`/admin/${adminId}`)
      .then((result) => {
        setAdmin(result.data);
        if (adminId === 1) {
          setIsSuperAdmin(true);
        }
        return result.data.id;
      })
      // In the subsequent promise, another GET request is sent to obtain an array of books associated with the admin ID.

      .then(() => {
        instance
          .get(`/book/${adminId}`, books)
          .then((result) => {
            setBooks(result.data);
            // If the admin ID is equal to 1, the setIsSuperAdmin() function is called to set a boolean state indicating that the current admin is a superadmin.
            if (result.data.length > 0) {
              setIsBook(false);
            } else {
              setIsBook(true);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // This handleNewBook function is a handler for creating a new book entry. It prevents the default form submission behavior using e.preventDefault(), retrieves the admin ID from the session storage, and then sends a POST request to create a new borrower with the specified details.
  function handleNewBook(e) {
    e.preventDefault();
    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.id;
    instance
      .post(`/borrower`, {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@mail.com",
        phone_number: "01 02 03 04 05",
      })
      .then((response) => {
        // Upon a successful response, it retrieves the borrower ID from the response and then sends another POST request to create a new book with the specified details, including the borrower ID and admin ID.
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
            // If the request is successful, it updates the books state, fetches the latest book data using the getData function, and closes the modal by toggling the showModal state.
            setBooks(books);
            getAdmin();
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

  // Functions for deconnect
  const deleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // This handleDisconnected function is a handler for logging out the admin user from the application. It removes the admin_id from the session storage using the removeItem method.
  const handleDisconnected = () => {
    const cookies = document.cookie.split(";");
    // The loop splits each cookie string by the equal sign and uses the cookie name to check if it is the token cookie.
    // If it is the token cookie, it is deleted by setting its expiration date to a past date using the document.cookie property.
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split("=");
      if (cookie[0] === "token") {
        document.cookie = `${cookie[0]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
    // Finally, the function uses the navigate function from the @reach/router library to navigate the user back to the home page ("/") of the application.
    navigate("/");
  };

  // Function for limit the number of caracters for the textarea 'resume'.
  const MAX_CHARS = 450;
  const handleChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= MAX_CHARS) {
      setResume(inputText);
    }
  };

  // Variable for the color of username
  const styleH1 = {
    color: "#c9768f",
  };

  return (
    <section className="container_accueil">
      <h1>
        Bonjour <span style={styleH1}>{admin.username}</span>, voici la liste de
        vos livres empruntés
      </h1>
      <div className="buttons">
        {isSuperAdmin && (
          <Link to="/dashboard">
            <button type="button" className="buttonDashboard">
              Tableau de bord
            </button>
          </Link>
        )}
        {showModal ? (
          <div>
            <div className="overlay" />
            <form className="modal_form_accueil" onSubmit={handleNewBook}>
              <button
                type="button"
                className="close-button"
                onClick={toggleModal}
              >
                ✖️
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
                onChange={handleChange}
                maxLength={MAX_CHARS}
              />
              <div>{MAX_CHARS - resume.length} caractères restants</div>
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
            Ajouter un livre
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

                <Link to={`/onebook/${book.id}`} key={book.id}>
                  <button className="buttonKnow" type="button">
                    En savoir plus
                  </button>
                </Link>
              </div>
            ))}
          </ul>
        </>
      )}
      <button type="button" className="buttonDisconnect" onClick={deleteModal}>
        Se déconnecter
      </button>
      {showDeleteModal && (
        <div>
          <div className="overlay" />
          <div className="modal_form">
            <p>Souhaitez-vous vous déconnecter ?</p>
            <button className="save" type="button" onClick={handleDisconnected}>
              Oui
            </button>
            <button className="save" type="button" onClick={handleCancelDelete}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
