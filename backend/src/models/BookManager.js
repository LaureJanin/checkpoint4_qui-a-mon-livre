const AbstractManager = require("./AbstractManager");

class BookManager extends AbstractManager {
  constructor() {
    super({ table: "book" });
  }

  findAllBooks() {
    return this.connection.query(`select * from  ${this.table}`);
  }

  findAll(adminId) {
    return this.connection
      .query(`SELECT * FROM ${this.table} WHERE admin_id = ?`, [adminId])
      .then(([rows]) => {
        return rows;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  findById(id) {
    return this.connection.query(`select * from ${this.table} where id = ?`, [
      id,
    ]);
  }

  insert(book) {
    return this.connection.query(
      `insert into ${this.table} (title, author, year, resume, isBorrowed, loan_date, borrower_id, admin_id) values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        book.title,
        book.author,
        book.year,
        book.resume,
        book.isBorrowed,
        book.loan_date,
        book.borrower_id,
        book.admin_id,
      ]
    );
  }

  update(book) {
    return this.connection.query(
      `update ${this.table} set title = ?, author = ?, year = ?, resume = ?, isBorrowed = ?, loan_date = ?, borrower_id = ?, admin_id = ? where id = ?`,
      [
        book.title,
        book.author,
        book.year,
        book.resume,
        book.isBorrowed,
        book.loan_date,
        book.borrower_id,
        book.admin_id,
        book.id,
      ]
    );
  }
}

module.exports = BookManager;
