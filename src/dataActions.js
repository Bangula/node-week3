import moment from "moment";
import chalk from "chalk";
import fs from "fs";

export function readData(){
     return new Promise( (resolve, reject) => {
        fs.readFile(`${__dirname}/fasts.json`, 'utf8', function(err, data){
            if (err){
                reject(new Error(err));
            } else {
                if(data){
                    let obj = JSON.parse(data);
                    let fasts = obj || [];
                    resolve(fasts);
                }else resolve ([])                
            }});
     })        
}

export async function checkActiveFasts(){
    try{
        let fasts = await readData();
        if(fasts.length){
            let last = fasts[fasts.length - 1];        
            if(moment(last.end_date).format() > moment().format()) {
                return true;
            }
            else return false
        }
    }
    catch(err){
        return false;
    }    
}

export async function writeData(values, updateFast){
    let endDate = moment(values.start_date).add(values.fast_type, 'hours')
    
    try{
        let fasts = await readData();  
        let lastFastTypeValue = fasts ? fasts.length ? fasts[fasts.length - 1].fast_type : values.fast_type : values.fast_type;
        let newFast = {            
            start_date: moment(values.start_date).format(),
            fast_type: values.fast_type === 0 ? lastFastTypeValue : values.fast_type,
            end_date: values.fast_type === 0 ? moment().format() : endDate.format()
        }
        if(values.fast_type === 0 || updateFast){
            fasts.pop();
        }      
        fasts.push(newFast);
        let json = JSON.stringify(fasts);
        fs.writeFile(`${__dirname}/fasts.json`, json, 'utf8', (err, data) => {
            if(err) console.log(err);
            else {
                console.log(`\n ${chalk.bold.green(values.fast_type ? "The Fast was scheduled successfully." : "The Fast is ended successfully" )} \n`);
            }
        }); 
    }
    catch(err){
        let fasts = [];
        let newFast = {            
            start_date: moment(values.start_date).format(),
            fast_type: values.fast_type,
            end_date: endDate.format()
        }
        fasts.push(newFast);
        let json = JSON.stringify(fasts);
        fs.writeFile(`${__dirname}/fasts.json`, json, 'utf8', (err, data) => {
            if(err) console.log(err);
            else {
                console.log(`\n ${chalk.bold.green("The Fast was scheduled successfully.")} \n`);
            }
        });     }
}