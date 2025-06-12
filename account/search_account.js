const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours"); 

const colours = new ConsoleColours();

const reader = new Reader();
const fileHandler = new FileHandler("./data/accounts_storage.json");

// Spec 4.1: Function to validate name input
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

  /* Spec 4.2: Prompt User for First and Last Name 

     - Ask for first name using `reader.question()`.  
     - Validate input using `validateName()`.  
     - If valid, proceed to ask for last name.  
     - If last name is valid, store both names in an object and call `searchQueriedAccount()`.  
     - If validation fails at any step, re-prompt the user.  
  */
}
            

// Function to search for accounts based on the query
function searchQueriedAccount(query, accountsmenu, mainMenu) {
  try {
    const existingData = fileHandler.retrieveFromFile();

    // Check if the retrieved data is a valid array
    if (!Array.isArray(existingData)) {
      console.error(`\nError: No valid data found. Please check the data file.\n`);
      askToTryAgain(accountsmenu, mainMenu);       
      return;  
    }

   /* Spec 4.3: Search for Matching Accounts  

       - Filter `existingData` to find accounts where first and last names match `query`.  
       - If no matches are found, display a message and call `askToTryAgain()`.  
       - If matches are found, proceed to displaying results.  
    */

    const accounts = existingData.filter(
      acc => acc.firstName === query.firstName && acc.lastName === query.lastName
    );

    // Check if any matching accounts were found
    if (null) {
            // Log the number of accounts found
      console.log(`\nFound ${accounts.length} Account(s):\n`);
            // Loop through each matching account and display its details

      accounts.forEach((account, index) => {
        console.log(`${colours.gold}-------- Account ${index + 1} --------${colours.reset}`);
       
        /* Spec 4.4: Display Matching Accounts  

         - Loop through `accounts` and display the following details:  
           - Account ID  
           - First Name  
           - Last Name  
           - Date of Birth  
           - Address  
           - Occupation  
         - Ensure missing values display as `"N/A"`.  
         - After displaying results, return to the Accounts Management Menu.  
      */

        console.log(`${colours.gold}------------------------------${colours.reset}\n`);  
      });
            // Return to the accounts management menu after displaying the results
    } else {
            // If no matching accounts were found, log a message
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


function askToTryAgain(accountsmenu, mainMenu) {

   /* Spec 4.5: Ask User if They Want to Try Again  

     - Ask the user: "Do you want to search again? (yes/no)".  
     - If "yes", restart `searchAccount()`.  
     - If "no", return to `accountsmenu()`.  
     - If input is invalid, re-prompt the user.  
  */

  const ask = () => {
        // Use `reader.question` to ask the user if they want to try searching again
    reader.question(`${colours.gold}Do you want to try searching again? (yes/no): ${colours.reset}`, (answer) => {
            // Check if the user's answer is "yes" or "y"
      if (null) {
        console.log(); // Add a newline for formatting
                // Restart the search process by calling `searchAccount`
        searchAccount(accountsmenu, mainMenu);
              // Check if the user's answer is "no" or "n"
      } else if (null) {
                // Log a message indicating the search is ending
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