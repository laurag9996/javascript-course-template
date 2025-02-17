// user-manager.js

// Import Node.js modules for file system and path manipulation.
const path = require("path");
const FileHandler = require("../utility/file_handler");

// Initialize a FileHandler instance for managing user data.
const usersFileHandler = new FileHandler(path.join(__dirname, "../data/users.json"));

// Object to store the current user's session information.
let currentUser = {
  userName: null,
  passWord: null,
};

/**
 * Retrieves the current user's username.
 * @returns {string|null} - The current user's username or null if not set.
 */
function getCurrentUser() {
  return currentUser.userName;
}

/**
 * Retrieves the current user's password.
 * @returns {string|null} - The current user's password or null if not set.
 */
function getCurrentPassword() {
  return currentUser.passWord;
}

/**
 * Sets the current user's session information.
 * @param {string} username - The username to set.
 * @param {string} password - The password to set.
 */
function setCurrentUser(username, password) {
  currentUser.userName = username;
  currentUser.passWord = password;
}

/**
 * Clears the current user's session information.
 */
function clearCurrentUser() {
  currentUser.userName = null;
  currentUser.passWord = null;
}

/**
 * Validates the length of an input field.
 * @param {string} input - The input string to validate.
 * @param {number} minLength - The minimum allowed length.
 * @param {number} maxLength - The maximum allowed length.
 * @param {string} fieldName - The name of the field being validated (for error messages).
 * @returns {boolean} - True if the input is valid, false otherwise.
 */
function validateInputLength(input, minLength, maxLength, fieldName) {
  if (input.length < minLength || input.length > maxLength) {
    console.log(`\nError: ${fieldName} must be between ${minLength} and ${maxLength} characters.`);
    return false;
  }
  return true;
}

/**
 * Validates a username based on specific criteria.
 * @param {string} username - The username to validate.
 * @returns {boolean} - True if the username is valid, false otherwise.
 */
function isValidUsername(username) {
  const isValid = /^[a-zA-Z0-9]{3,15}$/.test(username); // Alphanumeric, 3-15 characters.
  if (!isValid) {
    console.log("\nError: Username must be 3-15 characters long and contain only letters and numbers.");
  }
  return isValid;
}

/**
 * Saves a new user to the users.json file after validation.
 * @param {string} username - The username to save.
 * @param {string} password - The password to save.
 * @returns {boolean} - True if the user was successfully saved, false otherwise.
 */
function saveUser(username, password) {
  if (!isValidUsername(username)) {
    return false;
  }
  if (!validateInputLength(password, 6, 20, "Password")) {
    return false;
  }

  // Retrieve existing users using FileHandler.
  const users = usersFileHandler.retrieveFromFile();

  if (users.some((user) => user.username === username)) {
    console.log("\nError: Username already exists. Please choose a different one.");
    return false;
  }

  // Add the new user to the list.
  users.push({ username, password });

  // Save the updated list back to the file using FileHandler.
  usersFileHandler.overrideToFile(users);
  console.log("\nUser successfully registered.");
  return true;
}

/**
 * Validates a user's credentials by checking the username and password.
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the credentials are valid, false otherwise.
 */
function validateUser(username, password) {
  // Retrieve existing users using FileHandler.
  const users = usersFileHandler.retrieveFromFile();
  return users.some((user) => user.username === username && user.password === password);
}

/**
 * Resets a user's password after validation.
 * @param {string} username - The username of the user whose password needs to be reset.
 * @param {string} newPassword - The new password to set.
 * @returns {boolean} - True if the password was successfully reset, false otherwise.
 */
function resetPassword(username, newPassword) {
  if (!validateInputLength(newPassword, 6, 20, "Password")) {
    return false;
  }

  // Retrieve existing users using FileHandler.
  const users = usersFileHandler.retrieveFromFile();
  const userIndex = users.findIndex((user) => user.username === username);

  if (userIndex > -1) {
    // Update the password for the found user.
    users[userIndex].password = newPassword;

    // Save the updated list back to the file using FileHandler.
    usersFileHandler.overrideToFile(users);
    return true;
  }

  console.log("Error: Username not found.");
  return false;
}

/**
 * Checks if a user exists in the users.json file.
 * @param {string} username - The username to search for.
 * @returns {boolean} - True if the user exists, false otherwise.
 */
function findUser(username) {
  // Retrieve existing users using FileHandler.
  const users = usersFileHandler.retrieveFromFile();
  return users.some((user) => user.username === username);
}

// Export all functions to make them available for use in other modules.
module.exports = {
  saveUser,
  validateUser,
  resetPassword,
  findUser,
  setCurrentUser,
  getCurrentUser,
  getCurrentPassword,
  clearCurrentUser,
};