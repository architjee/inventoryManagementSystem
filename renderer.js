// Fetching the 4 Data Tables from the API.
//#region
var cList = myAPI.storeGet('cList');
if (!cList) {
    // Should go here only 
    console.log("Is this the first execution, if not then we are screwed");
    myAPI.storeSet('cList', {});
    cList = {};
}
var cEntityIds = Object.keys(cList);
var stockInList = myAPI.storeGet('stockInList');
if (!stockInList) {
    console.log("Is this the first execution, if not then we are screwed");
    myAPI.storeSet('stockInList', {});
    // stockInList api structure.
    stockInList = {};
}


var stockOutList = myAPI.storeGet('stockOutList');
if (!stockOutList) {
    console.log("Is this the first execution, if not then we are screwed");
    myAPI.storeSet('stockOutList', {});
    stockOutList = {};
}

var balanceStockList = myAPI.storeGet('balanceStockList');
if (!balanceStockList) {
    console.log("Is this the first execution, if not then we are screwed");
    myAPI.storeSet('balanceStockList', {});
    balanceStockList = {};
}

var globalLotCount = myAPI.storeGet('globalLotCount');
if(!globalLotCount){
    globalLotCount = 1;
}
//#endregion


// Instantiating everything.

// Creating Data Table for Customer Addition List.
var customerTable = $('#customerTable').DataTable({
    "scrollY": "200px",
    "scrollCollapse": true,
    // "order": [[ 4, "desc" ]],
});
// Creating Data Table for Stock In Transaction Table.
var stockInTable = $('#stockInTable').DataTable({
    "scrollY": "150px",
    "scrollCollapse": true,
    "order": [[ 0, "desc" ]],
});
var stockOutTable = $('#stockOutTable').DataTable({
    "scrollY": "150px",
    "scrollCollapse": true,
    "order": [[ 0, "desc" ]],
});
var balanceStockTable = $('#balanceStockTable').DataTable({
    "scrollY": "150px",
    "scrollCollapse": true,
    "order": [[ 0, "desc" ]],
});
resetStockInTable();
$('.dataTables_length').addClass('bs-select');
// Populating the Customer table with BackEnd Data.
populateTableClist(cList, cEntityIds);

// Populating the Stock In Transaction Table with Stock IN Data.
populateTableStockIn(stockInList);
console.log("HELLOS")
// Populating the Customer List in Dropdown of Stock In Form.
populateClistForStockInForm(cList);

// Populating the Stock Out Transaction Table with Stock out Data.
populateTableStockOut(stockOutList);



// document.getElementById('stockInDate').value = new Date().toDateInputValue();
// Error Messaging Utility Tool.
function showErrorMessage(smallString) {
    document.getElementById('status').innerText = smallString;
    setTimeout(function () { document.getElementById('status').innerText = ''; }, 5000);
}
function stockInFun() {
    // Setting the invalidValueFlag as false.
    let invalidValueFlag = false;

    // Fetching all the elements from fields
    let stockInDate = document.getElementById("stockInDate").value;
    let stockInClientID = document.getElementById("stockInCList").value;
    let preservationType = document.getElementById("preservationType").value;
    let noOfBags = document.getElementById("noOfBags").value;
    let noOfBharti = document.getElementById("noOfBharti").value;
    let noOfQntl = document.getElementById("noOfQntl").value;
    let remarksStockIn = document.getElementById("remarksStockIn").value;
    if (!stockInDate || stockInClientID == "selectOne" || !preservationType || !noOfBags || !noOfBharti || !noOfQntl) {
        invalidValueFlag = true;

    }
    if (invalidValueFlag) {
        // Do nothing except showing error.
        showErrorMessage("Please fill all the details of StockIn form");
    } else {
        // We are gonna add this row to the stock In table as well as balance stock table.
        stockInEntityIDs = Object.keys(stockInList);
        var tempId = '_' + Math.random().toString(36).substr(2, 9);
        while (stockInEntityIDs.includes(tempId)) {
            tempId = '_' + Math.random().toString(36).substr(2, 9);
        }
        stockInList[tempId] = {
            'clientID': stockInClientID,
            'lotNo': ++globalLotCount,
            'stockInDate': stockInDate,
            'cName': cList[stockInClientID].cName,
            'pType': preservationType,
            'noOfBags': noOfBags,
            'noOfBharti': noOfBharti,
            'noOfQntl': noOfQntl,
            'remarksStockIn': remarksStockIn

        };
        myAPI.storeSet('globalLotCount', globalLotCount)
        myAPI.storeSet('stockInList', stockInList);
        addRowInStockInTable(stockInList[tempId]);

        // reset StockIn
        resetStockInTable();
    }
    console.log("invalidValueFlag", invalidValueFlag);
}






document.getElementById('reload').onclick = window.reload;
document.getElementById('addCustomer').onclick = addCustomerFun;

// console.log($);

