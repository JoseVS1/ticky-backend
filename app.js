const express = require("express");
const cors = require("cors");
const todoRouter = require("./routes/todoRouter");
const tagRouter = require("./routes/tagRouter");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);
app.use("/api/tags", tagRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});