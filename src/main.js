
import chalk from "chalk"
import datePrompt from "date-prompt";
import inquirer from "inquirer";
import {writeData} from "./dataActions"

const chechActiveFasts = () => {
    return false;
}

const confirmAnswerValidator = async (input) => {
    if (isNaN(input) || Number(input) > 48) {
       return ("Please provide valid number of hours (example: 16)");
    }
    return true;
 };

const startFast = () => {
    const questions = [
        {
          type: 'input',
          name: 'fast_type',
          loop: true,
          message: "Fast Type (how many hours will the fast last, example: 16)",
          validate: confirmAnswerValidator
        }
      ];
      
      
    datePrompt('Start Date: (When fasting should begin)')
    .then(isoStr => {
        inquirer.prompt(questions).then((answers) => {
            writeData({start_date: isoStr, fast_type: answers.fast_type})
          }).catch(err => console.log(err));
    })
    .catch(isoStr => console.log('Aborted with', isoStr))}

const printFastStatus = () => {
    console.log(`
        Status: - ${chalk.green('Active')}
        Started Fasting - ${chalk.blue('April 2, 20:00')}
        Fast Ending - ${chalk.blue('April 6, 20:00')}
        Elapsed Time - ${chalk.blue('1:30:45')}
        Fast Type - ${chalk.yellow('16 hours')}            
        `);
}

export function processUserAction(options){
    let activeStatus = chechActiveFasts();

    if(options.action == "status"){
        if(activeStatus) console.log(`\n ${chalk.bold.blue("There is no active fast, type 'zero start' in terminal to start with fast.")} \n`);
        else  printFastStatus();
    }
    else if(options.action == "start"){
        if(activeStatus) printFastStatus();
        else startFast();
    } 
}

