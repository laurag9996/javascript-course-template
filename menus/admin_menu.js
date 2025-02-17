const { Reader } = require("../utility/reader");
const ConsoleColours = require("../utility/console_colours"); 
const FileHandler = require("../utility/file_handler");
const clearFileHandler = new FileHandler("./data/accounts_storage.json");
const { getCurrentUser, getCurrentPassword } = require("../account/user_service");

const colours = new ConsoleColours();

//Displays the Admin Management Menu, allowing the user to drop storage or return to the main menu, with validation for sensitive actions
function adminmenu(mainMenu) {
  const reader = new Reader();

  const displayMenu = () => {
    console.log(
      `\n${colours.navyBlue}=================================================${colours.reset}`
    );
    console.log(
      `${colours.white}  Welcome to ${colours.gold}Admin Management Menu${colours.navyBlue}  ${colours.reset}`
    );
    console.log(
      `${colours.navyBlue}=================================================${colours.reset}\n`
    );
    console.log(`${colours.grey}Please select an option:${colours.reset}\n`);
    console.log(`${colours.white}1. Drop Storage${colours.reset}`);
    console.log(`${colours.white}2. Back${colours.reset}\n`);
  };

  const validateCredentials = (callback) => {
    reader.question(`${colours.gold}Enter your username: ${colours.reset}`, (username) => {
      reader.question(`${colours.gold}Enter your password: ${colours.reset}`, (password) => {
        if (username === getCurrentUser() && password === getCurrentPassword()) {
          callback();
        } else {
          console.log(`\n${colours.gold}Invalid credentials. Please try again.${colours.reset}\n`);
          displayMenu();
          handleUserInput();
        }
      });
    });
  };

  const handleUserInput = () => {
    reader.question(
      `${colours.gold}Please enter an option: ${colours.reset}`,
      (answer) => {
        switch (answer) {
          case "1":
            validateCredentials(() => {
              console.log(
                `\n${colours.navyBlue}================== Drop Storage ==================${colours.reset}\n`
              );
              clearFileHandler.clearFile();
              console.log(
                `\n${colours.gold}Storage cleared successfully!${colours.reset}\n`
              );
              displayMenu(); 
              handleUserInput(); 
            });
            break;
          case "2":
            console.log(
              `\n${colours.navyBlue}Redirecting back to Main Menu...${colours.reset}\n`
            );
            if (typeof mainMenu === "function") {
              mainMenu(); 
            } else {
              console.log(`Error: mainMenu is not a function.`);
            }
            break;
          default:
            console.log(
              `\nInvalid choice. Please enter a number between 1 and 2.\n`
            );
            handleUserInput(); 
        }
      }
    );
  };

  displayMenu(); 
  handleUserInput(); 
}

module.exports = { adminmenu };