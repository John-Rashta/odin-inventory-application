const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");

exports.showItem = async (req, res) => {
    const searchId = req.params.itemid;
    const newData = await db.searchForItem(searchId);
    res.render("item", {item: newData[0]});
}

exports.startUpdateItem = async (req, res) => {
    const searchId = req.params.itemid;
    const allCategories = await db.getAllCategories();
    const newData = await db.searchForItem(searchId);
    res.render("updateItem", {categories: allCategories, item: newData[0]});
    
}

exports.updateItem = async (req, res) => {
    const newUpdate = req.body;
    const searchId = req.params.itemid;
    await db.updateItem(searchId, newUpdate.item_name, newUpdate.price, newUpdate.measure);
    await db.deleteCategoriesFromItem(searchId);
    if (newUpdate.categories) {
        if (Array.isArray(newUpdate.categories)) {
            await Promise.all(newUpdate.categories.map(async (category) => {
                await db.addCategoryOnItem(searchId, category);
            }))
        } else {
            await db.addCategoryOnItem(searchId, newUpdate.categories);
        }
    }
    res.redirect("/");
    
}

exports.deleteItem = async (req, res) => {
    const searchId = req.params.itemid;
    await db.deleteItem(searchId);
    res.redirect("/");
}

exports.startCreateItem = async (req, res) => {
    const categories = await db.getAllCategories();
    res.render("create" , {categories});
}

exports.createItem = async (req, res) => {
    const newCreate = req.body;
    const [newId] = await db.insertItem(newCreate.item_name, newCreate.price, newCreate.measure);
    if (newCreate.categories) {
        if (Array.isArray(newCreate.categories)) {
            await Promise.all(newCreate.categories.map(async (category) => {
                await db.addCategoryOnItem(newId.id, category);
            }))
        } else {
            await db.addCategoryOnItem(newId.id, newCreate.categories);
        }
    }
    res.redirect("/");
}
