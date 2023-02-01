const AbstractManager = require("./AbstractManager");

class BorrowerManager extends AbstractManager {
  constructor() {
    super({ table: "borrower" });
  }

  insert(borrower) {
    return this.connection.query(
      `insert into ${this.table} (firstname, lastname, email, phone_number) values (?, ?, ?, ?)`,
      [
        borrower.firstname,
        borrower.lastname,
        borrower.email,
        borrower.phone_number,
      ]
    );
  }

  update(borrower) {
    return this.connection.query(
      `update ${this.table} set firstname = ?, lastname = ?, email = ?, phone_number = ? where id = ?`,
      [
        borrower.firstname,
        borrower.lastname,
        borrower.email,
        borrower.phone_number,
        borrower.id,
      ]
    );
  }
}

module.exports = BorrowerManager;
