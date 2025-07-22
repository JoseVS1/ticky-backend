const User = require("../models/PrismaClient").user;

const getUsers = async (req, res) => {
    try {
        const users = await User.findMany({
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUser = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const user = await User.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                todos: true,
                tags: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };

        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const user = await User.findUnique({
            where: {
                id
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };

        const deletedUser = await User.delete({
            where: {
                id
            }
        });

        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    getUsers,
    getUser,
    deleteUser
}