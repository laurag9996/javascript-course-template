// console-colors.js

// Class to define console text color codes using ANSI escape sequences.
class ConsoleColors {
    constructor() {
      // Reset color to default (white).
      this.reset = "\x1b[0m";
  
      // Define Alchemy colors using RGB values in ANSI escape sequences.
      this.navyBlue = "\x1b[38;2;0;0;150m"; 
      this.gold = "\x1b[38;2;184;134;11m";  
      this.white = "\x1b[37m";              
      this.grey = "\x1b[90m";               
    }
  }
  
  // Export the class for use in other modules.
  module.exports = ConsoleColors;