import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
    try {
        // Валидация на входните данни
        const { firstName, lastName, username, email, password } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        // Проверка за съществуващ потребител
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send("Username is already taken");
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).send("Email is already in use");
        }

        // Намери ролята "User"
        const role = await Role.findOne({ role: "User" });
        if (!role) {
            return res.status(404).send("Role 'User' not found");
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
            roles: [role._id] // Свържи потребителя с ролята
        });

        // Запази потребителя
        await newUser.save();
        return res.status(201).send("User registered successfully!");
    } catch (error) {
        console.error(error);
        next(error); // Изпрати грешката към middleware за обработка
    }
};


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(200).send("User not found!")
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).send("Password is incorrect!");
        }
        return res.status(200).send("Login Success!");
    } catch (error) {
        return res.status(500).send("Something went wrong!")
    }
}