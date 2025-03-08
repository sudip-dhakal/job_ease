const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    //since userId was used as a payload while generating token
    console.log("Decoded user ID:", decode.userId);
    req.id = decode.userId;

    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: "Access denied. Not Authenticated. Invalid token." });
    return;
  }
};

module.exports = { isAuthenticated };
