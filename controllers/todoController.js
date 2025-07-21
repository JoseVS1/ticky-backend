const getTodos = (req, res) => {
    res.send("all todos")
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