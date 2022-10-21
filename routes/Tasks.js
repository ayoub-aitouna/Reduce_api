const Router = require("express").Router();
const {
  add_anounsment,
  set_task_done,
  anounsments,
  done,
  add_done,
  search,
  edite_done,
} = require("../controllers/Tasks");

Router.post("/add_announcement", add_anounsment);
Router.post("/add_done", add_done);
Router.get("/anounsments", anounsments);
Router.get("/done", done);
Router.post("/set_task_done", set_task_done);
Router.post("/edit_done", edite_done);
Router.get("/search/:name", search);

module.exports = Router;