// Creating functions mapped above.    
//#region
function addCustomerFun() {
    let cName = document.getElementById('customerName').value;
    let mobNo = document.getElementById('mobileNumber').value;
    if (cName.trim() && mobNo.trim().length == 10) {
        // We are good to go
        // Add the row in db also.
        var tempId = '_' + Math.random().toString(36).substr(2, 9);
        cEntityIds = Object.keys(cList);
        while (cEntityIds.includes(tempId)) {
            tempId = '_' + Math.random().toString(36).substr(2, 9);
        }
        cList[tempId] = { 'cName': cName, 'mobNo': mobNo };
        myAPI.storeSet('cList', cList);
        // Add the column in dataTable 
        document.getElementById('customerTableBody').innerHTML += `<tr><td>${cName}</td><td>${mobNo}</td></tr>`;
        document.getElementById('customerName').value = '';
        document.getElementById('mobileNumber').value = '';


    }
    else {
        showErrorMessage('Add a valid customerName and mobile number');
    }
}

// Should be called only once, while initialising.
function populateClistForStockInForm(cList) {
    cEntityIds = Object.keys(cList);
    document.getElementById('stockInCList').innerHTML = ``;
    document.getElementById('stockInCList').innerHTML += `<option value="selectOne">Select One</option>`;
    for (let i = 0; i < cEntityIds.length; i++) {
        console.log(cList[cEntityIds[i]]);
        document.getElementById('stockInCList').innerHTML += `<option value="${cEntityIds[i]}">${cList[cEntityIds[i]].cName}</option>`
    }
}
// Should be called only once, while initialising.
function populateTableClist(cList, cEntityIds) {

    for (i = 0; i < cEntityIds.length; i++) {
        console.log(cList[cEntityIds[i]])
        if (cList[cEntityIds[i]]) {
            customerTable.row.add([cList[cEntityIds[i]].cName, cList[cEntityIds[i]].mobNo, `X`]).draw(false);
        }

    }

}
function populateTableStockIn(stockInList) {
    console.log(stockInList);
    stockInEntityIDs = Object.keys(stockInList);
    for (i = 0; i < stockInEntityIDs.length; i++) {
        console.log(stockInList[stockInEntityIDs[i]])
        if (stockInList[stockInEntityIDs[i]]) {
            stockInTable.row.add([ stockInList[stockInEntityIDs[i]].lotNo,stockInList[stockInEntityIDs[i]].stockInDate, stockInList[stockInEntityIDs[i]].cName, stockInList[stockInEntityIDs[i]].pType, stockInList[stockInEntityIDs[i]].noOfBags, stockInList[stockInEntityIDs[i]].noOfBharti, stockInList[stockInEntityIDs[i]].noOfQntl, stockInList[stockInEntityIDs[i]].remarksStockIn ]).draw(false);
        }

    }

}
function populateTableStockOut(stockOutList) {
    console.log(stockOutList);
    stockOutEntityIDs = Object.keys(stockOutList);
    for (i = 0; i < stockOutEntityIDs.length; i++) {
        console.log(stockOutList[stockOutEntityIDs[i]])
        if (stockOutList[stockOutEntityIDs[i]]) {
            stockOutTable.row.add([ stockOutList[stockOutEntityIDs[i]].lotNo,stockOutList[stockOutEntityIDs[i]].stockInDate, stockOutList[stockOutEntityIDs[i]].cName, stockOutList[stockOutEntityIDs[i]].pType, stockOutList[stockOutEntityIDs[i]].noOfBags, stockOutList[stockOutEntityIDs[i]].noOfBharti, stockOutList[stockOutEntityIDs[i]].noOfQntl, stockOutList[stockOutEntityIDs[i]].remarksStockIn ]).draw(false);
        }

    }
}
function addRowInStockInTable(row){
    stockInTable.row.add([row.lotNo,row.stockInDate, row.cName, row.pType, row.noOfBags, row.noOfBharti, row.noOfQntl, row.remarksStockIn]).draw();
}
function resetStockInTable(){
    document.getElementById('stockInForm').innerHTML = `<tr>
    <td colspan="2" class="tac">
      <h3>Stock In Account</h3>

    </td>
  </tr>
  <!-- <tr>
    <td> Lot No:

    </td>
    <td>
      <input type="number" name="Hello" id="lotno"><br>

    </td>
  </tr> -->
  <tr>
    <td>
      Date :
    </td>
    <td>
      <input type="date" name="stockInDate" id="stockInDate">
    </td>
  </tr>
  <tr>
    <td>
      Client Name:
    </td>
    <td>
      <select name="stockInCList" id="stockInCList"></select>
      
    </td>
  </tr>

  <tr>
    <td>
      Preservation Type:
    </td>
    <td>
      <input type="list" id="preservationType">
    </td>
  </tr>

  <tr>
    <td>
      Bags:
    </td>
    <td>
      <input type="number" name="noOfBags" id="noOfBags">
    </td>
  </tr>


  <tr>
    <td>
      Bharti:
    </td>
    <td>
      <input type="number" name="noOfBharti" id="noOfBharti">
    </td>
  </tr>


  <tr>
    <td>
      Qntl:
    </td>
    <td>
      <input type="number" name="noOfQntl" id="noOfQntl" value="0.0">
    </td>
  </tr>

  <tr>
    <td>
      Remarks:
    </td>
    <td>
      <input name="remarksStockIn" id="remarksStockIn" value="">
    </td>
  </tr>
`;

}
//#endregion
//

// Attaching functionality to the buttons.
document.getElementById("stockIn").onclick = stockInFun;