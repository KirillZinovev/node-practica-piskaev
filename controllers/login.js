const User = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const link = "https://kappa.lol/VMimi";
const messanger = "https://kappa.lol/iSONv";
const logger = require("../logger/index");
const winston = require("winston");
require("dotenv").config();
exports.form = (req, res) => {
  res.render("loginForm", { title: "Login", link: link, messanger: messanger });
};

exports.submit = (req, res, next) => {
  const email = req.body.loginForm.email;
  const password = req.body.loginForm.password;

  if (!validator.isEmail(email)) {
    res.render("loginForm", {
      errors: ["Неверный формат email"],
      link: link,
      messanger: messanger,
    });
    return;
  }

  User.authenticate(req.body.loginForm, (error, data) => {
    if (error) return next(error);
    if (!data) {
      res.render("loginForm", {
        errors: ["Имя или пароль неверный"],
        link: link,
        messanger: messanger,
      });
      logger.error("Имя или пароль неверный");
      return;
    }

    req.session.userEmail = data.email;
    req.session.userName = data.name;

    const token = jwt.sign(
      {
        name: req.body.name,
      },
      process.env.JWTTOCENSECRET || "aboba",
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60,
    });
    console.log("Токен подготовлен (на странице login): " + token);
    logger.info("Token подготовка :" + token);
    res.redirect("/");
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
