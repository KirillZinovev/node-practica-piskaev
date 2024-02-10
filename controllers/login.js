const User = require("../models/user");
const validator = require("validator");
const link = "https://kappa.lol/VMimi";
const messanger = "https://kappa.lol/iSONv";

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
      return;
    }

    req.session.userEmail = data.email;
    req.session.userName = data.name;
    res.redirect("/");
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
