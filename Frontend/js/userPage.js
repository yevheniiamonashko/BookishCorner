// check if user authorized
const user = authData();

if (!user.id) {
    alert('You are not authorized');
    window.location.href = './user-login.html';
}

// display username on pages related to user page
getData(apiUrl.userById + user.id).then((userData) => {
    document.querySelector('.user-name').innerHTML = userData.username;
});

// Create a logout button
const logoutButton = document.querySelector('.js-user-logout');

// Clear the authorization tag
if (logoutButton) {
    logoutButton.onclick = () => authData('clear');
}



/**
 * Add author
 */
const authorForm = document.querySelector('#authorForm');

if (authorForm) {
    authorForm.addEventListener('submit', function (event) {
        event.preventDefault();

        setNewData(event.target, 'Author added successfully!', 'Failed to add author.');
    });
}




/**
 * general function for data updating
 */
async function putData(url, data) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    return response.json();
}



/**
 * general function for data deleting
 */
async function deleteData(url) {
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    return response.json();
}





/**
 * function to retreive books added by user on user page
 */
function viewPageUser() {

    // check user_id if it correspond to 1(user_id of admin)
    const url = (user.id == 1) ? apiUrl.books : apiUrl.userBooks + user.id;

    // get books
    fetch(url)
        .then(res => res.json())
        .then((books) => {
            const booksHTML = document.querySelector('#user-books');

            // check if books exist
            if (books.error || books.length == 0) {

                // display empty state
                booksHTML.innerHTML = `<h2 class="empty-state">You didn't add any books yet!</h2>`;

            } else {

                // clear block from previous html
                booksHTML.innerHTML = '';

                // display books on page
                books.forEach(book => {
                    // create variables from object keys
                    const { id, title, img } = book;

                    // display html cards of books
                    booksHTML.innerHTML += `<div class="content-card card-book">
                                                <a href="book.html?id=${id}" class="card-book__img-hold">
                                                    <img src="./img/books/${img}" alt="${title}" class="card-book__img">
                                                </a>
                                                <div class="card-book__text-hold">
                                                    <a href="book.html?id=${id}" class="card-book__title-link">${title}</a>
                                                    <div class="card-book__actions">
                                                        <a href="./book-edit.html?id=${id}" class="card-book__more">Edit book</a>
                                                        <a href="${id}" class="card-book__delete delete">Delete book</a>
                                                    </div>
                                                </div>
                                            </div>`;
                });


                // book deleting
                const deleteLinks = document.querySelectorAll('.card-book__delete');

                // for each button "delete" put function for deleting
                deleteLinks.forEach(link => {
                    link.addEventListener('click', async (event) => {
                        event.preventDefault();

                        const bookId = event.target.getAttribute('href');

                        if (!bookId) {
                            alert('Book ID is missing');
                            return;
                        }

                        if (confirm('Are you sure you want to delete this book?')) {
                            try {
                                await deleteData(apiUrl.bookById + bookId);
                                alert('Book deleted successfully!');
                                event.target.closest('.card-book').remove();
                                if (booksHTML.innerHTML == '') {
                                    booksHTML.innerHTML = `<h2 class="empty-state">You didn't add any books yet!</h2>`;
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Failed to delete book: ' + error.message);
                            }
                        }
                    });
                });
            }
        })
}





/**
 * display list of authors in form
 */
function setSelectAuthor(selectedAuthorId = false) {
    // Displaying authors in the book addition form/
    const selectAuthor = document.querySelector('#js-select-author');

    // check if element exist on the page
    if (selectAuthor) {

        // Query db to achieve authors
        getData(apiUrl.authors).then(
            (authors) => {

                // view authors to html select
                if (authors.length !== 0) {
                    authors.forEach(
                        (author) => {

                            // create variables from object
                            const { id, firstname, lastname } = author;

                            // display list to form
                            selectAuthor.innerHTML += `<option value="${id}" ${selectedAuthorId && selectedAuthorId == id ? 'selected' : ''}>${firstname} ${lastname}</option>`;
                        }
                    );
                } else {
                    alert('Authors array empty')
                }
            }
        )
    }
}




/**
 * functionality for adding book page
 */
function viewPageBookAdd() {

    // display authors in "select" field
    setSelectAuthor();

    //Book adding
    const bookForm = document.querySelector('#bookForm');

    if (bookForm) {
        bookForm.addEventListener('submit', function (event) {
            event.preventDefault();

            setNewData(event.target, 'Book added successfully!', 'Failed to add book.', './user-page.html');
        });
    }


    // display user_id in hidden field
    bookForm.querySelector('input[name="user_id"]').value = user.id;

}




/**
 * User reviews displaying
 */
function setUserComments(userId) {

    // get reviews by book_id
    getData(apiUrl.userReviews + userId).then(
        (userReviews) => {

            // get block of reviews
            const bookReviewsHTML = document.querySelector(".comments-list");

            // check if user has reviews
            if (userReviews.length === 0) {

                // display empty state
                bookReviewsHTML.innerHTML = '<h2 class="empty-state">You didn\'t write any reviews yet!</h2>';
            } else {

                // Remove empty state
                bookReviewsHTML.innerHTML = '';

                // display reviews on page
                userReviews.forEach(review => {

                    // display html cards of books
                    bookReviewsHTML.innerHTML += `<div class="comment-item">
                            <p class="comment-item__user"><a href="book.html?id=${review.bookid}" targte="_blank">${review.bookTitle}</a></p>
                            <p class="comment-item__text" contenteditable="false">${review.text}</p>
                            <div class="comment-item__btn-actions">
                                <a href="" class="btn btn-sm btn-radius btn-blue btn-edit">Edit</a>
                                <a href="${review.id}" class="btn btn-sm btn-radius btn-red btn-del">Delete</a>
                            </div>
                        </div>`;
                });

                // review deleting
                const deleteLinks = document.querySelectorAll('.btn-del');

                // for each button "delete" put function for deleting
                deleteLinks.forEach(link => {
                    link.addEventListener('click', async (event) => {
                        event.preventDefault();

                        const reviewId = event.target.getAttribute('href');

                        if (!reviewId) {
                            alert('Review ID is missing');
                            return;
                        }

                        if (confirm('Are you sure you want to delete this review?')) {
                            try {
                                await deleteData(apiUrl.review + reviewId);
                                alert('Review deleted successfully!');
                                event.target.closest('.comment-item').remove();
                                if (bookReviewsHTML.innerHTML == '') {
                                    bookReviewsHTML.innerHTML = '<h2 class="empty-state">You didn\'t write any reviews yet!</h2>';
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Failed to delete review: ' + error.message);
                            }
                        }
                    });
                });


                // Handle editing and saving reviews
                const editButtons = document.querySelectorAll('.btn-edit');

                editButtons.forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        const commentItem = event.target.closest('.comment-item');
                        const commentText = commentItem.querySelector('.comment-item__text');
                        const isEditing = commentText.isContentEditable;

                        if (isEditing) {
                            // Save the edited comment
                            const reviewId = event.target.nextElementSibling.getAttribute('href');
                            const updatedText = commentText.textContent;

                            if (updatedText == '') {
                                alert('Review text is required');
                                return;
                            }
                            // Save the updated text to the server
                            putData(apiUrl.review + reviewId, { text: updatedText })
                                .then(() => {
                                    alert('Review updated successfully!');
                                    commentText.contentEditable = "false";
                                    event.target.textContent = "Edit";
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    alert('Failed to update review: ' + error.message);
                                });
                        } else {
                            // Enter edit mode
                            commentText.contentEditable = "true";
                            commentText.focus();
                            event.target.textContent = "Save";
                        }
                    });
                });
            }
        })
}




