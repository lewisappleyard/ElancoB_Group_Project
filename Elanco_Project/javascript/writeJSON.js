export function writeJSONtofile(rawdata){
    
    const fs = require('fs');

    let student = { 
    name: 'Mike',
    age: 23, 
    gender: 'Male',
    department: 'English',
    car: 'Honda' 
    };
 
    let data = JSON.stringify(rawdata);
    fs.writeFileSync('APIreturn.json', data);
    console.log(data);
}