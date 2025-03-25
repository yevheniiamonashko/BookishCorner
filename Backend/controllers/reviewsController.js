import repository from "../datalayer/reviewsRepository.js";

async function addNewReview(request, response) {
    const { text, book_id, user_id } = request.body;

    if (text && book_id && user_id) {
        try {
            await repository.addNewReview({ text, book_id, user_id });

            response.status(201).json({ message: 'Review added successfully!', review: { text, book_id, user_id } });
        } catch (err) {
            response.status(500).json({ error: err.message });
        }
    } else {
        response.status(400).json({ error: 'Missing required fields' });
    }
}

async function bookReviews(request, response) {
    const { bookId } = request.params;
    const { page = 1, limit = 10 } = request.query; // Default to page 1 and limit 10

    if (!bookId) {
        return response.status(400).json({ error: 'Book ID is required' });
    }

    const offset = (page - 1) * limit;

    try {
        const reviews = await repository.getReviewsByBookId(bookId, limit, offset);
        const totalReviews = await repository.getTotalReviewsByBookId(bookId);
        const totalPages = Math.ceil(totalReviews / limit);

        response.json({ reviews, totalPages, currentPage: parseInt(page, 10) });
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}

async function userReviews(request, response) {
    const { id } = request.params;

    if (!id) {
        return response.status(400).json({ error: 'User ID is required' });
    }

    try {
        const reviews = await repository.getReviewsByUserId(id);

        response.json(reviews);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}

async function deleteReview(request, response) {
    const { id } = request.params;

    try {
        await repository.deleteReview(id);

        response.status(200).json({ message: 'Review deleted successfully!' });
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}


async function editReview(request, response) {
    const { id } = request.params;
    const { text } = request.body;

    if (!text) {
        return response.status(400).json({ error: 'Review text is required' });
    }

    try {
        await repository.editReview(id, text);
        response.status(200).json({ message: 'Review updated successfully!', review: { id, text } });
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}


export default {
    addNewReview,
    bookReviews,
    deleteReview,
    editReview,
    userReviews
};
