import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Accueil.scss";

export default function Book() {
  const [book, setBook] = useState("");
  //   const [borrower, setBorrower] = useState("");

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/book/${id}`)
      .then((result) => {
        setBook(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  //   useEffect(() => {
  //     const borrowerId = book.borrower_id;
  //     console.warn(borrowerId);
  //     axios
  //       .get(`http://localhost:5000/borrower/${borrowerId}`)
  //       .then((result) => {
  //         setBorrower(result.data);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }, []);

  return (
    <section className="container">
      <div>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.year}</p>
        <p>{book.resume}</p>
        <p>{book.isBorrowed ? book.loan_date.split("T")[0] : ""}</p>

        <Link to={`/book/${book.id}`} key={book.id} target="_blank">
          <button type="button">Contacter l'emprunteur</button>
        </Link>
      </div>
    </section>
  );
}
