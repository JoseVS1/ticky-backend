const Todo = require("../models/PrismaClient").todo;
const Tag = require("../models/PrismaClient").tag;
const TodoStatus = require("../models/TodoStatus");

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.findMany({
            where: {
                userId: req.user.userId
            },
            include: {
                tags: true
            }
        });

        res.status(200).json({todos});
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

const getTodo = async (req, res) => {
    const id = Number(req.params.id);
    
    try {
        const todo = await Todo.findUnique({
            where: {
                id
            },
            include: {
                tags: true
            }
        });

        if (!todo) {
            return res.status(404).json({ errors: [{ message: "Todo not found" }] });
        }

        if (todo.userId !== req.user.userId) {
            return res.status(403).json({ errors: [{ message: "Forbidden" }] });
        }

        res.status(200).json({ todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
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
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

const updateTodo = async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, status, tags } = req.body;
    let tagsArr;

    if (!Object.values(TodoStatus).includes(status)) {
        return res.status(400).json({ errors: [{ message: "Invalid status value" }] });
    }

    if (tags !== undefined) {
        if (!Array.isArray(tags)) {
            return res.status(400).json({ errors: [{ message: "Tags must be an array of integers" }] });
        }

        for (let i = 0; i < tags.length; i++) {
            const tag = await Tag.findUnique({
                where: {
                    id: tags[i]
                }
            });

            if (!tag) {
                return res.status(404).json({ errors: [{ message: "Tag not found" }] });
            }

            if (tag.userId !== req.user.userId) {
                return res.status(403).json({ errors: [{ message: "Forbidden"}] });
            }
        };

        tagsArr = tags.map(tag => (
            { id: tag }
        ));
    }
    
    try {
        const todo = await Todo.findUnique({
            where: {
                id
            }
        });

        if (!todo) {
            return res.status(404).json({ errors: [{ message: "Todo not found" }] });
        }

        if (todo.userId !== req.user.userId) {
            return res.status(403).json({ errors: [{ message: "Forbidden" }] });
        }

        const updatedTodo = await Todo.update({
            where: {
                id
            },
            data: {
                title,
                ...(description && { description }),
                status,
                ...(tagsArr && tagsArr.length ? {
                    tags: {
                        connect: tagsArr
                    }
                } : {
                    tags: {
                        set: []
                    }
                })
            },
            include: {
                tags: true
            }
        });

        res.status(200).json({ message: "Todo updated", todo: updatedTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
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
            return res.status(404).json({ errors: [{ message: "Todo not found" }] });
        }

        if (todo.userId !== req.user.userId) {
            return res.status(403).json({ errors: [{ message: "Forbidden" }] });
        }

        const deletedTodo = await Todo.delete({
            where: {
                id
            }
        });

        res.status(200).json({ message: "Todo deleted", todo: deletedTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}