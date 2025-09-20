const User = require("../models/PrismaClient").user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        const existingUser = await User.findUnique({ where: { email } });
        
        if (existingUser) {
            return res.status(409).json({ errors: [{ message: "User already exists" }] });
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

        const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        await User.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken
            }
        });

        res.status(201).json({ message: "User registered", accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, todos: user.todos, tags: user.tags } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

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
            return res.status(401).json({ errors: [{ message: "Invalid credentials" }] });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ errors: [{ message: "Invalid credentials" }]});
        }

        const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: "5s" });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        await User.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken
            }
        });
    
        res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, todos: user.todos, tags: user.tags }});
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
    }
};

const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    try {
        const payload = jwt.verify(token, process.env.REFRESH_SECRET);

        const user = await User.findUnique({
            where: {
                id: payload.userId
            }
        });

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: "1h" });
    
        res.json({ accessToken })
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

const logout = async (req, res) => {
    try {
        await User.update({
            where: {
                id: req.user.userId
            },
            data: {
                refreshToken: null
            }
        });

        res.json({ message: "Logged out" });
    } catch (err) {
        res.status(500).json({ errors: [{ message: "Internal Server Error" }]});
    }
}

module.exports = {
    signup,
    login,
    refreshToken,
    logout
}