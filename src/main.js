
import chalk from "chalk";
import datePrompt from "date-prompt";
import inquirer from "inquirer";
import moment from "moment";
import { writeData, checkActiveFasts, readData } from "./dataActions";

const confirmAnswerValidator = async (input) => {
    let validNumbers = [16, 18, 20, 36]
    if (isNaN(input) || validNumbers.indexOf(Number(input)) === -1) {
       return ("Please provide valid number of hours (16, 18, 20, 36)");
    }
    return true;
 };

const startFast = (updateFast) => {
    const questions = [
        {
          type: 'input',
          name: 'fast_type',
          loop: true,
          message: "Fast Type (how many hours will the fast last (16, 18, 20, 36)",
          validate: confirmAnswerValidator
        }
      ];     
      
    datePrompt('Start Date: (When fasting should begin)')
    .then(isoStr => {
        inquirer.prompt(questions).then((answers) => {
            updateFast ? writeData({start_date: isoStr, fast_type: Number(answers.fast_type)}, true) : writeData({start_date: isoStr, fast_type: Number(answers.fast_type)})
          }).catch(err => console.log(err));
    })
    .catch(isoStr => console.log('Aborted with', isoStr))}

const printFastStatus = async (mssg) => {
    try {
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
                    ${mssg === "start" ? chalk.red("If you want to start new Fast, you need to end the current active fast.") : ""}         
                    `);
            }
        }
    }
    catch(err){
        console.log(err)
    }    
    
}
const endFast = async () => {
    try {
        let data = await readData();
        if(data){
            if(data.length){
                let lastFast = data[data.length - 1];   
                writeData({start_date: lastFast.start_date, fast_type: 0});      
            }
        }
    }
    catch(err){
        console.log(err)
    } 
}

const printAllFasts = async () => {
    try {
        let data = await readData();
        console.log(data)
            if(data.length){
                console.log("success-2")

                data.forEach(item => {
                    let isActive = moment(item.end_date).format() > moment().format() ? true : false
                    let difference = new Date().getTime() - new Date(item.start_date).getTime();
                    let formatedDiff = Math.floor(difference/(1000*60*60)) + ":" + Math.floor(difference/(1000*60))%60 + ":" + Math.floor(difference/1000)%60;
                    console.log(`
                        Fast Status: - ${chalk.green(isActive ? 'Active' : 'Inactive')}
                        Started Fasting - ${chalk.blue(item.start_date)}
                        Fast Ending - ${chalk.blue(item.end_date)}
                        Elapsed Time - ${chalk.blue(formatedDiff)}
                        Fast Type - ${chalk.yellow(`${item.fast_type} hours`)} \n   
                        ${mssg === "start" ? chalk.red("If you want to start new Fast, you need to end the current active fast.") : ""}         
                        `);
                })
            }else  console.log(`\n ${chalk.bold.blue("You have no Fasts at this moment, if you want to start new fast, type 'zero start' in your terminal.")} \n`);
      
    }
    catch(err){
        console.log("error-2")

        console.log(`\n ${chalk.bold.blue("You have no Fasts at this moment, if you want to start new fast, type 'zero start' in your terminal.")} \n`);
    } 
}

export async function processUserAction(options){
    let activeStatus = await checkActiveFasts();
    if(options.action == "status"){
        if(!activeStatus) console.log(`\n ${chalk.bold.blue("There is no active fast, type 'zero start' in terminal to start with fast.")} \n`);
        else  printFastStatus();
    }
    else if(options.action == "start"){
        if(activeStatus) printFastStatus("start");
        else startFast();
    } 
    else if(options.action == "end"){
        if(activeStatus) endFast();
        else console.log(`\n ${chalk.bold.blue("No active Fast found.")} \n`);
    } 
    else if(options.action == "update"){
        let updateLast = true;
        if(activeStatus) startFast(updateLast);
        else console.log(`\n ${chalk.bold.blue("No active Fast found.")} \n`);
    } 
    else if(options.action == "list"){
        printAllFasts();
    } 
}

