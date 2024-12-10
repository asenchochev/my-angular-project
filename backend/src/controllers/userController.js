const router = require("express").Router();
const userManager = require("../managers/userManager");
const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlackList");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "SoftSecret";
const { authCookieName } = require("../app-config");
const perfumeManager = require("../managers/perfumeManager");
const { auth } = require("../utils");
const { getErrorMessage } = require("../utils/getErrorMessage");
const nodemailer = require('nodemailer');
//  Login requests

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                throw new Error("Wrong email!");
            }
            return Promise.all([
                user,
                user ? user.matchPassword(password) : false,
            ]);
        })
        .then(([user, match]) => {
            if (!match) {
                res.status(401).send({ message: "Wrong email or password" });
                return;
            }
            user = bsonToJson(user);
            const token = createToken({ id: user._id });

            if (process.env.NODE_ENV === "production") {
                res.cookie(authCookieName, token, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
            } else {
                res.cookie(authCookieName, token, { httpOnly: true });
            }
            res.status(200).send(user);
        })
        .catch((err) => {
            return res.status(400).send(getErrorMessage(err));
        });
});

router.post("/register", async (req, res) => {
    const { email, phonenumber, password, rePass } = req.body;
    try {
        if (password != rePass) {
            throw new Error("Passwords dont match!");
        }
        const user = await User.findOne({ email });

        if (user) {
            throw new Error("User already exist");
        }
    } catch (error) {
        return res.status(400).send(getErrorMessage(error));
    }
    return User.create({ email, phonenumber, password, rePass })
        .then(async (createdUser, callback) => {
            createdUser = bsonToJson(createdUser);
            const token = createToken({ id: createdUser._id });
            if (process.env.NODE_ENV === "production") {
                res.cookie(authCookieName, token, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
            } else {
                res.cookie(authCookieName, token, { httpOnly: true });
            }

            // let transporter = nodemailer.createTransport({
            //     host: 'smtp.gmail.com',
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         user: email,
            //         pass: password,
            //     }
            // })

            // console.log('work');
            // let mailOptions = {
            //     from: '"Demo"',
            //     to: 'danitud911@gmail.com',
            //     subject: 'Demo subject',
            //     html: `<h1>Hi ${email}</h1>`
            // }

            // let info = await transporter.sendMail(mailOptions);
            // callback(info);
            res.status(200).send(createdUser);
        })
        .catch((err) => {
            res.status(400).send(getErrorMessage(err));
        });
});

function createToken(data) {
    return jwt.sign(data, secret, { expiresIn: "2d" });
}
const bsonToJson = (data) => {
    return JSON.parse(JSON.stringify(data));
};

//  Log out
router.post("/logout", auth(), (req, res) => {
    const token = req.cookies[authCookieName];
    TokenBlacklist.create({ token })
        .then(() => {
            res.clearCookie(authCookieName)
                .status(204)
                .send({ message: "Logged out!" });
        })
        .catch((err) => {
            res.status(400).send(getErrorMessage(err));
        });
});

router.post("/profile", auth(), async (req, res) => {
    const owner = req.body;
    try {
        const perfumes = await perfumeManager.getByUser(owner);
        res.send(perfumes);
        return perfumes;
    } catch (error) {
        res.send(getErrorMessage(error));
    }
});

router.post("/editProfile", auth(), async (req, res) => {
    try {
        const newUser = req.body.user;
        const oldUser = req.body.creator;
        if (newUser.password == undefined || newUser.password == "") {
            throw new Error("Write your new password!");
        }

        if (newUser.phonenumber == undefined || newUser.phonenumber == "") {
            throw new Error("Write your new phone number!");
        }

        const email = newUser.email;
        const user = await User.findOne({ email }).lean();
        if (user && user.email != oldUser.email) {
            throw new Error("User already exist!");
        }

        const edited = await userManager.editProfile(oldUser._id, newUser);
        res.send(edited);
        return edited;
    } catch (error) {
        res.status(400).send(getErrorMessage(error));
    }
});

router.get("/profile", auth(), (req, res, next) => {
    const { _id } = req.user;
    User.findOne(_id, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
        .then((user) => {
            return res.status(200).send(user);
        })
        .catch(next);
});
module.exports = router;
