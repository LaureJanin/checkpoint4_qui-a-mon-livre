const { verify, hash, argon2id } = require("argon2");
const jwt = require("jsonwebtoken");
const models = require("../models");

const browse = (req, res) => {
  models.admin
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = (req, res) => {
  models.admin
    .findById(req.params.id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// This code defines a function called add that is used to add a new admin user to a database.
const add = (req, res) => {
  // Within the function, it extracts the password field from the req.body object.
  const { password } = req.body;
  // It then defines an object called hashingOptions that specifies the options for the password hashing process.
  // These options include the argon2id algorithm for hashing, a memory cost of 2^16 (65536), a time cost of 5 iterations, and a parallelism factor of 1.
  const hashingOptions = {
    type: argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  };
  // The hash() function from the argon2 package is then called with the password and hashing options to generate a hashed password.
  // This function returns a promise that resolves with the hashed password.
  hash(password, hashingOptions).then((hashedPassword) => {
    const admin = {
      ...req.body,
      hashedPassword,
    };
    // Once the hashed password is generated, the function creates a new object called admin that includes all fields from the req.body object and adds the hashed password as a new field.
    // The models.admin.insert(admin) function is then called to insert the new admin into the database. This function returns a promise that resolves with an array of rows affected by the insertion.
    models.admin.insert(admin).then(([rows]) => {
      if (rows.affectedRows === 1) {
        return res.status(201).json({ success: "Admin saved" });
      }
      return res.status(403).json({ error: "une erreur s'est produite" });
    });
  });
};

const log = (req, res) => {
  const { username, password } = req.body;
  models.admin
    .findByUsername(username)
    .then(([[admin]]) => {
      if (!admin) {
        return res.status(403).json({ error: "User not found" });
      }
      verify(admin.password, password)
        .then((match) => {
          if (match) {
            const token = jwt.sign(
              { username: admin.username, sub: admin.id },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );
            // set the token cookie with the generated JWT
            res.cookie("token", token);
            return res
              .status(200)
              .json({ success: "Admin logged", adminId: admin.id });
          }
          return res.status(403).json({ error: "password incorrect" });
        })
        .catch((error) => {
          console.error(error);
        });
      return false;
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = (req, res) => {
  models.admin
    .delete(req.params.id)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  browse,
  read,
  add,
  log,
  destroy,
};
