const { Router } = require("express");
const itemsController = require("../controllers/itemsController");
const itemsRouter = Router();

itemsRouter.get("/:itemid", itemsController.showItem);
itemsRouter.get("/update/:itemid", itemsController.startUpdateItem);
itemsRouter.post("/update/:itemid", itemsController.updateItem);
itemsRouter.post("/delete/:itemid", itemsController.deleteItem);

module.exports = itemsRouter;