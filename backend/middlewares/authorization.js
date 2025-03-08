const User = require("../models/user.model");


const isAuthorized = (roles = []) => {
    // roles is an array of allowed roles
    return async (req, res, next) => {
        try {
            // Ensure user is authenticated (this will be handled by isAuthenticated)
            if (!req.id) {
                return res.status(401).json({
                    error: "User not authenticated",
                    success: false
                });
            }

            // Fetch user details from the database (using req.id set in isAuthenticated)
            const user = await User.findById(req.id);
            if (!user) {
                return res.status(404).json({
                    error: "User not found",
                    success: false
                });
            }

            // Check if user role matches any of the allowed roles
            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    error: "You do not have the required permissions",
                    success: false
                });
            }

            next(); // User is authorized, proceed to the next middleware or route handler
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal server error",
                success: false
            });
        }
    };
};

module.exports = { isAuthorized };
