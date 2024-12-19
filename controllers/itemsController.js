const { body, validationResult, query, param, matchedData } = require("express-validator");
const db = require("../db/queries");
const asyncHandler = require('express-async-handler');
const helpWithErrors = require("../errors/helpWithErrors");

const validateForm = [
    body("item_name").trim()
        .isAlpha().withMessage("Must only contain letters.")
        .isLength({min: 1, max: 255}).withMessage("Max 255 characters."),
    body("price").trim()
        .isFloat().withMessage("Must be a number. Examples: 25, 15.45"),
    body("measure").trim()
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers.")
        .isLength({min: 1, max: 100}).withMessage("Max 100 characters."),
    body("categories")
    .optional({values: "falsy"})
    .isInt(),
  ];
  
const validateId = [
    param("itemid").trim()
        .toInt().isInt(),
];

const cantFindItem = "Could Not Find Item.";

exports.showItem = [
    validateId,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(cantFindItem);
        }
        const searchId = req.params.itemid;
        const newData = await db.searchForItem(searchId);
        helpWithErrors(newData, cantFindItem);
        res.render("item", {item: newData[0]});
    })
];

exports.startUpdateItem = [
    validateId,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(cantFindItem);
        }
        const searchId = req.params.itemid;
        const allCategories = await db.getAllCategories();
        const newData = await db.searchForItem(searchId);
        helpWithErrors(newData, cantFindItem);
        res.render("updateItem", {categories: allCategories, item: newData[0]});
        
    })
];

exports.updateItem = [
    validateId.concat(validateForm),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const newUpdate = matchedData(req);
        if (!Object.hasOwn(newUpdate, "itemid")) {
            throw new CustomNotFoundError(cantFindItem);
        }
        if (!errors.isEmpty()) {
            const newData = await db.searchForItem(newUpdate.itemid);
            const allCategories = await db.getAllCategories();
            helpWithErrors(newData, cantFindItem);
            return res.status(400).render("updateItem", {
                errors: errors.array(),
                categories: allCategories,
                item: newData[0],
              });
        }
        const searchId = newUpdate.itemid;
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
        
    })
];

exports.deleteItem = [
    validateId,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(cantFindItem);
        }
        const searchId = req.params.itemid;
        await db.deleteItem(searchId);
        res.redirect("/");
    })
];

exports.startCreateItem = asyncHandler(async (req, res) => {
    const categories = await db.getAllCategories();
    res.render("create" , {categories});
});

exports.createItem = [
    validateForm,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const categories = await db.getAllCategories();
            return res.status(400).render("create", {
                errors: errors.array(),
                categories,
              });
        }
        const newCreate = matchedData(req);
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
    })
];