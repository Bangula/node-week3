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
                    let obj = JSON.parse(data); //now it an object
                    let fasts = obj || [];
                    // obj.table.push({id: 2, square:3}); //add some data
                    // json = JSON.stringify(obj); //convert it back to json
                    // fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
                    resolve(fasts);
                }else resolve ([])                
            }});
     })
        
}

export async function checkActiveFasts(){
    let fasts = await readData();
    if(fasts.length){
        let last = fasts[fasts.length - 1];        
        if(moment(last.end_date).format() > moment().format()) {
            console.log(fasts[fasts.length - 1]);
            return true;

        }
        else return false
    }
    else return false;
}

export async function writeData(values){
    console.log(values.start_date);    
    console.log(moment(values.start_date).format())

    let endDate = moment(values.start_date).add(2, 'hours')
 
    try{
        let fasts = await readData();
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
        }); 
    }
    catch(err){
        console.log(err)
    }
}