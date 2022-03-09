    var stockInTable = $('#stockInTable').DataTable({
    "scrollY": "100px",
    "scrollCollapse": true,
    "order": [[ 4, "desc" ]],
    });
    $('.dataTables_length').addClass('bs-select');
    // console.log("here");
    // $("#dtVerticalScrollExample").tableExport(); 
    // console.log("here2s");
    // $("#dtVerticalScrollExample").table2excel({
    //     exclude: ".excludeThisClass",
    //     name: "Worksheet Name",
    //     filename: "SomeFile.xls", // do include extension
    //     preserveColors: false // set to true if you want background colors and font colors preserved
    // });
    // bigString = document.getElementById("dtVerticalScrollExample");
    // console.log(bigString);
    // document.getElementsByTagName('body')[0].append(bigString);
    // console.log();
    // document.getElementById("dtVerticalScrollExample").table2excel({
    //         exclude: ".excludeThisClass",
    //         name: "Worksheet Name",
    //         filename: "SomeFile.xls", // do include extension
    //         preserveColors: false // set to true if you want background colors and font colors preserved
    //     });
    // table2excel();
    var customerTable = $('#customerTable').DataTable({
        "scrollY": "200px",
        "scrollCollapse": true,
        // "order": [[ 4, "desc" ]],
        });
        // $('.dataTables_length').addClass('bs-select');
        // console.log("here");
        
    // Creating the database.
    // Retreiving the mainObj object.
    // store.set('mainObj', 'hello world');
    // var mainObj = storeGet('mainObj');
    // storeSet('cList', {});
    var cList = myAPI.storeGet('cList');
    // console.log(cList)
    if(!cList){
        // Should go here only 
        console.log("Is this the first execution, if not then we are screwed")
        myAPI.storeSet('cList', {});
    }
    var cEntityIds = Object.keys(cList);
    // document.getElementById('stockInDate').value = new Date().toDateInputValue();
    document.getElementById("stockIn").onclick = stockInFun;
    function stockInFun() {
        let lotNo = document.getElementById("lotno").value;
        // console.log(lotNo);
    }
    // console.log(cList,cEntityIds)
    function populateTableClist(cList, cEntityIds) {
        // bigString = ``;
        for( i=0; i<cEntityIds.length; i++){
            console.log(cList[cEntityIds[i]])
            if(cList[cEntityIds[i]]){
                customerTable.row.add( [cList[cEntityIds[i]].cName,cList[cEntityIds[i]].mobNo] ).draw(false);
                console.log("HELLLLLLLLLO")
                // bigString += `<td>${cList[cEntityIds[i]].cName}</td><td>${ cList[cEntityIds[i]].mobNo}</td>`;
            }
        }
        // document.mainFunc();
        
    }
    populateTableClist(cList, cEntityIds);

    document.getElementById('reload').onclick = window.reload;
    document.getElementById('addCustomer').onclick = addCustomerFun;
    function addCustomerFun() {
        let cName = document.getElementById('customerName').value;
        let mobNo = document.getElementById('mobileNumber').value;
        if(cName.trim() && mobNo.trim().length==10){
            // We are good to go
            // console.log(cName, mobNo);
            // Add the row in db also.
            var tempId ='_' + Math.random().toString(36).substr(2, 9);
              
            while (cEntityIds.includes(tempId)) {
                tempId = '_' + Math.random().toString(36).substr(2, 9);
            }
            cList[tempId] = {'cName':cName, 'mobNo': mobNo};
            myAPI.storeSet('cList', cList);
            // Add the column in dataTable 
            document.getElementById('customerTableBody').innerHTML += `<tr><td>${cName}</td><td>${mobNo}</td></tr>`;
            document.getElementById('customerName').value = '';
            document.getElementById('mobileNumber').value = '';


        }
        else{
            showErrMessage('Add a valid customerName and mobile number');
            setTimeout(function() { showErrMessage(''); }, 5000);

        }
    
    }
    // console.log($);

    function showErrMessage(smallString) {
        document.getElementById('status').innerText = smallString;
    }   

console.log(myAPI);
console.log(myAPI.storeSet("hello","world"));
console.log(myAPI.storeGet('hello'));
// myAPI.diagPrint("hello");
// document.getElementById("reload").onclick = mainFunc;