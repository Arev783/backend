const path = require("node:path");
const fs = require('fs');
function clean(filename){
const extt = path.parse(filename).ext.toLowerCase();
const namee = path.parse(filename).name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g, "");
 return namee + extt;
}

function foo(derec,newFolder){
    fs.mkdirSync(newFolder,{recursive:true});
    const files =fs.readdirSync(derec);

    for(const file of files){
        const fullpathname = path.join(derec,file);

        const cleaned = clean(file);
        const destPath = path.join(newFolder,cleaned);
        fs.copyFileSync(fullpathname,destPath);
    }
}

foo('./folder','./newFolder');