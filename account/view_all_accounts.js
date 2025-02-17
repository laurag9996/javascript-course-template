const FileHandler = require("../utility/file_handler");
const { Reader } = require("../utility/reader");
const { createAccount } = require("./create_account");
const retrieveFromFile = require("../utility/file_handler")
const mainMenu = require("../menus/main_menu");
const reader = new Reader();
const ConsoleColours = require("../utility/console_colours");

const colours = new ConsoleColours();
const fileHandler = new FileHandler("./data/accounts_storage.json");

// Function to view all accounts created ******
function viewAllAccounts(mainMenu) {
    let accounts = fileHandler.retrieveFromFile();
    // Find all accounts created 
    if (accounts.length > 0) {
        console.log(`All Accounts:`);
        accounts.forEach((account, index) => {
            console.log(`\n${colours.gold}----------------------------------------${colours.reset}`);
            console.log(`${colours.navyBlue}Account ${index + 1}:${colours.reset}`);
            console.log(`${colours.gold}----------------------------------------${colours.reset}`);
            console.log(`ID: ${account.id || "N/A"}`);
            console.log(`First Name: ${account.firstName || "N/A"}`);
            console.log(`Last Name: ${account.lastName || "N/A"}`);
            console.log(`Address: ${account.address || "N/A"}`);
            console.log(`Occupation: ${account.occupation || "N/A"}`);
            console.log(`${colours.gold}----------------------------------------${colours.reset}`);
        });
    } else {
        // If no account is found with the given ID
        console.log('No Accounts found.');
    }

    // Prompt the user to return to the main menu
    reader.question(`${colours.gold}\nPress Enter to return to the main menu...${colours.reset}`, () => {
        if (typeof mainMenu === "function") {
            // Lazy-load policiesmenu.js to avoid circular dependencies
            const { accountsmenu } = require("../menus/accounts_menu");
            accountsmenu(mainMenu); // Redirect user back to policy management menu
        } else {
            console.log("Error: mainMenu is not a function.");
        }
    });
}

module.exports = { viewAllAccounts };