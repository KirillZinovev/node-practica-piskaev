const express = require("express");
const favicon = require("express-favicon");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./controllers/admin");
const session = require("express-session");
const message = require("./middleware/message");
const messanger = "https://kappa.lol/iSONv";
const link = "https://kappa.lol/VMimi";
const bodyParser = require("body-parser");
const logger = require("./logger/index");
const passport = require("passport");
const passportFunction = require("./middleware/passport_jwt");
const passportFunctionYandex = require("./middleware/passport_yandex");
const passportFunctionGoogle = require("./middleware/passport_go");
const passportFunctionGitHub = require("./middleware/passport_github");
const passportFunctionVkontakte = require("./middleware/passport_vkontakte");
const { sequelize } = require("./models/db");
// const morgan = require("morgan");
const winston = require("winston");
const app = express();
app.use(bodyParser.json());

// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));
const myRoutes = require("./routers/index_routers");
const userSession = require("./middleware/user_session");
const passportFunctionJWT = require("./middleware/passport_jwt");

require("dotenv").config;
const port = process.env.PORT || "3000";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const flash = require("connect-flash");
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "views")));
app.use("/uploads", express.static("uploads"));
// app.use(morgan("tiny"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passportFunctionJWT(passport);
passportFunctionYandex(passport);
passportFunctionGoogle(passport);
passportFunctionGitHub(passport);
passportFunctionVkontakte(passport);
app.use(
  "/css/bootstrap.css",
  express.static(
    path.join(
      __dirname,
      "public/css/bootstrap-5.3.2/dist/css/bootstrap.min.css"
    )
  )
);

app.use(favicon(__dirname + "/public/img/logo.png"));
app.use(userSession);
app.use(message);
app.use(myRoutes);

app.get("/", (req, res) => {
  res.render("registerForm.ejs", { link: link, messanger: messanger });
});

app.use(adminRoutes);

app.listen(port, async function () {
  await sequelize.sync({ force: true });
  logger.info(
    `Сервер запущен на порту ` + port + ", все базы данных синхронизированны"
  );
  console.log(
    `Сервер запущен на порту ` + port + ", все базы данных синхронизированны"
  );
});

if (app.get("env") != "development") {
} else {
}
