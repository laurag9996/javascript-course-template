const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours"); 
const colours = new ConsoleColours();
const reader = new Reader();
const fileHandler = new FileHandler("./data/accounts_storage.json");


// Function to validate policy number input
function validatePolicyNumber(input) {

   /* Spec 5.1: Implement validation logic

   - Check if the input is empty and display an error message.
   - Ensure the policy number is at least 5 characters long.
  */

  return true; // Placeholder, students should replace with actual logic.
}


// Function to validate yes/no input
function validateYesNoInput(input) {
  const validInputs = ["yes", "y", "no", "n"];
  if (!validInputs.includes(input.toLowerCase())) {
    console.log(`\nError: Invalid input. Please enter 'yes' or 'no'.\n`);
    return false;
  }
  return true;
}

// Function to ask for policy number
function askForPolicyNumber(callback) {

  const ask = () => {
    reader.question(`Policy Number: `, (policyNumber) => {
      if (validatePolicyNumber(policyNumber)) {
        callback({ policyNumber });
      } else {
        ask(); // Re-prompt if validation fails
      }
    });
  };

  ask(); // Initial prompt
}

// Function to search for a policy based on the query
function searchQueriedPolicy(query, policiesMenu, mainMenu) {
  try {
    const existingData = fileHandler.retrieveFromFile();
    let foundPolicies = [];

     /* Spec 5.2: Loop through existingData and find policies matching query.policyNumber

     - Iterate through accounts
     - Check if they have policies
     - Find policies where policy.policyNumber matches query.policyNumber
     - Store matching policies in foundPolicies
    */

    if (foundPolicies.length > 0) {
      console.log(`\nFound ${foundPolicies.length} Matching Policies:\n`);

      foundPolicies.forEach(({ account, policies }, index) => {
        console.log(`${colours.gold}----------------------------------------${colours.reset}`);
        console.log(`Policy Holder: ${account.firstName} ${account.lastName}`);

        policies.forEach((policy, policyIndex) => {
          console.log(`\n${colours.navyBlue}Policy ${policyIndex + 1}:${colours.reset}`);

           /* Spec 5.3: Display policy details

           - Policy Number
           - Account Number
           - Status
           - No Claims Discount
           - Penalty Points
           - Convictions
           - Premium


           TODO: Display Vehicles
           - Loop through policy.vehicles and print details


           TODO: Display Coverages
           - Loop through policy.coverages and print details


           TODO: Display Policy Periods


           - Loop through policy.policyPeriods and print details

           */

          console.log(`${colours.gold}----------------------------------------${colours.reset}\n`);
        });
      });

      policiesMenu(mainMenu);
    } else {
      console.log(`\nNo policy found matching the given policy number: ${query.policyNumber}.\n`);
      askToTryAgain(policiesMenu, mainMenu);
    }
  } catch (error) {
    console.log(`\nError: An unexpected issue occurred while searching for the policy. Please try again.\n`);
    console.error(error);
    askToTryAgain(policiesMenu, mainMenu);
  }
}

// Function to ask the user if they want to try again
function askToTryAgain(policiesMenu, mainMenu) {
  const ask = () => {

/* Spec 5.4: Ask the user if they want to try again

    - Use reader.question to prompt: "Do you want to try searching again? (yes/no)"
    - Validate input using validateYesNoInput function
    - If "yes", call searchPolicy
    - If "no", return to policiesMenu
*/
  };

  ask(); // Initial prompt
}

// Function to start the policy search process
function searchPolicy(policiesMenu, mainMenu) {
  askForPolicyNumber((query) => {
    searchQueriedPolicy(query, policiesMenu, mainMenu);
  });
}

module.exports = { searchPolicy };