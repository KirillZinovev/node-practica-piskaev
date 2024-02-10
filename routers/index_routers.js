const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const entries = require("../controllers/entries");
const validate = require("../middleware/validate");

// Список записей
router.get("/", entries.list);

// Форма создания записи
router.get("/post", entries.form);

// Создание записи
router.post(
  "/post",
  validate.required("[entry[title]]"),
  validate.required("[entry[content]]"),
  validate.lengthAbove("[entry[title]]", 4),
  entries.submit
);

router.get("/register", register.form);
router.post("/register", register.submit);
router.get("/login", login.form);
router.post("/login", login.submit);
router.get("/delete/:id", entries.delete);
router.get("/edit/:id", entries.updateForm);
router.post("/edit/:id", entries.updateSubmit);
router.get("/logout", login.logout);

module.exports = router;
