const bcrypt = require("bcrypt");
const UserModel = require('../../model/auth/AuthUser.js');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require("mongoose");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(409).json({ message: "User already exists. Please login", success: false });
        }

        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);

        await userModel.save();

        return res.status(200).json({ message: "Sign up successfully", success: true });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server error", success: false });
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: "Invalid email and password", success: false });
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(403).json({ message: "Invalid email and password", success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            message: "Sign in successfully",
            success: true,
            jwtToken,
            email,
            name: user.name
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server error", success: false });
    }
}

module.exports = {
    signup,
    signin
}