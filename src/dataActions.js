import moment from "moment";
import fs from "fs";

function readData(){
     return new Promise( (resolve, reject) => {
        fs.readFile(`${__dirname}/fasts.json`, 'utf8', function(err, data){
            if (err){
                reject(new Error(err));
            } else {
                console.log("json file data: ", data)
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
    return false;
}

export async function writeData(values){

    let startDate = new Date(values.start_date)      
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + values.fast_type));
    console.log(startDate, endDate);    
 
    try{
        let fasts = await readData();
        let newFast = {            
            start_date: startDate,
            fast_type: endDate
        }
        fasts.push(newFast);
        let json = JSON.stringify(fasts);
        fs.writeFile(`${__dirname}/fasts.json`, json, 'utf8', (err, data) => {
            if(err) console.log(err)
            else console.log(data)
        }); 

    }
    catch(err){
        console.log(err)
    }

    console.log("write data to json file ", values);
  
}