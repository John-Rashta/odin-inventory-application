const { body, validationResult, param } = require("express-validator");
const db = require("../db/queries");

exports.showAllCategories = async (req, res) => {
    const newData = await db.getAllCategories();
    res.render("categories", {categories: newData});
}

const validateName = [
    body("category_name").trim()
        .isAlpha().withMessage("Must only contain letters.")
        .isLength({min: 1, max: 255}).withMessage("Max 255 characters."),
  ];
  
const validateId = [
    param("categoryid").trim()
        .toInt().isInt(),
];

exports.showCategory = [
    validateId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const searchId = req.params.categoryid;
        const newData = await db.getAllItemsInCategory(searchId);
        const catData = await db.searchForCategory(searchId);
        res.render("category", {items: newData, category: catData[0]});
    }
];

exports.startUpdateCategory = [
    validateId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const searchId = req.params.categoryid;
        const newData = await db.searchForCategory(searchId);
        res.render("updateCategory", {category: newData[0]});
        
    }
];

exports.updateCategory = [
    validateId.concat(validateName),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const newUpdate = req.body;
        const searchId = req.params.categoryid;
        await db.updateCategory(searchId, newUpdate.category_name);
        res.redirect("/");
    }
];

exports.deleteCategory = [
    validateId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const searchId = req.params.categoryid;
        await db.deleteCategory(searchId);
        res.redirect("/");
    }

];

exports.startCreateCategory = async (req, res) => {
    res.render("createCategory");
}

exports.createCategory = [
    validateName,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const newCreate = req.body;
        await db.insertCategory(newCreate.category_name);
        res.redirect("/");
    }
];


