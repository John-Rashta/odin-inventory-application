const db = require("../db/queries");

exports.showAllItems = async (req, res) => {
    const allItems = await db.getAllItems();
    res.render("index", {items: allItems} );
}