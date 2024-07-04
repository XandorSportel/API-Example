// ? ----- [ Packages ] -----
const jwt = require('jsonwebtoken');
require('dotenv/config');

// ? ----- [ Authentication ] -----
async function auth (req, res, next) {
    const Header = req.header('Authorization')
    if (!Header) {
        return {
            message: "Access denied. Token is invalid.",
            code: 401
        }
    }
    
    const token = Header.replace('Bearer ', '');
    if (!token) {
        return {
            message: "Access denied. Token is invalid.",
            code: 401
        }
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if (err) {
                res.status(401).json({ message: "Access denied. Token is invalid.", code: 401 });
            } else {
                next();
            }
        })
    }
}

// ? ----- [ Export Module ] -----
module.exports = auth;