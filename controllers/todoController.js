const Todo = require("../models/PrismaClient").todo;
const TodoStatus = require("../models/TodoStatus");

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.findMany({
            where: {
                userId: req.user.userId
            }
        });

        res.status(200).json({todos});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getTodo = async (req, res) => {
    const id = Number(req.params.id);
    
    try {
        const todo = await Todo.findUnique({
            where: {
                id
            }
        });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        if (todo.userId !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.status(200).json({ todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const createTodo = async (req, res) => {
    const { title, description } = req.body;

    try {
        const todo = await Todo.create({
            data: {
                title,
                ...(description && { description }),
                userId: req.user.userId
            }
        });

        res.status(201).json({ message: "Todo created", todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const updateTodo = async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, status } = req.body;

    if (!Object.values(TodoStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const todo = await Todo.findUnique({
            where: {
                id
            }
        });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        if (todo.userId !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updatedTodo = await Todo.update({
            where: {
                id
            },
            data: {
                title,
                ...(description && { description }),
                status
            }
        });

        res.status(200).json({ message: "Todo updated", todo: updatedTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const deleteTodo = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const todo = await Todo.findUnique({
            where: {
                id
            }
        });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        if (todo.userId !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const deletedTodo = await Todo.delete({
            where: {
                id
            }
        });

        res.status(200).json({ message: "Todo deleted", todo: deletedTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}