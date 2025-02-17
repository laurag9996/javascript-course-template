// file-handler.js

// Import Node.js modules for file system and path manipulation.
const fs = require("fs");
const path = require("path");

// Class to handle file operations such as saving, retrieving, and clearing JSON data.
class FileHandler {
  /**
   * Constructor initializes the file path and ensures the directory exists.
   * @param {string} filePath - The path to the file being handled.
   */
  constructor(filePath) {
    this.filePath = filePath;
    this.ensureDirectoryExists(); // Ensure the file's directory exists before performing any operations.
  }

  /**
   * Ensures the directory for the file exists. If not, it creates the directory.
   */
  ensureDirectoryExists() {
    const dir = path.dirname(this.filePath); // Extract the directory from the file path.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory recursively if it doesn't exist.
    }
  }

  /**
   * Saves data to the JSON file by appending it to existing data.
   * @param {Object} data - The data to be saved.
   */
  saveToFile(data) {
    let existingData = []; // Initialize an empty array for existing data.
    if (fs.existsSync(this.filePath)) {
      const fileData = fs.readFileSync(this.filePath, "utf8"); // Read the file contents as a string.
      existingData = JSON.parse(fileData); // Parse the string into a JavaScript object or array.
    }
    existingData.push(data); // Append the new data to the existing data.
    fs.writeFileSync(this.filePath, JSON.stringify(existingData, null, 2)); // Write updated data back to the file in JSON format.
  }

  /**
   * Overrides the entire JSON file with new data, replacing the old data.
   * @param {Object} data - The data to replace the file contents.
   */
  overrideToFile(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2)); // Write the updated data directly to the file.
    console.log("Data successfully saved to file."); // Log success message.
  }

  /**
   * Retrieves data from the JSON file.
   * @returns {Array|Object} - The parsed data from the file, or an empty array if the file doesn't exist.
   */
  retrieveFromFile() {
    if (fs.existsSync(this.filePath)) {
      const fileData = fs.readFileSync(this.filePath, "utf8"); // Read the file contents as a string.
      return JSON.parse(fileData); // Parse and return the data as a JavaScript object or array.
    } else {
      console.log("No data found in the file."); // Log a message if the file doesn't exist.
      return []; // Return an empty array if there's no data.
    }
  }

  /**
   * Clears all data from the JSON file.
   */
  clearFile() {
    if (fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2)); // Clear the file by writing an empty array.
      console.log("All data has been removed from the file.");
    } else {
      console.log("File does not exist, nothing to clear.");
    }
  }

  /**
   * Deletes an item from the JSON file by its ID.
   * @param {number|string} id - The ID of the item to delete.
   */
  deleteById(id) {
    if (!fs.existsSync(this.filePath)) {
      console.log("File does not exist, nothing to delete.");
      return;
    }
    const fileData = fs.readFileSync(this.filePath, "utf8");
    let existingData = JSON.parse(fileData);
    const filteredData = existingData.filter(item => item.id !== id); // Filter out the item with the matching ID.
    if (existingData.length === filteredData.length) {
      console.log(`No data found with ID: ${id}`);
      return;
    }
    fs.writeFileSync(this.filePath, JSON.stringify(filteredData, null, 2)); // Write the updated data back to the file.
    console.log(`Data with ID: ${id} has been deleted.`);
  }
}

// Export the FileHandler class to make it available for use in other modules.
module.exports = FileHandler;