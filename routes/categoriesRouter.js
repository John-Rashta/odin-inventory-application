const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();


categoriesRouter.get("/", categoriesController.showAllCategories);
categoriesRouter.get("/create", categoriesController.startCreateCategory);
categoriesRouter.post("/create", categoriesController.createCategory);
categoriesRouter.get("/:categoryid", categoriesController.showCategory);
categoriesRouter.get("/update/:categoryid", categoriesController.startUpdateCategory);
categoriesRouter.post("/update/:categoryid", categoriesController.updateCategory);
categoriesRouter.post("/delete/:categoryid", categoriesController.deleteCategory);


module.exports = categoriesRouter;