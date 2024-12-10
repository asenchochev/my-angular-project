const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../lib/jwt");

const SECRET = "ThatIsMyBestSecret";



exports.editProfile = (id, newData) => User.findByIdAndUpdate(id, newData)

exports.register = async (userData) => {
    const user = await User.findOne({email: userData.email})

    if(user) {
        throw new Error("Email already exist")
    }

    const createdUser = await User.create(userData)
    const token = generateToken(createdUser);
    return token;
}

async function generateToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
    };

    const token = await jwt.sign(payload, SECRET, { expiresIn: "2d" });
    return token
}
