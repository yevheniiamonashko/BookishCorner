import express from "express";
import bc from "../controllers/booksController.js";

const router = express.Router();

router.get("/books", bc.getBooks);
router.post("/books", bc.addNewBook);
router.put('/book/:id', bc.editBook);
router.delete('/book/:id', bc.deleteBook);
router.get("/book/:id", bc.getSingleBook);
router.get("/author-books/:id", bc.getBooksByAuthorId)
router.get("/user-books/:id", bc.getBooksByUserId)
router.get("/search-books", bc.searchBooksByTitle);
export default router;
