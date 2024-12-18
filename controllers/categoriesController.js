const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");

exports.showAllCategories = async (req, res) => {
    const newData = await db.getAllCategories();
    res.render("categories", {categories: newData});
}

exports.showCategory = async (req, res) => {
    const searchId = req.params.id;
    const newData = await db.getAllItemsInCategory(searchId);
    res.render("category", {items: newData});
}

exports.startUpdateCategory = async (req, res) => {
    const searchId = req.params.id;
    const newData = await db.searchForCategory(searchId);
    res.render("updateCategory", {category: newData});
    
}

exports.updateCategory = async (req, res) => {
    const newUpdate = req.body;
    const searchId = req.params.id;
    await db.updateCategory(searchId,...newUpdate);
    res.redirect("/");
}

exports.deleteCategory = async (req, res) => {
    const searchId = req.params.id;
    await db.deleteCategory(searchId);
    res.redirect("/");
}

