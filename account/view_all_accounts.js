const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours");
const { Reader } = require("../utility/reader"); // Import the Reader class

const colours = new ConsoleColours();
const reader = new Reader(); // Initialize the reader object

function viewCreatedPolicy(account, mainMenu) {
  const fileHandler = new FileHandler("./data/accounts_storage.json");
  const accounts = fileHandler.retrieveFromFile();

  const accountData = accounts.find((acc) => acc.id === account.id);

  
  if (!accountData) {
    console.log("Account not found.");
    return;
  }

  if (!accountData.policies || accountData.policies.length === 0) {
    console.log("No policies found for this account.");
    return;
  }

  // Get the latest policy (Assumes policies have a `createdAt` timestamp)
  const latestPolicy = accountData.policies.sort((a, b) => 
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  )[0];

  console.log(`\n${colours.gold}----------------------------------------${colours.reset}`);
  console.log(`Viewing Latest Created Policy for Account: ${account.id}`);
  console.log(`${colours.gold}----------------------------------------${colours.reset}`);

  /* Spec 3.1: Print Policy Details

   - Display key policy details (handling missing values with `|| "N/A"`).
   - Concatenate `firstName` and `lastName` for policy holder's name.
   - Handle convictions list
   - Format and display premium
   - Handle missing values
*/

  console.log(`\n${colours.navyBlue}Policy Details:${colours.reset}`);
  console.log(`Policy Holder: ${accountData.firstName + " " + accountData.lastName || "N/A"}`);
  console.log(`Policy Number: ${latestPolicy.policyNumber || "N/A"}`);
  console.log(`Status: ${latestPolicy.status || "N/A"}`);
  console.log(`No Claims Discount: ${latestPolicy.noClaimsDiscount ? "Yes" : "No"}`);
  console.log(`Penalty Points: ${latestPolicy.penaltyPoints || "N/A"}`);
  console.log(`Convictions: ${latestPolicy.convictions.length > 0 ? latestPolicy.convictions.join(", ") : "N/A"}`);
  console.log(`Premium: £${latestPolicy.premium.toFixed(2) || "N/A"}`);

  if (latestPolicy.vehicles && latestPolicy.vehicles.length > 0) {
    console.log(`\n${colours.grey}Vehicles:${colours.reset}`);

    /* Spec 3.2: Loop Through Vehicles

       - Iterate over `latestPolicy.vehicles` using `.forEach()`.
       - Use an index to number each vehicle.
       - Print `carModel`, `carReg` (registration), `mileage`, and `mods` (modifications).
       - Use `|| "N/A"` to handle missing values
    */
  }

  if (latestPolicy.coverages && latestPolicy.coverages.length > 0) {
    console.log(`\n${colours.grey}Coverages:${colours.reset}`);

   /* Spec 3.3: Loop Through Coverages

       - Iterate over `latestPolicy.coverages` using `.forEach()`.
       - Use `cIndex` to number each coverage.
       - Print coverage number and type
       - Handle missing values
       
    */
  }

  if (latestPolicy.policyPeriods && latestPolicy.policyPeriods.length > 0) {
     
    /* Spec 3.4: Loop Through Policy Periods

       - Iterate over `latestPolicy.policyPeriods` using `.forEach()`
       - Use `pIndex` to number each period
       - Print policy Period Number (display "Period X where X is 'pIndex +1')
       - Display 'startDate' and 'endDate'
       - Ensure 'premium' is formatted as currency
       - Handle missing values

    */
  }

  console.log(`${colours.gold}----------------------------------------${colours.reset}`);

  // Prompt the user to return to the main menu
  reader.question(`\n${colours.gold}Press Enter to return to the main menu...${colours.reset}`, () => {
    if (typeof mainMenu === "function") {
      const { policiesmenu } = require("../menus/policies_menu");
      policiesmenu(mainMenu);
    } else {
      console.log("Error: mainMenu is not a function or is undefined.");
    }
  });
}

module.exports = { viewCreatedPolicy };