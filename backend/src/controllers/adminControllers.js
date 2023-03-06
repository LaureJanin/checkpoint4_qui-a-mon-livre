const { verify, hash, argon2id } = require("argon2");
const { generateToken } = require("../services/jwt");
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

const add = (req, res) => {
  const { password } = req.body;
  const hashingOptions = {
    type: argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  };
  hash(password, hashingOptions).then((hashedPassword) => {
    const admin = {
      ...req.body,
      hashedPassword,
    };

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
            const token = generateToken({
              id: admin.id,
              username: admin.username,
            });
            return res
              .cookie("admin_auth", token, { httpOnly: true, secure: false })
              .status(200)
              .json({ token, success: "Admin logged" });
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

module.exports = {
  browse,
  read,
  add,
  log,
};
