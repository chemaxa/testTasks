let config={
  appName: 'userList'
};
/**Mock of localStorage for tests */
if (typeof localStorage === "undefined" || localStorage === null) {
  let collection={};
  config.storage={
      getItem:function(key){
        let data = collection[key] || {};
        return JSON.stringify(data);
      },
      setItem:function(key,data){
        collection[key]=data;
      }
  };

  console.warn(`WARNING!
   LocalStorage is emulated!
    Run on Node Environment!`);
  
}else{
  config.storage=localStorage;
}


export default config; 