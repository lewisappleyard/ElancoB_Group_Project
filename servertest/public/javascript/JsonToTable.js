var xhttp = new XMLHttpRequest();
var response;
const tableBtnText = document.getElementById("tableBtnText")
//var tRow = new Array();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log("THIS LINE");
        console.log(xhttp.responseText);
        tableObject = JSON.parse(xhttp.responseText);
    }
}
xhttp.open("GET", "APIreturn.json", true);
xhttp.send();
const button = document.getElementById("table-button");

var tableCount = 0;

var tableObject =   { "product" : [
                        {"name":"product1","price":"\xA320"}, // \xA3 is the literal string symbol for "£", where just writing the pound symbol wont work
                        {"name":"product2","price":"\xA325"},
                        {"name":"product3","price":"\xA315"},
                        {"name":"product4","price":"\xA330"},
                    ]};


button.addEventListener("click", function()
{
    tableBtnText.style.display = "none";
    createTable(tableObject);

    console.log("button pressed");
});

function createTable(arrayData) {
    console.log(arrayData);
    console.log("SPLIT HERE");
    console.log(arrayData[0].fields.Items.value); // This is the name of one receipt item so this array needs looping

    var itemValues = arrayData[0].fields.Items.value; // use itemValues[0].value.Name.value for product names, use itemValues[0].value.TotalPrice.valueData.text
    var recieptDate = arrayData[0].fields.TransactionDate.valueData.text;
    

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
    for (var property in itemValues){
        
        console.log(property);
        console.log("CHECK HERE");
        tRow.push(newBody.insertRow());
        var nameData = tRow[tRow.length-1].insertCell();
        var priceData = tRow[tRow.length-1].insertCell();
        var itemDate = tRow[tRow.length-1].insertCell();
        var tempString = "Row";
        tRow[tRow.length-1].id = tempString.concat(tableCount);
        //console.log(tempString.concat(tableCount))

        var nameInput = nameData.appendChild(document.createElement("input"));
        nameInput.value = itemValues[property].value.Name.value; //arrayData.product[property].name;
        var priceInput = priceData.appendChild(document.createElement("input"));
        priceInput.value = itemValues[property].value.TotalPrice.valueData.text; //arrayData.product[property].price;
        var dateInput = itemDate.appendChild(document.createElement("input"));
        dateInput.value = recieptDate;

        

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
