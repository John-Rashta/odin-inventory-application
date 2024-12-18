const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");

exports.showItem = async (req, res) => {
    const searchId = req.params.id;
    const newData = await db.searchForItem(searchId);
    res.render("item", {item: newData});
}

exports.startUpdateItem = async (req, res) => {
    const searchId = req.params.id;
    const allCategories = await db.getAllCategories();
    const newData = await db.searchForItem(searchId);
    res.render("updateItem", {categories: allCategories, item: newData});
    
}

exports.updateItem = async (req, res) => {
    const newUpdate = req.body;
    const searchId = req.params.id;
    await db.updateItem(...newUpdate);
    await db.deleteCategoriesFromItem(searchId);
    if (newUpdate.categories) {
        await Promise.all(newUpdate.categories.map(async (category) => {
            await db.addCategoryOnItem(category);
        }))
    }
    res.redirect("/");
}

exports.deleteItem = async (req, res) => {
    const searchId = req.params.id;
    await db.deleteItem(searchId);
    res.redirect("/");
}