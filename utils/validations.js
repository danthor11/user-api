export const verifyUsername = async (username) => {
  if (!username) throw new Error("Username is required");
  if (!/^[a-zA-Z0-9_\.]+$/.test(username))
    throw new Error(
      "Username must contain only letters, numbers, dots and underscore"
    );
};

export const verifyMail = async (email) => {
  if (!email) throw new Error("Email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Email is not valid");
};

export const verifyPassword = (password) => {
  if (!password) throw new Error("Password is required");
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/.test(password)) {
    if (password.length < 8) {
      throw new Error("Your password must be at least 8 characters");
    }
    if (password.search(/[a-z]/i) < 0) {
      throw new Error("Your password must contain at least one letter.");
    }
    if (password.search(/[0-9]/) < 0) {
      throw new Error("Your password must contain at least one digit.");
    }
  }
};
