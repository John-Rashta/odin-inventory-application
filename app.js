const express = require("express");
const app = express();
const path = require("node:path");

const indexRouter = require("./routes/indexRouter");
const itemsRouter = require("./routes/itemsRouter");
const categoriesRouter = require("./routes/categoriesRouter");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/items", itemsRouter);
app.use("/categories", categoriesRouter);

app.use((err, req, res, next) => {
    console.error(err);
    // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
    res.status(err.statusCode || 500).send(err.message);
  });
  
app.listen(8080);