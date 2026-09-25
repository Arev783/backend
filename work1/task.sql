-- CREATE ROLE library_guest;
-- CREATE ROLE library_staff LOGIN PASSWORD 'Arev123';
-- CREATE DATABASE library_db;

-- CREATE TABLE books(
--     book_id integer,
--     title text,
--     author varchar(50),
--     price numeric(10,2),
--     in_stock boolean,
--     published_on date,
--     added_at TIMESTAMPTZ
-- );

-- INSERT INTO books(book_id,title,author,price,in_stock,published_on,added_at)
-- VALUES
-- (1, 'The Hobbit', 'J.R.R. Tolkien', 15.99, TRUE, '1937-09-21', NOW()),
-- (2, '1984', 'George Orwell', 12.50, TRUE, '1949-06-08', NOW()),
-- (3, 'Pride and Prejudice', 'Jane Austen', 10.99, FALSE, '1813-01-28', NOW());

-- SELECT * FROM books;

-- SELECT title,price from books where in_stock = true;

-- GRANT SELECT ON books TO library_staff;