/**
 * Page with user reviews 
 */
function viewPageUserReviews() {

    // display user reviews
    setUserComments(user.id);
}




/**
 * Edit profile
 */
function viewPageUserEdit() {

    const profileEditForm = document.querySelector('.form-edit');

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(profileEditForm);

            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };
            if (data.username == '' || data.email == '' || data.password == '') {
                alert('Missing required fields');
                return;
            }

            try {
                const result = await putData(apiUrl.userByEmail + user.id, data);
                alert('Profile updated successfully!');
                window.location.href = './user-page.html';
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to update profile: ' + error.message);
            }
        });
    }

    getData(apiUrl.userById + user.id).then((userData) => {
        if (userData) {
            profileEditForm.querySelector('input[name="username"]').value = userData.username;
            profileEditForm.querySelector('input[name="email"]').value = userData.email;
            profileEditForm.querySelector('input[name="password"]').value = userData.password;  // Assuming you want to show the password (not recommended)
        } else {
            alert('Failed to load user data');
        }
    });
}




/**
 * Functionality for book editing
 */
function viewPageBookEdit() {

    // get id from get parameter
    const bookId = getUrlData("id");

    // get form from html document
    const bookEditForm = document.querySelector('.form-book');

    if (bookEditForm) {
        bookEditForm.addEventListener('submit', function (event) {
            event.preventDefault();

            setNewData(event.target, 'Book updated successfully!', 'Failed to edit book.', './user-page.html');
        });
    }

    // get data from server
    getData(apiUrl.bookById + bookId).then((bookData) => {
        if (bookData) {
            if (bookData.user_id != user.id && user.id != 1) {
                alert('This book was added by not you, you can not add any changes or delete');
                window.location.href = './user-page.html';
            }

            bookEditForm.setAttribute('data-endpoint', apiUrl.bookById + bookId)
            bookEditForm.querySelector('[name="title"]').value = bookData.title;
            bookEditForm.querySelector('[name="description"]').value = bookData.description;

            setSelectAuthor(bookData.author_id);

            document.querySelector('#preview-img').src = `img/books/${bookData.img}`;
        } else {
            alert('Failed to load book data');
            window.location.href = './user-page.html';
        }
    });
}



/**
 * Page router
 */
const viewUserPage = document.querySelector('body').getAttribute('data-page') ?? 'empty';

switch (viewUserPage) {

    case 'user-page':
        viewPageUser();
        break;

    case 'book-add-page':
        viewPageBookAdd();
        break;

    case 'book-edit':
        viewPageBookEdit();
        break;

    case 'user-page-reviews':
        viewPageUserReviews();
        break;

    case 'user-edit':
        viewPageUserEdit();
        break;

}