-- CREATE DATABASE bookstore_db;

-- CREATE TABLE authors(
--     author_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     full_name text NOT NULL,
--     email text NOT NULL UNIQUE,
--     country varchar(50) DEFAULT 'Unknown',
--     joined_at timestamptz NOT NULL DEFAULT(NOW())
-- );

-- INSERT INTO authors(full_name,email,country,joined_at) VALUES
--     ('Jane Austen', 'jane.austen@example.com', 'England', NOW());
--     INSERT INTO authors(full_name,email,country,joined_at) VALUES
--     ('George Orwell', 'george.orwell@example.com', 'United Kingdom', NOW());
--     INSERT INTO authors(full_name,email,joined_at) VALUES
--     ('Haruki Murakami', 'haruki.murakami@example.com', NOW());


--   INSERT INTO authors(full_name,email,joined_at) VALUES
--     ('Haruki Murakami', 'haruki.murakami@example.com', NOW());


-- CREATE TABLE books(
--     book_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     author_id integer NOT NULL,
--     title text NOT NULL,
--     price numeric(8,2) NOT NULL CHECK(price > 0),
--     pages integer CHECK(pages > 0),
--     tags text[],
--     published_on date NOT NULL
-- );

-- ALTER TABLE books ADD CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES authors(author_id);

-- INSERT INTO books(author_id, title, price, pages, tags, published_on) VALUES
--     (1, 'Pride and Prejudice', 12.99, 432, '{classic,romance}', '1813-01-28'),
--     (1, 'Sense and Sensibility', 11.50, 368, '{classic,family}', '1811-10-30'),
--     (2, '1984', 14.75, 320, '{dystopian,politics}', '1949-06-08'),
--     (2, 'Animal Farm', 10.99, 112, '{satire,political}', '1945-08-17'),
--     (3, 'Norwegian Wood', 16.25, 296, '{literary,modern}', '1987-08-04'),
--     (3, 'Kafka on the Shore', 18.50, 505, '{magical,mystery,literary}', '2002-09-12');

-- CREATE INDEX idx_books on books USING btree (published_on);

-- EXPLAIN ANALYZE SELECT * FROM books where published_on between '2020-01-01' AND '2020-12-31';

--    SELECT title FROM books WHERE tags @> ARRAY['fiction'];

-- CREATE INDEX idx_books_tags ON books USING GIN (tags);

-- EXPLAIN ANALYZE  SELECT title FROM books WHERE tags @> ARRAY['fiction'];


-- CREATE TABLE book_signings(
--     signing_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     author_id integer NOT NULL,
--     store_location text NOT NULL,
--     during tstzrange NOT NULL
-- );

-- ALTER TABLE books ADD CONSTRAINT fk_authors FOREIGN KEY (author_id) REFERENCES authors(author_id);

-- ALTER TABLE book_signings ADD CONSTRAINT
-- no_overlapping_signings EXCLUDE USING gist (author_id WITH =, during WITH &&);

-- INSERT INTO book_signings(author_id, store_location, during) VALUES
--     (1, 'Greenwood Books', tstzrange('2026-10-05 18:00:00+00', '2026-10-05 20:00:00+00', '[)'));

-- ALTER TABLE authors ADD COLUMN website text;

-- UPDATE authors
-- SET website = 'https://www.janeausten.org'
-- WHERE author_id = 1;

-- UPDATE authors
-- SET website = 'https://www.orwellfoundation.com'
-- WHERE author_id = 2;

-- UPDATE authors
-- SET website = NULL
-- WHERE author_id = 3;

-- ALTER TABLE authors ADD CONSTRAINT website_is_secure CHECK(website is  NULL or website Like 'https://%'); 

-- INSERT INTO authors(full_name, email, country, website)
-- VALUES ('Test Author', 'test.author@example.com', 'Unknown', 'http://insecure.example.com');