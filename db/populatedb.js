#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  item_name VARCHAR ( 255 ),
  price REAL,
  measure TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS items_categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  item_id INTEGER REFERENCES items (id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories (id) ON DELETE CASCADE
);

  INSERT INTO items (item_name, price, measure) 
VALUES
  ('eggs', 3.25, '10 units'),
  ('water', 2.5, '1L'),
  ('spaghetti', 5, '500g');

  INSERT INTO categories (category_name) 
VALUES
  ('Dairy'),
  ('Drinks'),
  ('Pasta and Rice'),
  ('Favorites');

  INSERT INTO items_categories (item_id, category_id) 
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (3, 4);
`;

/*


  INSERT INTO items_categories (item_id, category_id) 
VALUES
  (1, 1),
  (2, 2),
  (3, 3);

   INSERT INTO categories (category_name) 
VALUES
  ('Dairy'),
  ('Drinks'),
  ('Pasta and Rice');

  CREATE TABLE IF NOT EXISTS items_categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  item_id INTEGER REFERENCES items (id),
  category_id INTEGER REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name VARCHAR ( 255 ),
);

*/

async function main() {
  console.log("seeding...");
  const client = new Client({
    host: "localhost", // or wherever the db is hosted
    user: process.env.ROLE_NAME,
    database: "inventory_data",
    password: process.env.ROLE_PASSWORD,
    port: 5432 // The default port
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();