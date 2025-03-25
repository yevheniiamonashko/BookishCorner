import express from "express";
import ac from "../controllers/authorsController.js";

const router = express.Router();

router.get("/authors", ac.getAuthors);
router.get("/author/:id", ac.getAuthorInfo);
router.post("/authors", ac.addNewAuthor);
router.get("/search-authors", ac.searchAuthorsByName);

export default router;
