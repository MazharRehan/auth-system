exports.verificationEmailTemplate = (verificationUrl) => `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
`;

exports.resetPasswordEmailTemplate = (resetUrl) => `
    <h1>Reset Password</h1>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
`;