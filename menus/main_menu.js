const { Reader } = require("../utility/reader");
const { accountsmenu } = require("./accounts_menu");
const { policiesmenu } = require("./policies_menu");
const { adminmenu } = require("./admin_menu");
const ConsoleColours = require("../utility/console_colours"); 
const { clearCurrentUser } = require("../account/user_service");

const colours = new ConsoleColours();

//Displays the main menu for Alchemy Insurance, allowing users to navigate between Accounts, Policies, Admin, or log out.
function mainMenu() {
  const reader = new Reader();

  const askForChoice = () => {
    console.log(
      `\n${colours.navyBlue}=================================================${colours.reset}`
    );
    console.log(
      `${colours.white}  Welcome to ${colours.gold}Alchemy Insurance Menu${colours.navyBlue}  ${colours.reset}`
    );
    console.log(
      `${colours.navyBlue}=================================================${colours.reset}\n`
    );
    console.log(`${colours.grey}Please select an option:${colours.reset}\n`);
    console.log(`${colours.white}1. Accounts${colours.reset}`);
    console.log(`${colours.white}2. Policies${colours.reset}`);
    console.log(`${colours.white}3. Admin${colours.reset}`);
    console.log(`${colours.white}4. Logout${colours.reset}\n`);

    reader.question(
      `${colours.gold}Please enter an option: ${colours.reset}`,
      (answer) => {
        switch (answer) {
          case "1":
            console.log(
              `\n${colours.navyBlue}================== Accounts ==================${colours.reset}`
            );
            accountsmenu(mainMenu);
            break;
          case "2":
            console.log(
              `\n${colours.navyBlue}================== Policies ==================${colours.reset}`
            );
            policiesmenu(mainMenu);
            break;
          case "3":
            console.log(
              `\n${colours.navyBlue}================== Admin ==================${colours.reset}`
            );
            adminmenu(mainMenu);
            break;
          case "4":
            console.log(
              `\n${colours.navyBlue}Logging out... Thank you for using Alchemy Insurance!${colours.reset}\n`
            );
            const { consoleInsurance } = require("../insurance_ai");
            consoleInsurance(); 
            clearCurrentUser();
            break;
          default:
            console.log(
              `\nInvalid choice. Please enter a number between 1 and 4.\n`
            );
            askForChoice();
        }
      }
    );
  };

  askForChoice();
}

module.exports = { mainMenu };
