const { body, validationResult, param, matchedData } = require("express-validator");
const db = require("../db/queries");
const asyncHandler = require('express-async-handler');
const helpWithErrors = require("../errors/helpWithErrors");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

exports.showAllCategories = asyncHandler(async (req, res) => {
    const newData = await db.getAllCategories();
    res.render("categories", {categories: newData});
});

const validateName = [
    body("category_name").trim()
        .isAlpha().withMessage("Must only contain letters.")
        .isLength({min: 1, max: 255}).withMessage("Max 255 characters."),
  ];
  
const validateId = [
    param("categoryid").trim()
        .toInt().isInt(),
];

const cantFindCategory = "Could Not Find Category.";

exports.showCategory = [
    validateId,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(cantFindCategory);
        }
        const searchId = req.params.categoryid;
        const newData = await db.getAllItemsInCategory(searchId);
        const catData = await db.searchForCategory(searchId);
        helpWithErrors(catData, cantFindCategory);
        res.render("category", {items: newData, category: catData[0]});
    })
];

exports.startUpdateCategory = [
    validateId,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(cantFindCategory);
        }
        const searchId = req.params.categoryid;
        const newData = await db.searchForCategory(searchId);
        helpWithErrors(newData, cantFindCategory);
        res.render("updateCategory", {category: newData[0]});
        
    })
];

exports.updateCategory = [
    validateId.concat(validateName),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const data = matchedData(req);
        if (!Object.hasOwn(data, "categoryid")) {
            throw new CustomNotFoundError(cantFindCategory);
        }
        if (!errors.isEmpty()) {
            const newData = await db.searchForCategory(data.categoryid);
            helpWithErrors(newData, cantFindCategory);
            return res.status(400).render("updateCategory", {
                errors: errors.array(),
                category: newData[0],
              });
        }
        await db.updateCategory(data.categoryid, data.category_name);
        res.redirect("/");
    })
];

exports.deleteCategory = [
    validateId,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(cantFindCategory);
        }
        const searchId = req.params.categoryid;
        await db.deleteCategory(searchId);
        res.redirect("/");
    })
];

exports.startCreateCategory = async (req, res) => {
    res.render("createCategory");
}

exports.createCategory = [
    validateName,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("createCategory", {
                errors: errors.array(),
              });
        }
        const newCreate = matchedData(req);
        await db.insertCategory(newCreate.category_name);
        res.redirect("/");
    })
];


