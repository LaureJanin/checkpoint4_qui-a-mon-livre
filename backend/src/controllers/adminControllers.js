const { verify, hash, argon2id } = require("argon2");
const jwt = require("jsonwebtoken");
const models = require("../models");

const browse = (req, res) => {
  models.admin
    .findAll(req.params.book.admin_id)
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
            const token = jwt.sign(
              { username: admin.username },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );
            req.session.adminId = admin.id;
            req.session.save();
            res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
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

module.exports = {
  browse,
  read,
  add,
  log,
};
