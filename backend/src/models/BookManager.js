const AbstractManager = require("./AbstractManager");

class BookManager extends AbstractManager {
  constructor() {
    super({ table: "book" });
  }

  insert(book) {
    return this.connection.query(
      `insert into ${this.table} (title, author, year, resume, isBorrowed, loan_date, borrower_id) values (?, ?, ?, ?, ?, ?, ?)`,
      [
        book.title,
        book.author,
        book.year,
        book.resume,
        book.isBorrowed,
        book.loan_date,
        book.borrower_id,
      ]
    );
  }

  update(book) {
    return this.connection.query(
      `update ${this.table} set title = ?, author = ?, year = ?, resume = ?, isBorrowed = ?, loan_date = ?, borrower_id = ? where id = ?`,
      [
        book.title,
        book.author,
        book.year,
        book.resume,
        book.isBorrowed,
        book.loan_date,
        book.borrower_id,
        book.id,
      ]
    );
  }
}

module.exports = BookManager;
