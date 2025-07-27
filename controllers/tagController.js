const Tag = require("../models/PrismaClient").tag;

const getTags = async (req, res) => {
    try {
        const tags = await Tag.findMany({
            where: {
                userId: req.user.userId
            }
        });

        res.status(200).json({ tags });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

const createTag = async (req, res) => {
    const { name } = req.body;

    try {
        const tag = await Tag.create({
            data: {
                name,
                userId: req.user.userId
            }
        });

        res.status(201).json({ message: "Tag created", tag });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

const deleteTag = async (req, res) => {
    const id = Number(req.params.id);
    
    try {
        const tag = await Tag.findUnique({
            where: {
                id
            }
        });

        if (!tag) {
            return res.status(404).json({ errors: [{ message: "Tag not found" }] });
        }

        if (tag.userId !== req.user.userId) {
            return res.status(403).json({ errors: [{ message: "Forbidden" }] });
        }

        const deletedTag = await Tag.delete({
            where: {
                id
            }
        });

        res.status(200).json({ message: "Tag deleted", tag: deletedTag });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

module.exports = {
    getTags,
    createTag,
    deleteTag
};