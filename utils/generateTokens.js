const jwt = require('jsonwebtoken');

// generate access and refresh tokens for user authentication
const generateTokens = (userId) => {
    // Generate an access token with a short expiration time
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    // Generate a refresh token to allow users to obtain new access tokens
    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );

    return { accessToken, refreshToken };
};

module.exports = generateTokens;