import { prepareQuery } from "./dataAccess.js";


async function addNewReview(review) {
    const queryText = "INSERT INTO review (text, book_id, user_id) VALUES (?, ?, ?)";
    try {
        await prepareQuery(queryText, [review.text, review.book_id, review.user_id]);
    } catch (error) {
        throw new Error(error);
    }
}

async function getReviewsByBookId(bookId, limit, offset) {
    const queryText = `
        SELECT review.text, user.username FROM review
        JOIN user ON review.user_id = user.id
        WHERE book_id = ?
        ORDER BY review.id DESC
         LIMIT ? OFFSET ? `;
    try {
        const reviews = await prepareQuery(queryText, [bookId, limit, offset]);
        return reviews;
    } catch (error) {
        throw new Error(error);
    }
}

async function getTotalReviewsByBookId(bookId) {
    const queryText = "SELECT COUNT(*) as total FROM review WHERE book_id = ?";
    try {
        const result = await prepareQuery(queryText, [bookId]);
        return result[0].total;
    } catch (error) {
        throw new Error(error);
    }
}

async function getReviewsByUserId(id) {
    const queryText = `
        SELECT review.*, book.title as bookTitle, book.id as bookid FROM review
        JOIN book ON review.book_id = book.id
        WHERE review.user_id = ?
        ORDER BY review.id DESC`;
    try {
        const reviews = await prepareQuery(queryText, [id]);
        return reviews;
    } catch (error) {
        throw new Error(error);
    }
}

async function deleteReview(id) {
    const queryText = "DELETE FROM review WHERE id = ?";
    try {
        await prepareQuery(queryText, [id]);
    } catch (error) {
        throw new Error(error);
    }
}


async function editReview(id, text) {
    const queryText = "UPDATE review SET text = ? WHERE id = ?";
    try {
        await prepareQuery(queryText, [text, id]);
    } catch (error) {
        throw new Error(error);
    }
}


export default {
    addNewReview,
    getReviewsByBookId,
    getTotalReviewsByBookId,
    deleteReview,
    editReview,
    getReviewsByUserId
};
