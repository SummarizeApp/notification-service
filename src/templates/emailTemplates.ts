interface EmailTemplate {
    subject: string;
    html: string;
}

type TemplateFunction = (data: any) => EmailTemplate;

export const emailTemplates: Record<string, TemplateFunction> = {
    otpVerification: (data: { otp: string }) => ({
        subject: 'Email Verification OTP',
        html: `
            <h1>Email Verification</h1>
            <p>Your OTP for email verification is: <strong>${data.otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
        `
    }),

    welcome: (username: string): EmailTemplate => ({
        subject: 'Welcome to Our Platform',
        html: `
            <h1>Welcome ${username}!</h1>
            <p>Thank you for verifying your email address.</p>
            <p>You can now start using our platform.</p>
        `
    }),

    passwordReset: (resetLink: string): EmailTemplate => ({
        subject: 'Password Reset Request',
        html: `
            <h1>Password Reset Request</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    })
}; 