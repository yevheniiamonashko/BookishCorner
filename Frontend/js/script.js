/**
 * General fuction for adding data to database
 */
function setNewData(form, successText, errorText, redirect = false) {
    const formData = new FormData(form);

    fetch(form.getAttribute('data-endpoint'), {
        method: form.getAttribute('data-method'),
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            if (!data.error) {
                alert(successText);

                if (redirect) {
                    window.location.href = redirect;
                }
            } else {
                alert(data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(errorText + error);
        });
}




/**
 * Search authors in database */
function searchAuthors(searchVal, authorsHTML) {

    getData(apiUrl.searchAuthors + searchVal).then(
        (authors) => {
            if (authors.length === 0) {
                authorsHTML.innerHTML = `<h2 class="empty-state">No authors were found for your search request "${searchVal}"!</h2>`;
            } else {
                authorsHTML.innerHTML = '';

                // display author on page
                authors.forEach(author => {

                    // display html cards of authors
                    authorsHTML.innerHTML += setCardAuthor(author);
                });

            }
        }
    )

}

/**
 * Search books in database 
 */

function searchBooks(searchVal, booksHTML) {


    // get books
    getData(apiUrl.searchBooks + searchVal).then(
        (books) => {


            // check if books exist
            if (books.length === 0) {

                // display empty state
                booksHTML.innerHTML = `<h2 class="empty-state">No books were found for your search request "${searchVal}"!</h2>`;

            } else {

                // clear block from previous html
                booksHTML.innerHTML = '';

                // display books on page
                books.forEach(book => {

                    // display html cards of books
                    booksHTML.innerHTML += setCardBook(book);
                });
            }
        }
    )
}




/**
 * Event form search 
 */
function setEventSearchForm() {

    // select elements for search
    const form = document.querySelector(".search");
    const formTypes = form.querySelectorAll('input[name="type-search"]');
    const input = document.querySelector(".search-input");
    const searchResult = document.querySelector(".search-result");
    const content = document.querySelector("#search-list");
    let searchVal = '';

    // Global variable to remember the timeout id
    let saveTimeOutId;

    // Function for the search field
    const setSearch = (e) => {

        // abort default html functuonality
        e.preventDefault();

        // Clear previous timeouts
        clearTimeout(saveTimeOutId);

        // Start the last timeout
        saveTimeOutId = setTimeout(() => {

            // if search request the same, logic to not doing anything in respond
            if (searchVal == input.value.trim()) {
                return;
            }

            // Get the search phrase
            searchVal = input.value.trim();


            // Check if the search phrase is empty to hide the block
            if (searchVal === '') {

                // Hide the search block
                searchResult.classList.add('hide');

            } else {

                // Show the search block
                searchResult.classList.remove('hide');

                // Select the search type
                const searchType = form.querySelector('input[type="radio"]:checked').value;

                // Switch search mode
                switch (searchType) {
                    case 'authors':
                        searchAuthors(searchVal, content);
                        break;

                    case 'books':
                        searchBooks(searchVal, content);
                        break;
                    default:
                        searchBooks(searchVal, content);
                        break;
                }
            }

        }, 1000);

    }

    // Attach the input event to the search field
    input.oninput = setSearch;
    form.onsubmit = setSearch;

    // follow the change of search type
    formTypes.forEach(inputType => {
        inputType.onchange = () => {

            // clear the search field
            input.value = '';

            // Hide the search block
            searchResult.classList.add('hide');
        }
    });
}




/**
 * Display reviews on the  book page
 */
function viewReviewsByBookId(bookId, page = 1) {

    // get reviews by book_id
    getData(apiUrl.review + bookId + '?page=' + page).then(
        (bookReviews) => {

            // get block of reviews
            const bookReviewsHTML = document.querySelector(".comments-list");
            const bookReviewsBtnMore = document.querySelector("[data-review-page]");

            // check if book has reviews
            if (bookReviews.reviews.length === 0 && page === 1) {

                // display empty state
                bookReviewsHTML.innerHTML = '<h2 class="empty-state">There is no reviews for this book!</h2>';

                // hide button "show more"
                bookReviewsBtnMore.remove();
            } else {

                // clear block from previous html
                if (page == 1) {
                    bookReviewsHTML.innerHTML = '';
                }

                // display reviews on page
                bookReviews.reviews.forEach(review => {

                    // display html cards of books
                    bookReviewsHTML.innerHTML += `<div class="comment-item">
                        <p class="comment-item__user">${review.username}</p>
                        <p class="comment-item__text">${review.text}</p>
                    </div>`;
                });

                // If page reached limit of reviews
                if (bookReviews.currentPage === bookReviews.totalPages) {

                    // hide button "show more"
                    bookReviewsBtnMore.remove();
                } else {

                    // connect next page to the button "show more"
                    bookReviewsBtnMore.setAttribute('data-review-page', Number(page) + 1);
                }
            }
        }
    )
}




/**
 * Comments
 */
function setComments(book_id, user = false) {

    // Відбираємо елементи для роботи коментарів
    const formComment = document.querySelector('.comments-form');

    // Показуємо форму, якщо користувач авторизований
    if (!user) {

        // Приховуємо форму коментарів
        formComment.remove();
    } else {

        // Робимо форму коментарування
        formComment.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(formComment);

            const data = {
                text: formData.get('comment'),
                user_id: user.id,
                book_id
            };

            // Якщо коментар пустий видаємо помилку
            if (data.text == '') {
                alert('Write your review!')
                return;
            }

            try {
                const response = await fetch(apiUrl.review, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    formComment.reset();
                    alert(result.message);
                    console.log("result: ", result);

                    // We get the element of the comment output block
                    const bookReviewsHTML = document.querySelector(".comments-list");

                    // check if there is an empty status
                    if (bookReviewsHTML.querySelector('.empty-state')) {
                        bookReviewsHTML.innerHTML = '';
                    }

                    // display html cards of books
                    bookReviewsHTML.innerHTML = `<div class="comment-item">
                        <p class="comment-item__user">${user.username}</p>
                        <p class="comment-item__text">${result.review.text}</p>
                    </div>` + bookReviewsHTML.innerHTML;

                } else {
                    alert('Comment adding failed: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Comment adding failed: ' + error.message);
            }
        });
    }

    // Displaying comments on the page
    viewReviewsByBookId(book_id);

    // get button "show more"
    const bookReviewsBtnMore = document.querySelector("[data-review-page]");

    // put  click event on "show more" button 
    bookReviewsBtnMore.onclick = (e) => {

        // get data attribute of current page
        const currentPage = bookReviewsBtnMore.getAttribute('data-review-page');

        // display next page
        viewReviewsByBookId(book_id, currentPage)
    };
}




/**
 * Function for the author-books page
 */
function viewPageAuthorBooks() {

    // get author parameter from link
    const id = getUrlData('author');

    // If there is no id parameter, redirect user to main page
    if (!id) {
        alert('Id is not found, you will be redirected to main page.');
        window.location.href = './index.html';
        return;
    }

    // get information about author
    getData(apiUrl.authorById + id).then(
        (author) => {
            const title = document.querySelector('.title');
            title.innerHTML = `${author.firstname} ${author.lastname}`;
        }
    )

    // get author books
    getData(apiUrl.authorBooks + id).then(
        (authorBooks) => {

            // get block of books
            const authorBooksHTML = document.querySelector("#author-books-list");

            // check if authors exist
            if (authorBooks.length === 0) {

                // display empty state
                authorBooksHTML.innerHTML = '<h2 class="empty-state">There is no books to display!</h2>';

            } else {

                // clear block from previous html
                authorBooksHTML.innerHTML = '';

                // display books on page
                authorBooks.forEach(book => {

                    // display html cards of books
                    authorBooksHTML.innerHTML += setCardBook(book);
                });
            }
        }
    )
}




/**
 * Function for the author list page
 */
function viewPageAuthorList() {

    // Query db to achieve authors
    getData(apiUrl.authors).then(
        (authors) => {

            // get block of authors
            const authorList = document.querySelector("#author-list")

            // check if authors exist
            if (authors.length === 0) {

                // display empty state
                authorList.innerHTML = '<h2 class="empty-state">There is no authors to display!</h2>';

            } else {

                // clear block from previous html
                authorList.innerHTML = '';

                // display authors on page
                authors.forEach(author => {

                    // display html cards of authors
                    authorList.innerHTML += setCardAuthor(author);
                });
            }
        }
    );
}



/**
 * Function for the main page
 */
function viewPageHome() {

    // Event for search form
    setEventSearchForm();

}




/**
 * function to display book info
 */
function viewPageBook() {

    // Check the authorization tag for comments
    const user = authData();

    // get id from get parameter
    const id = getUrlData("id");

    // If there is no id parameter, redirect user to main page
    if (!id) {
        alert('Id is not found, you will be redirected to main page.');
        window.location.href = './index.html';
        return;
    }

    // get book info by id
    getData(apiUrl.bookById + id).then(
        (book) => {
            const { id, author_lastname, author_name, description, img, title } = book;

            // union firstname and lastname of author
            const author = (author_name.trim() + " " + author_lastname.trim()).trim();

            // get elements from book page
            const bookContent = document.querySelector('.js-book-content');
            const bookImage = bookContent.querySelector('.js-book-img');
            const bookAuthor = bookContent.querySelector('.js-book-author');
            const bookTitle = bookContent.querySelector('.js-book-title');
            const bookDescription = bookContent.querySelector('.js-book-text');

            // put data from db to html page
            bookTitle.innerHTML = title;
            bookAuthor.innerHTML = author;
            bookDescription.innerHTML = description;
            bookImage.src = `./img/books/${img}`;
        }
    )

    // Calling up the comments functionality
    if (user.id) {
        getData(apiUrl.userById + user.id).then((userData) => {
            setComments(id, userData);
        });
    } else {
        setComments(id);
    }

}




/**
 * registration functionality
 */
function viewPageRegistration() {
    // check if user authorized
    const user = authData();

    if (user.id) {
        alert('You are authorized');
        window.location.href = './user-page.html';
        return;
    }

    const registerForm = document.querySelector('#registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch(apiUrl.registration, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    authData('set', result.id, result.token);
                    alert('User successfully created!');
                } else {
                    alert('Registration failed: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Registration failed: ' + error.message);
            }
        });
    }
}

