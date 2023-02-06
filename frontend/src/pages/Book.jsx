import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../utils/instance";
import "./Book.scss";

export default function Book() {
  const [book, setBook] = useState([]);
  const [borrower, setBorrower] = useState([]);
  const [titleBook, setTitleBook] = useState("");
  const [authorBook, setAuthorBook] = useState("");
  const [yearBook, setYearBook] = useState("");
  const [resumeBook, setResumeBook] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  function handleEdit() {
    setIsEditing(!isEditing);
  }

  useEffect(() => {
    if (book.length !== 0) {
      setTitleBook(book.title);
      setAuthorBook(book.author);
      setYearBook(book.year);
      setResumeBook(book.resume);
    }
  }, [book]);

  function handleUpdate(e) {
    e.preventDefault();
    setIsEditing(false);
    instance
      .put(`/book/${id}`, {
        title: titleBook,
        author: authorBook,
        year: yearBook,
        resume: resumeBook,
        isBorrowed: book.isBorrowed,
        loan_date: book.loan_date.split("T")[0],
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

  return (
    <section className="container">
      <div>
        {isEditing ? (
          <form onSubmit={handleUpdate}>
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
            <button type="submit">Enregistrer</button>
          </form>
        ) : (
          <section className="book">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.year}</p>
            <p>{book.resume}</p>
            <p>{book.loan_date}</p>
            <p>
              {borrower.firstname} {borrower.lastname}
            </p>
            <button
              type="submit"
              onClick={() => {
                handleEdit();
              }}
            >
              Modifier les informations
            </button>
            <button type="button" onClick={() => toggleModal()}>
              Contacter l'emprunteur
            </button>
            {showModal && (
              <div className="modal_form">
                <p>{borrower.phone_number}</p>
                <p>{borrower.email}</p>
              </div>
            )}
          </section>
        )}
      </div>
      <Link to="/accueil">
        <button className="buttonHome" type="button">
          Home
        </button>
      </Link>
    </section>
  );
}
