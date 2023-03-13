import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import instance from "../utils/instance";
import "./styles/Book.scss";

export default function Book() {
  const [book, setBook] = useState([]);
  const [titleBook, setTitleBook] = useState("");
  const [authorBook, setAuthorBook] = useState("");
  const [yearBook, setYearBook] = useState("");
  const [resumeBook, setResumeBook] = useState("");
  const [dateBook, setDateBook] = useState("");

  const [borrower, setBorrower] = useState([]);
  const [firstnameBorrower, setFirstnameBorrower] = useState("");
  const [lastnameBorrower, setLastnameBorrower] = useState("");
  const [emailBorrower, setEmailBorrower] = useState("");
  const [phoneNumberBorrower, setPhoneNumberBorrower] = useState("");

  const [isEditingBook, setIsEditingBook] = useState(false);
  const [isEditingBorrower, setIsEditingBorrower] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { id } = useParams();

  // The getData function makes two GET requests to retrieve data related to a specific book. The function expects an id parameter that represents the book's unique identifier.
  const getData = () => {
    instance
      // The first GET request uses the instance object to send a GET request to the server to retrieve the book's information using the id parameter. Upon a successful response, it updates the book state with the retrieved data.
      .get(`/book/${id}`)
      .then((result) => {
        setBook(result.data);
        const borrowerId = result.data.borrower_id;
        instance
          // The second GET request uses the borrower_id property of the book state to send another GET request to retrieve information about the borrower who borrowed the book. Upon a successful response, it updates the borrower state with the retrieved data.
          .get(`/borrower/${borrowerId}`)
          .then((res) => {
            setBorrower(res.data);
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
    getData();
  }, []);

  function handleEditBook() {
    setIsEditingBook(!isEditingBook);
  }

  useEffect(() => {
    if (book.length !== 0) {
      setTitleBook(book.title);
      setAuthorBook(book.author);
      setYearBook(book.year);
      setResumeBook(book.resume);
      setDateBook(book.loan_date);
    }
  }, [book]);

  // The handleUpdateBook function is used to update the information of a book on the server using the PUT method.
  // It expects an e event object as a parameter and is typically called when a user submits a form to update a book's information.
  function handleUpdateBook(e) {
    e.preventDefault();
    // It then sets isEditingBook state to false to indicate that the book is no longer being edited.
    setIsEditingBook(false);
    // The function then retrieves the admin_id from sessionStorage and uses the instance object to send a PUT request to the server to update the book's information. The id parameter is used to identify the book that needs to be updated. The new book information is sent as an object with properties title, author, year, resume, isBorrowed, loan_date, borrower_id, and admin_id.
    const adminId = window.sessionStorage.getItem("admin_id");
    instance
      .put(`/book/${id}`, {
        title: titleBook,
        author: authorBook,
        year: yearBook,
        resume: resumeBook,
        isBorrowed: book.isBorrowed,
        loan_date: dateBook.split("T")[0],
        borrower_id: book.borrower_id,
        admin_id: adminId,
      })
      .then((res) => {
        console.warn(res);
        getData();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleEditBorrower() {
    setIsEditingBorrower(!isEditingBorrower);
  }

  useEffect(() => {
    if (borrower.length !== 0) {
      setFirstnameBorrower(borrower.firstname);
      setLastnameBorrower(borrower.lastname);
      setEmailBorrower(borrower.email);
      setPhoneNumberBorrower(borrower.phone_number);
    }
  }, [borrower]);

  // This function handleUpdateBorrower is used to update the information of a borrower.
  function handleUpdateBorrower(e) {
    // When the function is called, it first prevents the default action of the form submission. It then sets setIsEditingBorrower to false, which is a state variable used to control whether the borrower information is being edited or not.
    e.preventDefault();
    setIsEditingBorrower(false);
    // Next, it retrieves the adminId from the session storage. It then uses the instance object to make an HTTP PUT request to the /borrower/${book.borrower_id} endpoint to update the borrower's information. The request body contains the updated borrower's firstname, lastname, email, phone_number, and admin_id.
    const adminId = window.sessionStorage.getItem("admin_id");
    instance
      .put(`/borrower/${book.borrower_id}`, {
        firstname: firstnameBorrower,
        lastname: lastnameBorrower,
        email: emailBorrower,
        phone_number: phoneNumberBorrower,
        admin_id: adminId,
      })
      // If the request is successful, the function calls the getData function to retrieve the updated borrower data and updates the state variables accordingly. If the request fails, it logs the error to the console.
      .then((res) => {
        console.warn(res);
        getData();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Functions for delete the book
  function handleDelete() {
    instance
      .delete(`/book/${id}`)
      .then(() => {
        // Navigate to home page after successful deletion
        window.location.href = "/accueil";
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const deleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // Function for limit the number of caracters for the textarea 'resume'.
  const MAX_CHARS = 450;
  const handleChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= MAX_CHARS) {
      setResumeBook(inputText);
    }
  };

  // Variable for the style of borrower's name
  const styleBorrower = {
    color: "#c9768f",
    fontSize: "22px",
    fontWeight: "700",
  };

  return (
    <section className="container_book">
      <h1>Emprunt en cours</h1>
      <div className="box">
        {isEditingBook ? (
          <div>
            <div className="overlay" />
            <form className="modal_form_book" onSubmit={handleUpdateBook}>
              <button
                type="button"
                className="close-button"
                onClick={handleEditBook}
              >
                ✖️
              </button>
              <label htmlFor="date">
                Modifier les informations concernant le livre
              </label>
              <input
                type="text"
                value={titleBook}
                placeholder="Titre du livre"
                onChange={(event) => setTitleBook(event.target.value)}
              />
              <input
                type="text"
                value={authorBook}
                placeholder="Auteur du livre"
                onChange={(event) => setAuthorBook(event.target.value)}
              />
              <input
                type="text"
                value={yearBook}
                placeholder="Année de parution du livre"
                onChange={(event) => setYearBook(event.target.value)}
              />
              <textarea
                type="text"
                value={resumeBook}
                placeholder="Résumé du livre"
                onChange={handleChange}
                maxLength={MAX_CHARS}
              />
              <div>{MAX_CHARS - resumeBook.length} caractères restants</div>
              <label htmlFor="date">Date d'emprunt</label>
              <input
                type="date"
                value={dateBook}
                onChange={(event) => setDateBook(event.target.value)}
              />
              <button className="save" type="submit">
                Enregistrer
              </button>
            </form>
          </div>
        ) : (
          <section className="book">
            <h2>Informations concernant le livre</h2>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.year}</p>
            <p>{book.resume}</p>
            <p>{moment(book.loan_date).format("DD MMM YYYY")}</p>
            <button
              className="buttonModif"
              type="submit"
              onClick={() => {
                handleEditBook();
              }}
            >
              Modifier
            </button>
          </section>
        )}

        {isEditingBorrower ? (
          <div>
            <div className="overlay" />
            <form className="modal_form_book" onSubmit={handleUpdateBorrower}>
              <button
                type="button"
                className="close-button"
                onClick={handleEditBorrower}
              >
                ✖️
              </button>
              <label htmlFor="text">
                Modifier les informations concernant l'emprunteur
              </label>
              <input
                type="text"
                placeholder="Prénom"
                value={firstnameBorrower}
                onChange={(event) => setFirstnameBorrower(event.target.value)}
              />
              <input
                type="text"
                placeholder="Nom"
                value={lastnameBorrower}
                onChange={(event) => setLastnameBorrower(event.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={emailBorrower}
                onChange={(event) => setEmailBorrower(event.target.value)}
              />
              <input
                type="text"
                placeholder="Numéro de téléphone"
                value={phoneNumberBorrower}
                onChange={(event) => setPhoneNumberBorrower(event.target.value)}
              />
              <button className="save" type="submit">
                Enregistrer
              </button>
            </form>
          </div>
        ) : (
          <section className="book">
            <h2>Informations concernant l'emprunteur</h2>
            <p style={styleBorrower}>
              {borrower.firstname} {borrower.lastname}
            </p>
            <p>{borrower.phone_number}</p>
            <a href={`mailto:${borrower.email}`}>{borrower.email}</a>
            <button
              className="buttonModif"
              type="submit"
              onClick={() => handleEditBorrower()}
            >
              Modifier
            </button>
          </section>
        )}
      </div>
      <button
        type="submit"
        className="buttonReturn"
        key={book.id}
        onClick={deleteModal}
      >
        Le livre a été rendu
      </button>
      {showDeleteModal && (
        <div>
          <div className="overlay" />
          <div className="modal_form">
            <p>Êtes-vous sûr de vouloir supprimer cet emprunt ?</p>
            <button
              className="save"
              type="button"
              onClick={() => handleDelete(book.id)}
            >
              Oui
            </button>
            <button className="save" type="button" onClick={handleCancelDelete}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <Link to="/accueil">
        <button className="buttonReturn" type="button">
          Accueil
        </button>
      </Link>
    </section>
  );
}
