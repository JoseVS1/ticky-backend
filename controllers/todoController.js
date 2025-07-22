const Todo = require("../models/PrismaClient").todo;

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.findMany();

        res.status(200).json({todos});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    };
};

const getTodo = (req, res) => {
    const id = req.params.id;
    res.send(`todo #${id}`);
};

const createTodo = (req, res) => {
    res.send("create todo");
};

const updateTodo = (req, res) => {
    const id = req.params.id;
    res.send(`update todo #${id}`)
};

const deleteTodo = (req, res) => {
    const id = req.params.id;
    res.send(`delete todo #${id}`);
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}