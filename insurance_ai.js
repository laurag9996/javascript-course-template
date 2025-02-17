const { login, register, forgotPassword } = require("./actionpages/portal_actions");
const { Reader } = require("./utility/reader");
const ConsoleColours = require("./utility/console_colours");

const colours = new ConsoleColours();

//Displays the main console menu for Alchemy Insurance, allowing users to log in, register, or exit the system
function consoleInsurance() {
  const reader = new Reader();

  //Displays the main menu options and handles user input
  const askForChoice = () => {
    console.log(
      `\n${colours.navyBlue}=================================================`);
    console.log(
      `${colours.white}  Welcome to ${colours.gold}Alchemy Insurance Policy System${colours.navyBlue}`
    );
    console.log(
      `${colours.navyBlue}=================================================\n`
    );
    console.log(`${colours.grey}Please enter an option:${colours.reset}\n`);
    console.log(`1. Login`);
    console.log(`2. Register`);
    console.log(`3. Forgot Password`);
    console.log(`4. Exit\n`);

    reader.question(
      `${colours.gold}Please select an option: ${colours.reset}`,
      (answer) => {
        switch (answer) {
          case "1":
            console.log(
              `\n${colours.navyBlue}================== Login ==================${colours.reset}`
            );
            login(reader, consoleInsurance);
            break;
          case "2":
            console.log(
              `\n${colours.navyBlue}============ Registering new user ============${colours.reset}`
            );
            register(reader, consoleInsurance);
            break;
            case "3":
              console.log(
                `\n${colours.navyBlue}=========== Forgot Password ================${colours.reset}`,
              );
              forgotPassword(reader, consoleInsurance);
              break;
          case "4":
            console.log(
              `\n${colours.navyBlue}Exiting... Thank you for using Alchemy Insurance!${colours.reset}\n`
            );
            reader.close();
            break;
          default:
            console.log(
              `\nInvalid choice. Please enter a number between 1 and 3.\n`
            );
            askForChoice();
        }
      }
    );
  };

  askForChoice();
}

consoleInsurance();

module.exports = { consoleInsurance };