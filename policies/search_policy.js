const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours"); // Import the ConsoleColours class

// Create an instance of ConsoleColours
const colours = new ConsoleColours();

const reader = new Reader();
const fileHandler = new FileHandler("./data/accounts_storage.json");

// Function to validate policy number input
function validatePolicyNumber(input) {
  // Check if the input is empty or doesn't meet the required format
  if (!input || input.trim() === "") {
    console.log(`\nError: Policy number cannot be empty. Please try again.\n`);
    return false;
  }
  // Add additional validation rules if needed (e.g., minimum length, specific format)
  if (input.length < 5) {
    console.log(`\nError: Policy number must be at least 5 characters long. Please try again.\n`);
    return false;
  }
  return true;
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

    for (const account of existingData) {
      if (!Array.isArray(account.policies)) continue; // Skip if policies are missing or not an array

      const matchingPolicies = account.policies.filter(
        (policy) => policy.policyNumber === query.policyNumber
      );

      if (matchingPolicies.length > 0) {
        foundPolicies.push({ account, policies: matchingPolicies });
      }
    }

    if (foundPolicies.length > 0) {
      console.log(`\nFound ${foundPolicies.length} Matching Policies:\n`);

      foundPolicies.forEach(({ account, policies }, index) => {
        console.log(`${colours.gold}----------------------------------------${colours.reset}`);
        console.log(`Policy Holder: ${account.firstName} ${account.lastName}`);

        policies.forEach((policy, policyIndex) => {
          console.log(`\n${colours.navyBlue}Policy ${policyIndex + 1}:${colours.reset}`);
          // Display Policy Details
          console.log(`  Policy Number: ${policy.policyNumber ?? "N/A"}`);
          console.log(`  Account Number: ${policy.accountNumber ?? "N/A"}`);
          console.log(`  Status: ${policy.status ?? "N/A"}`);
          console.log(`  No Claims Discount: ${policy.noClaimsDiscount ? "Yes" : "No"}`);
          console.log(`  Penalty Points: ${policy.penaltyPoints ?? "N/A"}`);
          console.log(`  Convictions: ${policy.convictions?.length > 0 ? policy.convictions.join(", ") : "None"}`);
          console.log(`  Premium: £${policy.premium?.toFixed(2) ?? "N/A"}`);

          // Display Vehicles
          console.log(`\n  ${colours.grey}Vehicles:${colours.reset}`);
          policy.vehicles?.forEach((vehicle, vIndex) => {
            console.log(`    Vehicle ${vIndex + 1}:`);
            console.log(`      Model: ${vehicle.carModel ?? "N/A"}`);
            console.log(`      Registration: ${vehicle.carReg ?? "N/A"}`);
            console.log(`      Mileage: ${vehicle.mileage ?? "N/A"}`);
            console.log(`      Modifications: ${vehicle.mods?.length > 0 ? vehicle.mods.join(", ") : "None"}`);
          });

          // Display Coverages
          console.log(`\n  ${colours.grey}Coverages:${colours.reset}`);
          policy.coverages?.forEach((coverage, cIndex) => {
            console.log(`    Coverage ${cIndex + 1}:`);
            console.log(`      Type: ${coverage.coverageType ?? "N/A"}`);
            console.log(`      Amount: £${coverage.coverageAmount?.toFixed(2) ?? "N/A"}`);
          });

          // Display Policy Periods
          console.log(`\n  ${colours.grey}Policy Periods:${colours.reset}`);
          policy.policyPeriods?.forEach((period, pIndex) => {
            console.log(`    Period ${pIndex + 1}:`);
            console.log(`      Start Date: ${period.startDate ?? "N/A"}`);
            console.log(`      End Date: ${period.endDate ?? "N/A"}`);
            console.log(`      Premium: £${period.premium?.toFixed(2) ?? "N/A"}`);
          });

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
    reader.question(`${colours.gold}Do you want to try searching again? (yes/no): ${colours.reset}`, (answer) => {
      if (validateYesNoInput(answer)) {
        if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
          console.log();
          searchPolicy(policiesMenu, mainMenu); // Restart the search process
        } else {
          console.log(`${colours.navyBlue}Search ended. Returning to Policies Management Menu...${colours.reset}`);
          policiesMenu(mainMenu); // Return to the main menu
        }
      } else {
        ask(); // Re-prompt if validation fails
      }
    });
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