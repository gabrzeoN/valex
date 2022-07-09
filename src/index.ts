import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import router from "./routers/index.js";

dotenv.config({ path: ".env" });
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const port = +process.env.PORT || 5000;
app.listen(port, () => {
  console.log(chalk.green.bold(`Server is listening on port ${port}.`));
});