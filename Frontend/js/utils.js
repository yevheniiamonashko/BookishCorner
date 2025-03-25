// Object url to db
const apiUrl = {
    books: 'http://localhost:3000/books',
    userBooks: 'http://localhost:3000/user-books/',
    authors: 'http://localhost:3000/authors',
    authorById: 'http://localhost:3000/author/',
    bookById: 'http://localhost:3000/book/',
    authorBooks: 'http://localhost:3000/author-books/',
    searchBooks: 'http://localhost:3000/search-books/?q=',
    searchAuthors: 'http://localhost:3000/search-authors/?q=',
    registration: 'http://localhost:3000/register',
    review: 'http://localhost:3000/reviews/',
    login: 'http://localhost:3000/login',
    userByEmail: 'http://localhost:3000/user/',
    userById: 'http://localhost:3000/user/id/',
    userReviews: 'http://localhost:3000/reviews/user/',
}

// Get data from db
async function getData(url) {
    if (url) {
        const res = await fetch(url);
        if (!res.ok) {
            alert('Error: url invalid ' + url)
        } else {
            const data = await res.json();
            return data;
        }
    }
}




/**
 * Textarea autogrow
 */
const textarea = document.querySelector('textarea.textarea-autogrow');
if (textarea) {
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight + 2) + 'px';
    });
}



/**
 * File upload preview
 */
function readURL(input) {
    // Check if a file is passed and if the first file is selected
    if (input.files && input.files[0]) {
        // Create a FileReader object
        const reader = new FileReader();

        // File load event handler
        reader.onload = function (e) {
            // Set the image path as the data source for the element with id "preview-img"
            document.getElementById('preview-img').src = e.target.result;
        }

        // Read the file as a data URL
        reader.readAsDataURL(input.files[0]);
    }
}

// File input change event for file input elements
const inputFile = document.querySelector("input[type='file']");
if (inputFile) {
    inputFile.addEventListener('change', function () {
        // Call the readURL function with the selected file input element
        readURL(this);
    });
}


/**
 * Delete alert
 */
// Function to handle delete button click
function handleDelete(event) {
    // Ask for confirmation before deletion
    if (confirm('Are you sure you want to delete this item?')) {
        // Proceed with deletion if confirmed
        console.log('Item deleted');
        // Here you can add your deletion logic
    } else {
        // Deletion cancelled
        console.log('Deletion cancelled');
    }
}

// Add click event listener to all buttons with class "delete"
document.querySelectorAll('.delete').forEach(function (button) {
    button.addEventListener('click', handleDelete);
});


// get parameter from url
function getUrlData(param = false) {
    if (param) {
        const parsedUrl = new URL(window.location.href);
        return parsedUrl.searchParams.get(param);
    }

    return false;
}




// html book card 
function setCardBook(book) {
    // create variables from object keys
    const { id, title, img } = book;

    return `<div class="content-card card-book">
                <a href="book.html?id=${id}" class="card-book__img-hold">
                    <img src="./img/books/${img}" alt="${title}" class="card-book__img">
                </a>
                <div class="card-book__text-hold">
                    <a href="book.html?id=${id}" class="card-book__title-link">${title}</a>
                    <a href="book.html?id=${id}" class="card-book__more">See more</a>
                </div>
            </div>`;
}

// html author card 
function setCardAuthor(author) {

    // create variables from object keys
    const { id, img, firstname, lastname } = author;

    return `<div class="content-card card-book card-book-author">
                <a href="author-books.html?author=${id}" class="card-book__img-hold">
                    <img src="./img/authors/${img}" alt="" class="card-book__img">
                </a>
                <div class="card-book__text-hold">
                    <a href="author-books.html?author=${id}" class="card-book__title-link">${firstname} ${lastname}</a>
                    <a href="author-books.html?author=${id}" class="card-book__more">View books</a>
                </div>
            </div>`;
}






/**
 * get or set authorization data
 */
function authData(type = 'get', id = false, token = false) {
    let res = {};

    switch (type) {
        case 'clear':
            localStorage.clear();
            window.location.href = './index.html';
            break;

        case 'set':
            localStorage.setItem('user_id', id);
            localStorage.setItem('user_token', token);
            window.location.href = './user-page.html';
            break;

        case 'get':
        default:
            res.id = localStorage.getItem('user_id');
            res.token = localStorage.getItem('user_token');
            break;
    }

    return res;
}
