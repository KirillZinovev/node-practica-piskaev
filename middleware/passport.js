const JwtStrategy = require("passport-jwt").Strategy;
const User = require("…/models/user");
const logger = require("…/logger/index_logger");

require("dotenv").config();

const cookieExtractor = function (req) {
let token = null;
if (req && req.cookies) {
