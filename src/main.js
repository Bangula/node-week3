
import chalk from "chalk"
import datePrompt from "date-prompt";
import inquirer from "inquirer";
import { writeData, checkActiveFasts, readData } from "./dataActions"

const confirmAnswerValidator = async (input) => {
    if (isNaN(input) || Number(input) > 48 || Number(input) < 1) {
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
            writeData({start_date: isoStr, fast_type: Number(answers.fast_type)})
          }).catch(err => console.log(err));
    })
    .catch(isoStr => console.log('Aborted with', isoStr))}

const printFastStatus = async () => {
    let data = await readData();
    if(data){
        if(data.length){
            let lastFast = data[data.length - 1];
            let difference = new Date().getTime() - new Date(lastFast.start_date).getTime();
            let formatedDiff = Math.floor(difference/(1000*60*60)) + ":" + Math.floor(difference/(1000*60))%60 + ":" + Math.floor(difference/1000)%60;
            console.log(`
                Fast Status: - ${chalk.green('Active')}

                Started Fasting - ${chalk.blue(lastFast.start_date)}

                Fast Ending - ${chalk.blue(lastFast.end_date)}

                Elapsed Time - ${chalk.blue(formatedDiff)}

                Fast Type - ${chalk.yellow(`${lastFast.fast_type} hours`)} \n            
                `);
        }
    }
    
}

export async function processUserAction(options){
    let activeStatus = await checkActiveFasts();
    if(options.action == "status"){
        if(!activeStatus) console.log(`\n ${chalk.bold.blue("There is no active fast, type 'zero start' in terminal to start with fast.")} \n`);
        else  printFastStatus();
    }
    else if(options.action == "start"){
        if(activeStatus) printFastStatus();
        else startFast();
    } 
}

