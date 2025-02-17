const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours");
const { Reader } = require("../utility/reader"); // Import the Reader class

const colours = new ConsoleColours();
const reader = new Reader(); // Initialize the reader object

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
            console.log(`\n${colours.navyBlue}Policy ${index + 1}:${colours.reset}`);
            console.log(`Policy Holder: ${account.firstName + " " + account.lastName || "N/A"}`);
            console.log(`Policy Number: ${policy.policyNumber || "N/A"}`);
            console.log(`Status: ${policy.status || "N/A"}`);
            console.log(`No Claims Discount: ${policy.noClaimsDiscount ? "Yes" : "No"}`);
            console.log(`Penalty Points: ${policy.penaltyPoints || "N/A"}`);
            console.log(`Convictions: ${policy.convictions.length > 0 ? policy.convictions.join(", ") : "N/A"}`);
            console.log(`Premium: £${policy.premium.toFixed(2) || "N/A"}`);

            if (policy.vehicles && policy.vehicles.length > 0) {
                console.log(`\n${colours.grey}Vehicles:${colours.reset}`);
                policy.vehicles.forEach((vehicle, vIndex) => {
                    console.log(`  Vehicle ${vIndex + 1}:`);
                    console.log(`    Model: ${vehicle.carModel || "N/A"}`);
                    console.log(`    Registration: ${vehicle.carReg || "N/A"}`);
                    console.log(`    Mileage: ${vehicle.mileage || "N/A"}`);
                    console.log(`    Modifications: ${vehicle.mods && vehicle.mods.length > 0 ? vehicle.mods.join(", ") : "N/A"}`);
                });
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

    // Prompt the user to return to the main menu
    reader.question(`\n${colours.gold}Press Enter to return to the main menu...${colours.reset}`, () => {
        if (typeof mainMenu === "function") {
            mainMenu(); // Call mainMenu directly
        } else {
            console.log("Error: mainMenu is not a function or is undefined.");
        }
    });
}

module.exports = { viewallpolicies }; // Export the function with the correct name