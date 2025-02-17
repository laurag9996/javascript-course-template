// auth-handler.js

// Import required modules and classes.
const { saveUser, validateUser, setCurrentUser, findUser } = require("../account/user_service");
const { mainMenu } = require("../menus/main_menu");
const FileHandler = require("../utility/file_handler");

// Initialize a FileHandler instance for managing user data.
const usersFileHandler = new FileHandler("./data/users.json");

/**
 * Handles user login by prompting for username and password.
 * Validates credentials and directs to the main menu if successful.
 * @param {Object} reader - The readline interface for user input.
 * @param {Function} consoleInsurance - The fallback function to call if login fails.
 */
function login(reader, consoleInsurance) {
  reader.question("\nEnter your username: ", (username) => {
    reader.question("Enter your password: ", (password) => {
      if (validateUser(username, password)) {
        console.log("\nLogin successful!");
        setCurrentUser(username, password);
        mainMenu(consoleInsurance); // Redirect to the main menu.
      } else {
        console.log("\nError: Username and Password not found. Please try again.");
        if (typeof consoleInsurance === "function") {
          consoleInsurance(); // Retry or return to the previous menu.
        } else {
          console.log("Error: consoleInsurance is not a function.");
        }
      }
    });
  });
}

/**
 * Handles user registration by prompting for a username and password.
 * Saves credentials and directs to the main menu if successful.
 * @param {Object} reader - The readline interface for user input.
 * @param {Function} parentMenu - The fallback function to call if registration fails.
 */
function register(reader, parentMenu) {
  reader.question("\nEnter a username: ", (username) => {
    reader.question("Enter a password: ", (password) => {
      if (saveUser(username, password)) {
        console.log("\nRegistration successful!");
        setCurrentUser(username, password);
        mainMenu(parentMenu); // Redirect to the main menu.
      } else {
        console.log("\nFailed to register username and password. Please try again.");
        if (typeof parentMenu === "function") {
          parentMenu(); // Retry or return to the previous menu.
        } else {
          console.log("Error: parentMenu is not a function.");
        }
      }
    });
  });
}

/**
 * Handles the forgot password functionality.
 * Allows users to reset their password after verifying their username.
 * @param {Object} reader - The readline interface for user input.
 * @param {Function} parentMenu - The fallback function to call after resetting the password.
 */
function forgotPassword(reader, parentMenu) {
  reader.question("Enter your username: ", (username) => {
    // Retrieve all users from the file using FileHandler.
    const users = usersFileHandler.retrieveFromFile();

    // Find the user by their username.
    const userIndex = users.findIndex((user) => user.username === username);

    if (userIndex !== -1) {
      // Username found, prompt for a new password.
      reader.question("Enter your new password: ", (newPassword) => {
        // Update the password for the found user.
        users[userIndex].password = newPassword;

        // Save the updated users array back to the file using FileHandler.
        usersFileHandler.overrideToFile(users);
        console.log("\nPassword reset successfully!");
        mainMenu(parentMenu); // Redirect to the main menu.
      });
    } else {
      // Username not found.
      console.log("\nUsername not found.");
      console.log("Would you like to try again or return to the main menu?");
      reader.question("Type 'retry' to try again or anything else to return to the main menu: ", (response) => {
        if (response.toLowerCase() === "retry") {
          forgotPassword(reader, parentMenu); // Retry the forgot password process.
        } else {
          mainMenu(parentMenu); // Return to the main menu.
        }
      });
    }
  });
}

// Export all functions to make them available for use in other modules.
module.exports = { login, register, forgotPassword };