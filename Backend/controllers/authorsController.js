import repository from "../datalayer/authorsRepository.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = '../Frontend/img/authors/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function getAuthors(request, response) {
    try {
        const authors = await repository.getAllAuthors();
        response.json(authors);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}


function addNewAuthor(request, response) {
    upload.single('img')(request, response, async (err) => {
        if (err) {
            return response.status(500).json({ error: err.message });
        }

        const { firstname, lastname } = request.body;
        const img = request.file ? request.file.filename : '';

        if (firstname && lastname) {
            try {
                const authorId = await repository.addNewAuthor({ firstname, lastname, img });
                response.status(201).json({ message: 'Author added successfully!', author: { id: authorId, firstname, lastname, img } });
            } catch (err) {
                response.status(500).json({ error: err.message });
            }
        } else {
            response.status(400).json({ error: 'Missing required fields' });
        }
    });
}


async function getAuthorInfo(request, response) {
    const { id } = request.params;
    try {
        const author = await repository.getAuthorById(id);
        if (author) {
            response.json(author);
        } else {
            response.status(404).json({ error: 'Author not found' });
        }
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}


async function searchAuthorsByName(request, response) {
    const { q: name } = request.query;
    if (!name) {
        return response.status(400).json({ error: 'Author name is required' });
    }

    try {
        const authors = await repository.searchAuthorsByName(name);
        response.json(authors);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}

export default {
    getAuthors,
    addNewAuthor,
    getAuthorInfo,
    searchAuthorsByName
};