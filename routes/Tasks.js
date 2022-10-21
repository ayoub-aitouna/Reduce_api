const Router = require("express").Router();
const {
  add_anounsment,
  anounsments,
  done,
  add_done,
  search,
} = require("../controllers/Tasks");

Router.post("/add_anounsment", add_anounsment);
Router.post("/add_done", add_done);
Router.get("/anounsments", anounsments);
Router.get("/done", done);
Router.get("/search/:name", search);

module.exports = Router;
