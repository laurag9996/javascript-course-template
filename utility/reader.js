// reader.js

// Import Node.js module for handling input/output interactions.
const readline = require("readline");

// Singleton class to handle user input using the `readline` module.
class Reader {
  /**
   * Constructor ensures only one instance of the Reader class is created (Singleton pattern).
   */
  constructor() {
    if (!Reader.instance) {
      // Create a readline interface for user input/output.
      this.reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      // Enable raw mode to listen for keypress events.
      process.stdin.setRawMode(true);
      process.stdin.resume();

      // Save the singleton instance.
      Reader.instance = this;
    }
    return Reader.instance;
  }

  /**
   * Prompts the user with a question and executes a callback with the user's response.
   * @param {string} query - The question to display to the user.
   * @param {Function} callback - The function to execute with the user's response.
   */
  question(query, callback) {
    this.reader.question(query, callback);
  }

  /**
   * Closes the readline interface, ending the input stream.
   */
  close() {
    this.reader.close();
  }

  /**
   * Resets the readline interface by closing the current instance and creating a new one.
   */
  reset() {
    this.reader.pause(); // Pause the current interface.
    this.reader.close(); // Close the current interface.
    this.reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    }); // Recreate the readline interface.
  }

  /**
   * Displays a prompt message to the user.
   */
  prompt() {
    console.log("Press Enter to continue...");
  }
}

// Export the Reader class as a singleton to make it available for use in other modules.
module.exports = { Reader };