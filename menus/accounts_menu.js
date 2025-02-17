const { createNewAccount } = require("../account/create_account");
const { searchAccount } = require("../account/search_account");
const { viewAccount, viewAllAccounts } = require("../account/view_all_accounts");
const { Reader } = require("../utility/reader");
const ConsoleColours = require("../utility/console_colours"); 

const colours = new ConsoleColours();

//Displays the Accounts Management Menu, allowing the user to search, create, or view accounts, or return to the main menu
function accountsmenu(mainMenu) {
  const reader = new Reader();

  const askForChoice = () => {
    console.log(
      `\n${colours.navyBlue}=================================================${colours.reset}`
    );
    console.log(
      `${colours.white}  Welcome to ${colours.gold}Accounts Management Menu${colours.navyBlue}  ${colours.reset}`
    );
    console.log(
      `${colours.navyBlue}=================================================${colours.reset}\n`
    );
    console.log(`${colours.grey}Please select an option:${colours.reset}\n`);
    console.log(`${colours.white}1. Search Account${colours.reset}`);
    console.log(`${colours.white}2. Create New Account${colours.reset}`);
    console.log(`${colours.white}3. View Accounts${colours.reset}`);
    console.log(`${colours.white}4. Back${colours.reset}\n`);

    reader.question(
      `${colours.gold}Please enter an option: ${colours.reset}`,
      (answer) => {
        switch (answer) {
          case "1":
            console.log(
              `\n${colours.navyBlue}================== Search Account ==================${colours.reset}\n`
            );
            searchAccount(accountsmenu, mainMenu);
            break;
          case "2":
            console.log(
              `\n${colours.navyBlue}================== Create New Account ==================${colours.reset}\n`
            );
            createNewAccount(accountsmenu, mainMenu);
            break;
          case "3":
            console.log(
              `\n${colours.navyBlue}================== View Accounts ==================${colours.reset}\n`
            );
            viewAllAccounts(accountsmenu, mainMenu, reader);
            break;
          case "4":
            console.log(
              `\n${colours.navyBlue}Redirecting back to Main Menu...${colours.reset}\n`
            );
            if (typeof mainMenu === "function") {
              const { mainMenu } = require("./main_menu");
              mainMenu(mainMenu); 
            } else {
              console.log(
                `Error: mainMenu is not a function.`
              );
            }
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

module.exports = { accountsmenu };