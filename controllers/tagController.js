const getTags = (req, res) => {
    res.send("all tags");
};

const createTag = (req, res) => {
    res.send("create tag");
};

const deleteTag = (req, res) => {
    const id = req.params.id;
    res.send("delete tag");
}

module.exports = {
    getTags,
    createTag,
    deleteTag
}