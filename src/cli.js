import inquirer from "inquirer";
import {processUserAction} from "./main"
import chalk from "chalk"

let welcomeMsg = `${chalk.blue.underline.bold('ZERO')} - ${chalk.yellow('Time tracking application for intermittent fasting')}`

async function promptForMissingOptions(options) {
    const defaultTemplate = "status";
  
    const questions = [];
    if (!options.length) {
      console.log("", '\n', welcomeMsg, '\n')
      questions.push({
        type: "list",
        name: "action",
        message: "Please choose action",
        choices: [
            {
              key: '1',
              name: 'Check the fast status',
              value: 'status',
            },
            {
              key: '2',
              name: 'Start a fast',
              value: 'start',
            },
            {
              key: '3',
              name: 'End an active fast',
              value: 'end',
            },
            {
              key: '4',
              name: 'Update an active fast',
              value: 'update',
            },
            {
              key: '5',
              name: 'List all fasts',
              value: 'list',
            },
          ],
          default: defaultTemplate, 
    
      });
    } else {        
        return {
            ...options,
            action: options[0]
        };

    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        action: options.argAction || answers.action,
    };
    
}

export async function cli(args){
    let options = await promptForMissingOptions(args);
    processUserAction(options)
}