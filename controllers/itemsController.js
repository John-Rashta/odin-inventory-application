const { body, validationResult, query, param } = require("express-validator");
const db = require("../db/queries");

const validateForm = [
    body("item_name").trim()
        .isAlpha().withMessage("Must only contain letters.")
        .isLength({min: 1, max: 255}).withMessage("Max 255 characters."),
    body("price").trim()
        .isFloat().withMessage("Must be a number. Examples: 25, 15.45"),
    body("measure").trim()
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers.")
        .isLength({min: 1, max: 100}).withMessage("Max 100 characters."),
    body("categories").isInt(),
  ];
  
const validateId = [
    param("itemid").trim()
        .toInt().isInt(),
];

exports.showItem = [
    validateId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const searchId = req.params.itemid;
        const newData = await db.searchForItem(searchId);
        res.render("item", {item: newData[0]});
    }

];

exports.startUpdateItem = [
    validateId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const searchId = req.params.itemid;
        const allCategories = await db.getAllCategories();
        const newData = await db.searchForItem(searchId);
        res.render("updateItem", {categories: allCategories, item: newData[0]});
        
    }
];

exports.updateItem = [
    validateId.concat(validateForm),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
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
];

exports.deleteItem = [
    validateId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
        const searchId = req.params.itemid;
        await db.deleteItem(searchId);
        res.redirect("/");
    }
];

exports.startCreateItem = async (req, res) => {
    const categories = await db.getAllCategories();
    res.render("create" , {categories});
};

exports.createItem = [
    validateId.concat(validateForm),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("ERROR");
        }
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

];