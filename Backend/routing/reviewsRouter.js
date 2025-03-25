import express from "express";
import re from "../controllers/reviewsController.js";

const router = express.Router();

router.post("/reviews", re.addNewReview);
router.get("/reviews/:bookId", re.bookReviews);
router.get("/reviews/user/:id", re.userReviews);
router.delete('/reviews/:id', re.deleteReview);
router.put('/reviews/:id', re.editReview);

export default router;
