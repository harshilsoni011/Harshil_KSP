const chalk = require("chalk");

const runSeeders = async () => {
    let hasErrors = false;

    // Add KSP seeders here if needed in the future

    if (hasErrors) {
        console.log(chalk.bgRed.white("⚠️ Seeders completed with some errors."));
        process.exit(1);
    } else {
        console.log(chalk.bgGreen.white("🎉 All seeders completed successfully!"));
    }
};

module.exports = runSeeders;
