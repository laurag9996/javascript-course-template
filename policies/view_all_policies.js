const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours");
const { Reader } = require("../utility/reader"); 

const colours = new ConsoleColours();
const reader = new Reader(); 

function viewallpolicies(mainMenu) {
    const fileHandler = new FileHandler("./data/accounts_storage.json");
    const accounts = fileHandler.retrieveFromFile();

    if (!accounts || accounts.length === 0) {
        console.log("No accounts found.");
        return;
    }

    accounts.forEach((account) => {
        if (!account.policies || account.policies.length === 0) {
            return;
        }
        console.log(`\n${colours.gold}----------------------------------------${colours.reset}`);
        console.log(`Viewing Policies for Account: ${account.id}`);
        console.log(`${colours.gold}----------------------------------------${colours.reset}`);

        account.policies.forEach((policy, index) => {

            /* Spec 2.1: Display Policy Details

               - Print details like Policy Number, Holder Name, Status, etc.
               - Use `??` to handle missing values.
               - Ensure all data is properly formatted.
            */

            if (policy.vehicles && policy.vehicles.length > 0) {

                /* Spec 2.2: Display Vehicle Details

                   - Loop through `policy.vehicles` and print each vehicle’s details.
                   - Include model, registration, mileage, and modifications.
                   - Handle cases where no vehicles exist.
                */
            }

            if (policy.coverages && policy.coverages.length > 0) {
                console.log(`\n${colours.grey}Coverages:${colours.reset}`);
                policy.coverages.forEach((coverage, cIndex) => {
                    console.log(`  Coverage ${cIndex + 1}:`);
                    console.log(`    Type: ${coverage.coverageType || "N/A"}`);
                });
            }

            if (policy.policyPeriods && policy.policyPeriods.length > 0) {
                console.log(`\n${colours.grey}Policy Periods:${colours.reset}`);
                policy.policyPeriods.forEach((period, pIndex) => {
                    console.log(`  Period ${pIndex + 1}:`);
                    console.log(`    Start Date: ${period.startDate || "N/A"}`);
                    console.log(`    End Date: ${period.endDate || "N/A"}`);
                    console.log(`    Premium: £${period.premium.toFixed(2) || "N/A"}`);
                });
            }

            console.log(`${colours.gold}----------------------------------------${colours.reset}`);
        });
    });

   /* Spec 2.3: Prompt User to Return to the Main Menu

       - Use `reader.question()` to ask the user to press Enter.
       - Ensure `mainMenu` is called correctly if defined.
       - Handle cases where `mainMenu` is not a function.
    */
}

module.exports = { viewallpolicies }; // Export the function with the correct name