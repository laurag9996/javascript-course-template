const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours"); 

const colours = new ConsoleColours();

const reader = new Reader();
const fileHandler = new FileHandler("./data/accounts_storage.json");

// Function to validate name input
function validateName(input, fieldName) {
  if (!input || input.trim() === "") {
     //Name field cannot be empty
    return false;
  }
  if ((input)) {
    // Name must only contains letters 
    return false;
  }
  return true;
}

// Function to ask for account details
function askForChoice(callback) {
  // Define a nested function to ask for the first name
    // Use the `reader.question` method to prompt the user for their first name
      // Validate the first name using the `validateName` function
        // Define a nested function to ask for the last name
          // Use the `reader.question` method to prompt the user for their last name
            // Validate the last name using the `validateName` function
              // If both names are valid, invoke the callback with an object containing the first and last names

            } else {
                            // If the last name is invalid, re-prompt for the last name
              // Re-prompt for last name if validation fails
            }
          });
        };
                // After the first name is validated, prompt for the last name

      } else {
        // If the first name is invalid, re-prompt for the first name
      }
    });
  };
  // Start the process by prompting for the first name
}

// Function to search for accounts based on the query
function searchQueriedAccount(query, accountsmenu, mainMenu) {
  try {
    const existingData = fileHandler.retrieveFromFile();

    // Check if the retrieved data is a valid array
    if (!Array.isArray(existingData)) {
          // Check if the retrieved data is a valid array
      console.error(`\nError: No valid data found. Please check the data file.\n`);
      askToTryAgain(accountsmenu, mainMenu);       // Prompt the user to try again by calling `askToTryAgain`
      return;  // Exit the function early
    }

    // Filter the existing data to find accounts matching the provided query (first and last name)
    const accounts = existingData.filter(
      acc => acc.firstName === query.firstName && acc.lastName === query.lastName
    );

    // Check if any matching accounts were found
    if () {
            // Log the number of accounts found
      console.log(`\nFound ${accounts.length} Account(s):\n`);
            // Loop through each matching account and display its details

      accounts.forEach((account, index) => {
        console.log(`${colours.gold}-------- Account ${index + 1} --------${colours.reset}`);
       // Display account ID or "N/A" if not available
        // Display first name or "N/A" if not available
         // Display last name or "N/A" if not available
        // Display date of birth or "N/A" if not available
         // Display address or "N/A" if not available
          // Display occupation or "N/A" if not available
        console.log(`${colours.gold}------------------------------${colours.reset}\n`);  
      });
            // Return to the accounts management menu after displaying the results
    } else {
            // If no matching accounts were found, log a message
         // Prompt the user to try again by calling `askToTryAgain`
      askToTryAgain(accountsmenu, mainMenu);
    }
  } catch (error) {
        // Handle any errors that occur during the search process
            // Log a user-friendly error message
    console.log(`\nAn error occurred while searching for the account. Please try again.\n`);
        // Prompt the user to try again by calling `askToTryAgain`
    askToTryAgain(accountsmenu, mainMenu);
  }
}

// Function to ask the user if they want to try again
function askToTryAgain(accountsmenu, mainMenu) {
    // Define a nested function to prompt the user
  const ask = () => {
        // Use `reader.question` to ask the user if they want to try searching again
    reader.question(`${colours.gold}Do you want to try searching again? (yes/no): ${colours.reset}`, (answer) => {
            // Check if the user's answer is "yes" or "y"
      if () {
        console.log(); // Add a newline for formatting
                // Restart the search process by calling `searchAccount`
        searchAccount(accountsmenu, mainMenu);
              // Check if the user's answer is "no" or "n"
      } else if () {
                // Log a message indicating the search is ending
        console.log(`${colours.navyBlue}Search ended. Returning to Accounts Management Menu...${colours.reset}`);
                // Return to the accounts management menu
        accountsmenu(mainMenu);
      } else {
                // If the input is invalid, log an error message
        console.log(`\nError: Invalid input. Please enter 'yes' or 'no'.\n`);
                // Re-prompt the user by calling `ask` again
        ask();
      }
    });
  };
    // Start the process by calling `ask`
  ask();
}

// Function to start the account search process
function searchAccount(accountsmenu, mainMenu) {
    // Call `askForChoice` to prompt the user for their first and last name
  askForChoice((query) => {
        // Once the query is obtained, call `searchQueriedAccount` to perform the search
    searchQueriedAccount(query, accountsmenu, mainMenu);
  });
}

module.exports = { searchAccount };