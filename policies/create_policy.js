const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours");

const colours = new ConsoleColours();
const reader = new Reader();
const accountsFileHandler = new FileHandler("./data/accounts_storage.json");


const { viewCreatedPolicy } = require("./view_created_policy");

function createNewPolicy(mainMenu) {
  console.log("\n Welcome to the Policy Creation Wizard!");

  // Available coverage options
  const coverageOptions = [

    /* Spec 4.1: Define Coverage Options  
   
      - Create an array called `coverageOptions`.  
      - Include four coverage types
      - Each coverage option should be an object with properties
   */

  ];

  // Available modification options
  const modificationOptions = [
    { type: "Tinted Windows", selected: false },
    { type: "Alloy Wheels", selected: false },
    { type: "Performance Exhaust", selected: false },
    { type: "Spoiler", selected: false },
  ];

  const policy = {
    policyNumber: Math.random().toString(36).substring(2, 9),
    vehicles: [],
    coverages: [],
    policyPeriods: [],
    status: "quoted", //quoted, bound, saved, discarded
    noClaimsDiscount: false,
    penaltyPoints: 0,
    convictions: [],
  };

  const handleExit = (answer) => {
    if (answer.toLowerCase() === "exit") {
      console.log("\nPolicy creation cancelled. Exiting...");
      reader.close();
      mainMenu();
      return true;
    }
    return false;
  };

  // Function to handle the Escape key press
  const handleEscape = (str, key) => {
    if (key && key.name === "escape") {
      console.log("\nEsc key pressed. Exiting Policy creation...");
      process.stdin.removeListener('keypress', handleEscape); // Remove the listener
      reader.reset(); // Reset the reader
      const { policiesmenu } = require("../menus/policies_menu");
      policiesmenu(mainMenu); // Redirect user back to policy management menu
    }
  };

  // Keypress event listener
  process.stdin.on('keypress', handleEscape);

  // Function to ask for account number in which the policy is made for
  const askForAccountNumber = () => {

    /* Spec 4.2: Ask for Account Number  
 
      - Prompt the user to enter an account number  
      - Validate format: must start with "ALC" followed by numbers.  
      - Check if the account exists in `accountsFileHandler.retrieveFromFile()`.  
      - If valid, store in `policy.accountNumber` and call `askForNoClaimsDiscount(account)`.  
   */
  };

  // Function to ask for No Claims Discount
  const askForNoClaimsDiscount = (account) => {

    /* Spec 4.3: Ask for No Claims Discount  

     - Prompt user with "Do you have a No Claims Discount? (yes/no)".  
     - Ensure input is "yes" or "no".  
     - Store result in `policy.noClaimsDiscount`.  
     - If valid, call `askForPenaltyPoints(account)`.  
  */
  };

  // Function to ask for Penalty Points
  const askForPenaltyPoints = (account) => {

    /* Spec 4.4: Ask for Penalty Points  

     - Prompt user to enter number of penalty points.  
     - Ensure input is a valid number (0-6).  
     - If points > 6, display message and exit policy creation.  
     - If points > 4, show warning about premium increase.  
     - Store in `policy.penaltyPoints` and call `askForConvictions(account)`.  
  */
  }

  // Function to ask for Convictions
  const askForConvictions = (account) => {

    /* Spec 4.5: Ask for Convictions  
  
      - Prompt user: "Do you have any convictions? (yes/no)".  
      - If "yes", ask for conviction details and store them in `policy.convictions`.  
      - If "no", store an empty array.  
      - Then call `askForVehicleMakeModel(account)`.  
   */

  };

  // Function to ask user for vehicle details
  const askForVehicleMakeModel = (account) => {

    /* Spec 4.6: Ask for Make/Model  
  
     - Prompt user for:  
       - Vehicle Make/Model (only letters, numbers, and spaces allowed).    
  */

  };

  const askForVehicleReg = (account, vehicle) => {

    /* Spec 4.7: Ask for Registration
  
     - Prompt user for:   
       - Vehicle Registration (validate UK format).    
  */

  };

  const askForVehicleMileage = (account, vehicle) => {
    /* Spec 4.8: Ask for Vehicle Details  
  
     - Prompt user for:  
       - Vehicle Mileage (ensure numeric input).  
  
     - Store details and call `askForModifications(vehicle, account)`.  
  */

  };

  // Function to ask for modifications
  const askForModifications = (vehicle, account) => {

    /* Spec 4.9: Ask for Modifications  
  
     - Display modification options  
     - Allow users to select multiple modifications.  
     - Store selected modifications   
  */
  };

  // Function for coverage selection
  const askForCoverageChoices = (account) => {
    console.log(
      `\n${colours.navyBlue}Select Coverage Options:${colours.reset}`
    );

    /* Spec 4.10: Implement Coverage Selection Menu 
  
     - Loop through `coverageOptions`   
     - Indicate if an option is already selected  
     - Add an extra option at the end to proceed to premium calculation.  
  */
    reader.question(
      `${colours.gold}Enter your choice: ${colours.reset}`,
      (choice) => {
        if (handleExit(choice)) return;

        const choiceNumber = parseInt(choice);

        // Validate the choice
        if (isNaN(choiceNumber)) {
          console.log(
            `\n${colours.gold}Invalid input. Please enter a number.${colours.reset}\n`
          );
          return askForCoverageChoices(account);
        }


        if (choiceNumber >= 1 && choiceNumber <= coverageOptions.length) {

          // Spec 4.11: Implement Coverage Rules  


          askForCoverageChoices(account); // Stay in the menu to select more options

        } else if (choiceNumber === coverageOptions.length + 1) {

          /* Spec 4.12: Implement validation for proceeding to premium calculation  
  
           - Check if at least one coverage option is selected before proceeding.  
           - If no coverage is selected, display an error message and re-prompt the user.  
           - If valid, store selected coverages in `policy.coverages` and call `calculatePremium(account)`.  
         */

        } else {
          console.log(`\n${colours.gold}Invalid choice. Please try again.${colours.reset}\n`);
          askForCoverageChoices(account);
        }
      });
  };

  const calculatePremium = (account) => {
    /* Spec 4.13: Calculate Premium  
  
      - Start with a base premium of £100.  
      - Apply surcharges/discounts based on:  
        - No Claims Discount (-20%).  
        - Penalty Points (+£50 per point after 4).  
        - Convictions (+£100 surcharge).  
        - Vehicle mileage (+£1 per 1000 miles).  
        - Modifications (+£50 if any modifications exist).  
        - Coverage type:  
          - Comprehensive (+£800).  
          - Third Party, Fire and Theft (+£600).  
          - Third Party Only (+£400).  
          - Road Traffic Act Cover (+£250).  
      - Store in `policy.premium` and display the final amount.   
   */
  };

  const offerOptions = (account) => {
    console.log(
      `\n${colours.navyBlue}Please select an option:${colours.reset}`
    );
    console.log(`1. Bind and Issue Policy`);
    console.log(`2. Save Submission`);
    console.log(`3. Discard and Go Back to Previous Menu`);
    console.log(`4. Logout`);

    reader.question(
      `${colours.gold}Enter your choice: ${colours.reset}`,
      (choice) => {
        if (handleExit(choice)) return;

        switch (choice) {
          case "1":
            bindPolicy(account);
            break;
          case "2":
            saveSubmission(account);
            break;
          case "3":
            discardSubmission();
            break;
          case "4":
            console.log(`\n${colours.navyBlue}Logging out...${colours.reset}`);
            const { consoleInsurance } = require("../insurance_ai");
            consoleInsurance(); // Calls the first menu in insurance_ai.js
            break;
          default:
            console.log(
              `\n${colours.gold}Invalid choice. Please try again.${colours.reset}\n`
            );
            offerOptions(account);
        }
      }
    );
  };

  const bindPolicy = (account) => {
    policy.status = "bound";
    policy.policyPeriods.push({
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      premium: policy.premium,
    });
    savePolicy(account, policy);
    console.log(
      `\n${colours.navyBlue}Policy bound and issued successfully!${colours.reset}`
    );
    postPolicyOptions(account, policy);
  };

  const saveSubmission = (account) => {
    policy.status = "saved";
    savePolicy(account, policy);
    console.log(
      `\n${colours.navyBlue}Submission saved successfully!${colours.reset}`
    );
    postPolicyOptions(account, policy);
  };

  const discardSubmission = () => {
    policy.status = "discarded";
    console.log(
      `\n${colours.navyBlue}Submission discarded. Returning to policy management menu.${colours.reset}`
    );

    // Lazy-load policiesmenu.js to avoid circular dependencies
    const { policiesmenu } = require("../menus/policies_menu");

    policiesmenu(mainMenu); // Redirect user back to policy management menu
  };

  const savePolicy = (account, policy) => {
    // Retrieve all accounts from the JSON file
    const accounts = accountsFileHandler.retrieveFromFile();

    // Find the account by ID
    const accountIndex = accounts.findIndex((acc) => acc.id === account.id);

    // If account not found, log an error and return
    if (accountIndex === -1) {
      console.log(
        `\n${colours.gold}Account not found. Cannot save policy.${colours.reset}\n`
      );
      return;
    }

    // Ensure the account has a 'policies' property (initialize if not present)
    if (!accounts[accountIndex].policies) {
      accounts[accountIndex].policies = [];
    }

    // Prevent duplicate policies (check for policyNumber)
    if (
      accounts[accountIndex].policies.some(
        (p) => p.policyNumber === policy.policyNumber
      )
    ) {
      console.log(
        `\n${colours.gold}Policy already exists, skipping save.${colours.reset}\n`
      );
      return;
    }

    // Add the new policy to the account's policies array
    accounts[accountIndex].policies.push(policy);

    // Save the updated accounts array back to the file, replacing the old data
    accountsFileHandler.overrideToFile(accounts);
    console.log(
      `\n${colours.navyBlue}Policy successfully saved to the account.${colours.reset}`
    );
  };

  const postPolicyOptions = (account, policy) => {
    console.log(
      `\n${colours.navyBlue}Please select an option:${colours.reset}`
    );
    console.log(`1. View Created Policy`);
    console.log(`2. Create New Policy`);
    console.log(`3. Go Back to Previous Menu`);
    console.log(`4. Logout`);

    reader.question(
      `${colours.gold}Enter your choice: ${colours.reset}`,
      (choice) => {
        if (handleExit(choice)) return;

        switch (choice) {
          case "1":
            viewCreatedPolicy(account, mainMenu);
            break;
          case "2":
            createNewPolicy(mainMenu);
            break;
          case "3":
            console.log(`\n${colours.navyBlue}Back to Policies Menu...${colours.reset}`);
            const { policiesmenu } = require("../menus/policies_menu");
            policiesmenu(mainMenu);
            break;
          case "4":
            console.log(`\n${colours.navyBlue}Logging out...${colours.reset}`);
            const { consoleInsurance } = require("../insurance_ai");
            consoleInsurance(); // Redirects back to the pre-login menu
            break;
          default:
            console.log(`\nInvalid choice. Please try again.\n`);
            postPolicyOptions(account, policy);
        }
      }
    );
  };

  askForAccountNumber();
};


module.exports = { createNewPolicy };
