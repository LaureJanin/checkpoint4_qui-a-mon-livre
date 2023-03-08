const AbstractManager = require("./AbstractManager");

class BorrowerManager extends AbstractManager {
  constructor() {
    super({ table: "borrower" });
  }

  findAll() {
    return this.connection.query(`select * from  ${this.table}`);
  }

  findById(id) {
    return this.connection.query(`select * from ${this.table} where id = ?`, [
      id,
    ]);
  }

  insert(borrower) {
    return this.connection.query(
      `insert into ${this.table} (firstname, lastname, email, phone_number, admin_id) values (?, ?, ?, ?, ?)`,
      [
        borrower.firstname,
        borrower.lastname,
        borrower.email,
        borrower.phone_number,
        borrower.admin_id,
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
