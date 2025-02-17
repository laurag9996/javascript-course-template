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

// Function to validate date of birth (DD-MM-YYYY)
function validateDOB(input) {
  if (!input || input.trim() === "") {
    console.log("\nError: Date of Birth cannot be empty. Please try again.\n");
    return false;
  }

  // Check if the input matches the DD-MM-YYYY format
  const datePattern = /^\d{2}-\d{2}-\d{4}$/;
  if (!datePattern.test(input)) {
    console.log("\nError: Date of Birth must be in the format DD-MM-YYYY. Please try again.\n");
    return false;
  }

  // Split the input into day, month, and year
  const [day, month, year] = input.split("-").map(Number);

  // Validate the month (1–12)
  if (month < 1 || month > 12) {
    console.log("\nError: Invalid month. Please enter a valid month (1–12).\n");
    return false;
  }

  // Validate the day based on the month
  const daysInMonth = new Date(year, month, 0).getDate(); // Get the last day of the month
  if (day < 1 || day > daysInMonth) {
    console.log(`\nError: Invalid day. The month ${month} has ${daysInMonth} days. Please try again.\n`);
    return false;
  }

  // Check if the date is valid (e.g., not 31-02-2000)
  const dob = new Date(`${year}-${month}-${day}`);
  if (isNaN(dob.getTime())) {
    console.log("\nError: Invalid date. Please enter a valid date.\n");
    return false;
  }

  // Calculate the age
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  // Validate age constraints
  if (age < 17) {
    console.log("\nError: You must be at least 17 years old.\n");
    return false;
  }

  if (age > 100) {
    console.log("\nError: Unfortunately, we cannot process accounts for individuals over 100 years old.\n");
    return false;
  }

  return true;
}

// Function to validate address
function validateAddress(input) {
  if (!input || input.trim() === "") {
    console.log("\nError: Address cannot be empty. Please try again.\n");
    return false;
  }
  if (!/^[A-Za-z0-9\s\-,.#]+$/.test(input)) {
    console.log("\nError: Address contains invalid characters. Please try again.\n");
    return false;
  }
  if (input.length < 5 || input.length > 100) {
    console.log("\nError: Address must be between 5 and 100 characters long.\n");
    return false;
  }
  return true;
}

function validateOccupation(input) {
  if (!input || input.trim() === "") {
    console.log("\nError: Occupation cannot be empty. Please try again.\n");
    return false;
  }
  if (!/^[A-Za-z\s-]+$/.test(input)) {
    console.log("\nError: Occupation must contain only letters, spaces, or hyphens. Please try again.\n");
    return false;
  }
  return true;
}

// Function to validate occupation
function validateOccupation(input) {
  if (!input || input.trim() === "") {
    console.log("\nError: Occupation cannot be empty. Please try again.\n");
    return false;
  }
  if (!/^[A-Za-z\s-]+$/.test(input)) {
    console.log("\nError: Occupation must contain only letters, spaces, or hyphens. Please try again.\n");
    return false;
  }
  return true;
}

// Function to validate email address
function validateEmail(input) {
  if (!input || input.trim() === "") {
    console.log("\nError: Email address cannot be empty. Please try again.\n");
    return false;
  }
   // Regular expression to validate email format
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailPattern.test(input)) {
     console.log("\nError: Invalid email address format. Please try again.\n");
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
    reader.question("Last Name: ", (lastName) => {
      if (validateName(lastName, "Last Name")) {
        account.lastName = lastName;
        askDOB();
      } else {
        askLastName(); // Re-prompt if validation fails
      }
    });
  };

  const askDOB = () => {
    reader.question("Date of Birth (DD-MM-YYYY): ", (dob) => {
      if (validateDOB(dob)) {
        account.dob = dob;
        askAddress();
      } else {
        askDOB(); // Re-prompt if validation fails
      }
    });
  };

  const askAddress = () => {
    reader.question("Address: ", (address) => {
      if (validateAddress(address)) {
        account.address = address;
        askOccupation();
      } else {
        askAddress(); // Re-prompt if validation fails
      }
    });
  };

  const askOccupation = () => {
    reader.question("Occupation: ", (occupation) => {
      if (validateOccupation(occupation)) {
        account.occupation = occupation;
        askEmailAddress(account, () => {
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
    if (validateEmail(email)) {
      account.email = email; // Save the email to the account object
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

  if (createdAccount) {
    console.log(`\nViewing Created Account:\n`);
    console.log(`${colours.gold}----------------------------------------${colours.reset}`);
    console.log(`First Name: ${account.firstName || "N/A"}`);
    console.log(`Last Name: ${account.lastName || "N/A"}`);
    console.log(`Date of Birth: ${account.dob || "N/A"}`);
    console.log(`Address: ${account.address || "N/A"}`);
    console.log(`Occupation: ${account.occupation || "N/A"}`);
    console.log(`Email Address: ${account.email || "N/A"}`);
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