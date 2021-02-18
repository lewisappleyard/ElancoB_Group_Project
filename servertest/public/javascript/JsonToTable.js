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

const button = document.getElementById("table-button");
const fileInp = document.getElementById("inpFile");
const saveBtn = document.getElementById("save-button");
const loadingSwirl = document.getElementById("loadingSwirl")
const addRowBtn = document.getElementById("addrow-button");
const manualButton = document.getElementById("manualButton");
const tableBtnText = document.getElementById("tableBtnText")
const saveAndSubmitBtn = document.getElementById('saveSection');
const userOptionDiv = document.getElementById("userOptionDiv");
const submitRebate = document.getElementById("rebateSubmition");
var tRow = new Array();

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
    //delete previous table
    document.getElementById('receiptTable').innerHTML = "";

    loadingSwirl.style.display = "block";
    saveAndSubmitBtn.style.display = "none";
    tableBtnText.style.display = "none";
    addRowBtn.style.display = "none"
	frm = new FormData();
	frm.append('img', fileInp.files[0]);
    $.ajax({
        url: "/api/ocrraw",
        type: "POST",
        data: frm,
        contentType: false,

        cache: false,
        processData: false,
        beforeSend : function() {
        },
        success: function(data) {
            tableBtnText.style.display = "none";
            loadingSwirl.style.display = "none";
            saveAndSubmitBtn.style.display = "flex";
            manualButton.style.display = "none";
            userOptionDiv.style.display = "flex";
            createTable(data);
        },
        error: function(e) {
            loadingSwirl.style.display = "none";
            alert("upload failed, please try again");
        }                    
    });
}));



saveBtn.addEventListener("click", function() {
    console.log("Save pressed")

    var temp = saveTable();
    promptDownload(temp);
});

submitRebate.addEventListener("click", function(){//submit rebate button
    var userOptionSelect = document.getElementById("userOptionSelect");
    if(userOptionSelect.value != ""){
        var tableVariables = {
            "user": "",
            "items": [{}]
        };

        tableVariables.user = userOptionSelect.value;

        for (row in tRow) {
            if (tRow[row].id != "DELETED") {
                var prodName = document.getElementById("name".concat(row)).value;
                var prodPrice = document.getElementById("price".concat(row)).value;
                var prodDate = document.getElementById("date".concat(row)).value;
                console.log(row);
                tableVariables.items[row] = {"name":prodName, "date":prodDate, "price":prodPrice};
                console.log(tableVariables);
            }
        }
        //save table as a whole pass into node function
        frm = new FormData();
	    frm.append('table', tableVariables);    

        $.ajax({
            url: "/savelist",
            type: "POST",
            data: frm,
            contentType: false,
            cache: false,
            processData: false,

            beforeSend : function() {
            },
            success: function(data) {
                //console.log(data);
                if("error" in data && data.error == true){
                    alert("Rebate failed to submit please try again");
                }else{
                    alert("Rebate has been successfully submitted");
                }
            },
            error: function(e) {
                alert("Rebate failed to submit please try again (error in calling)");
            }     

        })
        
    }else{
        alert("please select a user to save");
    }
});

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
            newSave = newSave.concat(q,prodName,q,",",q,prodPrice,q,",",q,prodDate,q,"\n");
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

