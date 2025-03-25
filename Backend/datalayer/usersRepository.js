import { prepareQuery } from "./dataAccess.js";

async function addNewUser(user) {
    const queryText = "INSERT INTO user (username, email, password, token) VALUES (?, ?, ?, ?)";
    try {
        await prepareQuery(queryText, [user.username, user.email, user.password, user.token]);
    } catch (error) {
        throw new Error(error);
    }
}


async function updateUserToken(token, email) {
    const queryText = "UPDATE user SET token = ? WHERE email = ?";
    try {
        await prepareQuery(queryText, [token, email]);
    } catch (error) {
        throw new Error(error);
    }
}


async function getUser(email) {
    const queryText = `SELECT * FROM user WHERE email = ?`;
    try {
        const user = await prepareQuery(queryText, [email]);
        return user;
    } catch (error) {
        throw new Error(error);
    }
}


async function getUserById(id) {
    const queryText = `SELECT * FROM user WHERE id = ?`;
    try {
        const user = await prepareQuery(queryText, [id]);
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

async function updateUserProfile(userId, userData) {
    const queryText = "UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?";
    try {
        await prepareQuery(queryText, [userData.username, userData.email, userData.password, userId]);
    } catch (error) {
        throw new Error(error);
    }
}

export default {
    updateUserToken,
    addNewUser,
    getUserById,
    updateUserProfile,
    getUser
};
