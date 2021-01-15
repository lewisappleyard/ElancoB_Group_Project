var xhttp = new XMLHttpRequest();
var response;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
    }
}
xhttp.open("GET", "ExampleJson.json", true);
xhttp.send();

const button = document.getElementById("tablebutton");

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
    table.style.width = '75%';
    table.style.border = '1px solid black';
    table.setAttribute('border', '1');
    /*
    var tRow = `<tr>
                <td>Name</td>
                <td>Price</td>
                </tr>`;

    table.innerHTML += tRow; */

    var newBody = document.createElement("tbody");

    for (var property in tableObject){
        console.log(property);
        var tRow = newBody.insertRow();
        var nameData = tRow.insertCell();
        var priceData = tRow.insertCell();

        nameData.appendChild(document.createElement("input"));
        priceData.appendChild(document.createElement("input"));

        var newButton = document.createElement("input");
        newButton.type = "button";
        newButton.id = "deleteRow";
        newButton.value = "Delete Row";
        newButton.onclick = function() { deleteRow(newBody, tRow) };

        var buttonSpace = tRow.insertCell();
        buttonSpace.appendChild(newButton);
    }

    /*
    // needs to be eventually a for each loop
    for (var i = 0; i < 4; i++)
    {
        var tRow = newBody.insertRow();
        var nameData = tRow.insertCell();
        var priceData = tRow.insertCell();

        nameData.appendChild(document.createTextNode(tableObject[i].name));
        priceData.appendChild(document.createTextNode(tableObject[i].price));

        var newButton = document.createElement("input");
        newButton.type = "button";
        var temp = "deleteButton";
        newButton.id = temp.concat(tableCount); // Possibly not used anymore
        newButton.value = "Delete Row";
        newButton.onclick = function() { deleteRow(newBody, tRow) };
        
        var temp = tRow.insertCell();
        temp.appendChild(newButton);

        

        /*
        var tRow = `<tr>
                    <td>${tableObject[i].name}</td>
                    <td>${tableObject[i].price}</td>
                    </tr>`;

        newBody.innerHTML += tRow;
        */


        /* THE BELOW IS OLD AND LEFT FOR REFERENCE, CAN BE REMOVED IF WANTED
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
            }
        }
    }
    */

    table.appendChild(newBody);

    tableCount += 1;
    console.log("row and button made!");
    console.log(tableCount);
}



function deleteTable(tableBody, tableRow) {
    var parentTable = document.getElementById("tableHolder");

    parentTable.removeChild(tableBody); // This removechild for the row also removes the button, because the button is a child of the tablebody that is passed to the function
}

function deleteRow(tableBody, tableRow) {
    tableBody.removeChild(tableRow);
    //tableRow.remove();
    //tableBody.remove();
}
