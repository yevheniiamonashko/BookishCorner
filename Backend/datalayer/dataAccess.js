import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database('./database.sqlite');

const initializeDatabase = () => {
    db.serialize(() => {



        db.run(`CREATE TABLE IF NOT EXISTS author (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            img VARCHAR(50) NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            img VARCHAR(50) NOT NULL,
            FOREIGN KEY (author_id) REFERENCES author(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL, 
            password VARCHAR(255) NOT NULL,
            token VARCHAR(255) NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS review (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(id),
            FOREIGN KEY (book_id) REFERENCES book(id)
        )`);
    });

};


const prepareQuery = (queryText, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(queryText, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export { db, initializeDatabase, prepareQuery };
