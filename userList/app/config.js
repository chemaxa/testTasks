let config={
  appName: 'userList'
};
/**Mock of localStorage for tests */
if (typeof localStorage === "undefined" || localStorage === null) {
  let collection={};
  config.storage={
      getItem:function(key){
        console.log('KEY: ',key);
        let data = collection[key] || {};
        return JSON.stringify(data);
      },
      setItem:function(key,data){
        collection[key]=data;
      }
  };

  console.log('Run on Node', config.storage);
  
}else{
  config.storage=localStorage;
}


export default config; 