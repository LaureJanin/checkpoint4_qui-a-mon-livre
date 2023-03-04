import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import instance from "../utils/instance";
import "./Book.scss";

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

  const getData = () => {
    instance
      .get(`/book/${id}`)
      .then((result) => {
        setBook(result.data);
        const borrowerId = result.data.borrower_id;
        instance
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

  function handleUpdateBook(e) {
    e.preventDefault();
    setIsEditingBook(false);
    instance
      .put(`/book/${id}`, {
        title: titleBook,
        author: authorBook,
        year: yearBook,
        resume: resumeBook,
        isBorrowed: book.isBorrowed,
        loan_date: dateBook.split("T")[0],
        borrower_id: book.borrower_id,
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

  function handleUpdateBorrower(e) {
    e.preventDefault();
    setIsEditingBorrower(false);
    instance
      .put(`/borrower/${book.borrower_id}`, {
        firstname: firstnameBorrower,
        lastname: lastnameBorrower,
        email: emailBorrower,
        phone_number: phoneNumberBorrower,
      })
      .then((res) => {
        console.warn(res);
        getData();
      })
      .catch((err) => {
        console.error(err);
      });
  }

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

  return (
    <section className="container">
      <h1>Emprunt en cours</h1>
      {isEditingBook ? (
        <div>
          <div className="overlay" />
          <form className="modal_form" onSubmit={handleUpdateBook}>
            <button
              type="button"
              className="close-button"
              onClick={handleEditBook}
            >
              X
            </button>
            <label htmlFor="date">
              Modifier les informations concernant le livre
            </label>
            <input
              type="text"
              value={titleBook}
              onChange={(event) => setTitleBook(event.target.value)}
            />
            <input
              type="text"
              value={authorBook}
              onChange={(event) => setAuthorBook(event.target.value)}
            />
            <input
              type="text"
              value={yearBook}
              onChange={(event) => setYearBook(event.target.value)}
            />
            <input
              type="text"
              value={resumeBook}
              onChange={(event) => setResumeBook(event.target.value)}
            />
            <label htmlFor="date">Date d'emprunt</label>
            <input
              type="date"
              value={dateBook}
              onChange={(event) => setDateBook(event.target.value)}
            />
            <button type="submit">Enregistrer</button>
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
        <form onSubmit={handleUpdateBorrower}>
          <label htmlFor="text">
            Modifier les informations concernant l'emprunteur
          </label>
          <input
            type="text"
            value={firstnameBorrower}
            onChange={(event) => setFirstnameBorrower(event.target.value)}
          />
          <input
            type="text"
            value={lastnameBorrower}
            onChange={(event) => setLastnameBorrower(event.target.value)}
          />
          <input
            type="text"
            value={emailBorrower}
            onChange={(event) => setEmailBorrower(event.target.value)}
          />
          <input
            type="text"
            value={phoneNumberBorrower}
            onChange={(event) => setPhoneNumberBorrower(event.target.value)}
          />
          <button type="submit">Enregistrer</button>
        </form>
      ) : (
        <section className="book">
          <h2>Informations concernant l'emprunteur</h2>
          <p>
            {borrower.firstname} {borrower.lastname}
          </p>
          <p>{borrower.phone_number}</p>
          <p>{borrower.email}</p>
          <button
            className="buttonModif"
            type="submit"
            onClick={() => handleEditBorrower()}
          >
            Modifier
          </button>
        </section>
      )}

      <button
        type="submit"
        className="buttonReturn"
        key={book.id}
        onClick={deleteModal}
      >
        Le livre a été rendu
      </button>
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Êtes-vous sûr de vouloir supprimer cet emprunt ?</p>
            <button type="button" onClick={() => handleDelete(book.id)}>
              Oui
            </button>
            <button type="button" onClick={handleCancelDelete}>
              Annuler
            </button>
          </div>
        </div>
      )}
      <Link to="/accueil">
        <button className="buttonReturn" type="button">
          Home
        </button>
      </Link>
    </section>
  );
}
