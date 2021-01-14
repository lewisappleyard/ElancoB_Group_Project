var xhttp = new XMLHttpRequest();
var response;
//var tRow = new Array();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
    }
}
xhttp.open("GET", "ExampleJson.json", true);
xhttp.send();

const button = document.getElementById("table-button");

var tableCount = 0;

var tableObject =   [
                        {"name":"product1","price":"\xA320"}, // \xA3 is the literal string symbol for "£", where just writing the pound symbol wont work
                        {"name":"product2","price":"\xA325"},
                        {"name":"product3","price":"\xA315"},
                        {"name":"product4","price":"\xA330"},
                    ];


button.addEventListener("click", function()
{
    createTable(tableObject);

    console.log("button pressed");
});

function createTable(arrayData) {
    var table = document.getElementById("receiptTable");
    //var temp = "createdTable";
    //table.id = temp;
    /*
    var tRow = `<tr>
                <td>Name</td>
                <td>Price</td>
                </tr>`;

    table.innerHTML += tRow; */

    var newBody = document.createElement("tbody");
    var tRow = new Array();
    var tempCount = 0;
    for (var property in tableObject){
        
        console.log(property);
        tRow.push(newBody.insertRow());
        var nameData = tRow[tRow.length-1].insertCell();
        var priceData = tRow[tRow.length-1].insertCell();
        var tempString = "Row";
        tRow[tRow.length-1].id = tempString.concat(tableCount);
        //console.log(tempString.concat(tableCount))

        nameData.appendChild(document.createTextNode(property.name));
        priceData.appendChild(document.createTextNode(property.price));

        var newButton = document.createElement("input");
        newButton.type = "button";
        newButton.id = "deleteRow".concat(tableCount);
        newButton.value = "Delete Row";
        newButton.arrayID = tempCount++;
        console.log(tRow);
        console.log(tRow[tRow.length-1].id);
        newButton.onclick = function() { deleteRow(newBody, tRow[this.arrayID].id) };
        var buttonSpace = tRow[tRow.length -1].insertCell();
        buttonSpace.appendChild(newButton);
        
        tableCount += 1;
    }
    
    table.appendChild(newBody);

    console.log("row and button made!");
    console.log(tableCount);
}



function deleteTable(tableBody, tableRow) {
    var parentTable = document.getElementById("tableHolder");

    parentTable.removeChild(tableBody); // This removechild for the row also removes the button, because the button is a child of the tablebody that is passed to the function
}

function deleteRow(tableBody, tableRow) {
    console.log(tableRow);
    var temp = document.getElementById(tableRow);
    //console.log(temp);
    tableBody.removeChild(temp);
    //temp.remove();
}
