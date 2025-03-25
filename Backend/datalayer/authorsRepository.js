import { prepareQuery } from "./dataAccess.js";

async function getAllAuthors() {
    const queryText = "SELECT * FROM author";
    try {
        const authors = await prepareQuery(queryText);
        return authors;
    } catch (error) {
        throw new Error(error);
    }
}


async function addNewAuthor(author) {
    const queryText = "INSERT INTO author (firstname, lastname, img) VALUES (?, ?, ?)";
    try {
        const result = await prepareQuery(queryText, [author.firstname, author.lastname, author.img]);
        return result.lastID;
    } catch (error) {
        throw new Error(error);
    }
}


async function getAuthorById(id) {
    const queryText = "SELECT * FROM author WHERE id = ?";
    try {
        const author = await prepareQuery(queryText, [id]);
        return author[0];  // Assuming the query returns an array, we take the first (and likely only) result
    } catch (error) {
        throw new Error(error);
    }
}

async function searchAuthorsByName(name) {
    const queryText = `
        SELECT * FROM author
        WHERE firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?
    `;

    const [firstName, lastName] = name.split(' ');
    const searchPatternFirstName = `%${firstName}%`;
    const searchPatternLastName = lastName ? `%${lastName}%` : searchPatternFirstName;
    const searchPatternFullName = `%${name}%`;

    try {
        const authors = await prepareQuery(queryText, [searchPatternFirstName, searchPatternLastName, searchPatternFullName]);
        return authors;
    } catch (error) {
        throw new Error(error);
    }
}


export default {
    getAllAuthors,
    addNewAuthor,
    getAuthorById,
    searchAuthorsByName
};