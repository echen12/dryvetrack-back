const JWT = require("jsonwebtoken")


module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(400).json("no token found");
    }

    //let user = await JWT.verify(token, "fFAFASF@%@#$fsdaf2");

    // if (user) {
    //     next()
    // } else {
    //     return res.status(400).json("token invalid");
    // }

    try {
        let user = await JWT.verify(token, "fFAFASF@%@#$fsdaf2");
        req.email = user.email;
        next()
    } catch (error) {
        return res.status(400).json("token invalid");
    }


}