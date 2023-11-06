const User = require("../models/userModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;
        //console.log('Received request body:', req.body);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            //console.log('Found user:', existingUser);
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({
            email,
            password,
            username,
            createdAt,
        });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            path: "/",
            withCredentials: true,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
        });
        res.status(201).json({
            message: "User signed up successfully",
            success: true,
            user,
        });
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "Incorrect password or email" });
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "Incorrect password or email" });
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            path: "/",
            withCredentials: true,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
        });
        res.status(201).json({
            message: "User logged in successfully",
            success: true,
            userDetails: user,
        });
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.Logout = (req, res, next) => {
    try {
        // clear the token cookie
        res.clearCookie("token", {
            path: "/",
            withCredentials: true,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
        });

        //res.cookie('token', '', { expires: new Date(0) });

        res.status(200).json({
            message: "User logged out successfully",
            success: true,
        });

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// TODO
module.exports.deleteAccount = (req, res, next) => {};
