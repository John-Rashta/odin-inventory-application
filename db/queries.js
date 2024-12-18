const pool = require("./pool");

async function getAllItems() {
  const { rows } = await pool.query(`
        SELECT items.id, 
        items.item_name as item_name, 
        items.price as price, 
        items.measure as measure, 
        array_agg(categories.category_name) as categories_array
        FROM items
        LEFT JOIN items_categories AS relations ON relations.item_id = items.id
        LEFT JOIN categories ON relations.category_id = categories.id
        GROUP BY items.id, items.item_name, items.price, items.measure
    `);
  return rows;
}

async function insertItem(name, price, measure) {
  const {rows} = await pool.query("INSERT INTO items (item_name, price, measure) VALUES ($1, $2, $3) RETURNING id", [name, price, measure]);
  return rows;
}

async function searchForItem(id) {
  const {rows} = await pool.query(`
        SELECT items.id, 
        items.item_name as item_name, 
        items.price as price, 
        items.measure as measure, 
        array_agg(categories.category_name) as categories_array
        FROM items
        LEFT JOIN items_categories AS relations ON relations.item_id = items.id
        LEFT JOIN categories ON relations.category_id = categories.id
        WHERE items.id = $1
        GROUP BY items.id, items.item_name, items.price, items.measure
    `, [id]);
  return rows;
}

async function deleteItem(id) {
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
}

async function deleteCategory(id) {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
}

async function getAllCategories() {
    const {rows} = await pool.query("SELECT * FROM categories");
    return rows;
}

async function insertCategory(name) {
    await pool.query("INSERT INTO categories (category_name) VALUES ($1)", [name]);
}

async function updateCategory(id, name) {
    await pool.query("UPDATE categories SET category_name = $1 WHERE id = $2", [name, id]);
}

async function updateItem(id, name, price, measure) {
    await pool.query("UPDATE items SET item_name = $1, price = $2, measure = $3 WHERE id = $4", [name, price, measure, id]);
}

async function removeCategoryOnItem(itemid, categoryid) {
    await pool.query("DELETE FROM items_categories WHERE item_id = $1 AND category_id = $2", [itemid, categoryid]);
}

async function addCategoryOnItem(itemid, categoryid) {
    await pool.query("INSERT INTO items_categories (item_id, category_id) VALUES ($1, $2)", [itemid, categoryid]);
}

async function getAllItemsInCategory(id) {
    const {rows} = await pool.query(`
        SELECT items.id, 
        items.item_name as item_name, 
        items.price as price, 
        items.measure as measure, 
        array_agg(categories.category_name) as categories_array
        FROM items
        LEFT JOIN items_categories AS relations ON relations.item_id = items.id
        LEFT JOIN categories ON relations.category_id = categories.id
        WHERE categories.id = $1
        GROUP BY items.id, items.item_name, items.price, items.measure
    `, [id]);

    return rows;

}

async function deleteCategoriesFromItem(id) {
    await pool.query("DELETE FROM items_categories WHERE item_id = $1", [id]);
}

async function searchForCategory(id) {
    const {rows} = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    return rows;
}

module.exports = {
  getAllItems,
  insertItem,
  deleteItem,
  deleteCategory,
  searchForItem,
  insertCategory,
  updateCategory,
  updateItem,
  getAllCategories,
  removeCategoryOnItem,
  addCategoryOnItem,
  getAllItemsInCategory,
  deleteCategoriesFromItem,
  searchForCategory,
};

/*

"SELECT items.id, items.item_name, items.price, items.measure, array_agg(categories.category_name) as categories_array
FROM items
LEFT JOIN items_categories AS relations ON relations.item_id = items.id
LEFT JOIN categories ON relations.category_id = categories.id
WHERE categories.id = 1
GROUP BY items.id, items.item_name, items.price, items.measure;
"


*/