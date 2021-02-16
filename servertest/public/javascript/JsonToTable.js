/*
    TODO list for this section:
            Make sure the http request is to the returned JSON, not the temporary placeholder JSON
            Make sure to verify the format of the JSON that is returned before processing, and make sure to inform the user of an error if one occurs
            The save table function needs to validate any user inputs so that they are in the correct format to save, and if not then alert them
            Create table function may need reformatting, so that it can handle more JSON structures or possibly handle them dynamically, but the current layout and "flow" of the function works well
            The promptSave function currently asks the user to save a JSON file, which is useless to the customer, needs the format changing to something more accesible like a PDF,
            The best goal output of the promptSave function would be some form of PDF rebate form, with valid areas already filled out with the data

            For the full project, need to connect
*/

var xhttp = new XMLHttpRequest();
var response;
const tableBtnText = document.getElementById("tableBtnText")

var tRow = new Array();

// xhttp.onreadystatechange = function() {
    // if (this.readyState == 4 && this.status == 200) {
        // // console.log(xhttp.responseText);
        // tableObject = JSON.parse(xhttp.responseText);
    // }
// }
// xhttp.open("GET", "APIreturn.json", true);
// xhttp.send();

const button = document.getElementById("table-button");
const fileInp = document.getElementById("inpFile");
const saveBtn = document.getElementById("save-button");

var rowCount = 0;

// LEAVE THIS HERE FOR NOW CAN BE USED LATER!
var tableObject =   { "product" : [
                        {"name":"product1","price":"\xA320"}, // \xA3 is the literal string symbol for "£", where just writing the pound symbol wont work
                        {"name":"product2","price":"\xA325"},
                        {"name":"product3","price":"\xA315"},
                        {"name":"product4","price":"\xA330"},
                    ]};



$("#table-button").on('click',(function(e) {
    e.preventDefault();
	tableBtnText.style.display = "none";
	frm = new FormData();
	frm.append('img', fileInp.files[0]);
    $.ajax({
        url: "http://20.77.56.87/api/ocr",
        type: "POST",
        data: frm,
        contentType: false,
        cache: false,
        processData: false,
        beforeSend : function() {
        },
        success: function(data) {
            createTable(data);
        },
        error: function(e) {
            alert(e);
        }                    
    });
}));


saveBtn.addEventListener("click", function() {
    console.log("Save pressed")

    var temp = saveTable();
    promptDownload(temp);
});



// This function will eventually do some checks on the returned JSON file so that it is in the correct formatting
function checkReturned(arrayData) {
    
}

// This is where the table is saved, will work for now but needs possible data verification to validate values, example being the date and price being in the correct format, etc.
function saveTable() {
    var q = "\""; // q is used as a quick var name to get a quote mark for formatting the following csv file
    var newSave = q+"Product Name"+q+","+q+"Product Price"+q+","+q+"Product Date"+q+",\n";
    

    for (row in tRow) {
        if (tRow[row].id != "DELETED") {
            var prodName = document.getElementById("name".concat(row)).value;
            var prodPrice = document.getElementById("price".concat(row)).value;
            var prodDate = document.getElementById("date".concat(row)).value;
            //newSave.Customer.push({ "name" : prodName, "price" : prodPrice, "date" : prodDate }); // OLD JSON FILE FORMATTING, IGNORE/REMOVE
            newSave = newSave.concat(q,prodName,q,",",q,prodPrice,q,",",q,prodDate,q,",\n");
        }
    }
    //var stringSave = JSON.stringify(newSave); // OLD JSON FORMATTING, IGNORE/REMOVE

    console.log(newSave);
    return newSave;
}

// Prompts the user to download the JSON file in a text format, this is temporary and will need to be changed to a better file format
function promptDownload(saveJSONString) {
    var filename = "saveTest.csv";

    var element = document.createElement("a");
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveJSONString));
    element.setAttribute("download", filename);

    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

var test = {}

function createTable(arrayData) {
    /* These logs were used for testing, left in case more testing is needed
    console.log(arrayData);
    console.log("SPLIT HERE");
    console.log(arrayData[0].fields.Items.value); // This is the name of one receipt item so this array needs looping
    */

    var itemValues = arrayData["items"]; // use .value.Name.value for product names, use .value.TotalPrice.valueData.text
    var recieptDate = arrayData["date"];
    test = itemValues;
    var table = document.getElementById("receiptTable");

    var newBody = document.createElement("tbody");

    for (var i = 0; i < itemValues.length; i++) {
        // Below creates a new row within the table body, with a cell for each data type, and stores it in the global array of rows as well as give it a unique ID from the global row count
        tRow.push(newBody.insertRow());
        var nameData = tRow[tRow.length-1].insertCell();
        var priceData = tRow[tRow.length-1].insertCell();
        var itemDate = tRow[tRow.length-1].insertCell();
        tRow[tRow.length-1].id = "row".concat(rowCount);

        // Below populates the new cells of the row with data returned, currently very restricted and not flexible based on returned JSON format, possible improvement can be made here
        var nameInput = nameData.appendChild(document.createElement("input"));
        nameInput.value = itemValues[i]["name"];
        nameInput.id = "name".concat(rowCount);
        var priceInput = priceData.appendChild(document.createElement("input"));
        priceInput.value = itemValues[i]["price"];
        priceInput.id = "price".concat(rowCount);
        var dateInput = itemDate.appendChild(document.createElement("input"));
        dateInput.value = recieptDate;
        dateInput.id = "date".concat(rowCount);

        // Below creates a new button for the row, that will delete the row when pressed,
        // meaning the user is free to update and change the table once an API call has been returned and the table produced
        var newButton = document.createElement("input");
        newButton.type = "button";
        newButton.id = "deleteRow".concat(rowCount);
        newButton.value = "Delete block";
        newButton.arrayID = rowCount;
        console.log(tRow);
        console.log(tRow[tRow.length-1].id);
        newButton.onclick = function() { deleteRow(newBody, tRow[this.arrayID].id, this.id) };
        var buttonSpace = tRow[tRow.length -1].insertCell();
        buttonSpace.appendChild(newButton);
        
        // increment row count, as a way to keep track of all of the rows that exist currently within the table
        rowCount += 1;
    }
    
    table.appendChild(newBody);

    console.log("row and button made!");
    console.log(rowCount);
}

function deleteRow(tableBody, tableRow, rowID) {
    console.log(tableRow, rowID);

    // First, remove the row that needs to be deleted from the webpage
    tableBody.removeChild(document.getElementById(tableRow));

    // Then, make sure the row is marked as deleted in the row array, so it isn't saved when the user wishes to save their table data
    var temp = rowID.replace("deleteRow", "");
    tRow[temp].id = "DELETED";
}
