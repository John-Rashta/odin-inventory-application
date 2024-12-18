const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");

exports.showAllCategories = async (req, res) => {
    const newData = await db.getAllCategories();
    res.render("categories", {categories: newData});
}

exports.showCategory = async (req, res) => {
    const searchId = req.params.categoryid;
    const newData = await db.getAllItemsInCategory(searchId);
    const catData = await db.searchForCategory(searchId);
    res.render("category", {items: newData, category: catData[0]});
}

exports.startUpdateCategory = async (req, res) => {
    const searchId = req.params.categoryid;
    const newData = await db.searchForCategory(searchId);
    res.render("updateCategory", {category: newData[0]});
    
}

exports.updateCategory = async (req, res) => {
    const newUpdate = req.body;
    const searchId = req.params.categoryid;
    await db.updateCategory(searchId, newUpdate.category_name);
    res.redirect("/");
}

exports.deleteCategory = async (req, res) => {
    const searchId = req.params.categoryid;
    await db.deleteCategory(searchId);
    res.redirect("/");
}

exports.startCreateCategory = async (req, res) => {
    res.render("createCategory");
}

exports.createCategory = async (req, res) => {
    const newCreate = req.body;
    await db.insertCategory(newCreate.category_name);
    res.redirect("/");
}