function createTable(data) {
    console.log(data);
    var table = document.getElementById("receiptTable");

    var newBody = document.createElement("tbody");

    receipt = data["analyzeResult"]["documentResults"][0]["fields"];
    receiptDate = "TransactionDate" in receipt ? receipt["TransactionDate"]["text"] : "";
	
    items = "Items" in receipt ? receipt["Items"]["valueArray"] : [];
	
    // Before adding the items, add a header to the table to name the columns
    addTableHeader(newBody);
	
    tableBtnText.style.display = "block";

	if (items.length == 0) {
        tableBtnText.innerHTML = "couldn't find any products, please enter manually";
        //addRow(); This has been moved further down into the same if statement, it needs to be this way for the table ordering to be correct
    }
    else{
        tableBtnText.innerHTML = "please enter any missing items/fields";
    }

    for (var i = 0; i < items.length; i++) {
	    itm = items[i]["valueObject"];
		
	    itmName = "Name" in itm ? itm["Name"]["text"] : "";
	    itmPrice = "TotalPrice" in itm ? itm["TotalPrice"]["valueNumber"] : "";
		
        // Below creates a new row within the table body, with a cell for each data type, and stores it in the global array of rows as well as give it a unique ID from the global row count
        tRow.push(newBody.insertRow());
        var nameData = tRow[tRow.length-1].insertCell();
        var priceData = tRow[tRow.length-1].insertCell();
        var itemDate = tRow[tRow.length-1].insertCell();
        nameData.class = "tdItemsClass";
        priceData.class = "tdItemsClass";
        itemDate.class = "tdItemsClass";

        tRow[tRow.length-1].id = "row".concat(rowCount);

        // Below populates the new cells of the row with data returned, currently very restricted and not flexible based on returned JSON format, possible improvement can be made here
        var nameInput = nameData.appendChild(document.createElement("input"));
        nameInput.value = itmName;
        nameInput.id = "name".concat(rowCount);
        var priceInput = priceData.appendChild(document.createElement("input"));
        priceInput.value = itmPrice;
        priceInput.id = "price".concat(rowCount);
        var dateInput = itemDate.appendChild(document.createElement("input"));
        dateInput.value = receiptDate;
        dateInput.id = "date".concat(rowCount);

        // Below creates a new button for the row, that will delete the row when pressed,
        // meaning the user is free to update and change the table once an API call has been returned and the table produced
        var newButton = document.createElement("input");
        newButton.type = "button";
        newButton.id = "deleteRow".concat(rowCount);
        newButton.value = "Delete";
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

    if (items.length == 0) {
        addRow();
    }

    console.log("row and button made!");
    console.log(rowCount);
    addRowBtn.style.display = "block";
}

manualButton.addEventListener("click", function(){
    //create table
    saveAndSubmitBtn.style.display = "flex";
    addRowBtn.style.display="block";
    manualButton.style.display="none";
    addRow();
});

function deleteRow(tableBody, tableRow, rowID) {
    console.log(tableRow, rowID);

    // First, remove the row that needs to be deleted from the webpage
    tableBody.removeChild(document.getElementById(tableRow));

    // Then, make sure the row is marked as deleted in the row array, so it isn't saved when the user wishes to save their table data
    var temp = rowID.replace("deleteRow", "");
    tRow[temp].id = "DELETED";
}





// NEW FOR ADDDING ROWS



addRowBtn.addEventListener("click", function() {
    console.log('add row pressed');

    addRow();
})

function addRow() {
    var table = document.getElementById("receiptTable");
    var newBody = document.createElement("tbody");

    tRow.push(newBody.insertRow());
    
    var nameData = tRow[tRow.length-1].insertCell();
    var priceData = tRow[tRow.length-1].insertCell();
    var itemDate = tRow[tRow.length-1].insertCell();
    nameData.class = "tdItemsClass";
    priceData.class = "tdItemsClass";
    itemDate.class = "tdItemsClass";

    tRow[tRow.length-1].id = "row".concat(rowCount);

    var nameInput = nameData.appendChild(document.createElement("input"));
    nameInput.id = "name".concat(rowCount);
    var priceInput = priceData.appendChild(document.createElement("input"));
    priceInput.id = "price".concat(rowCount);
    var dateInput = itemDate.appendChild(document.createElement("input"));
    dateInput.id = "date".concat(rowCount);

    // Create the delete row button
    var newButton = document.createElement("input");
    newButton.type = "button";
    newButton.id = "deleteRow".concat(rowCount);
    newButton.value = "Delete";
    newButton.arrayID = rowCount;
    console.log(tRow);
    console.log(tRow[tRow.length-1].id);
    newButton.onclick = function() { deleteRow(newBody, tRow[this.arrayID].id, this.id) };
    var buttonSpace = tRow[tRow.length -1].insertCell();
    buttonSpace.appendChild(newButton);

    rowCount += 1;
    table.appendChild(newBody);
}


function addTableHeader(newBody) {
    var headerRow = newBody.insertRow()
    headerRow.id = "headerId";
    //console.log(headerRow.id);

    var itemHeader = document.createElement("th");
    itemHeader.appendChild(document.createTextNode("Product"));

    var priceHeader = document.createElement("th");
    priceHeader.appendChild(document.createTextNode("Price"));

    var dateHeader = document.createElement("th");
    dateHeader.appendChild(document.createTextNode("Date"));

    var deleteHeader = document.createElement("th");
    deleteHeader.appendChild(document.createTextNode(" "));

    headerRow.appendChild(itemHeader);
    headerRow.appendChild(priceHeader);
    headerRow.appendChild(dateHeader);
    headerRow.appendChild(deleteHeader);
}