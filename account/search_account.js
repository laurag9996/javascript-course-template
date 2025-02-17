const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours"); 

const colours = new ConsoleColours();

const reader = new Reader();
const fileHandler = new FileHandler("./data/accounts_storage.json");

// Function to validate name input
function validateName(input, fieldName) {
  if (!input || input.trim() === "") {
    console.log(`\nError: ${fieldName} cannot be empty. Please try again.\n`);
    return false;
  }
  if (!/^[A-Za-z\s-]+$/.test(input)) {
    console.log(`\nError: ${fieldName} must contain only letters, spaces, or hyphens. Please try again.\n`);
    return false;
  }
  return true;
}

// Function to ask for account details
function askForChoice(callback) {
  const askFirstName = () => {
    reader.question(`First Name: `, (firstName) => {
      if (validateName(firstName, "First Name")) {
        const askLastName = () => {
          reader.question(`Last Name: `, (lastName) => {
            if (validateName(lastName, "Last Name")) {
              callback({ firstName, lastName });
            } else {
              askLastName(); // Re-prompt for last name if validation fails
            }
          });
        };
        askLastName(); // Prompt for last name after first name is valid
      } else {
        askFirstName(); // Re-prompt for first name if validation fails
      }
    });
  };
  askFirstName(); // Initial prompt for first name
}

// Function to search for accounts based on the query
function searchQueriedAccount(query, accountsmenu, mainMenu) {
  try {
    const existingData = fileHandler.retrieveFromFile();

    if (!Array.isArray(existingData)) {
      console.error(`\nError: No valid data found. Please check the data file.\n`);
      askToTryAgain(accountsmenu, mainMenu);
      return;
    }

    const accounts = existingData.filter(
      acc => acc.firstName === query.firstName && acc.lastName === query.lastName
    );

    if (accounts.length > 0) {
      console.log(`\nFound ${accounts.length} Account(s):\n`);
      accounts.forEach((account, index) => {
        console.log(`${colours.gold}-------- Account ${index + 1} --------${colours.reset}`);
        console.log(`Account ID: ${account.id || "N/A"}`);
        console.log(`First Name: ${account.firstName || "N/A"}`);
        console.log(`Last Name: ${account.lastName || "N/A"}`);
        console.log(`Date of Birth: ${account.dob || "N/A"}`);
        console.log(`Address: ${account.address || "N/A"}`);
        console.log(`Occupation: ${account.occupation || "N/A"}`);
        console.log(`${colours.gold}------------------------------${colours.reset}\n`);
      });
      accountsmenu(mainMenu);
    } else {
      console.log(`\nNo account found matching the given details.\n`);
      askToTryAgain(accountsmenu, mainMenu);
    }
  } catch (error) {
    console.error("Error searching for account:", error);
    console.log(`\nAn error occurred while searching for the account. Please try again.\n`);
    askToTryAgain(accountsmenu, mainMenu);
  }
}

// Function to ask the user if they want to try again
function askToTryAgain(accountsmenu, mainMenu) {
  const ask = () => {
    reader.question(`${colours.gold}Do you want to try searching again? (yes/no): ${colours.reset}`, (answer) => {
      if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
        console.log();
        searchAccount(accountsmenu, mainMenu);
      } else if (answer.toLowerCase() === "no" || answer.toLowerCase() === "n") {
        console.log(`${colours.navyBlue}Search ended. Returning to Accounts Management Menu...${colours.reset}`);
        accountsmenu(mainMenu);
      } else {
        console.log(`\nError: Invalid input. Please enter 'yes' or 'no'.\n`);
        ask();
      }
    });
  };
  ask();
}

// Function to start the account search process
function searchAccount(accountsmenu, mainMenu) {
  askForChoice((query) => {
    searchQueriedAccount(query, accountsmenu, mainMenu);
  });
}

module.exports = { searchAccount };