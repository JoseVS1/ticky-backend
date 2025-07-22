const User = require("../models/PrismaClient").user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const signup = async (req, res) => {
    const {email, password, name} = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const existingUser = await User.findUnique({ where: { email } });
        
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            data: {
                email,
                passwordHash: hashed,
                ...(name && { name })
            },
            include: { 
                todos: true, 
                tags: true
            }
        });

        const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered", token, user: { id: user.id, email: user.email, name: user.name, todos: user.todos, tags: user.tags } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const user = await User.findUnique({
            where: {
                email
            },
            include: {
                todos: true,
                tags: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: "1h" });
    
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, todos: user.todos, tags: user.tags }});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    signup,
    login
}