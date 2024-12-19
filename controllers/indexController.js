const db = require("../db/queries");
const asyncHandler = require('express-async-handler');

exports.showAllItems = asyncHandler(async (req, res) => {
    const allItems = await db.getAllItems();
    res.render("index", {items: allItems} );
});