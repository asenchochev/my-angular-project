import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { CreateError } from "../utils/error.js";
import { createSuccess } from "../utils/success.js";

export const register = async (req, res, next) => {
    try {
        // Валидация на входните данни
        const { firstName, lastName, username, email, password } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            return next(CreateError(422, "All fields are required"));
        }

        // Проверка за съществуващ потребител
        if (await User.findOne({ username })) {
            return next(CreateError(409, "Username is already taken"));
        }

        if (await User.findOne({ email })) {
            return next(CreateError(409, "Email is already in use"));
        }

        // Намери ролята "User"
        const role = await Role.findOne({ role: "User" });
        if (!role) {
            return next(CreateError(404, "Role 'User' not found"));
        }

        // Хеширай паролата
        const hashedPassword = await bcrypt.hash(password, 10);

        // Създай нов потребител
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            roles: [role._id]
        });

        // Запази потребителя
        await newUser.save();
        return next(createSuccess(200, "User Registered Successfully!"))
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(CreateError(422, "Email and password are required"));
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(CreateError(401, "Invalid credentials"));
        }

        return next(createSuccess(200, "Login Success!"))
    } catch (error) {
        next(error);
    }
};