/**
 * Login functionality
 */
function viewPageLogin() {

    // check if user authorized
    const user = authData();

    if (user.id) {
        alert('You are authorized');
        window.location.href = './user-page.html';
        return;
    }

    const loginForm = document.querySelector('#loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            const queryString = new URLSearchParams({ email, password }).toString();

            try {
                const response = await fetch(`${apiUrl.login}?${queryString}`);
                const result = await response.json();

                if (response.ok) {
                    authData('set', result.id, result.token);
                    alert('Login successful');
                } else {
                    alert('Login failed: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed: ' + error.message);
            }
        });
    }
}










/**
 * Change the footer of the link in relation to authorization
 */
if (authData().id) {
    const footerLinks = document.querySelector('.footer .list-nav-right');

    footerLinks.innerHTML = `
        <li><a href="./author-list.html">List of authors</a></li>
        <li><a href="./user-page.html">User page</a></li>`;
}





/**
 * Page router
 */
const viewPage = document.querySelector('body').getAttribute('data-page') ?? 'empty';

switch (viewPage) {

    case 'home':
        viewPageHome();
        break;

    case 'author-list':
        viewPageAuthorList();
        break;

    case 'author-books':
        viewPageAuthorBooks();
        break;

    case 'book-page':
        viewPageBook();
        break;

    case 'registration-page':
        viewPageRegistration();
        break;

    case 'login-page':
        viewPageLogin();
        break;
}