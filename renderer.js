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
if (!globalLotCount) {
  globalLotCount = 1;
}
//#endregion


// Instantiating everything.

// Creating Data Table for Customer Addition List.
var customerTable = $('#customerTable').DataTable({

  "scrollY": "150px",
  "scrollCollapse": true,

});
// Creating Data Table for Stock In Transaction Table.
var stockInTable = $('#stockInTable').DataTable({

  "scrollY": "150px",
  "scrollCollapse": true,
  "order": [[0, "desc"]],
});
var stockOutTable = $('#stockOutTable').DataTable({
  "scrollY": "150px",
  "scrollCollapse": true,
  "order": [[0, "desc"]],
});
var balanceStockTable = $('#balanceStockTable').DataTable({
  "scrollY": "150px",
  "scrollCollapse": true,
  "order": [[0, "desc"]],
});
resetStockInTable();
resetStockOutForm();
$('.dataTables_length').addClass('bs-select');
// Populating the Customer table with BackEnd Data.
populateTableClist(cList, cEntityIds);

// Populating the Stock In Transaction Table with Stock IN Data.
populateTableStockIn(stockInList);
// console.log("HELLOS")
// Populating the Customer List in Dropdown of Stock In Form.
populateClistForStockInForm(cList);

// Populating the Lot no. of Stock Out Form.
populateLotNoStockOutForm(balanceStockList);
// Populating the Stock Out Transaction Table with Stock out Data.
populateTableStockOut(stockOutList);

// Populating the Stock Out Transaction Table with Stock out Data.
populateTableBalnceStock(balanceStockList);


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
    copyOfTheObject = stockInList[tempId];
    myAPI.storeSet('globalLotCount', globalLotCount)
    myAPI.storeSet('stockInList', stockInList);
    addRowInStockInTable(stockInList[tempId]);

    // We are also gonna add this row in balance stock table.
    // We are gonna add this row to the stock In table as well as balance stock table.
    balanceStockEntityIDs = Object.keys(balanceStockList);
    var tempId = '_' + Math.random().toString(36).substr(2, 9);
    while (balanceStockEntityIDs.includes(tempId)) {
      tempId = '_' + Math.random().toString(36).substr(2, 9);
    }
    balanceStockList[tempId] = copyOfTheObject;
    addRowInBalanceStockTable(copyOfTheObject)
    myAPI.storeSet('balanceStockList', balanceStockList);
    populateLotNoStockOutForm(balanceStockList);
    // console.log(balanceStockList);
    // reset StockIn
    resetStockInTable();
  }
  //console.log("invalidValueFlag", invalidValueFlag);
}





document.getElementById('addCustomer').onclick = addCustomerFun;

// console.log($);

// Creating functions mapped above.    
//#region
function populateTableBalnceStock(balanceStockList) {
  //console.log(balanceStockList);
  balanceStockEntityIDs = Object.keys(balanceStockList);
  for (i = 0; i < balanceStockEntityIDs.length; i++) {
    //console.log(balanceStockList[balanceStockEntityIDs[i]])
    if (balanceStockList[balanceStockEntityIDs[i]]) {
      balanceStockTable.row.add([balanceStockList[balanceStockEntityIDs[i]].lotNo, balanceStockList[balanceStockEntityIDs[i]].stockInDate, balanceStockList[balanceStockEntityIDs[i]].cName, balanceStockList[balanceStockEntityIDs[i]].pType, balanceStockList[balanceStockEntityIDs[i]].noOfBags, balanceStockList[balanceStockEntityIDs[i]].noOfBharti, balanceStockList[balanceStockEntityIDs[i]].noOfQntl, balanceStockList[balanceStockEntityIDs[i]].remarksStockIn]).draw(false);
    }

  }

}
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

    populateClistForStockInForm(cList);
  }
  else {
    showErrorMessage('Add a valid customerName and mobile number');
  }
}

