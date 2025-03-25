import repository from "../datalayer/usersRepository.js";
import crypto from 'crypto';

const generateToken = () => {
    return crypto.randomBytes(16).toString('hex');
};


async function userRegister(request, response) {
    const { username, email, password } = request.body;

    if (username && email && password) {
        try {
            const existingUsers = await repository.getUser(email);
            if (existingUsers.length > 0) {
                return response.status(400).json({ error: 'User already exists' });
            }

            const token = generateToken();

            await repository.addNewUser({ username, email, password, token });

            const userData = await repository.getUser(email);

            response.status(201).json({ message: 'User created successfully!', token, id: userData[0].id });
        } catch (err) {
            response.status(500).json({ error: err.message });
        }
    } else {
        response.status(400).json({ error: 'Missing required fields' });
    }
}

async function setLogin(request, response) {
    const { email, password } = request.query;
    try {
        const user = await repository.getUser(email);

        if (user.length > 0) {
            const passwordDB = user[0].password;

            const isPasswordValid = (password.toLowerCase() == passwordDB.toLowerCase());

            if (isPasswordValid) {

                const token = generateToken();

                await repository.updateUserToken(token, email);
                response.status(200).json({ message: 'Login successful', token, id: user[0].id });
            } else {
                response.status(401).json({ error: 'Invalid password' });
            }
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        response.status(500).json({ error: 'User token not found' });
    }
}


async function getUser(request, response) {
    const { email } = request.params;
    try {
        const user = await repository.getUser(email);
        if (user.length > 0) {
            response.json(user[0]);
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        response.status(500).json({ error: 'User token not found' });
    }
}


async function getUserById(request, response) {
    const { id } = request.params;
    try {
        const user = await repository.getUserById(id);
        if (user.length > 0) {
            response.json(user[0]);
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        response.status(500).json({ error: 'User token not found' });
    }
}

async function updateUserProfile(request, response) {
    const { userId } = request.params;
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
        return response.status(400).json({ error: 'All fields are required' });
    }

    try {
        await repository.updateUserProfile(userId, { username, email, password });
        response.status(200).json({ message: 'Profile updated successfully!' });
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}


export default {
    userRegister,
    getUser,
    getUserById,
    updateUserProfile,
    setLogin
};
