const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";

    // DB Connection
    this.dbConnection();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async dbConnection() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Read and parse body
    this.app.use(express.json());

    // Public Directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth.routes"));
    this.app.use(this.usersPath, require("../routes/users.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app running at http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