// Should be called everytime .
function populateClistForStockInForm(cList) {
  cEntityIds = Object.keys(cList);
  document.getElementById('stockInCList').innerHTML = ``;
  document.getElementById('stockInCList').innerHTML += `<option value="selectOne">Select One</option>`;
  for (let i = 0; i < cEntityIds.length; i++) {
    // console.log(cList[cEntityIds[i]]);
    document.getElementById('stockInCList').innerHTML += `<option value="${cEntityIds[i]}">${cList[cEntityIds[i]].cName}</option>`
    // console.log("Setting the value of this option to be" + cEntityIds[i]);
  }
}

// Should be called everytime.
function populateLotNoStockOutForm(balanceStockList) {
  balanceStockEntityIDs = Object.keys(balanceStockList);
  document.getElementById('stockOutLotNo').innerHTML = ``;
  document.getElementById('stockOutLotNo').innerHTML += `<option value="selectOne">Select One</option>`;
  for (let i = 0; i < balanceStockEntityIDs.length; i++) {
    // console.log(balanceStockList[balanceStockEntityIDs[i]]);
    document.getElementById('stockOutLotNo').innerHTML += `<option value="${balanceStockEntityIDs[i]}">${balanceStockList[balanceStockEntityIDs[i]].lotNo}</option>`
  }
}

// Should be called only once, while initialising.
function populateTableClist(cList, cEntityIds) {

  for (i = 0; i < cEntityIds.length; i++) {
    // console.log(cList[cEntityIds[i]])
    if (cList[cEntityIds[i]]) {
      customerTable.row.add([cList[cEntityIds[i]].cName, cList[cEntityIds[i]].mobNo, `X`]).draw(false);
    }

  }

}
function populateTableStockIn(stockInList) {
  // console.log(stockInList);
  stockInEntityIDs = Object.keys(stockInList);
  for (i = 0; i < stockInEntityIDs.length; i++) {
    // console.log(stockInList[stockInEntityIDs[i]])
    if (stockInList[stockInEntityIDs[i]]) {
      stockInTable.row.add([stockInList[stockInEntityIDs[i]].lotNo, stockInList[stockInEntityIDs[i]].stockInDate, stockInList[stockInEntityIDs[i]].cName, stockInList[stockInEntityIDs[i]].pType, stockInList[stockInEntityIDs[i]].noOfBags, stockInList[stockInEntityIDs[i]].noOfBharti, stockInList[stockInEntityIDs[i]].noOfQntl, stockInList[stockInEntityIDs[i]].remarksStockIn]).draw(false);
    }

  }

}
function populateTableStockOut(stockOutList) {
  // console.log(stockOutList);
  stockOutEntityIDs = Object.keys(stockOutList);
  for (i = 0; i < stockOutEntityIDs.length; i++) {
    // console.log(stockOutList[stockOutEntityIDs[i]])
    if (stockOutList[stockOutEntityIDs[i]]) {
      stockOutTable.row.add([stockOutList[stockOutEntityIDs[i]].lotNo, stockOutList[stockOutEntityIDs[i]].stockInDate, stockOutList[stockOutEntityIDs[i]].stockOutDate, stockOutList[stockOutEntityIDs[i]].cName, stockOutList[stockOutEntityIDs[i]].pType, stockOutList[stockOutEntityIDs[i]].noOfBags, stockOutList[stockOutEntityIDs[i]].noOfBharti, stockOutList[stockOutEntityIDs[i]].noOfQntl, stockOutList[stockOutEntityIDs[i]].remarksStockIn]).draw(false);
    }

  }
}
function populateDataInStockOutForm(eventFired) {
  // console.log("hello")
  // console.log(eventFired.value);
  let thisObject = balanceStockList[eventFired.value];
  // console.log("ThisObject", thisObject);
  let clientId = thisObject.clientID;
  let cName = thisObject.cName;
  let lotNo = thisObject.lotNo;
  let noOfBags = thisObject.noOfBags;
  let noOfBharti = thisObject.noOfBharti;
  let noOfQntl = thisObject.noOfQntl;
  let pType = thisObject.pType;
  let remarksStockIn = thisObject.remarksStockIn;
  let stockInDate = thisObject.stockInDate;

  document.getElementById('stockOutDate').value = stockInDate;
  document.getElementById('clientListStockOut').value = cName;
  document.getElementById('preservationTypeStockOut').value = pType;
  // Setting values and max values
  document.getElementById('noOfBagsStockOut').value = noOfBags;
  document.getElementById('noOfBagsStockOut').setAttribute("max", noOfBags);
  document.getElementById('noOfBhartiStockOut').value = noOfBharti;
  document.getElementById('noOfBhartiStockOut').setAttribute("max", noOfBharti);
  document.getElementById('noOfQntlStockOut').value = noOfQntl;
  document.getElementById('noOfQntlStockOut').setAttribute("max", noOfQntl);
  document.getElementById('remarksStockOut').value = remarksStockIn;




}



