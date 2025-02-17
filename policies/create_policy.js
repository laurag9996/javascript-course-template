const { Reader } = require("../utility/reader");
const FileHandler = require("../utility/file_handler");
const ConsoleColours = require("../utility/console_colours");

const colours = new ConsoleColours();
const reader = new Reader();
const accountsFileHandler = new FileHandler("./data/accounts_storage.json");
const { viewCreatedPolicy } = require("./view_created_policy");

// Available coverage options
const coverageOptions = [
  { type: "Comprehensive", selected: false },
  { type: "Third Party", selected: false },
  { type: "Collision", selected: false },
  { type: "Liability", selected: false },
];

// Available modification options
const modificationOptions = [
  { type: "Tinted Windows", selected: false },
  { type: "Alloy Wheels", selected: false },
  { type: "Performance Exhaust", selected: false },
  { type: "Spoiler", selected: false },
];

function createNewPolicy(mainMenu) {
  console.log("\n Welcome to the Policy Creation Wizard!");
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

  // Add the keypress event listener
  process.stdin.on('keypress', handleEscape);

  // Function to ask for account number in which the policy is made for
  const askForAccountNumber = () => {
    reader.question(
      `Enter Account Number (Format: ALC100001): `,
      (accountNumber) => {
        if (handleExit(accountNumber)) return;

        const accounts = accountsFileHandler.retrieveFromFile();
        const account = accounts.find((acc) => acc.id === accountNumber);

        if (!/^ALC\d+$/.test(accountNumber)) {
          console.log(
            "Invalid Account Number. Must start with ALC followed by numbers."
          );
          return askForAccountNumber();
        }

        if (!account) {
          console.log(
            "Account not found. Please enter a valid account number."
          );
          return askForAccountNumber();
        }

        policy.accountNumber = accountNumber;
        askForNoClaimsDiscount(account);
      }
    );
  };

  // Function to ask for No Claims Discount
  const askForNoClaimsDiscount = (account) => {
    reader.question(
      `Do you have a No Claims Discount? (yes/no): `,
      (answer) => {
        if (handleExit(answer)) return;

        answer = answer.toLowerCase();
        if (answer !== "yes" && answer !== "no") {
          console.log("Invalid input. Please enter 'yes' or 'no'.");
          return askForNoClaimsDiscount(account);
        }

        policy.noClaimsDiscount = answer === "yes";
        askForPenaltyPoints(account);
      }
    );
  };

  // Function to ask for Penalty Points
  const askForPenaltyPoints = (account) => {
    reader.question(`Enter the number of penalty points: `, (points) => {
      if (handleExit(points)) return;

      if (!/^\d+$/.test(points)) {
        console.log("Invalid input. Please enter a valid number.");
        return askForPenaltyPoints(account);
      }

      policy.penaltyPoints = parseInt(points);

      // Check penalty points eligibility
      if (policy.penaltyPoints > 6) {
        console.log(
          `\n${colours.gold}Policy submission cancelled. You have more than 6 penalty points.${colours.reset}\n`
        );
        mainMenu(); // Redirect back to the main menu
        return;
      } else if (policy.penaltyPoints > 4) {
        console.log(
          `\n${colours.gold}Warning: You have more than 4 penalty points. This may affect your premium.${colours.reset}\n`
        );
      }

      askForConvictions(account);
    });
  };

  // Function to ask for Convictions
  const askForConvictions = (account) => {
    reader.question(`Do you have any convictions? (yes/no): `, (answer) => {
      if (handleExit(answer)) return;

      answer = answer.toLowerCase();
      if (answer !== "yes" && answer !== "no") {
        console.log("Invalid input. Please enter 'yes' or 'no'.");
        return askForConvictions(account);
      }

      if (answer === "yes") {
        reader.question(`Enter details of the convictions: `, (convictions) => {
          if (handleExit(convictions)) return;
          policy.convictions = convictions
            .split(",")
            .map((conviction) => conviction.trim());
          askForVehicleMakeModel(account);
        });
      } else {
        policy.convictions = [];
        askForVehicleMakeModel(account);
      }
    });
  };

  // Function to ask user for vehicle details
  const askForVehicleMakeModel = (account) => {
    reader.question(`Enter Make/Model of Car: `, (carModel) => {
      if (handleExit(carModel)) return;

      if (!/^[a-zA-Z0-9 ]+$/.test(carModel)) {
        console.log(
          "Invalid Make/Model. Only letters, numbers, and spaces allowed."
        );
        return askForVehicleMakeModel(account);
      }

      askForVehicleReg(account, { carModel });
    });
  };

  const askForVehicleReg = (account, vehicle) => {
    reader.question(
      `Enter Car Registration (UK format expected, e.g., AB12 CDE): `,
      (carReg) => {
        if (handleExit(carReg)) return;

        if (!/^[A-Z]{2}\d{2} [A-Z]{3}$/.test(carReg)) {
          console.log(
            "Invalid Car Registration. Format should be two letters, two digits, space, three letters."
          );
          return askForVehicleReg(account, vehicle);
        }

        vehicle.carReg = carReg;
        askForVehicleMileage(account, vehicle);
      }
    );
  };

  const askForVehicleMileage = (account, vehicle) => {
    reader.question(`Enter Mileage (Numbers Only): `, (mileage) => {
      if (handleExit(mileage)) return;

      if (!/^\d+$/.test(mileage)) {
        console.log("Invalid mileage. Enter numbers only.");
        return askForVehicleMileage(account, vehicle);
      }

      vehicle.mileage = parseInt(mileage);
      askForModifications(vehicle, account);
    });
  };

  // Function to ask for modifications
  const askForModifications = (vehicle, account) => {
    console.log(`\n${colours.navyBlue}Select Modifications:${colours.reset}`);
    modificationOptions.forEach((option, index) => {
      console.log(
        `${index + 1}. ${option.type} ${option.selected ? "[Selected]" : ""}`
      );
    });
    console.log(
      `${modificationOptions.length + 1}. Proceed to Coverage Selection`
    );

    reader.question(
      `${colours.gold}Enter your choice: ${colours.reset}`,
      (choice) => {
        if (handleExit(choice)) return;

        const choiceNumber = parseInt(choice);

        if (choiceNumber >= 1 && choiceNumber <= modificationOptions.length) {
          // Toggle the selected state of the modification option
          modificationOptions[choiceNumber - 1].selected =
            !modificationOptions[choiceNumber - 1].selected;
          askForModifications(vehicle, account); // Stay in the menu to select more options
        } else if (choiceNumber === modificationOptions.length + 1) {
          // Add selected modifications to the vehicle
          vehicle.mods = modificationOptions
            .filter((option) => option.selected)
            .map((option) => option.type);
          policy.vehicles.push(vehicle);
          askForCoverageChoices(account);
        } else {
          console.log(
            `\n${colours.gold}Invalid choice. Please try again.${colours.reset}\n`
          );
          askForModifications(vehicle, account);
        }
      }
    );
  };

  // Function for coverage selection
  const askForCoverageChoices = (account) => {
    console.log(
      `\n${colours.navyBlue}Select Coverage Options:${colours.reset}`
    );
    coverageOptions.forEach((option, index) => {
      console.log(
        `${index + 1}. ${option.type} ${option.selected ? "[Selected]" : ""}`
      );
    });
    console.log(
      `${coverageOptions.length + 1}. Proceed to Premium Calculation`
    );

    reader.question(
      `${colours.gold}Enter your choice: ${colours.reset}`,
      (choice) => {
        if (handleExit(choice)) return;

        const choiceNumber = parseInt(choice);

        if (choiceNumber >= 1 && choiceNumber <= coverageOptions.length) {
          let selectedCoverage = coverageOptions[choiceNumber - 1];

          let comprehensiveOption = coverageOptions.find(opt => opt.type === "Comprehensive");

          // If Comprehensive is selected, prevent selecting any other options
          if (comprehensiveOption.selected && selectedCoverage.type !== "Comprehensive") {
            console.log(
              `\n${colours.gold}Comprehensive already covers all other options. No need to select additional coverage.${colours.reset}`
            );
            askForCoverageChoices(account);
            return;
          }

          if (selectedCoverage.type === "Comprehensive") {
            // Toggle Comprehensive selection
            if (selectedCoverage.selected) {
              selectedCoverage.selected = false; // Unselect Comprehensive
            } else {
              selectedCoverage.selected = true; // Select Comprehensive
              // Deselect all other coverage options
              coverageOptions.forEach((option) => {
                if (option.type !== "Comprehensive") option.selected = false;
              });
            }

          } else {
            // Toggle selection for other coverage options (if Comprehensive is NOT selected)
            selectedCoverage.selected = !selectedCoverage.selected;
          }

          askForCoverageChoices(account); // Stay in the menu to select more options

        } else if (choiceNumber === coverageOptions.length + 1) {
          // Ensure at least one coverage is selected
          const selectedCoverages = coverageOptions.filter((option) => option.selected);

          if (selectedCoverages.length === 0) {
            console.log(`\n${colours.gold}You must select at least one coverage option to proceed.${colours.reset}\n`);
            askForCoverageChoices(account);
          } else {
            // Proceed to premium calculation
            policy.coverages = selectedCoverages.map((option) => ({
              coverageType: option.type,
            }));
            calculatePremium(account);
          }

        } else {
          console.log(`\n${colours.gold}Invalid choice. Please try again.${colours.reset}\n`);
          askForCoverageChoices(account);
        }
      });
  };

  const calculatePremium = (account) => {
    let basePremium = 100;

    // Apply No Claims Discount
    if (policy.noClaimsDiscount) {
      basePremium *= 0.8; // 20% discount
    }

    // Add penalty points surcharge
    if (policy.penaltyPoints > 4) {
      basePremium += 50 * (policy.penaltyPoints - 4); // £50 for each point above 4
    }

    // Add convictions surcharge
    if (policy.convictions.length > 0) {
      basePremium += 100; // £100 surcharge for convictions
    }

    // Add vehicle-related costs
    policy.vehicles.forEach((vehicle) => {
      basePremium += vehicle.mileage / 1000;
      if (vehicle.mods && vehicle.mods.length > 0) basePremium += 50; // Add £50 for modifications
    });

    // Add coverage-related costs
    policy.coverages.forEach((coverage) => {
      if (coverage.coverageType === "Comprehensive") basePremium += 200;
      if (coverage.coverageType === "Third Party") basePremium += 100;
      if (coverage.coverageType === "Collision") basePremium += 150;
      if (coverage.coverageType === "Liability") basePremium += 75;
    });

    policy.premium = basePremium;
    console.log(
      `\n${colours.navyBlue}Calculated Premium: £${policy.premium.toFixed(2)}${colours.reset
      }`
    );
    offerOptions(account);
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
}

module.exports = { createNewPolicy };
