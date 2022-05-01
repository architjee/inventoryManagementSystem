const Store = require('electron-store');
var  store = new Store();
var {contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
    'storeSet': (key, value) =>{
        store.set(key, value);
    },
    'storeGet': (key)=>{
        return store.get(key);
    },
 }
)
