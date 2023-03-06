const AbstractManager = require("./AbstractManager");

class AdminManager extends AbstractManager {
  constructor() {
    super({ table: "admin" });
  }

  findAll() {
    return this.connection.query(`select * from  ${this.table}`);
  }

  insert(admin) {
    return this.connection.query(
      `insert into ${this.table} (username, password) values (?, ?)`,
      [admin.username, admin.hashedPassword]
    );
  }

  findByUsername(username) {
    return this.connection.query(
      `select id, username, password from ${this.table} where username = ?`,
      [username]
    );
  }

  findById(id) {
    return this.connection.query(
      `select id, username, password from ${this.table} where id = ?`,
      [id]
    );
  }

  update(admin) {
    return this.connection.query(
      `update ${this.table} set username = ?, password = ? where id = ?`,
      [admin.username, admin.password, admin.id]
    );
  }
}

module.exports = AdminManager;
