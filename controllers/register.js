const User = require("../models/user");
// const {emailValidation, passValidation}  = require("../middleware/validation");

const link = "https://kappa.lol/VMimi";
const messanger = "https://kappa.lol/iSONv";

exports.form = (req, res) => {
  res.render("registerForm", { errors: {}, link: link, messanger: messanger });
};

exports.submit = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findByEmail(email, (error, user) => {
    if (error) return next(error);
    if (user) {
      console.log("Такой пользователь в базе уже существует.");
      res.redirect("/");
    } else {
      User.create(req.body, (err) => {
        if (err) return next(err);
        req.session.userEmail = email;
        req.session.userName = name;
        res.redirect("/");
      });
    }
  });
};
