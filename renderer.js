function mainFunc() {
    $('#dtVerticalScrollExample').DataTable({
    "scrollY": "200px",
    "scrollCollapse": true,
    "order": [[ 4, "desc" ]],
    });
    $('.dataTables_length').addClass('bs-select');
    console.log("here");
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
    console.log();
    document.getElementById("dtVerticalScrollExample").table2excel({
            exclude: ".excludeThisClass",
            name: "Worksheet Name",
            filename: "SomeFile.xls", // do include extension
            preserveColors: false // set to true if you want background colors and font colors preserved
        });
    table2excel();
}
mainFunc();