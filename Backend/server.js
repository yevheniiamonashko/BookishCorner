import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeDatabase } from "./datalayer/dataAccess.js";
import booksRouter from "./routing/booksRouter.js";
import authorsRouter from "./routing/authorsRouter.js";
import usersRouter from "./routing/usersRouter.js";
import reviewsRouter from "./routing/reviewsRouter.js";

// app.use(express.json());

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

initializeDatabase();

// setup routing
app.use(booksRouter);
app.use(authorsRouter);
app.use(usersRouter);
app.use(reviewsRouter);

// start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
