const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const mainMenu = require("../menus/main_menu");
const ConsoleColours = require("../utility/console_colours");
const reader = new Reader();
const fileHandler = new FileHandler("./data/accounts_storage.json");
const fs = require('fs');
const counterFile = 'lastAccountID.txt';
const colours = new ConsoleColours();

// Read the last used ID from the file (or initialize to 100000 if the file doesn't exist)
let lastAccountID = fs.existsSync(counterFile) ? parseInt(fs.readFileSync(counterFile, 'utf8')) : 100000;

// Function to validate name input
function validateName(input, fieldName) {
  //TODO: Ensure name contains only letters, spaces or hypens
  
  }
  return true;
}

// Function to validate date of birth (DD-MM-YYYY)
function validateDOB(input) {
    // TODO: Check if the date follows the format and is a valid date

  }

  // Check if the input matches the DD-MM-YYYY format
  if () {
    
  }

  // Split the input into day, month, and year

  // Validate the month (1–12)
  if () {
    
  }

  // Validate the day based on the month
  // Get the last day of the month
  if () {
    
  }

  // Check if the date is valid (e.g., not 31-02-2000)
  
  

  // Calculate the age
  const today = new Date();
 
  }

  // Validate age constraints
  if () {
   
  }



  return true;
}

// Function to validate address
function validateAddress(input) {
    // TODO: Ensure email follows a proper format (e.g., example@mail.com)

  }
  if ()) {
    console.log("\nError: Address contains invalid characters. Please try again.\n");
    return false;
  }
  if () {
    return false;
  }
  return true;
}

//Function to validate Occupation
function validateOccupation(input) {
  if () {
    return false;
  }
  if () {
    return false;
  }
  return true;
}

// Function to validate occupation
function validateOccupation(input) {
  if () {
    return false;
  }
  if () {
    return false;
  }
  return true;
}

// Function to validate email address
function validateEmail(input) {
  if () {
    return false;
  }
   // Regular expression to validate email format
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if () {
     return false;
   }
 
   return true;
 }

// Function to ask for account details with validation
function askForChoice(account, parentMenu, mainMenu) {

  const askFirstName = () => {
    reader.question("First Name: ", (firstName) => {
      if (validateName(firstName, "First Name")) {
        account.firstName = firstName;
        askLastName();
      } else {
        askFirstName(); // Re-prompt if validation fails
      }
    });
  };

  const askLastName = () => {
    reader.question("", () => {
      if (( , " ")) {
    
        askDOB();
      } else {
        askLastName(); // Re-prompt if validation fails
      }
    });
  };

  const askDOB = () => {
    reader.question(
      if () {
        
      } else {
         // Re-prompt if validation fails
      }
    });
  };

  const askAddress = () => {
  
        
      } else {
        // Re-prompt if validation fails
      }
    });
  };

  const askOccupation = () => {

      if () {
        
        console.log();
        // Save the account to the JSON file
        fileHandler.saveToFile(account);

        // Redirect to a different menu
        redirectAfterCreation(account, parentMenu, mainMenu);
      });
      } else {
        askOccupation(); // Re-prompt if validation fails
      }
    });
  };

  askFirstName(); // Start the process
}
const askEmailAddress = (account, nextStep) => {
  reader.question("Email Address: ", (email) => {
    if (()) {
       // Save the email to the account object
      nextStep(); // Proceed to the next step
    } else {
      askEmailAddress(account, nextStep); // Re-prompt if validation fails
    }
  });
};

// Function to redirect after account creation
function redirectAfterCreation(account, parentMenu, mainMenu) {
  console.log(
    `\n${colours.navyBlue}========================================================\n${colours.reset}`
  );
  console.log(`${colours.grey}Please select an option:${colours.reset}\n`);
  console.log(`1. View Created Account`);
  console.log(`2. Create another account`);
  console.log(`3. Back to Previous Menu\n`);

  reader.question(
    `${colours.gold}Please select an option: ${colours.reset}`,
    (answer) => {
      switch (answer) {
        case "1":
          console.log(
            `\n${colours.navyBlue}================== View Created Account ==================${colours.reset}\n`
          );
          viewCreatedAccount(account, parentMenu, mainMenu);
          break;
        case "2":
          console.log(
            `\n${colours.navyBlue}================== Create New Account ==================${colours.reset}\n`
          );
          createNewAccount(parentMenu, mainMenu);
          break;
        case "3":
          console.log(
            `\n${colours.navyBlue}Returning to Accounts Management Menu...${colours.reset}`
          );
          if (typeof parentMenu === "function") {
            parentMenu(mainMenu);
          } else {
            console.log(
              `Error: parentMenu is not a function.}`
            );
          }
          break;
        default:
          console.log(
            `\nInvalid choice. Please enter a number between 1 and 3.\n`
          );
          redirectAfterCreation(account, parentMenu, mainMenu);
      }
    }
  );
}

// Function to start the account creation process
function createNewAccount(parentMenu, mainMenu) {
  const account = {};
  account.id = generateAccountID(); // Generate and assign the unique account ID
  askForChoice(account, parentMenu, mainMenu);
}

// Function to randomly generate ID
function generateAccountID() {
  lastAccountID++; // Increment the ID by 1
  fs.writeFileSync(counterFile, lastAccountID.toString()); // Save the new ID to the file
  return `ALC${lastAccountID}`; // Return the new ID
}

// Function to view the newly created account
function viewCreatedAccount(account, mainMenu) {
  const accounts = fileHandler.retrieveFromFile(); // Read all accounts from the file
  const createdAccount = accounts.find((acc) => acc.id === account.id); // Find the newly created account

  //View the newly created Accounts Details 
  if (createdAccount) {
    console.log(`\nViewing Created Account:\n`);
    console.log(`${colours.gold}----------------------------------------${colours.reset}`);
    //Here should print the Newly created Account details
    console.log(`${colours.gold}----------------------------------------${colours.reset}\n`);
  } else {
    console.log("\Account not found.\n");
  }

  // Prompt the user to return to the main menu
  reader.question("\nPress Enter to return to the main menu...", () => {
    if (typeof mainMenu === "function") {
      const { accountsmenu } = require("../menus/accounts_menu");
      accountsmenu(mainMenu); // Redirect user back to account management menu
    } else {
      console.log("Error: mainMenu is not a function.");
    }
  });
}


module.exports = { createNewAccount };