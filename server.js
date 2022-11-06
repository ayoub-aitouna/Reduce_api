const express = require("express");
const app = express();
const Log = require("./log/index");
const { client } = require("./database/index");
const http = require("http");
/** Create HTTP server. */
const server = http.createServer(app);
const { Encrypte } = require("./Utils/Crypto");
var cors = require("cors");
var path = require("path");

require("express-async-errors");

//  routers
const Auth = require("./routes/Auth");
const Partners = require("./routes/Partners");
const Admin = require("./routes/Admin");
const Files = require("./routes/Files");
const Ville = require("./routes/Villes");
const Activities = require("./routes/Activities");
const Tasks = require("./routes/Tasks");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { authenticationMiddleware } = require("./middleware/Auth/auth");

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve("./public")));
// app.use(express.static("./public"));
client.connect();

app.use("/api/v1/auth", Auth);
app.use("/api/v1/partners", authenticationMiddleware, Partners);
app.use("/api/v1/admin", authenticationMiddleware, Admin);
app.use("/api/v1/Tasks", authenticationMiddleware, Tasks);
app.use("/api/v1/files", authenticationMiddleware, Files);
app.use("/api/v1/Ville", Ville);
app.use("/api/v1/Activities", Activities);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    server.listen(PORT, () => {
      Log.info(`App Running on port => ${PORT}`);
    });
  } catch (error) {
    Log.error(`App Stopped by an Error => ${error}`);
  }
};

start();
