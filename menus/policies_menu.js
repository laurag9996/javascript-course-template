// Import required modules
const { createNewPolicy } = require("../policies/create_policy");
const { searchPolicy } = require("../policies/search_policy");
const { viewCreatedPolicy } = require("../policies/view_created_policy");
const { viewallpolicies } = require("../policies/view_all_policies");
const { Reader } = require("../utility/reader");
const ConsoleColours = require("../utility/console_colours"); // Import the ConsoleColours class

// Create an instance of ConsoleColours
const colours = new ConsoleColours();

function policiesmenu(mainMenu) {
  const reader = new Reader(); // Create a new Reader instance
  const askForChoice = () => {
    console.log(
      `\n${colours.navyBlue}=================================================${colours.reset}`
    );
    console.log(
      `${colours.white}  Welcome to ${colours.gold}Policy Management Menu${colours.navyBlue}  ${colours.reset}`
    );
    console.log(
      `${colours.navyBlue}=================================================${colours.reset}\n`
    );
    console.log(`${colours.grey}Please select an option:${colours.reset}\n`);
    console.log(`${colours.white}1. Search Policy${colours.reset}`);
    console.log(`${colours.white}2. Create New Policy${colours.reset}`);
    console.log(`${colours.white}3. View Policies${colours.reset}`);
    console.log(`${colours.white}4. Back${colours.reset}\n`);
    reader.question(
      `${colours.gold}Please enter an option: ${colours.reset}`,
      (answer) => {
        switch (answer) {
          case "1":
            console.log(
              `\n${colours.navyBlue}================== Search Policy ==================${colours.reset}\n`
            );
            searchPolicy(policiesmenu, mainMenu);
            break;
          case "2":
            console.log(
              `\n${colours.navyBlue}================== Create New Policy ==================${colours.reset}\n`
            );
            createNewPolicy(() => policiesmenu(mainMenu)); // Pass policiesmenu as the main menu
            break;
          case "3":
            console.log(
              `\n${colours.navyBlue}================== View Policies ==================${colours.reset}\n`
            );
            viewallpolicies(mainMenu);
            break;
          case "4":
            console.log(
              `\n${colours.navyBlue}Redirecting back to Main Menu...${colours.reset}\n`
            );
            if (typeof mainMenu === "function") {
              mainMenu(); // Calls the Main Menu
            } else {
              console.log(`Error: mainMenu is not a function.`);
            }
            break;
          default:
            console.log(`\nInvalid choice. Please enter a number between 1 and 4.\n`);
            askForChoice();
        }
      }
    );
  };
  askForChoice();
}

module.exports = { policiesmenu };