function stockOutFunction() {
  let balanceStockId = document.getElementById('stockOutLotNo').value;
  thisObject = balanceStockList[balanceStockId];
  backUpCopyOfObject = JSON.parse(JSON.stringify(thisObject));
  let noOfBags = document.getElementById('noOfBagsStockOut').value;
  let noOfBharti = document.getElementById('noOfBhartiStockOut').value;
  let noOfQntl = document.getElementById('noOfQntlStockOut').value;
  let remarksStockOut = document.getElementById("remarksStockOut").value;
  // Create a stock out transaction.


  //
  // Setting the invalidValueFlag as false.
  let invalidValueFlag = false;

  // Fetching all the elements from fields
  let stockInDate = thisObject.stockInDate;
  let stockOutClientID = thisObject.clientID;
  let preservationType = thisObject.pType;

  if (!stockInDate || stockOutClientID == "selectOne" || !preservationType || !noOfBags || !noOfBharti || !noOfQntl) {
    invalidValueFlag = true;

  }
  if (invalidValueFlag) {
    // Do nothing except showing error.
    showErrorMessage("Invalid selection of Stock Out Form");
  } else {
    // We are gonna add this row to the stock out table as well as balance stock table.
    var tempId = '_' + Math.random().toString(36).substr(2, 9);
    stockOutEntityIDs = Object.keys(stockOutList);
    while (stockOutEntityIDs.includes(tempId)) {
      tempId = '_' + Math.random().toString(36).substr(2, 9);
    }
    thisObject.stockOutDate = Date.now();
    thisObject.noOfBags = noOfBags;
    thisObject.noOfBharti = noOfBharti;
    thisObject.noOfQntl = noOfQntl;
    thisObject.balanceStockId = balanceStockId;
    thisObject.remarksStockOut = remarksStockOut;
    console.log(thisObject);
    stockOutList[tempId] = thisObject;
    addRowInStockOutTable(thisObject);
    myAPI.storeSet('stockOutList', stockOutList);

    if (noOfBags == backUpCopyOfObject.noOfBags && noOfBharti == backUpCopyOfObject.noOfBharti && noOfQntl == backUpCopyOfObject.noOfQntl) {
      // Completely remove this transaction
      delete balanceStockList[balanceStockId];
      myAPI.storeSet('balanceStockList', balanceStockList);
      console.log(noOfBags)

    } else {
      backUpCopyOfObject.noOfBags -= thisObject.noOfBags;
      backUpCopyOfObject.noOfBharti -= thisObject.noOfBharti;
      backUpCopyOfObject.noOfQntl -= thisObject.noOfQntl;
      backUpCopyOfObject.remarksStockIn += "SOUT@" + Date.now();
      balanceStockList[balanceStockId] = backUpCopyOfObject
      console.log("Safe");
    }
    // We are also gonna add this row in balance stock table.
    // We are gonna add this row to the stock In table as well as balance stock table.

    // addRowInBalanceStockTable(copyOfTheObject)
    // myAPI.storeSet('balanceStockList', balanceStockList);
    // populateLotNoStockOutForm(balanceStockList);
    console.log(balanceStockList);
    // reset StockOut
    balanceStockTable.clear();
    balanceStockTable.draw();
    populateTableBalnceStock(balanceStockList);

    resetStockOutForm();
    populateLotNoStockOutForm(balanceStockList);
  }
  //console.log("invalidValueFlag", invalidValueFlag);
  //








}
function addRowInStockOutTable(row) {
  stockOutTable.row.add([row.lotNo, row.stockInDate, row.stockOutDate, row.cName, row.pType, row.noOfBags, row.noOfBharti, row.noOfQntl, row.remarksStockOut]).draw();
}
function addRowInStockInTable(row) {
  stockInTable.row.add([row.lotNo, row.stockInDate, row.cName, row.pType, row.noOfBags, row.noOfBharti, row.noOfQntl, row.remarksStockIn]).draw();
}
function addRowInBalanceStockTable(row) {
  balanceStockTable.row.add([row.lotNo, row.stockInDate, row.cName, row.pType, row.noOfBags, row.noOfBharti, row.noOfQntl, row.remarksStockIn]).draw();

}
function resetStockOutForm() {
  document.getElementById('stockOutForm').innerHTML = `  <tr>
  <td colspan="2" class="tac">
    <h3>Stock Out Account</h3>
  </td>
</tr>
<tr>
  <td>
    Lot No. Selection
  </td>

<td>
     <select name="stockOutLotNo" id="stockOutLotNo" onchange ="populateDataInStockOutForm(this)"></select>
    <br>
</td>
</tr>
<tr>
  <td>
    Stock In Date :
  </td>
  <td>
    <input type="date" name="stockOutDate" id="stockOutDate">
  </td>
</tr>
<tr>
  <td>
    Client Name:
  </td>
  <td>
    <input type="list" id="clientListStockOut">
  </td>
</tr>

<tr>
  <td>
    Preservation Type:
  </td>
  <td>
    <input type="list" id="preservationTypeStockOut" >
  </td>
</tr>

<tr>
  <td>
    Bags:
  </td>
  <td>
    <input type="number" name="noOfBagsStockOut" id="noOfBagsStockOut"  >
  </td>
</tr>


<tr>
  <td>
    Bharti:
  </td>
  <td>
    <input type="number" name="noOfBhartiStockOut" id="noOfBhartiStockOut" >
  </td>
</tr>


<tr>
  <td>
    Qntl:
  </td>
  <td>
    <input type="number" name="noOfQntlStockOut" id="noOfQntlStockOut">
  </td>
</tr>

<tr>
  <td>
    Remarks:
  </td>
  <td>
    <input name="remarksStockOut" id="remarksStockOut">
  </td>
</tr>`;
}
function convert2CSV(arr) {
  console.log("HELLO")
  let keysList = Object.keys(arr);

  console.log(arr);
  let tempArr = [Object.keys(arr[keysList[0]])];
  for (let i = 0; i < keysList.length; i++) {
    tempArr.push(arr[keysList[i]]);
    console.log(arr[keysList[i]]);
  }
  console.log("Created the tempArr");
  console.log(tempArr);
  return tempArr.map(it => {
    return Object.values(it).toString()
  }).join('\n')
}
function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}
function resetStockInTable() {
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
  function exportFunctionClist() {
  
    downloadBlob(convert2CSV(cList), 'Client List.csv', 'text/csv;charset=utf-8;')
  }
  function exportFunctionStockIn() {
  
    downloadBlob(convert2CSV(stockInList), 'Stock In List.csv', 'text/csv;charset=utf-8;')
  }
  function exportFunctionBalanceStock() {
  
    downloadBlob(convert2CSV(balanceStockList), 'Balance Stock.csv', 'text/csv;charset=utf-8;')
  }
  function exportFunctionStockOutList() {
  
    downloadBlob(convert2CSV(stockOutList), 'Stock Out List.csv', 'text/csv;charset=utf-8;')
  }
  //#endregion
//

// Attaching functionality to the buttons.
document.getElementById("stockIn").onclick = stockInFun;
document.getElementById("stockOut").onclick = stockOutFunction;

document.getElementById("exportButtonClist").onclick = exportFunctionClist;

document.getElementById("exportButtonStockIn").onclick = exportFunctionStockIn;

document.getElementById("exportButtonBalanceStock").onclick = exportFunctionBalanceStock;

document.getElementById("exportButtonStockOut").onclick = exportFunctionStockOutList;