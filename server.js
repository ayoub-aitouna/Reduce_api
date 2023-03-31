const express = require("express");
const app = express();
const http = require("http");
const session = require('express-session');
const server = http.createServer(app);
const { Encrypte } = require("./Utils/Crypto");
var cors = require("cors");
var path = require("path");
const PORT = process.env.PORT || 5000;
require("express-async-errors");

//  routers
const Auth = require("./routes/Auth");
const Partners = require("./routes/Partners");
const Admin = require("./routes/Admin");
const Files = require("./routes/Files");
const Ville = require("./routes/Villes");
const Activities = require("./routes/Activities");
const Tasks = require("./routes/Tasks");
const sub_partner = require("./routes/sub_partner");
const Banner = require("./routes/Banners");
const clients = require("./routes/Clients");
const profession = require("./routes/profession");
const State = require("./routes/State");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { authenticationMiddleware } = require("./middleware/Auth/auth");

app.use(express.json());
app.use(cors());

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.resolve("./public")));

app.use("/api/v1/auth", Auth);
app.use("/api/v1/partners", authenticationMiddleware, Partners);
app.use("/api/v1/admin", authenticationMiddleware, Admin);
app.use("/api/v1/Tasks", authenticationMiddleware, Tasks);
app.use("/api/v1/files", authenticationMiddleware, Files);
app.use("/api/v1/clients", authenticationMiddleware, clients);
app.use("/api/v1/banners", authenticationMiddleware, Banner);
app.use("/api/v1/sub_parnter", authenticationMiddleware, sub_partner);
app.use("/api/v1/Ville", Ville);
app.use("/api/v1/profession", profession);
app.use("/api/v1/Activities", Activities);
app.use("/api/v1/State", State);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const start = async () => {
  try {
    server.listen(PORT, () => console.log(`App Running on port => ${PORT}`));
  } catch (error) {
    console.error(`App Stopped by an Error => ${error}`);
  }
};
start();
