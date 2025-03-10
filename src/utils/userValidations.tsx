export const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim()) && !/\s/.test(email) ? "" : "Please enter a valid email address.";
};

export const validatePassword = (password: string): string => {
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }
    return "";
};
