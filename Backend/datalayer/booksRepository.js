import { prepareQuery } from "./dataAccess.js";

async function getAllBooks() {
    const queryText = `
        SELECT book.*, author.firstname as author_name, author.lastname as author_lastname
        FROM book 
        JOIN author ON book.author_id = author.id
    `;
    try {
        const books = await prepareQuery(queryText);
        return books;
    } catch (error) {
        throw new Error(error);
    }
}

async function getSingleBook(id) {
    const queryText = `
        SELECT book.*, author.firstname as author_name, author.lastname as author_lastname
        FROM book
        JOIN author ON book.author_id = author.id
        WHERE book.id = ?
        `;
    try {
        const book = await prepareQuery(queryText, [id]);
        return book;
    } catch (error) {
        throw new Error(error);
    }
}

async function addNewBook(book) {
    const queryText = "INSERT INTO book (title, description, author_id, user_id, img) VALUES (?, ?, ?, ?, ?)";
    try {
        await prepareQuery(queryText, [book.title, book.description, book.author_id, book.user_id, book.img]);
    } catch (error) {
        throw new Error(error);
    }
}


async function getBooksByAuthorId(authorId) {
    const queryText = "SELECT * FROM book WHERE author_id = ?";
    try {
        const books = await prepareQuery(queryText, [authorId]);
        return books;
    } catch (error) {
        throw new Error(error);
    }
}



async function getBooksByUserId(userId) {
    const queryText = "SELECT * FROM book WHERE user_id = ?";
    try {
        const books = await prepareQuery(queryText, [userId]);
        return books;
    } catch (error) {
        throw new Error(error);
    }
}


async function searchBooksByTitle(title) {
    const queryText = "SELECT * FROM book WHERE title LIKE ?";
    const searchPattern = `%${title}%`;
    try {
        const books = await prepareQuery(queryText, [searchPattern]);
        return books;
    } catch (error) {
        throw new Error(error);
    }
}

async function editBook(id, book) {
    const queryText = "UPDATE book SET title = ?, description = ?, author_id = ?, img = ? WHERE id = ?";
    try {
        await prepareQuery(queryText, [book.title, book.description, book.author_id, book.img, id]);
    } catch (error) {
        throw new Error(error);
    }
}

async function deleteBook(id) {
    const queryText = "DELETE FROM book WHERE id = ?";
    try {
        await prepareQuery(queryText, [id]);
    } catch (error) {
        throw new Error(error);
    }
}

export default {
    getAllBooks,
    getSingleBook,
    addNewBook,
    editBook,
    getBooksByAuthorId,
    getBooksByUserId,
    deleteBook,
    searchBooksByTitle
};
