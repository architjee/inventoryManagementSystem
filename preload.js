window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }

    // Creating the database.
    const Store = require('electron-store');
    var  store = new Store();
    // Retreiving the mainObj object.
    // store.set('mainObj', 'hello world');
    var mainObj = store.get('mainObj');
    document.getElementById('stockInDate').value = new Date().toDateInputValue();
    document.getElementById("stockIn").onclick = stockInFun;
    function stockInFun() {
        let lotNo = document.getElementById("lotno").value;
        console.log(lotNo);
    }
   

});