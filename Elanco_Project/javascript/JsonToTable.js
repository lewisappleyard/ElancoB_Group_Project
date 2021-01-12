const jsonToTable = require('json-to-table');
 


const myRecords = [
{
    name:'Bob',
    address:{zip:12345, state:'Euphoria'}
},
{
    name:'Jon',
    address:{street:'1234 Main St.', state:'Arizona'}
}];

const tabled = jsonToTable(myRecords, 'Default String');
 
module.exports = {
createReceiptTable: function() {
    var body = document.body;
    var table = document.createElement('table');
    table.style.width = '75%';
    table.style.border = '1px solid black';
    table.setAttribute('border', '1');
    var tableBody = document.createElement('tableBody');
    for (var i = 0; i < 3; i++)
    {
        var tRow = table.insertRow();
        for (var j = 0; j < 2; j++)
        {
            if (i == 2 && j == 1) {
                break;
            }
            else {
                var tData = tRow.insertCell();
                tData.appendChild(document.createTextNode('data here'));
                tData.style.border = '1px solid black';
                if (i == 1 && j == 1) {
                    tData.setAttribute('rowspan', '2');
                }
            }
        }
    }
    body.appendChild(table);
    console.log("create table function has been run");
}
}

//tabled will be an array of arrays like this
//[
//['name', 'address.zip', 'address.state', 'address.street'],
//['Bob',  12345,         'Euphoria',      ''],
//['Jon',  '',            '1234 Main St.', 'Arizona']
//]