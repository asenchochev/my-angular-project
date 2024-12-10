const { verify } = require("jsonwebtoken");
const { authCookieName } = require("../app-config");

function isGuest(redirect = true) {
    return function (req, res, next) {
        const token = req.cookies[authCookieName];
        if (token) {
            try {
                const decodedUser = verify(token, "ThatIsMyBestSecret");
                req.user = decodedUser;
                return next();
            } catch (error) {
                return res.status(401).send();
            }
        } else {
            return next();
        }
    };
}

module.exports = isGuest;
