const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
require("dotenv").config();
const Log = require("../log");
const { generateKeyAndstoreOtp } = require("../Utils/OTP.js");
const { GenrateAvaratByName } = require("../Utils/Avatar");

const { BadRequestError } = require("../errors/index.js");
const { Encrypte } = require("../Utils/Crypto");
