const fs = require("node:fs/promises");
const path = require("node:path");
const writeData = async (file,data)=>{
    const fullpath = path.join(__dirname,'..', 'data',file);
   await fs.writeFile(fullpath,data);
}

const readData =async (file)=>{
    const fullpath =  path.join(__dirname,'..', 'data',file);
   const data = await fs.readFile(fullpath,'utf-8');

   return data;
}

module.exports = {writeData,readData};