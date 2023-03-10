const express = require("express");

const router = express.Router();

const adminControllers = require("./controllers/adminControllers");
const borrowerControllers = require("./controllers/borrowerControllers");
const bookControllers = require("./controllers/bookControllers");
const authenticateToken = require("./middlewares/authenticate");

// Routes log
router.post("/login", adminControllers.log);
router.post("/register", adminControllers.add);

router.use(authenticateToken);

// Routes admin
router.get("/admin", adminControllers.browse);
router.get("/admin/:id", adminControllers.read);
router.delete("/admin/:id", adminControllers.destroy);

// Routes borrower
router.get("/borrower", borrowerControllers.browse);
router.get("/borrower/:id", borrowerControllers.read);
router.put("/borrower/:id", borrowerControllers.edit);
router.post("/borrower", borrowerControllers.add);
router.delete("/borrower/:id", borrowerControllers.destroy);

// Routes book
router.get("/book", bookControllers.browse);
router.get("/books", bookControllers.browseAdmin);
router.get("/book/:id", bookControllers.read);
router.put("/book/:id", bookControllers.edit);
router.post("/book", bookControllers.add);
router.delete("/book/:id", bookControllers.destroy);

module.exports = router;
