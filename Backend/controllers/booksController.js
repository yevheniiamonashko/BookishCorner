import repository from "../datalayer/booksRepository.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = '../Frontend/img/books/';
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

async function getBooks(request, response) {
    try {
        const books = await repository.getAllBooks();
        response.json(books);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}

async function getSingleBook(request, response) {
    const { id } = request.params;
    try {
        const book = await repository.getSingleBook(id);
        if (book.length > 0) {
            response.json(book[0]);
        } else {
            response.status(404).json({ error: 'Book not found' });
        }
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}


function addNewBook(request, response) {
    upload.single('img')(request, response, async (err) => {
        if (err) {
            return response.status(500).json({ error: err.message });
        }

        const { title, description, author_id, user_id } = request.body;
        const img = request.file ? request.file.filename : '';

        if (title && description && author_id && user_id) {
            try {
                await repository.addNewBook({ title, description, author_id, user_id, img });
                response.status(201).json({ message: 'Book added successfully!', book: { title, description, author_id, user_id, img } });
            } catch (err) {
                response.status(500).json({ error: err.message });
            }
        } else {
            response.status(400).json({ error: 'Missing required fields' });
        }
    });
}



async function getBooksByAuthorId(request, response) {
    const { id } = request.params;
    try {
        const books = await repository.getBooksByAuthorId(id);
        if (books.length > 0) {
            response.json(books);
        } else {
            response.status(404).json({ error: 'No books found for this author' });
        }
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}




async function getBooksByUserId(request, response) {
    const { id } = request.params;
    try {
        const books = await repository.getBooksByUserId(id);
        // Return the books array directly, even if it's empty
        response.json(books);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}



async function searchBooksByTitle(request, response) {
    const { q: title } = request.query;
    if (!title) {
        return response.status(400).json({ error: 'Book title is required' });
    }

    try {
        const books = await repository.searchBooksByTitle(title);
        response.json(books);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}





function editBook(request, response) {
    upload.single('img')(request, response, async (err) => {
        if (err) {
            return response.status(500).json({ error: err.message });
        }

        const { id } = request.params;
        const { title, description, author_id } = request.body;
        const img = request.file ? request.file.filename : '';

        if (title && description && author_id) {
            try {
                // Fetch the existing book to get the current image
                const existingBook = await repository.getSingleBook(id);

                if (existingBook.length === 0) {
                    return response.status(404).json({ error: 'Book not found' });
                }
                const currentImage = existingBook[0].img;

                // Determine the image to use
                const newImage = img || currentImage;

                // Update the book
                await repository.editBook(id, { title, description, author_id, img: newImage });

                // If a new image was uploaded, delete the old image
                if (img && currentImage) {
                    fs.unlink(path.join('../Frontend/img/books/', currentImage), (err) => {
                        if (err) console.error('Error deleting old image:', err);
                    });
                }

                response.status(200).json({ message: 'Book updated successfully!' });
            } catch (err) {
                response.status(500).json({ error: err.message });
            }
        } else {
            response.status(400).json({ error: 'Missing required fields' });
        }
    });
}

async function deleteBook(request, response) {
    const { id } = request.params;

    try {
        // Fetch the existing book to get the current image
        const existingBook = await repository.getSingleBook(id);

        if (existingBook.length === 0) {
            return response.status(404).json({ error: 'Book not found' });
        }
        const currentImage = existingBook[0].img;

        // Delete the image file
        if (currentImage) {
            fs.unlink(path.join('../Frontend/img/books/', currentImage), (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        // Delete the book from the database
        await repository.deleteBook(id);

        response.status(200).json({ message: 'Book deleted successfully!' });
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}



export default {
    getBooks,
    getSingleBook,
    addNewBook,
    editBook,
    getBooksByAuthorId,
    getBooksByUserId,
    deleteBook,
    searchBooksByTitle
};
